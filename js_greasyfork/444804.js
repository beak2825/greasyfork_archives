// ==UserScript==
// @name Crunchyroll Watchlist Userscript
// @namespace Itsnotlupus Scripts
// @description UI tweaks for CrunchyRoll Beta. New watchlist order and an autoplay tweak.
// @description:de UI-Optimierungen für Crunchyroll Beta. Neue Watchlist-Reihenfolge und Autoplay-Optimierung.
// @description:fr Tweaks pour Crunchyroll Beta. Nouvel ordre pour la watchlist et un ajustement de l'autoplay.
// @match https://beta.crunchyroll.com/*
// @version 0.9
// @require https://unpkg.com/moduleraid@5.1.2/dist/moduleraid.umd.js
// @require https://unpkg.com/devtools-detect@3.0.1/index.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444804/Crunchyroll%20Watchlist%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/444804/Crunchyroll%20Watchlist%20Userscript.meta.js
// ==/UserScript==

/**
 * Techniques used to monkeypatch Crunchyroll:
 * 
 * - Webpack modules contain a lot of useful functionality. moduleraid is essential in reaching those.
 *   The builtin find*() methods are constrained by minimization, and you may need to inspect its .modules 
 *   array to find what you need. see sortInit() for an example.
 * - The site uses Axios to perform network requests. Some of its modules expose utilities to define
 *   interceptors on its axios instances, which allows to modify and decorate data fetched by the site.
 * - This is a React app, so modifying the rendered markup on the site is tricky. There are 2 approaches:
 *   1. Observe for DOM changes or React renders and re-apply your modifications each time.
 *      This is how the watchlist card text changes and dimming are implemented.
 *   2. Find the source data used by the React components to render the app, and change that data.
 *      This is how custom watchlist sorting is implemented.
 * - Useful data can found on React component props, including access to the Redux store. This is done
 *   by using the React dev hooks and traversing the React Fiber tree to find matches. It is also possible
 *   to change a React component behavior by changing its props, but as with markup, this will not stick
 *   unless it is reapplied on every render. See tweakPlayer() for an example. 
 * 
 * The module devtools-detect is used to know when to make a few useful object available to the console, 
 *   which makes poking around and understanding what's there somewhat easier.
 */

/*jshint ignore:start */

const DAY = 24*3600*1000;
const WEEK = 7 * DAY;

const NOT_WATCHED = 0;
const WATCHED_WAIT = 1;
const WATCHED_DONE = 2;

// Localization
const i18n = {
  // reference strings
  'en': {
    'Crunchyroll Watchlist Userscript: {MSG}': 'Crunchyroll Watchlist Userscript: {MSG}',
    'Starting.': 'Starting.',
    'DevTools open': 'DevTools open',
    'Autoplay blocked at end of season.': 'Autoplay blocked at end of season.',
    'Natural Sort': 'Natural Order',
    'Airs on {DATE}': 'Airs on {DATE}',
    'No Recent Episode': 'No Recent Episode',
    'S{SEASON}E{EPISODE} - {TITLE}': 'S{SEASON}E{EPISODE} - {TITLE}',
    'Untitled': 'Untitled',
    'Better Cards': 'Enhanced Cards',
    'Show/Hide Comments': 'Show/Hide Comments'
  },
  // hasty translations
  'de': {
    'Crunchyroll Watchlist Userscript: {MSG}': 'Crunchyroll Watchlist Userscript: {MSG}',
    'Starting.': 'Anfang.',
    'DevTools open': 'DevTools geöffnet',
    'Autoplay blocked at end of season.': 'Autoplay am Saisonende gesperrt.',
    'Natural Sort': 'Natürliche Reihenfolge',
    'Airs on {DATE}': 'Am {DATE} ausgestrahlt',
    'No Recent Episode': 'Keine aktuelle Folge',
    'S{SEASON}E{EPISODE} - {TITLE}': 'S{SEASON}E{EPISODE} - {TITLE}',
    'Untitled': 'Ohne Titel',
    'Better Cards': 'Erweiterte Karten',
    'Show/Hide Comments': 'Kommentare ein-/ausblenden'
  },
  'fr': {
    'Crunchyroll Watchlist Userscript: {MSG}': 'Crunchyroll Watchlist Userscript: {MSG}',
    'Starting.': 'Démarrage.',
    'DevTools open': 'DevTools ouverts',
    'Autoplay blocked at end of season.': 'Autoplay bloqué en fin de saison.',
    'Natural Sort': 'Ordre Naturel',
    'Airs on {DATE}': 'Diffusion le {DATE}',
    'No Recent Episode': 'Pas d\'épisode récent',
    'S{SEASON}E{EPISODE} - {TITLE}': 'S{SEASON}E{EPISODE} - {TITLE}',
    'Untitled': 'Sans titre',
    'Better Cards': 'Cartes Améliorées',
    'Show/Hide Comments': 'Afficher/Masquer les commentaires'
  }
  // ...
}
const getLocale = (_ = location.pathname.split('/')[1]) => _ in i18n ? _ : navigator.language;
const loc = (s, locale=getLocale(), lang=locale.split('-')[0]) => i18n[locale]?.[s] ?? i18n[lang]?.[s] ?? i18n.en[s] ?? s;
const t = (s,o) => o?loc(s).replace(/\{([^{]*)\}/g,(a,b)=>o[b]??loc(a)):loc(s);
const dateFormatter = Intl.DateTimeFormat(getLocale(), { weekday: "long", hour: "numeric", minute: "numeric"});

// other utilities
const crel = (name, attrs, ...children) => ((e = Object.assign(document.createElement(name), attrs)) => (e.append(...children), e))();
const svg = (name, attrs, ...children) =>  {
  const e = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([key,val]) => e.setAttribute(key, val));
  e.append(...children);
  return e;
}
const log = (msg, ...args) => console.log(`%c${t('Crunchyroll Watchlist Userscript: {MSG}', { MSG: t(msg) })}`, 'font-weight:600;color:green', ...args);

