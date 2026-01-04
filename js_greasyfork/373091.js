// ==UserScript==
// @name VRV watchlist and other tweaks
// @namespace Itsnotlupus Scripts
// @description UI tweaks for VRV. put new episodes at the top of the watchlist and series pages.
// @match https://vrv.co/*
// @version 0.21
// @@require https://unpkg.com/moduleraid@5.1.2/dist/moduleraid.umd.js
// @require https://unpkg.com/redom@3.14.2/dist/redom.min.js
// @require https://unpkg.com/moment@2.22.2/min/moment.min.js
// @require https://unpkg.com/moment-duration-format@2.2.2/lib/moment-duration-format.js
// @require https://unpkg.com/devtools-detect@3.0.1/index.js
// @run-at document-start
// @grant GM_setValue
// @grant GM_getValue 
// @downloadURL https://update.greasyfork.org/scripts/373091/VRV%20watchlist%20and%20other%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/373091/VRV%20watchlist%20and%20other%20tweaks.meta.js
// ==/UserScript==

/*jshint ignore:start */

const win = unsafeWindow;


// A set of strings that could be localized.
const i18n = {
  'en': {
    'Watchlist userscript sort - Prioritize unwatched new items': 'Watchlist userscript sort - Prioritize unwatched new items',
    'Natural Sort': 'Natural Sort',
    'New Episodes on {DATE}': 'Airs on {DATE}',
    'No Recent Episode': 'No Recent Episode',
    'Up Next': 'Up Next',
    'Episode': 'Episode',
    'Dubbed': 'Dubbed',
    'Subtitled': 'Subtitled',
    'S{SEASON}E{EPISODE} - {TITLE}': 'S{SEASON}E{EPISODE} - {TITLE}'
  }
}

// hook into React as early as possible
let reactRoot;
const h = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
if (win[h]) {
  const ocfr = win[h].onCommitFiberRoot.bind(win[h]);
  win[h].onCommitFiberRoot = (_, root) => {
    reactRoot = root;
    return ocfr(_, root);
  };
} else {
  const listeners={};
  win[h] = {
    inject: ()=>0,
    checkDCE: ()=>0,
    onCommitFiberRoot: (_, root) => reactRoot = root,
    onCommitFiberUnmount: ()=>0,
    supportsFiber: true,
    on: ()=>0,
    sub: ()=>0,
    renderers: [],
    emit: ()=>0
  };
}

function getPropsThatContain(name) {
  const getPropFromNode = node => {
    if (!node) return;
    const props = node.memoizedProps;
    if (props?.[name] !== undefined) return props;
    const siblingProp = getPropFromNode(node.sibling);
    if (siblingProp !== undefined) return siblingProp;
    const childProp = getPropFromNode(node.child);
    if (childProp !== undefined) return childProp;
  }
  return getPropFromNode(reactRoot?.current);
}

/** Magically obtain a prop value from the most top-level React component we can find */
function getProp(name) {
  return getPropsThatContain(name)?.[name];
}
/** Horribly mutate a name prop value on zero or more React components */
function setProp(name, value) {
  let props;
  while (props = getPropsThatContain(name)) {
    if (props[name] === value) return;
    props[name] = value;
  }
}

const { el, svg, mount, setChildren } = redom;

