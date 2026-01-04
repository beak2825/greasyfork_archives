// ==UserScript==
// @name         Old Reddit Top Filters (1h,3h,6h,12h,24h,W,M,Y,all)
// @description  Add quick "top" filter shortcut buttons to the tab menu.
// @version      2.3
// @author      C89sd
// @namespace   https://greasyfork.org/users/1376767
// @match       https://old.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536708/Old%20Reddit%20Top%20Filters%20%281h%2C3h%2C6h%2C12h%2C24h%2CW%2CM%2CY%2Call%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536708/Old%20Reddit%20Top%20Filters%20%281h%2C3h%2C6h%2C12h%2C24h%2CW%2CM%2CY%2Call%29.meta.js
// ==/UserScript==

const MS_TABLE = { h: 3600e3, d: 86400e3, w: 604800e3, m: 2592e6, y: 31536e6 };
const BUTTONS = [
    { lbl: '1h',  t: 'hour',  filter: ''   },
    { lbl: '3h',  t: 'day',   filter: '3h' }, // may scrape too many pages on large subs
    //{ lbl: '4h',  t: 'day',   filter: '4h' },
    { lbl: '6h',  t: 'day',   filter: '6h' },
    { lbl: '12h', t: 'day',   filter: '12h'},
    { lbl: '24h', t: 'day',   filter: ''   },
    { lbl: 'W',   t: 'week',  filter: ''   },
    //{ lbl: '2W',  t: 'month', filter: '2w' },
    { lbl: 'M',   t: 'month', filter: ''   },
    //{ lbl: '3M',   t: 'year',  filter: '3m'   }, // may scrape too many pages on large subs
    //{ lbl: '6M',   t: 'year',  filter: '6m'   },
    { lbl: 'Y',   t: 'year',  filter: ''   },
    { lbl: 'all', t: 'all',   filter: ''   },
];
const FILTER_REGEX = /#filter=(\d+)([hdwmy])/i;
const MIN_POSTS = 25;
const FETCH_DELAY_MS = 750;

window.filterClick = function filterClick(e){
    const hrefClean = e.currentTarget.href.replace(/#.*/,'');
    const hereClean = location.href.replace(/#.*/,'');
    if (hrefClean === hereClean) setTimeout(() => location.reload(), 100);
};

const tabMenu = document.querySelector('.tabmenu');
if (tabMenu) {
    let fetchController = new AbortController();
    window.addEventListener('pagehide', () => fetchController.abort());

    const { origin, pathname } = window.location;
    const isFrontOrAllPage = pathname === '/' || pathname.startsWith('/r/all');
    const pathPrefix = (pathname.match(/^(\/r\/[^/]+|\/user\/[^/]+\/m\/[^/]+)/) || [''])[0];
    const baseUrl = `${origin}${pathPrefix}/top/?sort=top`;

    const styleTag = document.createElement('style');
    styleTag.textContent = '.ggray { filter: saturate(0.1) !important; }';
    document.head.appendChild(styleTag);

    const tMatch      = location.search.match(/[?&]t=([^&#]+)/i);
    const curT        = tMatch ? tMatch[1] : '';
    const curFilterRx = location.hash.match(FILTER_REGEX);
    const curFilter   = curFilterRx ? curFilterRx[1] + curFilterRx[2] : '';

    const buttonsHTML = BUTTONS
      .filter(btn => !(isFrontOrAllPage && btn.t === 'year'))
      .map(btn => {
          const url   = `${baseUrl}&t=${btn.t}`;
          const href  = btn.filter ? `${url}#filter=${btn.filter}` : url;
          const click = btn.filter ? 'onclick="filterClick(event)"' : '';

          const isSel = curT === btn.t && curFilter === btn.filter;
          const liCls = isSel ? 'selected' : (btn.filter ? 'ggray' : '');

          return `<li class="${liCls}"><a ${click} href="${href}">${btn.lbl}</a></li>`;
      })
      .join('');
    tabMenu.insertAdjacentHTML('beforeend', buttonsHTML);

    const runCustomFilter = () => {
        const hashMatch = window.location.hash.match(FILTER_REGEX);
        if (!hashMatch) return;

        const siteTable = document.getElementById('siteTable');
        if (!siteTable) return;

        fetchController.abort();
        fetchController = new AbortController();
        const { signal } = fetchController;

        const [, amount, unit] = hashMatch;
        const cutoffTimestamp = Date.now() - parseInt(amount, 10) * MS_TABLE[unit.toLowerCase()];

        const loader = document.createElement('div');
        loader.style.cssText = 'padding: 15px; font-weight: bold; display: none;';
        siteTable.insertAdjacentElement('afterend', loader);

        const navButtons = document.querySelector('#siteTable .nav-buttons');
        if (navButtons) siteTable.insertAdjacentElement('afterend', navButtons);

        const isTooOld = p => (p.dataset.timestamp || 0) < cutoffTimestamp;
        const filterPosts = () =>
            siteTable.querySelectorAll('.thing[data-timestamp]').forEach(p => isTooOld(p) && p.remove());

        const updateNext = href => {
            const nextLink = document.querySelector('.next-button a');
            if (nextLink) {
                if (href) nextLink.href = href.replace(/#.*/, '') + window.location.hash;
                else nextLink.parentElement.remove();
            }
        };

        const fetchPage = async url => {
            const startTime = Date.now();
            const html = await (await fetch(url, { credentials: 'include', signal })).text();
            const doc  = new DOMParser().parseFromString(html, 'text/html');
            const endTime = Date.now();
            const duration = endTime - startTime;

            const remainingDelay = Math.max(0, FETCH_DELAY_MS - duration);
            if (remainingDelay > 0) {
              await new Promise(r => setTimeout(r, remainingDelay));
            }

            return {
                posts: doc.querySelectorAll('#siteTable .thing'),
                next : doc.querySelector('.next-button a')?.href || ''
            };
        };

        (async () => {
            filterPosts();
            let nextUrl = document.querySelector('.next-button a')?.href;
            let fetchCount = 0;

            while (document.querySelectorAll('#siteTable .thing').length < MIN_POSTS && nextUrl) {
                if (signal.aborted) break;
                loader.textContent = `⏳ Filtering and loading more posts... ${++fetchCount}`;
                loader.style.display = 'block';

                try {
                    const { posts, next } = await fetchPage(nextUrl);
                    posts.forEach(p => siteTable.appendChild(p));
                    filterPosts();
                    nextUrl = next;
                    updateNext(nextUrl);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        loader.textContent = 'An error occurred while loading posts.';
                        console.error('[Reddit Filter Userscript] Fetch Error:', err);
                    }
                    break;
                }
            }
            loader.style.display = 'none';
        })();
    };
    window.runCustomFilter = runCustomFilter;

    window.addEventListener('pageshow', e => { if (!e.persisted) runCustomFilter(); });
}