/** calls a function whenever react renders */
const observeReact = (fn) => {
  reactObservers.add(fn);
  return () => reactObservers.delete(fn);
};
/** calls a function whenever the DOM changes */
const observeDOM = (fn, e = document.documentElement, config = { attributes: 1, childList: 1, subtree: 1 }) => {
  const observer = new MutationObserver(fn);
  observer.observe(e, config);
  return () => observer.disconnect();
};
/** check a condition on every DOM change until true */
const untilDOM = f => new Promise((r,_,d = observeDOM(() => f() && d() | r() )) => 0);

function debounce(fn) {
    let latestArgs, scheduled = false;
    return (...args) => {
        latestArgs = args;
        if (!scheduled) {
            scheduled = true;
            Promise.resolve().then(() => {
                scheduled = false;
                fn(...latestArgs);
            });
        }
    };
}

// React monkey-patching. the stuff belows allows us to:
// - observe every react renders
// - inspect nodes for props (which exposes redux and other useful state)
// - modify props value (which may not stick unless reapplied on every render)
const reactObservers = new Set;
const notifyReactObservers = debounce(() => reactObservers.forEach(fn=>fn()));
let reactRoot; // We assume we'll only ever see one react root. Seems to hold here.
const h = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
if (window[h]) {
  const ocfr = window[h].onCommitFiberRoot.bind(window[h]);
  window[h].onCommitFiberRoot = (_, root) => {
    notifyReactObservers();
    reactRoot = root;
    return ocfr(_, root);
  };
} else {
  const listeners={};
  window[h] = {
    onCommitFiberRoot: (_, root) => {
      notifyReactObservers();
      reactRoot = root
    },
    onCommitFiberUnmount: ()=>0,
    inject: ()=>0,
    checkDCE: ()=>0,
    supportsFiber: true,
    on: ()=>0,
    sub: ()=>0,
    renderers: [],
    emit: ()=>0
  };
}

/** Traversal of React's tree to find nodes that match a props name */
function findNodesWithProp(name, firstOnly = false) {
  const acc = new Set;
  const visited = new Set;
  const getPropFromNode = node => {
    if (!node || visited.has(node)) return;
    visited.add(node);
    const props = node.memoizedProps;
    if (props && typeof props === 'object' && name in props) {
      acc.add(node);
      if (firstOnly) throw 0; // goto end
    }
    getPropFromNode(node.sibling);
    getPropFromNode(node.child);
  }
  try { getPropFromNode(reactRoot?.current) } catch {}
  return Array.from(acc);
}

/** Magically obtain a prop value from the most top-level React component we can find */
function getProp(name) {
  return findNodesWithProp(name, true)[0]?.memoizedProps?.[name];
}

/** Forcefully mutate props on a component node in the react tree. */
function updateNodeProps(node, props) {
  Object.assign(node.memoizedProps, props);
  Object.assign(node.pendingProps, props);
  Object.assign(node.stateNode?.props??{}, props);
}

// Actual script logic starts here