const f = n => function(q) { return this[n] ? this[n](q) : document[n](q); };
const $ = Node.prototype.$ = f('querySelector');
const $$ = Node.prototype.$$ = f('querySelectorAll');
Element.prototype.attr = function(k,v) { return v==null?this.getAttribute(k):this.setAttribute(k,v) }; // why am I like this
const sleep = (w = 100) => new Promise(r=>setTimeout(r, w));
const until = async (f, w) => { while (!f()) await sleep(w) };
const loc = (s,locale=navigator.language, lang=locale.split('-')[0]) => i18n[locale]?.[s] ?? i18n[lang]?.[s] ?? s;
const t = (s,o) => o?loc(s).replace(/\{([^{]*)\}/g,(a,b)=>o[b]||a):loc(s);
const urlize = s => escape(s.replace(/\s+/g, '-').replace(/\W/g, ''));

win.addEventListener('load', () => {
  mount(document.head, el('script', { src: 'https://unpkg.com/moduleraid@5.1.2/dist/moduleraid.umd.js', onload: go }));   
});

async function go() {
  //console.error('VRV watchlist userscript starting.');
  await until(() => getProp('store')?.getState()?.accounts?.currentUser?.account);
  
  const mR = new moduleraid({ entrypoint: "webpackChunkvrvweb", debug: true });

  const [_, { default: { Core, Disc, CMS } }] = mR.findModule('Core');  

  // track watchlist sort dropdown state
  let previousSort, previousSortLabel;
  
  if (window.devtools.isOpen) {
    const exposed = { reactRoot, Core, Disc, CMS, getProp, setProp, mR };
    console.log('VRV Watchlist: DevTools open - exposing ', exposed);
    Object.assign(win, exposed);
  }

  async function decorateWatchlist() {
    if ($('.erc-watchlist-sorting') && !$('.erc-watchlist-sorting .smart-sort')) {
      const smartSortEnabled = !!GM_getValue('smartSort', true);
      let input;
      const radio = el('li.erc-watchlist-dropdown-list-item.smart-sort', el('.c-radio-button', el('label.c-radio-button__label', {
        title: t('Watchlist userscript sort - Prioritize unwatched new items')
      }, [
        input = el('input.c-radio-button__input', { type: 'radio', 'name': 'sort_by', value:'smart_sort', ...(smartSortEnabled?{checked:true}:null)}),
        el('span.c-radio-button__checkmark'),
        t('Natural Sort')
      ])));
      const radioContainer = $('.erc-watchlist-sorting .erc-watchlist-dropdown-list');
      radioContainer.insertBefore(radio, radioContainer.firstChild);
      Array.from(radioContainer.$$('input')).forEach(radio => radio.addEventListener('input', e=> {
        GM_setValue('smartSort', !!input.checked)
        sortWatchlist();
      }));
    }

    let decorated = false;
    let items;
    const decorations = [];
    for (const card of $$('.erc-watchlist-collection .watchlist-card:not(.decorated)')) {
      if (!items) {
        items = (await Disc.getAccountWatchlist({ n : 100 }))?.data?.items;
      }
      if (!items) continue;
      const [_,mode,item_id] = card.$('.c-watchlist-card__content-link').attr('href').split('/');
      decorateWatchlistItem(card, item_id, items);
      decorated = true;
    }
    if (decorated) {
      sortWatchlist()
    }
  }
  
  function sortWatchlist() {
      const smartSortEnabled = !!GM_getValue('smartSort', true);
      // sort our decorated cards.
      if (smartSortEnabled) {
        itemCount = $$('.erc-watchlist-collection .watchlist-card[lastAirDate]').length;
        const resultTitle = $('.controls-result-wrapper .result-title');
        if (!previousSort || !document.body.contains(previousSort[0])) {
          previousSortLabel = resultTitle?.textContent;
          previousSort = Array.from($$('.erc-watchlist-collection .watchlist-card[lastAirDate]'));          
        }
        if (resultTitle) resultTitle.textContent = t('Natural Sort');
        previousSort.slice().sort((a,b)=> {
          const sortByWatched = a.attr('watched')-b.attr('watched');
          if (sortByWatched) return sortByWatched;
          const sortByAirDate = b.attr('lastAirDate') - a.attr('lastAirDate');
          return a.attr('watched') == 1 ? -sortByAirDate : sortByAirDate;
        }).forEach(card => card.parentNode.appendChild(card));
      } else {
        if (previousSort) {
          $('.controls-result-wrapper .result-title').textContent = previousSortLabel ?? '';
          previousSort.forEach(card => card.parentNode.appendChild(card));
          previousSort = null;
          previousSortLabel = null;
        }
      }
  }
  
  function decorateWatchlistItem(card, item_id, items) {
    const item = items.find(item => item.panel.id === item_id); 
    if (!item || card.classList.contains('decorated')) return;
    const { completion_status, panel : { episode_metadata: ep, images: {thumbnail: [imgs] = []}, title }} = item;
    const lastAirDate = new Date(ep.episode_air_date);
    const ts = lastAirDate.getTime();
    card.attr('lastAirDate', ts);
    if (completion_status) {
      // 2 weeks. why? because this is the original air date, and VRV doesn't provide a date of local availability.
      // So.. we wing it and assume most shows become available within a week of their original air date. sadness.
      if (Date.now() - lastAirDate < 14*24*3600*1000) { 
        card.attr('watched', '1');
        // half-dullify and show original air date.
        card.style = 'filter: grayscale(90%);opacity:.9';
        const metadata = card.$('.c-watchlist-card__watch-status');
        setChildren(metadata, [
          el('span', { style: 'font-size:.8rem; margin-top: 1.5rem' }, t('New Episodes on {DATE}', { DATE: moment(lastAirDate).format('dddd LT')}))
        ]);
      } else {
        card.attr('watched', '2');
        // old shows, fully watched.
        // dullify thoroughly.
        card.style = 'filter: grayscale(90%);opacity:0.5';
        const metadata = card.$('.c-watchlist-card__watch-status');
        setChildren(metadata, [
          el('span', { style: 'font-size:.8rem; margin-top: 1.5rem' }, t('No Recent Episode'))
        ]);
      }
    } else {
      // use next episode image, title & number to decorate watchlist item. iffy CSS.
      card.attr('watched', '0');
      const metadata = card.$('.c-watchlist-card__watch-status');
      setChildren(metadata, [
        el('span', { style: 'font-size:.8rem; margin-top: 1.5rem' }, t('S{SEASON}E{EPISODE} - {TITLE}', {SEASON:ep.season_number || 1, EPISODE:ep.episode_number || 1, TITLE: title}))
      ]);
      metadata.style = 'height: 2.7em; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical;';
    }
    card.classList.add('decorated');
  }
  
  async function fixPlayer() {
    const [_,page] = location.pathname.split('/');
    if (page !== 'watch') return;
    // disable auto-play in some situations
    const upNext = getProp('upNextResource');
    if (upNext) {
      const currentlyPlaying = getProp('store').getState().watch.mediaResource;
      if (upNext?.json?.season_number !== currentlyPlaying?.json?.season_number || upNext?.json?.season_title !== currentlyPlaying?.json?.season_title) {
        // since VRV seasons are used for many things that are not actually seasons,
        // auto-playing a different season will often play something unexpected and damage the watchlist in the process
         // console.log("Last episode of season. Auto-play disabled.")
        setProp('upNextResource', undefined);
      }
    }
  }
  
  async function decorateSeriesPage() {
    const [_,page,series_id] = location.pathname.split('/');
    if (page !== 'series') return;
    const parent = $('.series-page-container .content');
    if (!parent) return;
    const playIcon = parent.$('.art-overlay .c-svg-play-icon');
    if (!playIcon) return;
    
    // remove the XL status of the first episode of the season, because why is that even a thing.
    // this needs to keep happening even after we put our "up next" card together, because VRV can reset an XL card at anytime.
    const xlcard = parent.$('.erc-tabs .xl-card');
    if (xlcard) xlcard.classList.remove('xl-card');
    const xlarticle = parent.$('.erc-tabs article.xl-episode');
    if (xlarticle) xlarticle.classList.remove('xl-episode');
    
    // craft a plausible "Up Next" XL showcard that immediately shows what will play next
    if (parent.classList.contains('decorated')) return; // don't overfetch the API
    parent.classList.add('decorated');
    const account_id = getProp('store').getState().accounts.currentUser.account.id ?? '-';
    const data = await Core.getUpNext({account_id, mode: 'series', series_id});
    const { data: { playhead, panel : { id, description, completion_status, episode_metadata: ep, images: {thumbnail: [imgs] = []}, title } } } = data;
    const timeString = sec => moment.duration(sec, 'seconds').format('hh:mm:ss');
    const duration = timeString(ep.duration_ms/1000);

    parent.insertBefore(el('.upnext.item-list-wrapper', { style: 'margin-bottom: 1em' }, [
      el('.erc-upsell-title', t('Up Next')),
      el('.item-list', { style: 'margin: 0' }, el('.media-list-element.xl-card', el('article.erc-episode-card.xl-episode', [
        el('a.card-link', { title, href: `/watch/${id}/${urlize(ep.series_title)}:${urlize(title)}` }),
        el('.h-thumbnail', { style: `border-color: ${parent.$('.h-thumbnail').style.borderColor}` },
          el('img.image.c-content-image', { src: imgs.find(obj=>obj.width===800).source, alt: title }),
          el('.art-overlay', e=>e.innerHTML=playIcon.outerHTML),
          el('.episode-state-info' + ( playhead ? '.state-progress-bar' : ''),
            playhead ? 
              el('.erc-progress-bar', [
                el('.progress-wrapper', el('.progress-bar', { style: `width: ${~~(playhead/ep.duration_ms*1e9)/1e4 + '%'}` })),
                el('.progress-info', `${timeString(playhead)} / ${duration}`)
              ]) :
              el('span.duration', duration)
          )
        ),
        el('section.info',
          el('.series-title', ep.series_title),
          el('.erc-content-title episode-title', `S${ep.season_number || 1}E${ep.episode_number || 1} - ${title}`),
          el('p.episode-description', description),
          el('.details-metadata', el('.c-meta-tags.media-tag-group', [
              el('span.c-meta-tags__type', t('Episode')),
              ep.is_dubbed && el('span.c-meta-tags__language', t('Dubbed')),
              ep.is_subbed && el('span.c-meta-tags__language', t('Subtitled'))
          ]))
        )
      ])))
    ]), parent.$('.information-tabs-wrapper'));
  }

    
  // check frequently for tweaks to apply to various pages. each check must be fast.
  async function main() {
    while (true) {
      const [_,page] = location.pathname.split('/');
      switch (page) {
        case 'series':
          await decorateSeriesPage(); 
          break;
        case 'watch':
          await fixPlayer(); 
          break;
        case 'watchlist':
          await decorateWatchlist();
          break;
      }
      await sleep();
    }
  }
  
  await main();
}
