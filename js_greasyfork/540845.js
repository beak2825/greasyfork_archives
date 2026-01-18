// ==UserScript==
// @name         HiAnime Links+ (Plus on Poster)
// @namespace    https://greasyfork.org/users/1470715
// @author       cattishly6060
// @author       forked_bytes
// @description  Add direct links to MyAnimeList and AniList on HiAnime watch pages ((and its poster))
// @icon         https://icons.duckduckgo.com/ip3/hianime.to.ico
// @match        *://hianime.to/*
// @match        *://hianimez.is/*
// @match        *://hianimez.to/*
// @match        *://hianime.nz/*
// @match        *://hianime.bz/*
// @match        *://hianime.pe/*
// @grant        GM_openInTab
// @version      1.2.1
// @license      0BSD
// @downloadURL https://update.greasyfork.org/scripts/540845/HiAnime%20Links%2B%20%28Plus%20on%20Poster%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540845/HiAnime%20Links%2B%20%28Plus%20on%20Poster%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Add images
  const malBase64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFKUExURQAAAC5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5Roi5RojVWpTxdqDlbpzJUpDVXpTdZppCjzv////r7/Vh0tXmPw2uEvYicysfR5vL0+bnE4LXC3uDl8ThZpkporvT1+oSZyPDz+DBTo6+829LZ66q42V55uHSMwZys06Sz1+js9bfD36Gx1Z2u1F96uPHz+X2Txf39/mB7uP7+/+/x+HOKwTBSo3aNwqOz1svT6PP1+k9ssc7W6fj6/Pf4+4qdy9rg76i32IGWx42gzIKXx73I4TRWpdfe7bTB3qy62kxqr97k8L3I4nWMwvj5/FRws83V6cXP5cHL46+93KKx1dDY6vX3++Po82uDvTpbp/v8/YWZycrT59Xc7LjE3+Hm8i9Soq6725qr0n6Uxktpr/z8/t3i8Ft3tqm32f4+yygAAAAPdFJOUwEVh9P50YNT8RfzVfv1z7hGe4QAAAABYktHRBcL1piPAAAAB3RJTUUH6QYZDiIGG4HDQAAAAZhJREFUSMft1ldXwjAUAOCwh+MyxLhQZIgDF4gL98a9F4pa9/r/r94mtVBPW5oHXzzehyT35H60TU9JCCHEZnc4oWY4XW4bYeHx1q7m4fWweqvlcqCwWf59dg0fcYvUA9iJSww4iIX10awVEasH+Ae/BQLBYDCkpDgMhiuzIUybACLYRSqgmVLa0sqyNhzSdsV2RDvltAsghl1MC2h3HJNEsgJSrBqjJ60LaC9AuI9+g3Q/VWNAH9AMDFIVDLHR8MhoNpvNGYCx/LgKJiaxn5ouzESj0VkwAGogmMNufoFPLeqCJV67zEFCvsAKmIHVNQbWOUjJ3UaxWNw0Blvb2O4AB7vVd2gAYC9J9+MKOLAC4PDoGBRwYgkA1leB06L5MygpB2fYnoP5KmnABbaXP0DpSo5rfZCR30xZC1jclPVBvITdrQ64Y7eUlyTpXgE4lHLAXsTDI596AniWlHgx+kRf3+j7h9A3/ZkNgBAomP0JiMWfAIJbll90U3SJb7s+0Y1d+OhASJ3f8hN7+HEGjz/1tasbGtnx5wvNirJSwodULQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNS0wNi0yNVQxNDozNDowNiswMDowMNrDr1EAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjUtMDYtMjVUMTQ6MzQ6MDYrMDA6MDCrnhftAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI1LTA2LTI1VDE0OjM0OjA2KzAwOjAw/Is2MgAAAABJRU5ErkJggg==';

  const anilstBase64Img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAClUExURRkhLQAFHAAAGAAQIBoTFhkUGBkdJtfY2unp6qKjpweO1AOd6wOY4xQ/WwoWJFZbYv///wBPgQCx/wCq/wmGyK2vs/7+/lyRugCt/wAAFfLz9LDe/QCm/2VpcLq8v13C/xQdKnF1esXHyW3H/iEpNMfp/oCEiS40P4DN/gAAAI+SlgAADo3R/kNIUNzy/pudoTq6/+v4/hoNCQCI0xREYxgnNxFReJBTZkgAAAABYktHRBCVsg0sAAAAB3RJTUUH6QYaAyIo3TryMgAAAXNJREFUWMPtlWFXgjAUhoGpzMyxQEmQdJZKpaVW9v9/WrB7B9bpoJdz/Lbn4865z+4L253jWCwWy5VxPQ1zOt2SHrne55q+ezMouB0SDSKQAL8Lo4Jw1KEJvLGMNfK+rI8mVEGSGsE0ayMQD1hf0EqQzCqBnLcQKBbXAp2BKBCLOkEct+ggedQCsMinjCpQS10rfRCsyAK2hgbWPvQwoQoSKJQ5ip4zmkDlkIC/5FJiBpKAvcLGfXeDrYQ0gUkQCPMxthlFoN6gcZ4ogWHeSQJ3B9vOlnnuYDP7iCDY8NNjCEdhSxAUo8SUSWnu9CG7XFCNkl8t7EcfPcO5BOl/gunn8MtwbFRUCXAm4oU6RJOK6NiYAEdJPQ9OxgoQfje1IFL8iU6uWcI/wdF4XmCGoQyY0iR9iRkuE5hRwj1cKM7l3wxNgnKUaMZGUJ4rzSq7RCAWqX7Q0kCYJbaDN44PDKOmb6jgSfVUvcRwqVvhWCwWy3X4Aap4O8LCxI3vAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI1LTA2LTI2VDAzOjM0OjQwKzAwOjAw9O3HTQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNS0wNi0yNlQwMzozNDo0MCswMDowMIWwf/EAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjUtMDYtMjZUMDM6MzQ6NDArMDA6MDDSpV4uAAAAAElFTkSuQmCC';

  // Variables
  const iconSize = 30;

  // Add minimal loading CSS
  const style = document.createElement('style');
  style.textContent = `
    .mal-link-loading .tick {
      opacity: 0.3;
    }
  `;
  document.head.appendChild(style);

  /** @typedef {{mal_id: ?number, anilist_id: ?number}} Link */
  /** @type {Map<string, ?Link>} */
  const cachedLinkMap = new Map();

  /** @type {Object<string, string>} */
  const linkType = {
    MAL: 'mal',
    ANILIST: 'anilist',
  };

  function addHiAnimeBtnAndSubTitle() {
    Array.from(document.querySelectorAll("div.flw-item"))?.filter(e => e.querySelector('div.film-detail') && e.querySelector('div.film-poster') || []).forEach(e => {
      if (e.querySelector('.custom-jp-title')) return;

      const title = e.querySelector('.film-name > a')?.textContent || "";
      const titleJp = (e.querySelector('.film-name > a')?.getAttribute('data-jname') || title || "").replace('[Uncensored]', '').trim();
      const query = encodeURIComponent(titleJp.slice(0, 100));

      const uriMAL = `https://myanimelist.net/search/all?q=${query}&cat=all#anime`;
      const uriAnilist = `https://anilist.co/search/anime?search=${query}`;
      const endpoint = e.querySelector('a.film-poster-ahref')?.href;

      const topPad = e.querySelector('.tick-rate') ? 35 : 10;
      const imgSize = iconSize;

      const aHiAnime = createLink(uriMAL, titleJp, endpoint, linkType.MAL);
      aHiAnime.innerHTML = `<img class="tick" width="${imgSize}" height="${imgSize}" style="position: absolute; left: 10px; top: ${topPad}px;" src="${malBase64Img}">`;
      e.querySelector('div.film-poster').appendChild(aHiAnime);

      const aAnilist = createLink(uriAnilist, titleJp, endpoint, linkType.ANILIST);
      aAnilist.innerHTML = `<img class="tick" width="${imgSize}" height="${imgSize}" style="position: absolute; left: 10px; top: ${topPad + imgSize + 3}px;" src="${anilstBase64Img}">`;
      e.querySelector('div.film-poster').appendChild(aAnilist);

      const jpTitleElement = `<h3 class="film-name custom-jp-title" style="font-size: 12px; color: gray;">${titleJp}</h3>`;
      e.querySelector('.film-detail')?.children?.[0]?.insertAdjacentHTML('afterend', jpTitleElement);

      [aHiAnime, aAnilist].forEach(e => addLinkClickListener(e));
    });
  }

  function addLinkClickListener(anchorElement) {
    try {
      if (anchorElement.nodeName !== 'A') {
        return;
      }
      anchorElement.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default behavior

        // Get configuration from data attributes
        const endpoint = anchorElement.dataset.endpoint;
        const cacheLinkKey = endpoint
          ? new URL(endpoint).pathname.split('/').filter(Boolean)?.at(-1)
          : null;
        const fallbackUrl = anchorElement.dataset.fallbackUrl;
        const type = anchorElement.dataset.type;

        // Get cached finalUrl
        const cachedFinalUrl = anchorElement.dataset.finalUrl;
        if (cachedFinalUrl) {
          GM_openInTab(cachedFinalUrl, {active: true});
          return;
        }

        // Get cached link
        /** @type {?Link} */
        const cachedLink = cachedLinkMap.get(cacheLinkKey);
        if (cachedLink) {
          let finalUrl;
          if (type === linkType.MAL && cachedLink.mal_id) {
            finalUrl = `https://myanimelist.net/anime/${cachedLink.mal_id}`;
          } else if (type === linkType.ANILIST && cachedLink.anilist_id) {
            finalUrl = `https://anilist.co/anime/${cachedLink.anilist_id}`;
          } else {
            finalUrl = fallbackUrl;
          }
          GM_openInTab(finalUrl || fallbackUrl, {active: true});
          return;
        }

        // Show loading state
        anchorElement.classList.add('mal-link-loading');
        anchorElement.style.pointerEvents = 'none';

        try {
          // Fetch required data
          const res = await fetch(endpoint);
          if (!res?.ok) {
            GM_openInTab(fallbackUrl, {active: true});
            return;
          }
          const data = await res.text();
          const malId = data.match(/"mal_id":"(\d+)",/)?.[1];
          const anilistId = data.match(/"anilist_id":"(\d+)",/)?.[1];
          if (malId || anilistId) {
            cachedLinkMap.set(cacheLinkKey, {
              mal_id: malId,
              anilist_id: anilistId
            });
          }

          if ((!malId && type === linkType.MAL)
            || (!anilistId && type === linkType.ANILIST)
            || (!anilistId && !malId)
            || !type) {
            GM_openInTab(fallbackUrl, {active: true});
            return;
          }

          // Open the link
          const finalUrl = type === linkType.MAL
            ? `https://myanimelist.net/anime/${malId}`
            : `https://anilist.co/anime/${anilistId}`;

          anchorElement.dataset.finalUrl = finalUrl;
          GM_openInTab(finalUrl, {active: true});

        } catch (error) {
          console.error('Failed to process link:', error);
        } finally {
          // Clean up (loading)
          anchorElement.classList.remove('mal-link-loading');
          anchorElement.style.pointerEvents = '';
        }
      });
    } catch (err) {
      console.error(`|| ERROR (.addLinkClickListener):`, err);
    }
  }

  /**
   * **********************
   * For anime poster
   * **********************
   */

  if (window.location.pathname === '/home') {
    /** @type {?Timeout} */
    let timeout;

    /** @type {?MutationObserver} */
    const observer = waitForElement('#widget-continue-watching .film_list-wrap', (_) => {
      addHiAnimeBtnAndSubTitle();
      clearTimeout(timeout);
    }, {
      rootElement: document.querySelector('#widget-continue-watching'),
    });

    // Remove observer after 5s
    timeout = setTimeout(() => {
      observer?.disconnect();
    }, 5_000);
  }

  addHiAnimeBtnAndSubTitle();

  /**
   * **********************
   * For tooltip
   * **********************
   */

  const qTipObs = new MutationObserver((mutations, _) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length && mutation.removedNodes.length) {
        const el = Array.from(mutation.addedNodes)
          .find(e => e.className === 'pre-qtip-content');
        if (el) {
          const title = el.querySelector('.pre-qtip-title')?.textContent || "";
          const titleJp = Array.from(el.querySelectorAll('.pre-qtip-line'))
              .find(e => e.innerText.trim().startsWith('Japanese:'))
              ?.innerText
              ?.split(':')
              ?.[1]
              ?.trim()
            || title;

          const query = encodeURIComponent(titleJp.slice(0, 100));
          const uriMAL = `https://myanimelist.net/search/all?q=${query}&cat=all#anime`;
          const uriAnilist = `https://anilist.co/search/anime?search=${query}`;
          const endpoint = el.querySelector('.pre-qtip-button a')?.href;

          const preQtipDetail = document.createElement('div');
          preQtipDetail.className = 'pre-qtip-detail';
          preQtipDetail.style.display = 'flex';
          preQtipDetail.style.gap = '5px';

          const imgSize = iconSize;

          const aHiAnime = createLink(uriMAL, titleJp, endpoint, linkType.MAL);
          aHiAnime.innerHTML = `<img class="tick" width="${imgSize}" height="${imgSize}" src="${malBase64Img}">`;
          preQtipDetail.appendChild(aHiAnime);

          const aAnilist = createLink(uriAnilist, titleJp, endpoint, linkType.ANILIST);
          aAnilist.innerHTML = `<img class="tick" width="${imgSize}" height="${imgSize}" src="${anilstBase64Img}">`;
          preQtipDetail.appendChild(aAnilist);

          [aHiAnime, aAnilist].forEach(e => addLinkClickListener(e));
          el.querySelector('.pre-qtip-detail')?.insertAdjacentElement('afterend', preQtipDetail);
        }
      }
    }
  });

  document.querySelectorAll('.qtip-content').forEach((el) => {
    qTipObs.observe(el, {
      childList: true,
      subtree: true,
    });
  });

  /**
   * **********************
   * For anime pages
   * **********************
   */

  const syncData = JSON.parse(document.getElementById('syncData')?.textContent || null);
  if (!syncData) return;

  const title = document.getElementsByClassName('film-name')[0];
  if (!title) return;

  const titleText = title?.textContent?.trim() || '';

  const malLink = syncData?.mal_id
    ? `https://myanimelist.net/anime/${syncData.mal_id}`
    : `https://myanimelist.net/search/all?q=${titleText}&cat=all#anime`;

  const anilistLink = syncData?.anilist_id
    ? `https://anilist.co/anime/${syncData.anilist_id}`
    : `https://anilist.co/search/anime?search=${titleText}`;

  if (window.location.pathname.startsWith('/watch/')) {
    const pcRight = document.querySelector('.player-controls .pc-right');
    if (!pcRight) return;

    const aMAL = createLink(malLink, 'MyAnimeList');
    aMAL.style.float = 'left';
    aMAL.style.padding = '6px';
    aMAL.innerHTML = `<img width="25" height="25" src="${malBase64Img}">`;
    pcRight.insertBefore(aMAL, pcRight.firstChild)

    const aAnilist = createLink(anilistLink, 'AniList');
    aAnilist.style.float = 'left';
    aAnilist.style.padding = '6px';
    aAnilist.innerHTML = `<img width="25" height="25" src="${anilstBase64Img}">`;
    pcRight.insertBefore(aAnilist, pcRight.firstChild)

  } else {
    const aMAL = createLink(malLink, 'MyAnimeList');
    aMAL.innerHTML = ` <img width="25" height="25" src="${malBase64Img}">`;
    title.appendChild(aMAL);

    const aAnilist = createLink(anilistLink, 'AniList');
    aAnilist.innerHTML = ` <img width="25" height="25" src="${anilstBase64Img}">`;
    title.appendChild(aAnilist);
  }

  /**
   * **********************
   * Utility
   * **********************
   */

  /**
   * @param {string} href
   * @param {string} title
   * @param {string} [endpoint=null]
   * @param {string} [type=null]
   * @returns {HTMLAnchorElement}
   */
  function createLink(href, title, endpoint = null, type = null) {
    const a = document.createElement('a');
    a.target = '_blank';
    a.rel = 'noreferrer,noopener';
    a.href = href;
    a.title = title;
    if (endpoint) {
      a.href = "#";
      a.dataset.endpoint = endpoint;
      a.dataset.fallbackUrl = href;
      a.dataset.type = type;
    }
    return a;
  }

  /**
   * @param {string} selector
   * @param {function(HTMLElement): void} callback
   * @param {{rootElement: ?HTMLElement}} [options={}]
   * @returns {?MutationObserver}
   */
  function waitForElement(selector, callback, options = {}) {
    // Default to document.body if no root element is specified
    const rootElement = options.rootElement || document.body;
    delete options.rootElement; // Remove our custom option before passing to MutationObserver

    // First try immediately (element might already exist)
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      // Only query when nodes are added
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const el = document.querySelector(selector);
          if (el) {
            obs.disconnect();
            callback(el);
            return;
          }
        }
      }
    });

    observer.observe(rootElement, {
      childList: true,
      subtree: true,
      ...options
    });

    // Return the observer so caller can disconnect if needed
    return observer;
  }

})();