function sortInit(mR) {
  // add sort elements we need. this needs to run before first render.
  // find sort data module and its members by shape, since it's all minimized
  const sortData = Object.values(mR.modules).find(m=>Object.values(m).includes("watchlist.sort"));
  const sortTypes = Object.entries(sortData).find(pair=>pair[1].alphabetical?.trigger)[0];
  const sortItems = Object.entries(sortData).find(pair=>pair[1][0]?.trigger)[0];
  const sortFilters = Object.entries(sortData).find(pair=>pair[1].alphabetical?.desc)[0];

  if ("natural" in sortData[sortTypes]) return;
  sortData[sortTypes].natural = { name: t("Natural Sort"), value: "natural", trigger: t("Natural Sort")}
  sortData[sortItems].unshift(sortData[sortTypes].natural);
  sortData[sortFilters]["natural"] = {}; // we don't want sort filters available for natural sort XXX this isn't enough.
  return true;
}

function axiosInit(Content, store) {
  Content.addRequestInterceptor(function (config) {
    if (config?.params?.sort_by === 'natural') {
      config.params.sort_by = '';
      config.__this_is_a_natural_sort = true;
    }
    return config;
  });
  Content.addResponseInterceptor(function (response) {
    if (response.config.url.endsWith('/watchlist')) {
      // save the watchlist items so we don't need to double fetch it.
      store.watchlistItems = response.data.items;
      // decorate watchlist items with 'watched' and 'lastAirDate' (for sorting and render)
      store.watchlistItems.forEach(item => {
        const { completion_status, panel: { episode_metadata: ep }} = item;
        const lastAirDate = new Date(ep.episode_air_date);
        item.lastAirDate = lastAirDate.getTime();
        if (completion_status) {
          // Cut off at 2 weeks after the original air date since VRV doesn't provide a date of next availability.
          // This works well enough for weekly shows, accounting for the occasional skipped week.
          item.watched = Date.now() - lastAirDate < 2 * WEEK ? WATCHED_WAIT : WATCHED_DONE;
        } else {
          item.watched = NOT_WATCHED;
        }
      });
      if (response.config.__this_is_a_natural_sort) {
        // the "Natural Sort" sorts items that haven't been watched above items that have.
        // it also sorts watched items likely to have new episode above items that aren't likely to have any.
        // it sorts items available to watch with more recent release first,
        // and items likely to have new episodes with closest next release first.
        // (If we had a sense of which shows are most eagerly watched, we could use that and have a plausible "Scientific Sort"..)
        store.watchlistItems.sort((a,b) => {
          // 1. sortByWatched
          const sortByWatched = a.watched - b.watched;
          if (sortByWatched) return sortByWatched;
          // 2. sortByAirDate
          const sortByAirDate = b.lastAirDate - a.lastAirDate;
          return a.watched === 1 ? -sortByAirDate : sortByAirDate;
        });
      }
    }
    return response;
  });
}

/** As long as Crunchyroll has nonsensical seasons, it's better
 *  to prevent autoplay across seasons
 */
function tweakPlayer() {
  const [_,page] = location.pathname.split('/');
  if (page !== 'watch') return;
  // find player React component
  const node = findNodesWithProp('upNextLink', true)[0];
  const props = node?.memoizedProps;
  if (props && !props.injected) {
    // wrap the changeLocation props and check if it's being asked to
    // navigate to the "upnext" address.
    const { videoEnded, changeLocation, upNextLink } = props;
    let videoJustEnded = false;
    updateNodeProps(node, {
      videoEnded() {
        // track this to only block autoplay but still allow user to use the "next video" button in the player.
        videoJustEnded = true;
        return videoEnded;
      },
      changeLocation(go) {
        if (videoJustEnded && go.to === upNextLink) {          
          videoJustEnded = false;
          // check if the next episode would be an "episode 1", indicative of another season
          const { content, watch } = getProp('store').getState(); // grab some state from redux
          const upNextId = content.upNext.byId[watch.id].contentId;
          const { episodeNumber } = content.media.byId[upNextId];
          if (episodeNumber === 1) {
            log('Autoplay blocked at end of season.');
            return;
          }
        }
        return changeLocation(go);
      }, 
      injected: true
    });
  }
}

/**
 * Dim items that have been watched, gray out shows with no recent episodes.
 * Show title of next episode to play, or expected air date for one to show up.
 */
function decorateWatchlist(store) {
  
  const { watchlistItems, classNames } = store;
  
  if (!classNames.watchlistCard) {
    // get a fresh mR, because not all CSS classnames are available at startup
    const mR = new moduleraid({ entrypoint: "__LOADABLE_LOADED_CHUNKS__", debug: false });
    const canari = Object.values(mR.modules).filter(o=>o?.Z?.watchlistCard)[0]?.Z;
    if (!canari) return; // too soon. retry on next mutation.
    
    // laboriously extract various classnames from whatever is exported
    // This mostly involves calling spurious react component renders and grabbing data from the trees generated.
    // This became necessary because classnames are now assigned random ids at build time.

    // checkbox
    const X = Object.values(mR.modules).filter(o=>o?.Z?.CheckboxOption)[0].Z;
    const { className: dropdownCheckboxOption, labelClassName: dropdownCheckboxOptionLabel } = X.CheckboxOption().props.children({onOptionClick:0, onBlur:0}).props;
    const C = Object.values(mR.modules).filter(o=>o?.Z?.defaultProps?.labelClassName==="")[0].Z.prototype.render.call({props:{ isChecked: true }}).props;
    const checkbox = C.className;
    const CL = C.children.props;
    const [checkboxLabel, checkboxLabelIsChecked] = CL.className.split(' ');
    const I = CL.children[0].props;
    const checkboxInput = I.className;
    const M = CL.children[1].props;
    const checkboxCheckmark = M.className;
    const S = M.children.props;
    const checkboxSvg = S.className;
    const P = S.children.props;
    const checkboxPath = P.className;
    const T = CL.children[2].props;
    const checkboxText = Object.values(mR.modules).filter(o=>o?.Z?.displayName === 'Text')[0].Z.render(T).props.className;
    
    // card elements
    const { watchlistCard, watchlistCard__contentLink } = canari;
    const watchListCardSubtitle = Object.values(mR.modules).filter(o=>o?.Z?.Subtitle)[0].Z.Subtitle({className: ''}).props.className;
    
    Object.assign(classNames, {
      dropdownCheckboxOption,
      dropdownCheckboxOptionLabel,
      checkbox,
      checkboxLabel,
      checkboxLabelIsChecked,
      checkboxInput,
      checkboxCheckmark,
      checkboxSvg,
      checkboxPath,
      checkboxText,
      watchlistCard,
      watchlistCard__contentLink,
      watchListCardSubtitle
    })
  }
  const c = classNames;
  
  let useBetterCards = localStorage.BETTER_CARDS !== "false"; // be optimistic
  const controls = document.querySelector(".erc-watchlist-controls");
  if (controls && !document.querySelector(".better-cards")) {
    const checkbox = crel('li', { className: "controls-item" }, 
                       crel('div', { className: `${c.checkbox} ${c.dropdownCheckboxOption}` },
                         crel('label', { className: `${c.checkboxLabel} ${c.dropdownCheckboxOptionLabel} better-cards`+(useBetterCards ? ` ${c.checkboxLabelIsChecked}`: ""), tabIndex: "0" },
                           crel('input', { className: c.checkboxInput, type: "checkbox", value: "better_cards" }),
                           crel('span', { className: c.checkboxCheckmark },
                             svg('svg', { class: c.checkboxSvg, viewBox: "2 2 16 16" },
                               svg('path', { class: c.checkboxPath, d: "M6,10 C7.93333333,12 8.93333333,13 9,13 C9.06666667,13 10.7333333,11 14,7", "stroke-width": "2"}))),
                           crel('span', { className: c.checkboxText }, t("Better Cards")))));
    const label = checkbox.querySelector(".better-cards");
    label.addEventListener("click", (e) => {
      if (e.target !== label.querySelector('input')) return;
      label.classList.toggle(c.checkboxLabelIsChecked, localStorage.BETTER_CARDS = useBetterCards = !useBetterCards);
      // remove all 'decorated' classes. triggers a mutation so this function runs again, and the loop below adjusts each card's appearance
      document.querySelectorAll(`.erc-my-lists-collection .${c.watchlistCard}.decorated`).forEach(e=>e.classList.remove('decorated'));
    });
    controls.insertBefore(checkbox, controls.firstChild);
  }
  for (const card of document.querySelectorAll(`.erc-my-lists-collection .${c.watchlistCard}:not(.decorated)`)) {
    const metadata = card.querySelector(`.${c.watchListCardSubtitle}`);
    if (useBetterCards) {
      const [item_id] = card.querySelector(`.${c.watchlistCard__contentLink}`).getAttribute('href').split('/').slice(-2); // XXX .at(-2)
      const item = watchlistItems.find(item => item.panel.id === item_id); 
      if (!item) return;
      const { watched, panel : { episode_metadata: ep, title }} = item;
      metadata.dataset.originalHTML = metadata.innerHTML;
      metadata.innerHTML = `<span style="font-size: 0.875rem; margin-top: 1.5rem"></span>`;
      const label = metadata.firstChild;
      switch (watched) {
        default:
        case NOT_WATCHED: 
          // use title & number to decorate watchlist item. iffy CSS.
          label.textContent = t('S{SEASON}E{EPISODE} - {TITLE}', {SEASON:ep.season_number || 1, EPISODE:ep.episode_number || 1, TITLE: title || t('Untitled')});
          metadata.style = 'height: 2.7em; overflow: hidden; text-overflow: ellipsis; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; white-space: normal';
          break;
        case WATCHED_WAIT: 
          // half-dullify and show original air date.
          label.textContent = t('Airs on {DATE}', { DATE: dateFormatter.format(new Date(ep.episode_air_date)) });
          card.style = 'filter: grayscale(90%);opacity:.9';
          break;
        case WATCHED_DONE: 
          // old shows, fully watched.
          // dullify thoroughly.
          label.textContent = t('No Recent Episode');
          card.style = 'filter: grayscale(90%);opacity:0.5';
          break;
      }
    } else {
      // restore original markup if we can.
      if (metadata.dataset.originalHTML) metadata.innerHTML=metadata.dataset.originalHTML;
      metadata.style='';
      card.style='';
    }
    card.classList.add('decorated');
  }
}

function hideComments() {
  const comments = document.querySelector(".commenting-wrapper");
  if (!comments) return;
  const comments_toggle = comments.querySelector('.comments-toggle');
  if (comments_toggle) return;
  const button = crel('div', { role: "button", className: "comments-toggle c-button c-button--type-two-weak", tabindex: "0"}, 
                   crel('span', { className: "c-call-to-action c-call-to-action--m c-button__cta", style: "cursor:pointer" }, t("Show/Hide Comments")));
  button.addEventListener('click', () => document.body.classList.toggle('show-comments'));
  comments.insertBefore(button, comments.firstChild);
}

function hideCookieBanner() {
  document.head.append(crel('style', { 
    type: 'text/css',
    textContent: `body:not(.show-evidon) .evidon-banner { 
      display: none !important;
    }`
  }));
  // not an unconditional hiding. let the user click a banner button once to trigger future hiding.
  if (!localStorage.evidon_clicked) {
    document.body.classList.add('show-evidon');
    document.body.addEventListener('click', e => {
      if (Array.from(document.querySelectorAll(`button[class*="evidon"]`)).includes(e.target)) {
        localStorage.evidon_clicked = true;
      }
    }, true);
  }
}

function main() {
  log('Starting.');

  // grab webpack modules first
  const mR = new moduleraid({ entrypoint: "__LOADABLE_LOADED_CHUNKS__", debug: false });
  const [ { Content } ] = mR.findModule('CMS'); // all the backend APIs are here.

  // state kept by this script
  const store = {
    // watchlist items last fetched
    watchlistItems : [],
    // classnames extracted from webpack exports, then cached here
    classNames: {}
  };
  
  // debugging help
  const devToolsDone = observeDOM(() => {
    if (devtools.isOpen) {
      const exposed = { Content, getProp, updateNodeProps, findNodesWithProp, mR, store, moduleraid };
      log('DevTools open', exposed);
      Object.assign(window, exposed);
      devToolsDone();
    }
  });
  
  // initial setup
  // wait for React so we can peek at Redux' state and get the accountId
  const setupDone = observeReact(() => {
    const accountId = getProp("store")?.getState()?.userManagement?.account?.accountId;
    if (!accountId) return;
    if (!localStorage.watchlist_userscript_setup) {
      console.log("accountId",accountId);
      // override watchlist_sort with our new order once after install.
      localStorage.WATCHLIST_SORT = JSON.stringify({ [accountId]: { type: "natural", order: "desc" }});
      localStorage.watchlist_userscript_setup = true;
    }
    setupDone();
  });

  
  // add our sort data early enough to be used by first render
  sortInit(mR);

  // intercept and augment watchlist requests
  axiosInit(Content, store);

  // player fixes - code triggers on React tree changes
  observeReact(tweakPlayer);
  
  // watchlist fixes - code triggers on DOM tree changes
  observeDOM(() => decorateWatchlist(store));
  
  // hide video comments by default
  document.head.append(crel('style', { 
    type: 'text/css',
    textContent: `body:not(.show-comments) .commenting-wrapper>div:last-child { 
      display: none;
    }`
  }));
  observeDOM(hideComments);
  
  // the cookie banner keeps on popping up even after interacting with it. make it not do that.
  hideCookieBanner();
}

untilDOM(() => window.__LOADABLE_LOADED_CHUNKS__ ).then(main);

