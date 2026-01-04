// ==UserScript==
// @name         Backloggery interop
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  Backloggery integration with game library websites
// @author       LeXofLeviafan
// @icon         https://backloggery.com/favicon.ico
// @match        *://backloggery.com/*
// @match        *://www.backloggery.com/*
// @match        *://steamcommunity.com/id/*/games*
// @match        *://steamcommunity.com/id/*/stats/*
// @match        *://steamcommunity.com/id/*/gamecards/*
// @match        *://steamcommunity.com/id/*/badges*
// @match        *://steamcommunity.com/profiles/*/games*
// @match        *://steamcommunity.com/profiles/*/stats/*
// @match        *://steamcommunity.com/profiles/*/gamecards/*
// @match        *://steamcommunity.com/profiles/*/badges*
// @match        *://steamcommunity.com/stats/*/achievements
// @match        *://steamcommunity.com/stats/*/achievements/*
// @match        *://store.steampowered.com/app/*
// @match        *://steamdb.info/app/*
// @match        *://steamdb.info/calculator/*
// @match        *://astats.astats.nl/astats/User_Games.php?*
// @match        *://gog.com/account
// @match        *://gog.com/*/account
// @match        *://gog.com/*/game/*
// @match        *://www.gog.com/account
// @match        *://www.gog.com/*/account
// @match        *://www.gog.com/*/game/*
// @match        *://www.humblebundle.com/home/*
// @match        *://itch.io/my-collections
// @match        *://*.itch.io/*
// @match        *://www.gamersgate.com/account/*
// @match        *://store.epicgames.com/*
// @match        *://play.google.com/*
// @match        *://www.dekudeals.com/collection*
// @match        *://www.dekudeals.com/items/*
// @match        *://psnprofiles.com/*
// @match        *://psnprofiles.com/trophies/*
// @match        *://retroachievements.org/user/*
// @match        *://retroachievements.org/game/*
// @require      https://unpkg.com/mreframe@0.2.0/dist/mreframe.js#sha256=7e789297a6ce514641860568db1c9269d4c1cf0f6cddc2242afd1effb04d0181
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/386681/Backloggery%20interop.user.js
// @updateURL https://update.greasyfork.org/scripts/386681/Backloggery%20interop.meta.js
// ==/UserScript==

/* eslint no-multi-spaces: "off", no-sequences: "off", no-return-assign: "off", curly: "off" */
(function() {
  'use strict';

  console.debug("[BL] loaded");
  GM_getValue('settings') || GM_setValue('settings', {});
  const NIL = undefined;
  const ROMAN = {Ⅰ: 'I', Ⅱ: 'II', Ⅲ: 'III', Ⅳ: 'IV', Ⅴ: 'V', Ⅵ: 'VI', Ⅶ: 'VII', Ⅷ: 'VIII', Ⅸ: 'IX', Ⅹ: 'X', Ⅺ: 'XI', Ⅻ: 'XII', Ⅼ: 'L', Ⅽ: 'C', Ⅾ: 'D', Ⅿ: 'M'};
  const LIG = {æ: 'ae', ł: 'l'};
  const [RE_ROMAN, RE_LIG] = [ROMAN, LIG].map(o => RegExp(`[${Object.keys(o).join('')}]`, 'g'));

  /* global require */
  let {identity, keys, vals, entries, dict: _dict, getIn, merge, assoc, assocIn, dissoc, update, chunks, eq, repr, chain, multi} = require('mreframe/util');

  let compact = xs => (xs||[]).filter(Boolean);
  let dict = pairs => _dict( compact(pairs) );
  let nameDict = (custom, ...names) => merge(custom, ...names.map(s => ({[s.toLowerCase()]: s})));
  let sortBy = (xs, weight) => xs.slice().sort((a, b) => weight(a) - weight(b));
  let groupBy = (xs, f) => xs.reduce((o, x, k) => (k = f(x),  (o[k] = o[k] || []).push(x),  o), {});
  let keymap = (ks, f) => dict( ks.map((k, i) => [k, f(k, i)]) );
  let mapEntries = (o, f) => dict( entries(o||{}).map(([k, v]) => f(k, v, o)) );
  let mapKeys = (o, f) => mapEntries(o, (k, v) => [f(k, v, o), v]);
  let mapVals = (o, f) => mapEntries(o, (k, v) => [k, f(v, k, o)]);
  let filterKeys = (o, f) => dict( entries(o||{}).filter(([k, v]) => f(k, v, o)) );
  let filterVals = (o, f) => filterKeys(o, (k, v) => f(v, k, o));
  let pick = (o, ...ks) => dict( ks.map(k => ((o||{})[k] != null) && [k, o[k]]) );
  let last = xs => xs[xs.length - 1];
  let range = (n, m) => (m == null ? range(0, n) : Array.from({length: m-n}, (_, i) => i+n));
  let in_ = (x, xs) => (xs||[]).includes(x);
  let when = (x, f) => (x ? f(x) : NIL);
  let replace = (s, re, pattern) => s.match(re) && s.replace(re, pattern);
  let str = (x, y=`${x}`, n="") => (x ? y : n),   str_ = (x, f) => when(x, f) || "";
  let join = (...ss) => compact(ss).join('\n');
  let qstr = s => str(in_('?', s), s.slice(1 + s.indexOf('?')));
  let query = s => dict( qstr(s).split('&').map(s => s.match(/([^=]+)=(.*)/)?.slice(1)) );
  let isHost = (...ss) => ss.some(s => `.${location.host}`.endsWith(`.${s}`));
  let slugify = s => s.replace(RE_ROMAN, c => ROMAN[c]).toLowerCase()               // replacing Roman numbers with equivalent Latin letters
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(RE_LIG, c => LIG[c])  // scrapping diacritics and ligatures
    .replace(/(?<=\b[a-z])[.](?=[a-z]\b)/g, "").replace(/['’]/g, "")                // removing apostrophes, and dots in abbreviations
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-*|-*$)/g, "");                         // replacing non-alphanumeric chars with '-', then trimming
  let capitalize = s => (s = `${s}`,  s.slice(0, 1).toUpperCase() + s.slice(1));
  let pascal = s => slugify(str(s)).split('-').map(capitalize).join("");
  let diff = (oldData, newData, normalize=identity) => when([oldData, newData].map(keys), ([oldKeys, newKeys]) =>
    ({removed: oldKeys.filter(k => !(k in newData)),
      added:   newKeys.filter(k => !(k in oldData)),
      updated: oldKeys.filter(k => (k in newData) && !eq(normalize(oldData[k]), normalize(newData[k])))}));
  let forever = f => setInterval(f, 100);
  let delay = msec => new Promise(resolve => setTimeout(resolve, msec));
  let debounce = (delay, action) => {
    let last = null;
    return function (...args) {clearTimeout(last);   last = setTimeout(() => action.apply(this, args), delay)};
  };

  const USER_OS = when([(navigator.platform||navigator.userAgentData?.platform||"").toLowerCase()], ([platform]) =>
    (platform.startsWith("win") ? 'windows' : platform.startsWith("mac") ? 'mac' : 'linux'));
  const PAGE = location.href;
  const PARAMS = query(location.search);
  const RE = {
    backloggery:        "backloggery\\.com/([^!/]+)($|[/?])",
    backloggeryAdd:     "backloggery\\.com/!/add$",
    backloggeryLists:   "backloggery\\.com/([^!/]+)/lists(?:/([0-9]+))?$",
    backloggeryTypes:   "backloggery\\.com/!/settings/platforms$",
    steamLibrary:       "steamcommunity\\.com/(?:id|profiles)/([^/]+)/games/?($|\\?)",
    steamAchievements:  "steamcommunity\\.com/(?:id|profiles)/([^/]+)/stats/[^/]+",
    steamAchievements2: "steamcommunity\\.com/stats/[^/]+/achievements",
    steamDetails:       "store\\.steampowered\\.com/app/([^/]+)",
    steamDbDetails:     "steamdb\\.info/app/[^/]+",
    steamDbLibrary:     "steamdb\\.info/calculator/([^/]+)/",
    steamStats:         "astats\\.astats\\.nl/astats/User_Games\\.php",
    steamBadges:        "steamcommunity\\.com/(?:id|profiles)/([^/]+)/(gamecards|badges)",
    gogLibrary:         "gog\\.com/([^/]+/)?account",
    gogDetails:         "gog\\.com(/([^/]+/)?game/[^/?]+)",
    humbleLibrary:      "humblebundle\\.com/home/(library|purchases|keys|coupons)",
    itchLibrary:        "itch\\.io/my-collections",
    itchDetails:        "[^/.]\\.itch\\.io/[^/]+$",
    ggateLibrary:       "gamersgate\\.com/account/games",
    epicStore:          "epicgames\\.com",
    gplay:              "play\\.google\\.com/*.",
    gplayLibrary:       "play\\.google\\.com/library/games$",
    gplayDetails:       "play\\.google\\.com/store/apps/details\\?id=([^&]+)",
    dekuLibrary:        "dekudeals\\.com/collection($|\\?(?!(.*&)?filter\\[))",
    dekuDetails:        "dekudeals\\.com/items/",
    psnLibrary:         "psnprofiles\\.com/([^/?]+)/?($|\\?)",
    psnDetails:         "psnprofiles\\.com/trophies/([^/?]+)/([^/?]+)$",
    retroProgress:      "retroachievements\\.org/user/([^/?]+)(/progress)?/?($|\\?)",  // progress + recents (on your profile page)
    retroGame:          "retroachievements\\.org/game/([0-9]+)/?($|\\?)",
  };
  const SETTINGS = GM_getValue('settings');

  const PSN_HW = {PS3: '3', PS4: '4', PS5: '5', VITA: 'V', VR: 'v'};
  const [ITCH_CDN, GGATE_CDN, PSN_CDN] = ["https://img.itch.zone/", "https://sttc.gamersgate.com/images/product/", "https://img.psnprofiles.com/game/"];
  const [EPIC_CDN, EPIC_STORE, RETRO_CDN] = ["https://cdn1.epicgames.com", "https://www.epicgames.com/store/product/", "https://media.retroachievements.org/Images/"];
  const [GPLAY_CDN] = ["https://play-lh.googleusercontent.com"];

  let $clear  = e => {while (e.firstChild) e.removeChild(e.firstChild);
                      return e};
  let $append = (parent, ...children) => (children.forEach(e => e && parent.appendChild(e)),  parent);
  let $before = (neighbour, ...children) => (children.forEach(e => e && neighbour.parentNode.insertBefore(e, neighbour)),  neighbour);
  let $after  = (neighbour, ...children) => when(neighbour.parentNode, parent => {
    (neighbour == parent.lastChild ? $append(parent, ...children) : $before(neighbour.nextSibling, ...children));
    return neighbour;
  });
  let $e = (tag, options, ...children) => $append(Object.assign(document.createElement(tag), options),
                                                  ...children.map(e => (typeof e != 'string' ? e : document.createTextNode(e))));
  let $get   = (xpath, e=document) => e && document.evaluate(xpath, e, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  let $find  = (selector, e=document) => e && e.querySelector(selector);
  let $find_ = (selector, e=document) => Array.from(typeof e?.querySelectorAll !== 'function' ? [] : e.querySelectorAll(selector));
  let $loadIcons = (e=document.head) => e?.append($e('link', {rel: 'stylesheet', href: "https://use.fontawesome.com/releases/v5.7.0/css/all.css"}));
  let $simulateInput = (input, value) => Object.assign(input, {value}).dispatchEvent(new Event('input', {bubbles: true}));
  let $addEventListener = (e, key, fn, _key=`_${key}BL`) => e?.addEventListener(key, e[_key] || (e[_key] = fn));
  let $setEventListener = (e, key, fn, _key=`_${key}BL`) => (e?.removeEventListener(key, e[_key]),   e?.addEventListener(key, (e[_key] = fn)));
  let $visibility = (e, x) => {e.style.visibility = (x ? 'visible' : 'hidden')};
  let $withLoading = (cursor, thunk) => new Promise(resolve => {
    cursor && document.body.classList.add(`${cursor}BL`);
    setTimeout(resolve, 100);
  }).then(thunk).finally(() => cursor && document.body.classList.remove(`${cursor}BL`));
  let $markUpdate = k => GM_setValue('updated', merge(GM_getValue('updated'), {[k]: new Date().getTime()}));
  let $stop = (f=(()=>{})) => e => (f(e),  e.stopPropagation(),  false);
  let $fetchJson = url => fetch(url).then(response => response.json());
  let $watcher = f => new MutationObserver((xs, watcher) => xs.forEach(x => x.addedNodes.forEach(e => e.tagName && f(e, watcher))));
  let $addStyle = (prefix, styles) => GM_addStyle( styles.map(s => s.replace(/^(?!\$)\s*/g, prefix+' ').replace(/\$/g, prefix)).join("\n") );
  let $addChanges = (newChanges) => when(GM_getValue('changes', []), (changes, oldChanges=new Set(changes)) =>
    GM_setValue('changes', [...changes, ...compact( newChanges.filter(id => !oldChanges.has(id)) )]));
  const WATCH_FIELDS = "name slug worksOn completed tags achievements platforms platform status trophies".split(' ');
  let $update = (library, newData) => when(GM_getValue(library, {}), oldData => {
    let {removed, added, updated} = diff(oldData, newData, o => chain(o, [pick, ...WATCH_FIELDS], [filterVals, Boolean]));
    $markUpdate(library);
    $addChanges( [...removed, ...updated].map(id => `${library}#${id}`) );
    console.debug("[BL] update stats", {library, old: oldData, new: newData, removed, added, updated});
    (removed.length > 0) && console.warn("[BL] removed:", library, removed.length, pick(oldData, ...removed));
    (updated.length > 0) && console.warn("[BL] updated:", library, updated.length, pick(oldData, ...updated), pick(newData, ...updated));
    (added.length   > 0) && console.warn("[BL] added:",   library, added.length,   pick(newData, ...added));
    GM_setValue(library, newData);
    setTimeout(() => alert( join(`Backloggery interop: added ${added.length} games, removed ${removed.length} games`,
                                 `(${updated.length} of ${keys(oldData).length} games changed)`) ));
  });
  const WATCH_META = {'steam-stats': 'steam', 'steam-platforms': 'steam', 'retro': 'retro'};
  let $mergeData = (key, newData, {showAlert}={}) => when([WATCH_META[key], GM_getValue(key, {})], ([library, oldData]) => {
    let {added, updated} = diff(oldData, newData, repr);
    library && $addChanges( updated.map(id => `${library}#${id}`) );
    console.debug("[BL] merging update stats", {library: library||key.replace(/-.*/, ""), size: keys(newData).length,
                                                old: pick(oldData, ...keys(newData)), oldAll: oldData, new: newData, added, updated});
    (updated.length > 0) && console.warn("[BL] updated:", key, updated.length, pick(oldData, ...updated), pick(newData, ...updated));
    (added.length   > 0) && console.warn("[BL] added:",   key, added.length,   pick(newData, ...added));
    GM_setValue(key, merge(oldData, newData));
    showAlert && (updated.length + added.length > 0) && setTimeout(() =>
      alert( join(`Backloggery interop: added ${added.length} games`, `(${updated.length} of ${keys(oldData).length} games changed)`) ));
  });

  if (isHost('backloggery.com', 'gog.com', 'humblebundle.com', 'itch.io', 'epicgames.com', 'play.google.com', 'psnprofiles.com')) {
    $loadIcons();
    GM_addStyle(`#loaderBL {position: fixed;  top: 50%;  left: 50%;  z-index: 10000;  transform: translate(-50%, -50%);
                            font-size: 300px;  text-shadow: -1px 0 grey, 0 1px grey, 1px 0 grey, 0 -1px grey}
                 @-webkit-keyframes rotationBL {from {-webkit-transform:rotate(0deg)}
                                                to {-webkit-transform:rotate(360deg)}}
                 @keyframes rotationBL {from {transform:rotate(0deg) translate(-50%, -50%);  -webkit-transform:rotate(0deg)}
                                        to {transform:rotate(360deg) translate(-50%, -50%);  -webkit-transform:rotate(360deg)}}
                 .rotatingBL {animation: rotationBL 2s linear infinite}
                 .progressBL * {cursor: progress !important}   .waitBL * {cursor: wait !important}
                 #loaderBL {display: none}   :is(.progressBL, .waitBL) #loaderBL {display: unset}`);
  }

  let _steamId = () => $find_("#CommunityTemplate > header nav + div > a").map(e => e.href.match("/(?:id|profiles)/([^/]+)/?$")?.[1]).find(Boolean);
  const USER_ID = (isHost('steamcommunity.com', 'store.steampowered.com') ? _steamId() :
                   isHost('steamdb.info') ? $find_("#account-menu a").map(e => e.href.match(RE.steamDbLibrary)?.[1]).find(Boolean) :
                   isHost('astats.nl') ? when($find(".navbar-right .dropdown-menu a[href^='/astats/User_Info.php?']")?.href, s =>
                                           query(new URL(s).search).SteamID64) :
                   isHost('retroachievements.org') ? $find(`nav .dropdown-menu-right a.dropdown-item[href*="/user/"]`)?.href.match(RE.retroProgress)?.[1] :
                   isHost('psnprofiles.com') ? SETTINGS.psnId : NIL);
  USER_ID && console.debug("[BL] info", {USER_ID});

  // eslint-disable-next-line no-undef
  if (isHost('backloggery.com')) new Promise(resolve => app.__vue__.$store.watch(x => x.page_platforms, resolve, {once: true})).then(BL_PLATFORMS => {

    let {reFrame: rf, reagent: r, atom: {deref, reset, swap}} = require('mreframe');

    let _type = s => s?.toLowerCase().replace(/\s+/g, '').replace(/^pc$/, 'windows').replace(/^ns(?=2?$)/, 'switch');
    const TYPES = dict(BL_PLATFORMS.map(x => [_type(x.abbr), x.platform_id]));
    let _loadTypeNames = () => Promise.resolve(GM_getValue('platforms')||fetch(`/api/fetch_platforms.php`).then(x => x.json())
      .then(o => dict( o.payload.map(x => [_type(x.abbr), x.title.replace(/^PC$/, "Windows (PC)")]).sort() )).then(o => (GM_setValue('platforms', o), o)));
    const RETRO_TYPES = nameDict({
      '64dd': 'N64', ams: 'CPC', appii: 'A2', arc2k1: 'A2001', ardu: 'ARD', cboy: 'DUCK', erdr: 'GBA', fc: 'NES', fds: 'NES', gcn: 'GC', gen: 'MD',
      intvis: 'INTV', jagcd: 'JCD', jaguar: 'JAG', nds: 'DS', ody2: 'MO2', pc80: '80/88', pc88: '80/88', pcecd: 'PCCD', pcfx: 'PC-FX', pkmini: 'MINI',
      ps: 'PS1', saturn: 'SAT', sg1000: 'SG1K', sfc: 'SNES', sgfx: 'PCE', smd: 'MD', svis: 'WSV', tg16: 'PCE', tgcd: 'PCCD', tvgc: 'ELEK', uzebox: 'UZE',
    }, '2600', '32X', '3DO', '7800', 'ARC', 'CHF', 'CV', 'DC', 'DSi', 'GB', 'GBA', 'GBC', 'GG', 'Lynx', 'MSX',
       'N64', 'NES', 'NGCD', 'NGP', 'PCE', 'PS2', 'PSP', 'SCD', 'SMS', 'SNES', 'VB', 'VC4000', 'VECT', 'WASM4', 'WS');
    const RETRO_MISC = ['EXE'];  // unmatched: standalone
    console.debug("[BL] types", TYPES, mapEntries(TYPES, k => when(RETRO_TYPES[k], x => [k, x])));

    const LIBS = ['steam', 'gog', 'humble', 'epic', 'itch', 'ggate', 'gplay', 'psn', 'deku', 'retro'];
    const EXTRAS = ['updated', 'steam-stats', 'steam-platforms', 'steam-rating', 'steam-my-tags', 'gog-rating',
                    'itch-info', 'gplay-img', 'gplay-info', 'psn-img', 'deku-info', 'retro-info'];
    const OS = {w: ["Windows", 'fa-windows'], l: ["Linux", 'fa-linux'], m: ["MacOS", 'fa-apple'],
                a: ["Android", 'fa-android'], s: ["Steam", 'fa-steam'], b: ["Web", 'fa-chrome']};
    const CUSTOM_ICONS = {steam: "fab fa-steam", windows: "fab fa-windows", linux: "fab fa-linux", mac: "fab fa-apple", android: "fab fa-android",
                          console: "fas fa-gamepad", xbox: "fab fa-xbox", playstation: "fab fa-playstation", web: "fab fa-chrome",
                          nodejs: "fab fa-node-js", flash: "fab fa-adobe", dice: "fas fa-dice", d20: "fas fa-dice-d20", trophy: "fas fa-trophy"};
    const INCOMPLETE = new Set(['none', 'unfinished', 'unplayed']);
    const RATING_ICON = [[94, '😎'], [90, '😍'], [80, '😋'], [70, '😏'], [60, '😌'], [50, '😐'], [40, '😕'], [30, '😢'], [20, '😨'], [0, '😱']];

    const BORDER = GM_getValue('settings', {}).borders || false;
    const COLORS = {unsynced: 'darkred', untracked: 'grey'};
    const BACKGROUNDS = {synced:    "linear-gradient(45deg, #000A, transparent)",
                         unsynced:  `linear-gradient(45deg, ${COLORS.unsynced}, indianred)`,
                         untracked: `linear-gradient(45deg, ${COLORS.untracked}, dimgrey, transparent)`};

    let statStr = (o={}, ...ks) => join(...ks.map(k => (o[k] || (o[k] === 0)) && `${capitalize(k)}: ${o[k]}`));
    const NOISE = new Set(`a an and as at by from for in into is of on or so the to game
                           collection edition remastered anniversary i ii iii iv v vi vii viii ix x`.split(/\s+/));
    let words = s => slugify(s).split('-').sort().reverse();
    let matching = (ss, zs) => {
      let weight = 0, i = 0, j = 0;
      while ((i < ss.length) && (j < zs.length)) {
        let s = ss[i],  z = zs[j];
        if (s === z) {
          i++,  j++,  weight += (NOISE.has(s) || !isNaN(s) ? 1.1 : 2);
        } else if (z.startsWith(s)) {
          i++,  j++,  weight += (z === s+'s' ? 1.5 : 1);
        } else {
          if (s < z) j++;  else i++;
        }
      }
      return weight;
    };
    let convertExcludeKey = (k, deku, psn) => k.replace(/^itchio#/, "itch#").replace(/droid#/, "gplay#")
      .replace(/^(?:psvr|psvita|ps[345]|switch|xbo|xboxs[xs])#(.*)$/, (_, id) => (id in deku ? `deku#${id}` : id in psn ? `psn#${id}` : ""));
    let convertExclude = (old, [deku, psn] = ['deku', 'psn'].map(k => GM_getValue(k, {}))) =>
      chain(groupBy(keys(old), k => k.replace(/#.*$/, "")),
            [mapVals, ks => compact( ks.map(k => old[k] && convertExcludeKey(k, deku, psn)) ).sort()],
            [filterVals, ks => ks.length > 0]);

    const INITIAL_STATE = {
      location:   new URL(location),
      cache:      keymap([...LIBS, ...EXTRAS, 'changes'], k => GM_getValue(k, (k === 'changes' ? [] : {}))),
      backlog:    GM_getValue('backlog2', {}),
      oldBacklog: GM_getValue('backlog'),
      exclude:    when(GM_getValue('exclude', {}), exclude => (keys(exclude).every(k => k in TYPES) ? exclude :
                                                               when(convertExclude(exclude), o => (GM_setValue('exclude', o),  o)))),
      lists:      GM_getValue('lists', {}),
      collapsed:  false,
    };

    rf.regSub('userId', getIn);
    rf.regSub('location', getIn);
    rf.regSub('cache', getIn);
    rf.regSub('hovered', getIn);
    rf.regSub('overlay', getIn);
    rf.regSub('overlayTypes', getIn);
    rf.regSub('collapsed', getIn);
    rf.regSub('upd', getIn);
    rf.regSub('backlog', getIn);
    rf.regSub('oldBacklog', getIn);
    rf.regSub('backlogTypeNames', getIn);
    rf.regSub('exclude', getIn);
    rf.regSub('lists', getIn);

    let _types = [], _regDataSub = (k, ...args) => when(TYPES[k], () => {_types.push(k);  rf.regSub(`data:${k}`, ...args)});
    let _rating = n => RATING_ICON.find(([m]) => Math.max(0, n) >= m)?.[1],  _rating5 = n => `${n}/5 ${_rating(25*(n-1))}`; // 1..5
    let _stars = (n, c="★") => range(n||0).map(() => c).join(""),  _stars5 = n => str(n, _stars(n) + _stars(5-n, "☆"));
    _regDataSub('steam', '<-', ['cache', 'steam'], '<-', ['cache', 'steam-stats'], '<-', ['cache', 'steam-platforms'],
                         '<-', ['cache', 'steam-rating'], '<-', ['cache', 'steam-my-tags'],
      ([data, stats={}, platforms={}, rating={}, tags={}]) => mapEntries(data, (id, o) =>
        [`steam#${id}`, merge(o, {url: `https://steamcommunity.com/app/${id}`, tags: tags[id], achievements: stats[id]||'?',
                                  rating: when(rating[id], n => n+"% "+_rating(n)), worksOn: platforms[id]||'s'})]));
    _regDataSub('gog', '<-', ['cache', 'gog'], '<-', ['cache', 'gog-rating'], ([data, rating={}]) => mapEntries(data, (id, o) =>
      [`gog#${id}`, merge(o, {url: str(o.url, `https://gog.com${o.url}`, NIL), storeRating: rating[o.url], completed: (o.completed ? 'yes' : 'no')})]));
    _regDataSub('humble', '<-', ['cache', 'humble'], data => mapKeys(data, k => `humble#${k}`));
    _regDataSub('epic', '<-', ['cache', 'epic'], data => mapEntries(data, (id, o) =>
      [`epic#${id}`, merge(o, {url: o.slug && EPIC_STORE+o.slug,  icon: EPIC_CDN+o.icon,  image: EPIC_CDN+o.image,
                               features: ['online', 'cloud'].filter(k => o[k]).join(", ")})]));
    _regDataSub('itchio', '<-', ['cache', 'itch'], '<-', ['cache', 'itch-info'], ([data, info={}]) => {
      let _info = mapVals(info, ({worksOn, rating, at, ...meta}) => ({worksOn, rating, sync: at, meta}));
      return mapEntries(data, (id, o) => [`itch#${id}`, merge(o, _info[id], o.image && {image: ITCH_CDN+o.image},
                                                              {meta: {Acquired: o.date, ...(_info[id]?.meta||{})}})]);
    });
    _regDataSub('ggate', '<-', ['cache', 'ggate'], data =>
      mapEntries(data, (id, o) => [`ggate#${id}`, merge(o, {url: `https://gamersgate.com/account/orders/${id.replace(':', '#')}`,
                                                            image: o.image && (GGATE_CDN+o.image)})]));
    _regDataSub('droid', '<-', ['cache', 'gplay'], '<-', ['cache', 'gplay-img'], '<-', ['cache', 'gplay-info'], ([data, img={}, info={}]) =>
      mapEntries(data, (id, o) => [`gplay#${id}`, merge(o, {url: `https://play.google.com/store/apps/details?id=${id}`, image: img[id]}, info[id])]));
    let _dekuData = platform => ([data, info={}]) => mapEntries(filterVals(data, o => o.platform === platform), (id, o) =>
      when(merge(o, info[ o.url.replace(/^\//, "") ]), o =>
        [`deku#${id}`, merge(o, {url: `https://www.dekudeals.com/items${o.url}`},
                             ...['image', 'icon'].map(s => o[s] && {[s]: `https://cdn.dekudeals.com/images${o[s]}`}))]));
    let _psnData = platform => ([data, images={}]) => mapEntries(filterVals(data, o => in_(PSN_HW[platform], o.platforms)),
      (id, o) => [`psn#${id}`, merge(o, {url: `https://psnprofiles.com/trophies/${id}/${SETTINGS.psnId||''}`},
                                     mapVals({icon: o.icon, image: images[id]}, s => s && PSN_CDN+s))]);
    let _retroData = platform => ([data, info={}]) => mapEntries(filterVals(data, o => o.platform === platform), (id, o) =>
      [`retro#${id}`, merge(info[id], o, {url: `https://retroachievements.org/game/${id}`},
                            mapVals({icon: o.icon, image: info[id]?.image}, s => s && (RETRO_CDN+s)))]);
    entries( nameDict({xboxss: 'xboxsx'}, 'switch', 'xbo', 'xboxsx') ).forEach(([type, platform]) =>
      _regDataSub(type, '<-', ['cache', 'deku'], '<-', ['cache', 'deku-info'], _dekuData(platform)));
    entries( nameDict({psvita: 'VITA', psvr: 'VR'}, 'PS3') ).forEach(([type, platform]) =>
      _regDataSub(type, '<-', ['cache', 'psn'], '<-', ['cache', 'psn-img'], _psnData(platform)));
    entries( nameDict({}, 'PS4', 'PS5') ).forEach(([type, platform]) =>
      _regDataSub(type, '<-', ['cache', 'psn'], '<-', ['cache', 'psn-img'], '<-', ['cache', 'deku'], '<-', ['cache', 'deku-info'],
        ([psn, psnImages, deku, dekuInfo]) => merge(_psnData(platform)([psn, psnImages]), _dekuData(type)([deku, dekuInfo]))));
    entries(RETRO_TYPES).forEach(([type, platform]) => _regDataSub(type, '<-', ['cache', 'retro'], '<-', ['cache', 'retro-info'], _retroData(platform)));
    _regDataSub('misc', '<-', ['cache', 'retro'], '<-', ['cache', 'retro-info'], args => merge( ...RETRO_MISC.map(k => _retroData(k)(args)) ));
    rf.regSub('data', () => keymap(_types, type => rf.subscribe([`data:${type}`])), identity);
    rf.regSub('data*', ([_, type]) => (!in_(type, _types) ? r.atom() : rf.subscribe([`data:${type}`])), (o, [_, type, ...path]) => getIn(o, path));
    rf.regSub('cached', '<-', ['cache'], o => LIBS.filter(k => o[k]).flatMap( multi().default(k => [[keys(o[k]).length, {itch: 'itchio', gplay: 'droid'}[k]||k]])
      .when('deku', k => entries( groupBy(vals(o[k]), x => x.platform) ).map(([type, xs]) => [xs.length, type, ...({xboxsx: ['xboxss']}[type] || [])]))
      .when('psn', k => entries( groupBy(vals(o[k]).flatMap(x => x.platforms.split('').map(c => [c, x])), ([c]) => c) ).map(([c, xs]) =>
        [xs.length, 'ps' + ({[PSN_HW.VITA]: 'vita', [PSN_HW.VR]: 'vr'}[c]||c)]))
      .when('retro', k => entries( groupBy(vals(o[k]), x => x.platform) ).map(([type, xs]) =>
        [xs.length, ...(in_(type, RETRO_MISC) ? ['misc'] : keys(RETRO_TYPES).filter(k => RETRO_TYPES[k] == type))])) ));
    rf.regSub('counts', '<-', ['cached'], '<-', ['backlogTypeNames'], ([cached, names={}]) =>
      chain(groupBy(cached, ([n, ...ks]) => compact( ks.map(k => names[k]) ).sort().join(" | ") || '?'),
            [mapVals, xs => xs.map(([n]) => n).reduce((a, b) => a+b)], (o => entries(o).sort()), [sortBy, ([s, n]) => -(s != '?' ? n : Infinity)]));
    rf.regSub('#data:all', ([_, type]) => rf.subscribe(['data*', type]), o => keys(o).length);
    rf.regSub('bound-ids', '<-', ['backlog'], (o, [_, type]) => compact( vals(o).map(x => x[type]) ).sort());
    rf.regSub('bound-ids*', ([_, type]) => rf.subscribe(['bound-ids', type]), ids => new Set(ids));
    rf.regSub('#bound-ids', ([_, type]) => rf.subscribe(['bound-ids', type]), ids =>
      mapVals(groupBy(ids, identity), xs => xs.length));
    rf.regSub('exclude*', ([_, type]) => rf.subscribe(['exclude', type]), ks => new Set(ks||[]));
    rf.regSub('data+', ([_, type]) => ['data*', '#bound-ids', 'exclude*'].map(k => rf.subscribe([k, type])), ([data, bound, excluded]) =>
      keys(data).map(id => ({id, bound: bound[id]||0, exclude: excluded.has(id), ...data[id]}))
                .sort((a, b) => (a.exclude-b.exclude) || (a.bound-b.bound) || a.name.localeCompare(b.name)));
    rf.regSub('word-sets', ([_, type]) => rf.subscribe(['data*', type]), data => mapVals(data, o => words(o.name)));
    rf.regSub('sort:all', ([_, type]) => ['word-sets', 'data+'].map(k => rf.subscribe([k, type])),
      ([sets, data], [_, type, id, text, weight=when(words(text), zs => mapVals(sets, ss => matching(zs, ss)))]) =>
        data.slice().sort((a, b) => ((b.id == id)-(a.id == id)) || (a.exclude-b.exclude) || (weight[b.id]-weight[a.id])));
    rf.regSub('sort:unbound', ([_, ...args]) => rf.subscribe(['sort:all', ...args]), xs => xs.filter(x => x.bound == 0));
    rf.regSub('#data:unbound', ([_, type]) => rf.subscribe(['data+', type]), (xs, [_, type, {excluded=true}={}]) =>
      xs.filter(x => (x.bound == 0) && (excluded || !x.exclude)).length);
    let _convertList = ([list, {'0': name, ...games}]) => when(name.match(/^(.*?)(?:\n([^]*))?$/), ([_, _name, desc]) =>
      entries(games).map(([id, s]) => [id, _name, desc, list, ...(s?.match(/(.*?):([^]*)/)||[]).slice(1)]));
    rf.regSub('lists*', '<-', ['lists'], o => mapVals(groupBy(entries(o).flatMap(_convertList), ([id]) => id), xs => xs.map(([_, ...x]) => x).sort()));
    rf.regSub('*tag-styles','<-', ['lists'], o => vals(o).map(s => s[0]?.split('\n')).filter(ss => ss?.[0] == '.tag-styles').flatMap(ss => ss.slice(1)));
    let _toStyle = k => [{bold: 'font-weight', italic: 'font-style'}[k] || (!k.endsWith("!") ? 'color' : 'background'), ":",
                         k.replace(/!$/, "").replace(/^(--.*)$/, "var($1)")].join("");
    rf.regSub('tag-styles', '<-', ['*tag-styles'], ss => when(compact( ss.map(s => s.match(/^([^:]+):(.*)$/)?.slice(1)) ), styles =>
      dict( styles.map(([k, v]) => [k, compact(v.split(" ")).map(_toStyle).join("; ")]) )));
    rf.regSub('tags-hideprefix', '<-', ['*tag-styles'], ss => ss.includes('!HIDEPREFIX'));
    rf.regSub('slugs', ([_, type]) => ['data*', 'bound-ids*', 'exclude*'].map(k => rf.subscribe([k, type])),
      ([data, bound, excluded], [_, type, {withExcluded=false}={}]) =>
         dict( sortBy(keys(data), k => !bound.has(k)).map(k => (withExcluded || !excluded.has(k)) && [slugify(data[k].name), k]) ));
    rf.regSub('slug', (([_, type]) => rf.subscribe(['slugs', type])), (o, [_, type, ...path]) => getIn(o, path));
    rf.regSub('#slugs', (([_, type]) => rf.subscribe(['slugs', type])), o => keys(o).length);

    rf.regSub('detected-id', ([_, {type, name}]) => rf.subscribe(['slug', type, slugify(name)]), identity);
    rf.regSub('library-id', ([_, o]) => rf.subscribe(['backlog', o.id]), (bl, [_, {type, libId}]) => libId || (bl?.custom ? NIL : bl?.[type]));
    rf.regSub('library-id*', ([_, o]) => [['backlog', o.id, 'custom'], ['library-id', o], ['detected-id', o]].map(rf.subscribe),
      ([custom, libId, detected], [_, {type}]) => (custom ? NIL : libId || detected));
    rf.regSub('backlog-entry', ([_, o]) => [['backlog', o.id], ['library-id', o]].map(rf.subscribe),
      ([bl, libId], [_, {name, type}]) => merge(bl, name && {name}, libId && {[type]: libId}));
    rf.regSub('library-entry', ([_, o]) => [['backlog-entry', o], ['library-id', o], ['data*', o.type]].map(rf.subscribe),
      ([bl, libId, data]) => bl?.custom||data?.[libId]);
    rf.regSub('library-source', ([_, o]) => [['backlog-entry', o], ['library-id', o]].map(rf.subscribe), ([bl, libId], [_, {type}]) =>
      (bl.custom ? 'custom' :  libId ? libId.replace(/#.*/, "") :
       in_(type, ['switch', 'xbo', 'xboxsx', 'xboxss', 'ps4', 'ps5']) ? 'deku' :
       in_(type, ['psvita', 'psvr', 'ps3', 'ps4', 'ps5']) ? 'psn' :
       type == 'itchio' ? 'itch' : type == 'droid' ? 'gplay' : in_(type, _types) ? type : NIL));
    rf.regSub('library-stats-updated', ([_, o]) => [['cache', 'updated'], ['library-source', o]].map(rf.subscribe),
              ([o, source]) => o[{steam: 'steam-stats'}[source]||source]);

    const _DATA_SUBS = {bl: 'backlog-entry', libId: 'library-id', data: 'library-entry', source: 'library-source'};
    let _dataSubs = (...extras) => ([_, o]) => mapVals(merge(_DATA_SUBS, ...extras), k => rf.subscribe([k, o]));
    rf.regSub('game-icon*', _dataSubs(), multi(o => o.source).default(({data}) => data?.icon||data?.image)
      .when('steam', ({libId, data}) => `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${libId.replace("steam#", "")}/${data.icon||"capsule_231x87.jpg"}`)
      .when('gog',   ({data}) => `https:${data?.image}_196.jpg`)
      .when('gplay', ({data}) => GPLAY_CDN + data?.icon));
    rf.regSub('game-image*', _dataSubs(), multi(o => o.source).default(({data}) => data?.image||data?.icon)
      .when('steam', ({libId, data}) => `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${libId.replace("steam#", "")}/${data.image||"header.jpg"}`)
      .when('gog',   ({data}) => `https:${data?.image}_392.jpg`)
      .when('gplay', ({data}) => GPLAY_CDN + (data?.image||data?.icon)));
    rf.regSub('game-icon', _dataSubs({icon: 'game-icon*', image: 'game-image*'}),
              ({bl, icon, image}) => (bl.force == 'image' ? image : icon));
    rf.regSub('game-image', _dataSubs({icon: 'game-icon*', image: 'game-image*'}),
              ({bl, icon, image}) => (bl.force == 'icon' ? icon : image));
    let _retroStatus = s => capitalize((s||'unfinished').split('-').map((z, i) => (i < 1 ? z : `(${z})`)).join(' '));
    const _ITCH_DATE = new Set(["Acquired", "Updated", "Published", "Release date"]);
    rf.regSub('game-stats', _dataSubs(), multi(o => o.source).default(() => "")
      .when('steam',  ({data}) => statStr(data, 'rating', 'tags', 'achievements'))
      .when('gog',    ({data}) => join(str_(data?.rating, n => `Rating: ${_stars5(n)}`), statStr(data, 'category', 'tags')))
      .when('humble', ({data}) => statStr(data, 'developer', 'publisher'))
      .when('epic',   ({data}) => statStr(data, 'developer', 'features'))
      .when('itch',   ({data}) => when(mapVals(data?.meta, (x, k) => str(!_ITCH_DATE.has(k), x, new Date(x))), meta =>
                                    statStr(meta, ...keys(meta))))
      .when('gplay',  ({data}) => statStr(data, 'rating', 'reviews', 'downloads', 'genre', 'developer', 'updated'))
      .when('deku',   ({data}) =>
        join(statStr(data, 'status', 'size', 'genre', 'released', 'metacritic', 'openCritic'), data?.time, data?.notes))
      .when('psn',    ({data}) => statStr(data, 'achievements', 'status', 'trophies', 'progress'))
      .when('retro',  ({data}) => join(when(data.status, s => "Status: "+_retroStatus(s)),
        statStr(data, 'achievements', 'hardcore', 'softcore', 'genre', 'released', 'developer', 'publisher'))));
    rf.regSub('game-name-stats', _dataSubs({stats: 'game-stats'}), (o, [_, {name}]) => join(`[${o.source}] ${o.data?.name||name||""}`, o.stats));
    rf.regSub('game-stats-updated', _dataSubs({upd: 'library-stats-updated'}), multi(o => o.source).default(({upd}) => upd)
      .when('custom', ({data}) => data?.updated)
      .when('itch',   ({data}) => data?.sync)
      .when('retro',  ({data}) => data?.sync));
    rf.regSub('game-synced', ([_, o]) => rf.subscribe(['game-stats-updated', o]), x => str(x, `Synced: ${new Date(x)}`));
    rf.regSub('game-stats*', ([_, o]) => [['game-name-stats', o], ['game-synced', o]].map(rf.subscribe), ss => join(...ss).split('\n'));
    rf.regSub('game-overlay', ([_, o]) => mapVals({image: ['game-image', o], stats: ['game-stats*', o]}, rf.subscribe), identity);
    let _cheevosMatch = ({achievements="0 / 0"}={}, cheevos) => (achievements || "0 / 0") == cheevos;
    rf.regSub('game-mark', _dataSubs(), multi(o => o.source).default(() => false)
      .when('steam', ({data}, [_, {cheevos}]) => !_cheevosMatch(data, cheevos))
      .when('psn',   ({data}, [_, {cheevos}]) => !_cheevosMatch(data, cheevos))
      .when('gog',   ({data}, [_, {status}]) => (data.completed == 'yes') == INCOMPLETE.has(status))
      .when('retro', ({data}, [_, {status, cheevos}]) => !_cheevosMatch(data, cheevos) || (data.achievements &&
        !in_(data.status, {completed: ['completed', 'mastered'], beaten: ['beaten-softcore', 'beaten-hardcore']}[status] || [NIL])))
      .when('deku',  ({data}, [_, {status, physical, priority}]) => {
        let valid = {"Completed": in_(status, ['beaten', 'completed']), "Currently playing": in_(priority, ["Ongoing", "Now Playing"]),
                     "Abandoned": priority === "Shelved",               "Want to play": in_(priority, ["Paused", "High"])}[data?.status];
        return ((data?.physical||false) != physical) || (data?.status && !valid)
      }));
    rf.regSub('game-highlight', ([_, o]) => [['backlog-entry', o], ['game-mark', o]].map(rf.subscribe), ([bl, mark]) =>
      (bl.custom || bl.ignore ? 'untracked' : mark ? 'unsynced' : 'synced'));
    rf.regSub('game-append', _dataSubs(), multi(o => o.source).default(() => "")
      .when('custom', () => " [custom]")
      .when('steam',  ({data}) => [str_(data?.rating, n => ` [${n}]`), str_(data?.hours, n => ` [${n}h]`)].join(""))
      .when('gog',    ({data}) => str_(data?.storeRating || data?.rating, n => ` [${_rating5(n)}]`))
      .when('itch',   ({data}) => str_(data?.rating, n => ` [${_rating5(n)}]`))
      .when('gplay',  ({data}) => str_(data?.rating, n => ` [${_rating5(n)}]`))
      .when('deku',   ({data}) => when({physical: "Physical", dlc: "DLC", rating: _rating5(data?.rating)}, o =>
        entries(o).map(([k, v]) => str(data?.[k], ` [${v}]`)).join("")))
      .when('psn',    ({data}) => str(data?.rank, ` [${data?.rank} rank]`)));
    rf.regSub('game-append*', ([_, o]) => [['backlog-entry', o], ['game-append', o]].map(rf.subscribe),
              ([bl, append]) => (bl?.ignore ? " [STATUS IGNORED]" : append||""));
    rf.regSub('game-platforms', _dataSubs(), ({data, source}) =>
      (source == 'custom' ? str(data?.icons).split(" ").map(s => [capitalize(s), CUSTOM_ICONS[s]]) :
       str(data?.worksOn).split("").map(c => OS[c]).map(([title, cls]) => [title, `fab ${cls}`])));
    rf.regSub('game-platforms*', ([_, o]) => rf.subscribe(['game-platforms', o]), xs => xs.map(([title]) => title).join(", "));
    rf.regSub('game-tooltip', ([_, o]) => ['append*', 'platforms*', 'synced'].map(k => rf.subscribe([`game-${k}`, o])),
      ([append, os, synced], [_, {name}]) => join(name + append + str(os, ` {${os}}`), synced));
    rf.regSub('game-link', ([_, o]) => rf.subscribe(['library-entry', o]), x => x?.url && {href: x.url});
    rf.regSub('game-status', ([_, type, id]) => rf.subscribe(['data*', type, id]),
      multi((o, [_, type, id]) => id.replace(/#.*/, "")).default(o => o?.status)
        .when('gog',   o => statStr(o, 'tags'))
        .when('psn',   o => statStr(o, 'rank', 'progress', 'trophies'))
        .when('deku',  o => join(o?.notes, o?.status))
        .when('retro', o => join(_retroStatus(o?.status), statStr(o, 'hardcore', 'softcore'))));
    rf.regSub('game-details', ([_, type, id]) => ['data*', 'game-status'].map(k => rf.subscribe([k, type, id])),
      ([o, status]) => ({...pick(o, 'achievements'), status}));

    rf.regSub('changes?', '<-', ['cache', 'changes'], xs => (xs||[]).length > 0);
    rf.regSub('changed', '<-', ['cache', 'changes'], xs => new Set(xs||[]));
    rf.regSub('changes', '<-', ['backlog'], '<-', ['changed'], ([backlog, changed]) =>
      filterVals(backlog, x => _types.some(k => changed.has(x[k]))));
    let _sortedBl = o => entries(o).map(([id, x]) => ({id, ...x})).sort((a, b) => (a.name||"").localeCompare(b.name||""));
    rf.regSub('changes*', '<-', ['changes'], _sortedBl);
    rf.regSub('custom', '<-', ['backlog'], o => filterVals(o, x => x.custom));
    rf.regSub('oldBacklog*', '<-', ['oldBacklog'], o => o||{});
    rf.regSub('old-custom', '<-', ['oldBacklog'], o => filterVals(o, x => x.custom));
    rf.regSub('old-custom*', '<-', ['old-custom'], _sortedBl);
    rf.regSub('#old-libs', '<-', ['oldBacklog'], o => vals(o).filter(x => !x.custom).length);
    rf.regSub('search-uri', '<-', ['userId'], (userId, [_, name, type]) => (!userId ? NIL :
      `/${userId}/library?${new URLSearchParams( dict([['search', name], ['page', 1], type && ['platform', '['+type+']']]) )}`));
    rf.regSub('uri', '<-', ['location'], o => `${o.pathname}?${new URLSearchParams(o.search)}`);

    let _checkUrl = rf.enrich(db => merge(db, {location: new URL(location), overlay: location.href.match(RE.backloggery),
                                               overlayTypes: location.href.match(RE.backloggeryTypes)}));
    let _setLists = rf.after((db, evt) => GM_setValue('lists', db.lists));

    rf.regEventDb('init', [_checkUrl], () => INITIAL_STATE);
    rf.regEventDb('set-userId', [_checkUrl, rf.unwrap, rf.path('userId')], (_, id) => id);
    rf.regEventDb('set-typeNames', [rf.unwrap, rf.path('backlogTypeNames')], (_, o) => o);
    rf.regEventDb('update-cache', [_checkUrl, rf.trimV, rf.path('cache')], (o, [k, v]) => assoc(o, k, v));
    rf.regEventDb('update-backlog', [_checkUrl, rf.unwrap, rf.path('backlog')], (_, o) => o);
    rf.regEventDb('update-exclude', [_checkUrl, rf.unwrap, rf.path('exclude')], (_, o) => o);
    rf.regEventDb('update-lists', [_checkUrl, rf.unwrap, rf.path('lists')], (_, o) => o);
    rf.regEventFx('check-url', [_checkUrl], () => {});  // invoking cofx explicitly
    rf.regEventDb('set-hovered', [rf.unwrap, rf.path('hovered')], (_, data) => data);
    rf.regEventDb('toggle-collapsed', [rf.path('collapsed')], x => !x);
    rf.regEventFx('delete-old', [rf.unwrap, rf.path('oldBacklog')], ({db}, id) =>
      ({confirm: {message: `Delete the old custom record '${db[id]?.name||'<unnamed>'}'?`, onSuccess: ['-delete-old', id]}}));
    rf.regEventFx('-delete-old', [rf.unwrap, rf.path('oldBacklog')], ({db}, id) => when(dissoc(db, id), o =>
      ({db: o, GM_setValue: {key: 'backlog', value: o}})));
    rf.regEventFx('clear-old', () => ({confirm: {message: "Delete all old entries?", onSuccess: ['-clear-old']}}));
    rf.regEventFx('-clear-old', [_checkUrl, rf.path('oldBacklog')], () => ({db: null, GM_deleteValue: 'backlog'}));
    rf.regEventFx('remove-change', [rf.unwrap, rf.path('cache', 'changes')], ({db}, id) =>
      when((db||[]).filter(x => x != id), xs => ({db: xs, GM_setValue: {key: 'changes', value: xs}})));
    rf.regEventFx('clear-changes', () => ({confirm: {message: "Clear stored changelog?", onSuccess: ['-clear-changes']}}));
    rf.regEventFx('-clear-changes', [_checkUrl, rf.path('cache', 'changes')], () => ({db: [], GM_deleteValue: 'changes'}));
    rf.regEventFx('toggle-exclude', [rf.trimV, rf.path('exclude')], ({db}, [type, id]) =>
      when(update(db, type, xs => (!in_(id, xs) ? [...(xs||[]), id].sort() : xs.filter(k => k !== id))), o =>
        ({db: o, GM_setValue: {key: 'exclude', value: filterVals(o, xs => xs.length > 0)}})));
    rf.regEventFx('init-backlog', [_checkUrl, rf.trimV, rf.path('backlog')], ({db}, [id, {type, libId}, bl]) =>
      when(merge(db, {[id]: merge(dissoc(bl, 'custom', ..._types), type && {[type]: libId})}), o =>
        ({db: o, GM_setValue: {key: 'backlog2', value: o}})));
    rf.regEventFx('assoc-backlog', [_checkUrl, rf.trimV, rf.path('backlog')], ({db}, args, path=args.slice(0, -1), x=last(args)) =>
        when(assocIn(db, path, x), o => !eq(db, o) &&
          {db: o, enhanceGameItem: path[0], GM_setValue: {key: 'backlog2', value: o}}));
    rf.regEventFx('dissoc-backlog', [_checkUrl, rf.unwrap, rf.path('backlog')], ({db}, id) =>
        when(dissoc(db, id), o => ({db: o, GM_setValue: {key: 'backlog2', value: o}})));
    rf.regEventFx('toggle-ignore', [_checkUrl, rf.unwrap, rf.path('backlog')], ({db}, id, o=db[id]) =>
      o && {dispatch: ['assoc-backlog', id, (o.ignore ? dissoc(o, 'ignore') : {...o, ignore: true})]});
    rf.regEventFx('toggle-custom', [rf.trimV], ({db}, [id, bl]) =>
      ({dispatch: ['assoc-backlog', id, (bl.custom ? dissoc(bl, 'custom') : merge(dissoc(bl, ..._types), {custom: {}}))]}));
    rf.regEventFx('cycle-force', [rf.trimV], ({db}, [id, bl]) =>
      ({dispatch: ['assoc-backlog', id, merge(bl, {force: {image: 'icon', '': 'image'}[bl.force||'']})]}));
    rf.regEventDb('purge-lists', [_setLists, rf.unwrap, rf.path('lists')], (lists, names) =>
      filterVals(lists, x => names.has(x['0'].split('\n', 1)[0])));
    rf.regEventDb('assoc-list', [_setLists, rf.trimV, rf.path('lists')], (lists, [id, name, desc, games]) =>
      assoc(lists, id, {...games, '0': name + str(desc, `\n${desc}`)}));
    rf.regEventFx('$set', [rf.trimV], (_, [state, data]) => ({$merge: {state, data}}));
    rf.regEventFx('$toggle-icon', [rf.trimV], (_, [state, id, icon, icons]) =>
      when([keys(CUSTOM_ICONS).filter(s => (s === icon) != in_(s, icons)).join(" ")||NIL], ([s]) =>
        ({$merge:   {state, data: {icons: s}},
          dispatch: ['assoc-backlog', id, 'custom', 'icons', s]})));
    rf.regEventFx('$reset', [rf.trimV], ({db}, [state, id, expand=false]) =>
      ({$merge: {state, data: merge(keymap("id icons url icon image name first".split(' '), _ => NIL), getIn(db, ['backlog', id, 'custom']))},
        dispatch: ['$expand', state, expand]}));
    rf.regEventFx('deselect', [rf.trimV, rf.path('backlog')], ({db}, [state, {id, type}]) =>
      ({fx: [['dispatch', ['$reset', state, id]], ['dispatch', ['assoc-backlog', id, dissoc(db[id], type)]]]}));
    rf.regEventFx('$expand', [rf.trimV], (_, [state, active=true]) =>
      ({$merge: {state, data: {active, preview: null}}, unfocus: !active}));
    rf.regEventFx('$unset-old', [rf.unwrap], (_, state) => ({$merge: {state, data: {id: NIL, icons: NIL, url: NIL, icon: NIL, image: NIL}}}));
    rf.regEventFx('$load-old-custom', [rf.trimV], ({db}, [state, oldId]) => when(getIn(db, ['oldBacklog', oldId, 'custom']), custom =>
      ({$merge: {state, data: {id: oldId, url: "", image: "", icon: "", icons: "", ...custom}}})));
    rf.regEventFx('move-old-custom', [rf.trimV], (_, args) =>
      ({confirm: {message: "Move this entry to new backlog?", onSuccess: ['-move-old-custom', ...args]}}));
    rf.regEventFx('-move-old-custom', [rf.trimV], ({db}, [state, oldId, newId]) =>
      when(db.backlog[newId] && getIn(db, ['oldBacklog', oldId, 'custom']), (custom, o=dissoc(db.oldBacklog, oldId)) =>
        ({db: merge(db, {oldBacklog: o}),  dispatch: ['assoc-backlog', newId, 'custom', custom],
          $merge: {state, data: {id: null, preview: null, active: false}},  GM_setValue: {key: 'backlog', value: o}})));
    rf.regEventFx('select', [rf.trimV, rf.path('backlog')], ({db}, [state, {id, type, name}, libId]) =>
      when((db[id]||{}), bl => ({fx: [['dispatch', ['assoc-backlog', id, merge(bl, {name, [type]: libId})]],
                                      ['dispatch', ['$reset', state, id]],  ['dispatch', ['remove-change', libId]]]})));
    rf.regEventFx('navigate', [_checkUrl, rf.unwrap], (_, uri) => uri && {navigate: uri});

    rf.regFx('confirm', ({message, onSuccess}) => confirm(message) && rf.disp(onSuccess));
    rf.regFx('unfocus', ok => {ok && document.activeElement?.blur()});
    rf.regFx('$merge', ({state, data}) => swap(state, merge, data));
    rf.regFx('GM_setValue', ({key, value}) => GM_setValue(key, value));
    rf.regFx('GM_deleteValue', GM_deleteValue);
    rf.regFx('enhanceGameItem', (id='_adder') => when($find(`#game${id}`)?.parentNode, enhanceGameItem));
    rf.regFx('navigate', uri => app.__vue__.$router.push(uri));  // eslint-disable-line no-undef

    rf.dispatchSync(['init']);
    _loadTypeNames().then(o => {console.debug('[bl] platforms', o);   rf.disp(['set-typeNames', o])});
    if (typeof GM_addValueChangeListener == 'function') {
      [...LIBS, ...EXTRAS, 'changes'].forEach(k =>
        GM_addValueChangeListener(k, (k, old, value, remote) => remote && rf.disp(['update-cache', k, value])));
      GM_addValueChangeListener('backlog2', (k, old, value, remote) => remote && rf.disp(['update-backlog', value]));
      GM_addValueChangeListener('exclude', (k, old, value, remote) => remote && rf.disp(['update-exclude', value]));
      GM_addValueChangeListener('lists', (k, old, value, remote) => remote && rf.disp(['update-lists', value]));
    }
    entries( rf.dsub(['data']) ).forEach(([type, data, slugs=rf.dsub(['slugs', type, {withExcluded: true}])]) => {
      let [n, m] = [data, slugs].map(o => keys(o).length);
      if (n != m) {
        let groups = groupBy(keys(data), id => slugify(data[id].name));
        let _data = (slug, ids, main=slugs[slug]) => [main, ...ids.filter(id => id != main)].map(id => ({id, ...data[id]}));
        let duplicates = entries(groups).filter(([slug, ids]) => ids.length > 1).map(([slug, ids]) => [slug, _data(slug, ids)]);
        console.warn(`[BL] ${type} names have ${n-m} collisions`, dict(duplicates));
      };
    })

    $append(document.body, $e('span', {id: 'side-loaderBL'}, $e('i', {className: "fas fa-cog rotatingBL"})));
    $append(document.body, $e('div', {id: 'overlayBL'}));
    GM_addStyle("body:not(.progressBL) #side-loaderBL {display: none}");
    $addStyle('.logoBL', ["{position: absolute;  left: -.5ex;  top: -1px;  width: 0;  display: flex;  flex-direction: row-reverse}",
                          "img {border: 1px solid darkorchid;  background: #1b222f;  max-height: 54px;  max-width: none}",
                          `$.force img {border-color: cornflowerblue}   $.source-custom img {border-color: ${COLORS.untracked}}`,]);
    $addStyle('.draggable_list', [".logoBL {left: .5ex}"]);
    $addStyle(':not(.listed_game, .draggable_list)', ["> .game-item {overflow: visible}"]);  // otherwise logo will be cut off
    $addStyle('.os', ["{padding-left: .75ex;  line-height: 0 !important;  font-size: 20px;  position: relative;  top: 2.5px;  font-weight: 400}",
                      "$:is(.fa-gamepad, .fa-dice, .fa-dice-d20, .fa-trophy) {font-weight: 900}"]);
    $addStyle('.tagsBL', [`{position: absolute;  top: 42px;  width: calc(100% - 75px);  margin: 0 53px;  padding: 0 4px;  pointer-events: none;
                            overflow-y: hidden;  overflow-x: auto;  scrollbar-width: none;  border-radius: 1em;  text-align: right;  z-index: 1}`,
                          `a {background-color: var(--active-accent);  color: var(--active-accent-text);  pointer-events: all;  border: 1px solid #0008;
                              border-radius: .25rem;  opacity: .8;  padding: 0 .25em;  font-size: smaller;  user-select: none;  white-space: nowrap}`,
                          "a:not(:hover) .collapseBL {display: none}"]);
    $addStyle('#overlayBL', ["{z-index: 10000;  pointer-events: none;  position: fixed;  top: 0;  left: 0;  width: 100%;  height: 100%;  display: flex}"]);
    $addStyle('#overlayBL .tooltip', [`{margin: auto;  align-items: center;  display: flex;  flex-direction: column;
                                        max-height: calc((100% - 54px) * .95);  background: rgba(0, 0, 0, 0.8);  padding: 2em;
                                        width: calc(min(66%, 800px) - 116px - 2vw);  transform: translate(calc(min(33%, 400px) - 20px - 1vw), 27px)}`,
                                      "$ > * {max-width: 100%}   $ > div {padding-top: 1em;  font-weight: bold}",
                                      "pre {white-space: pre-wrap;  margin: 1ex 0}"]);
    $addStyle('#overlayBL .changelist', [`{position: absolute;  top: 53px;  left: 0;  pointer-events: all;  background: rgba(0, 0, 0, 0.8);
                                           max-width: 33%;  max-height: 50%;  display: flex;  flex-direction: column}`,
                                         "$.right {right: 0;  left: auto}   $.collapsed {opacity: .5}   $:hover {opacity: 1}",
                                         "$ .items {overflow-y: auto}   $ .items > .item {margin: 1em}   $ .items > .item .delete {cursor: pointer;  float: right}",
                                         "> h1 {cursor: pointer;  position: relative;  padding: 1em;  padding-right: 3em}",
                                         "> h1 > .right {position: absolute;  right: 0;  margin-right: 1em}",
                                         "button {background: #4b4b4b;  color: white;  border: 1px solid black;  cursor: pointer;  border-radius: 5px}"]);
    $addStyle('#side-loaderBL', [`{position: fixed;  bottom: 1ex;  left: 1ex;  z-index: 10000;  font-size: 100px;
                                   text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000}`]);
    $addStyle('#import-dialogBL', [`{background: black;  position: fixed;  top: 45%;  left: 45%;  padding: 1em;  text-align: center}`]);
    const NAME_HEIGHT = 33.5/*px*/;
    $addStyle('.edit-widget', ["$ {position: relative;  top: 50px;  z-index: 500}   $:has(+ :not(.data)) {display: none}",
                               "$ .row {width: 100%;  display: flex;  flex-direction: row;  flex-shrink: 1}   $ .row.reverse {flex-direction: row-reverse}",
                               "input {margin-bottom: 0;  margin-right: 0;  color: white;  background: linear-gradient(45deg, dimgrey, grey, dimgrey)}",
                               "input::placeholder {color: darkgrey;  font-style: italic}",
                               ".names {max-height: 500px;  overflow-y: auto;  background: grey;  position: absolute;  width: 100%}",
                               "$ .names .list {display: flex;  flex-direction: column}   $ .row > :not(.row) {flex-shrink: 0}",
                               "button {height: 28px;  background: #4b4b4b;  color: white;  border-radius: 10px 8px 8px 10px;  padding: 5px}",
                               `.name {white-space: nowrap;  display: flex;  margin: .5px;  height: ${NAME_HEIGHT-1}px;  padding-top: 8px;  flex-shrink: 0}`,
                               "$ .name .title {flex-grow: 1;  text-align: left;  overflow: hidden;  text-overflow: ellipsis;  font-weight: normal}",
                               "$ .trash {cursor: pointer;  padding-right: 5px}   $ .name.bound .trash {opacity: 0.5;  cursor: not-allowed}",
                               "$ .name {width: calc(100% - 2px)}   $ .current .title {font-weight: bold}   $ .name .os {padding: 5px}",
                               "button b {flex: 1;  padding-left: 1ex;  text-align: left;  overflow: hidden;  text-overflow: ellipsis}",
                               "$ .oslist {display: flex;  position: absolute;  padding: 15px}   $ .name.bound:not(.current) .title {text-decoration: line-through}",
                               "$ .oslist .os {padding-top: 7.5px}   $ .os {padding-left: .75ex;  font-size: 20px;  color: white}",
                               "$ .oslist .action {padding-left: 1ex;  pointer-events: all}   $ .action {color: white;  cursor: pointer}",
                               "$ .anchor .action {position: absolute;  top: 17px;  right: 7.5px}   $ .action.fa-eye {cursor: zoom-in}",
                               "$ .hint {font-weight: bold;  font-style: italic;  white-space: pre-wrap}   $ .hint[href] {color: royalblue}",
                               "$ .semi-opaque {background: rgba(0, 0, 0, 0.8)}   $ .btn.custom {align-self: center;  margin-top: .5vh;  margin-right: .5vw}",
                               "$ .btn.force {align-self: center;  margin-top: .5vh;  margin-left: .5vw}",
                               "$ .anchor {position: relative}   $ .anchor input {padding-right: 30px}   $ .btn.fills:not(.selected) {border-color: gold}",
                               "$ .icons {padding-top: 1ex;  text-align: center}   $ .icons .btn {margin: .12em}   $ .btn.selected {border-color: white}",
                               ".btn {background: #4b4b4b;  color: white;  border: 1px solid black;  font-size: 20px;  padding: 5px;  border-radius: 5px}",
                               "$ .btn.disabled {color: dimgrey}   $ .btn:not(.disabled) {cursor: pointer}   $ .done {width: 90%;  cursor: pointer}",
                               "$ .btn.fa-eye {margin-left: 1.25px}   $ :is(.done, .img-preview) {display: block;  margin: 1ex auto}",
                               `.img-preview {border: 1px solid ${COLORS.untracked};  max-width: calc(100% - 2ex)}`]);
    $addStyle('input + .edit-widget',       [".oslist .os {color: var(--active-secondary-text)}"]);  // on Add form
    $addStyle('input:focus + .edit-widget', [".oslist .os {color: #000000d9}"]);                     // same when Title input is focused
    $addStyle('.game-info', ["$ .achBL {float: right;  padding: 0 1ex}   $ .statusBL {padding: 0 1ex;  font-size: 12px;  font-weight: bold;  white-space: pre-wrap}",
                             ".warnBL {color: red;  text-shadow: 0px 0px 10px red}",
                             `.ignoreBL {background: #4b4b4b;  color: white;  border: 1px solid black;  font-size: 15px;  padding: 6px;  border-radius: 5px;
                                         line-height: 10px;  margin: -5px 0;  cursor: pointer;  float: right}`,
                             "> :not(.data) :is(.achBL, .statusBL, .ignoreBL) {display: none}"]);    // Vue renderer moves these between tabs :-/
    $addStyle('.add-game', [".imageBL {display: block;  margin: 1em auto 0}"]);
    let Image = attrs => attrs.src && ['img', {...attrs, key: attrs.src||attrs.key}];
    let Overlay = () => when([['overlay'], ['overlayTypes'], ['hovered'], ['changes?'], ['old-custom*'], ['collapsed']].map(rf.dsub),
                             ([overlay, overlayTypes, hovered, stored, old, collapsed]) =>
      (overlayTypes            ? when(rf.dsub(['counts']), xs =>
         [Overlay.ChangeList, `Synced Platforms (${xs.length})`,
           {class: 'right', items: !collapsed && xs.map(([s, n]) => ['.item', ['strong', s], ` (${n})`])}]) :
       !overlay                ? NIL :
       hovered                 ? when(rf.dsub(['game-overlay', hovered]), data =>
         ['.tooltip',
           [Image, {key: '-', src: data.image, style: {overflow: 'hidden'}}],  // this forces the image to scale down to fit the box… CSS, amirite?
           ['div', {key: ''}, ...data.stats.map(s => ['pre', s])]]) :
       rf.dsub(['oldBacklog']) ? when(rf.dsub(['uri']), uri =>
         [Overlay.ChangeList, `Old custom entries (${old.length}) `,
           {empty: ['button', {onclick: () => rf.disp(['clear-old'])}, "Delete old entries from storage"],
            items: !collapsed && old.map(o => when(rf.dsub(['search-uri', o.name]), (href, here=(uri == href)) =>
              ['.item', [Overlay.Link, (here ? NIL : href), o.name],
                        here && ['i.delete.fas.fa-trash-alt', {title: "Delete", onclick () {rf.disp(['delete-old', o.id])}}]]))}]) :
       stored                 && when([['changes*'], ['uri']].map(rf.dsub), ([changes, uri]) =>
         [Overlay.ChangeList, `Unseen changes (${changes.length}) `,
           {empty: ['button', {onclick: () => rf.disp(['clear-changes'])}, "Clear changelog from storage"],
            items: !collapsed && changes.map(o => when(_types.find(k => o[k]),
              (type, href=rf.dsub(['search-uri', o.name, TYPES[type]]), here=(uri == href)) =>
                ['.item', [Overlay.Link, (here ? NIL : href), o.name, ` [${type}]`],
                          here && ['i.delete.fas.fa-trash-alt', {title: "Delete", onclick () {rf.disp(['remove-change', o[type]])}}]]))}])));
    Overlay.ChangeList = (header, {empty, items, collapsed=rf.dsub(['collapsed']), class: cls}) =>
      ['.changelist', {class: r.classNames({collapsed}, cls)},
        ['h1', {onclick: () => rf.disp(['toggle-collapsed'])}, header, ['span.right', `[${collapsed ? '+' : '-'}]`]],
        !collapsed && ['.items', ...((items||[]).length > 0 ? items : [empty])]]
    Overlay.Link = (href, ...content) => ['a', {href, onclick: e => (e.preventDefault(),  rf.disp(['navigate', href]))}, ...content];
    r.render([Overlay], overlayBL);  // eslint-disable-line no-undef

    let WidthWatcher = r.createClass({
      getInitialState:   () => ({signalWidth: () => {}}),
      componentDidMount  () {this.state.signalWidth(this.dom.offsetWidth)},
      componentDidUpdate () {this.state.signalWidth(this.dom.offsetWidth)},
      reagentRender (signalWidth, body) {this.state.signalWidth = signalWidth;
                                         return body},
    });
    let EditWidget = ({id}, gameItem) => when(r.atom( rf.dsub(['backlog', id, 'custom']) ), state => (info, gameItem, form) => {
      let bl = rf.dsub(['backlog-entry', info]);
      return ['.row',
               id && ['i.btn.custom', {class: ['fa', (bl.custom ? 'fa-edit' : 'fa-list')], title: (bl.custom ? "Custom" : "Listed"),
                                       onclick: () => rf.disp(['toggle-custom', id, bl])}],
               (!bl.custom ? [EditWidget.ForType, state, info, form, bl] :
                [EditWidget.Custom, state, bl.custom, info, gameItem, form])];
    });
    const _DELAY = 250/*ms*/;
    const _CUSTOM_TEMPLATES = {
      steam: {
        url: "https://steamcommunity.com/app/*",
        icon: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/*/capsule_231x87.jpg",
        image: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/*/header.jpg",
      },
      android: {
        url: "https://play.google.com/store/apps/details?id=*",
        icon: "https://play-lh.googleusercontent.com/*=s64-rw",
      },
    };
    let $upd = (state, key, extra={}) => debounce(_DELAY, function () {rf.dispatchSync(['$set', state, {[key]: this.value||NIL, ...extra}])});
    EditWidget.Custom = (state, custom, info, gameItem, form) => {
      let {active, row, id, oslist, preview, icons="", url="", icon="", image=""} = deref(state)||{};
      let empty = !(url||icon||image);
      let [oldCustom, _icons] = [rf.dsub(['old-custom*']), compact( icons.split(" ") )];
      let $preview = (x=null) => rf.disp(['$set', state, {preview: x}]);
      let $save = key => debounce(_DELAY, function () {when({[key]: this.value}, o => eq(custom, merge(custom, o)) ||
                                                              rf.disp(['assoc-backlog', info.id, 'custom', merge(custom, {updated: Date.now()}, o)]))});
      let $done = () => delay(_DELAY).then(() => rf.disp(!id ? ['$expand', state, false] : ['move-old-custom', state, id, info.id]));
      let _iconTooltip = k => join(capitalize(k), _CUSTOM_TEMPLATES[k] && "(+populates the form if it's empty)");
      enhanceForm(form, info.id);
      return ['.row.reverse', {onkeydown (e) {(e.key == 'Escape') && rf.disp(['$reset', state, info.id])}},
               [WidthWatcher, x => (row == x) || rf.disp(['$set', state, {row: x}]),
                 ['input[type=url]', {value: url, disabled: id, placeholder: "Link", title: "URL", style: {paddingRight: `${(oslist||30) - 15}px`},
                            onfocus () {rf.disp(['$expand', state])},   oninput: $upd(state, 'url'),   onchange: $save('url')}]],
               [WidthWatcher, x => (oslist == x) || rf.disp(['$set', state, {oslist: x}]),
                 ['.oslist',
                   ...rf.dsub(['game-platforms', info]).map(([title, cls]) => ['i.os', {class: cls, title}]),
                   url && ['a.action', {title: "Test", target: '_blank', href: url}, ['i.fas.fa-external-link-alt']]]],
               active &&
                 ['.semi-opaque', {style: {position: 'absolute', top: "43px", width: `${row||0}px`}},
                   ['.anchor',
                     ['input[type=url]', {value: icon, disabled: id, placeholder: "Logo", title: "Logo URL", oninput: $upd(state, 'icon'), onchange: $save('icon')}],
                     icon  && ['i.action.fas.fa-eye', {title: "Preview", onmouseenter () {$preview('icon')},  onmouseleave () {$preview()}}]],
                   ['.anchor',
                     ['input[type=url]', {value: image, disabled: id, placeholder: "Poster", title: "Poster URL", oninput: $upd(state, 'image'), onchange: $save('image')}],
                     image && ['i.action.fas.fa-eye', {title: "Preview", onmouseenter () {$preview('image')}, onmouseleave () {$preview()}}]],
                   ['.anchor.icons', ...keys(CUSTOM_ICONS).map(k =>
                     ['i.btn', {class: [CUSTOM_ICONS[k], empty && _CUSTOM_TEMPLATES[k] && 'fills', in_(k, _icons) && 'selected', id && 'disabled'], title: _iconTooltip(k),
                                onclick () {delay(_DELAY).then(() => {id || rf.dispatchSync(['$toggle-icon', state, info.id, k, _icons]);
                                                                      empty && !in_(k, _icons) &&
                                                                        when(_CUSTOM_TEMPLATES[k], o => rf.disp(['$set', state, o]))})}}])],
                   (id || (empty && !icons)) && (oldCustom.length > 0) &&
                     ['select', {onchange () {delay(_DELAY).then(() => rf.disp(['$load-old-custom', state, this.value]))}},
                       ['option', {disabled: true, selected: !id}, "Import from old custom"],
                       ...oldCustom.map(x => ['option', {value: x.id, selected: id === x.id}, x.name])],
                   ['.anchor',
                     ['button.done', {onclick: $done}, (!id ? "Done" : "Move from the old backlog")],
                     id && ['button.done', {onclick: () => delay(_DELAY).then(() => rf.disp(['$unset-old', state]))}, "Reset"]],
                   [Image, {class: 'img-preview', src: {icon, image}[preview]}]]];
    };
    EditWidget.ForType = (state, info, form, bl) => {
      let {active, row, oslist, first=0, name} = deref(state)||{};
      let [id, data] = ['id', 'entry'].map(k => rf.dsub([`library-${k}`, info]));
      enhanceForm(form, info.id, id && rf.dsub(['game-details', info.type, id]));
      return ['<>',
               ['.row.reverse', {onkeydown (e) {(e.key == 'Escape') && rf.disp(['deselect', state, info])}},
                 [WidthWatcher, x => (row == x) || rf.disp(['$set', state, {row: x}]),
                   ['input', {disabled: !in_(info.type, _types),   style: {paddingRight: `${(oslist||30) - 15}px`},
                              value: (active ? name : data?.name),   oninput: $upd(state, 'name'),
                              onfocus () {rf.disp(['$set', state, {active: true, name: this.value||data?.name||info.name}])}}]],
                 [WidthWatcher, x => (oslist == x) || rf.disp(['$set', state, {oslist: x}]),
                   ['.oslist', ...rf.dsub(['game-platforms', info]).map(([title, cls]) => ['i.os', {class: cls, title}])]],
                 [EditWidget.Names, 'all', state, {position: 'absolute', top: "43px", width: `${row||0}px`},
                  id, info.type, name, x => rf.disp(['select', state, info, x.id])]],
               ['i.btn.force', {class: ({icon: "fas fa-image", image: "fas fa-portrait"}[bl.force] || "far fa-images"),
                                title: `Displaying ${{icon: "logo only", image: "poster only"}[bl.force] || "logo and poster"}`,
                                onclick: () => rf.disp(['cycle-force', info.id, bl])}]];
    };
    const FORM_TITLE    = ".//label[normalize-space()='Title *']/following::input";
    const FORM_PLATFORM = ".//label[normalize-space()='Platform *']/following::select";
    const FORM_SAVES = [1, 2].map(i => `.//*[@class='button-row']/button[${i}]`);
    EditWidget.Add = (panel, form, gameItem, {type}) => when(r.atom({id: gameItem._id}), state => {
      let [title, platform, ...saves] = [FORM_TITLE, FORM_PLATFORM, ...FORM_SAVES].map(s => $get(s, form));
      let _save = x => panel._saved.unshift({name: x.name||title.value, href: rf.dsub(['search-uri', title.value, platform.value])});
      let _setId = id => (gameItem._id = id,  enhanceGameItem(gameItem),  id);
      let _saveIfAdded = ({payload: o}) => when((o?.type == 'queueToast') && (o.flavor == 'success') && `${o.msg}`.endsWith(" - Added!"),
          () => {_save(deref(state));  reset(state, {});  _setId()});
      rf.dispatchSync(['$set', state, {name: title.value}]);
      $setEventListener(title, 'focus', () => rf.disp(['$set', state, {active: true, name: title.value}]));
      $setEventListener(title, 'keydown', e =>
        when(e.key == 'Escape', () => {title.blur();  _setId();  swap(state, pick, 'saved')}));
      $setEventListener(title, 'input', $upd(state, 'name'));
      when(panel._unsubscribe, f => f());
      panel._unsubscribe = panel.__vue__?.$store.subscribeAction(_saveIfAdded, {prepend: true});
      return (panel, form, gameItem, info) => {
        let [{type}, {active, id, name, oslist, first=0}] = [info, deref(state)];
        let data = id && rf.dsub(['data*', type, id]);
        title.style.paddingRight = `${(oslist||30) - 15}px`;
        enhanceForm(form, null, id && rf.dsub(['game-details', type, id]));
        return ['<>',
                 id && [WidthWatcher, x => (oslist == x) || rf.disp(['$set', state, {oslist: x}]),
                         ['.oslist', {style: {right: 0, top: '-6ex'}},
                           ...(data.worksOn||"").split("").map(c => OS[c]).map(([title, cls]) => [`i.fab.${cls}.os`, {title}])]],
                 [EditWidget.Names, 'unbound', state, {}, id, type, name, x =>
                    {$simulateInput(title, x.name);   rf.disp(['$set', state, {active: false, id: _setId(x.id), first: 0}])}]];
      };
    });
    const LIST_OFFSET = 50, LIST_MARGIN = (LIST_OFFSET-15) / 2;  // 500px/33.5px = 15 rows visible (clipping the list for performance)
    EditWidget.Names = (suffix, state, style, id, type, name, onclick) => {
      let {active, first=0} = deref(state)||{};
      let count = rf.dsub([`#data:${suffix}`, type]);
      return active && when(rf.dsub([`sort:${suffix}`, type, id, name||""]).slice(first, first+LIST_OFFSET), results =>
        ['.names', {style, onscroll: e => when([Math.max(0, parseInt(e.target.scrollTop/NAME_HEIGHT - LIST_MARGIN))], ([x]) =>
                                               (first != x) && rf.dispatchSync(['$set', state, {first: x}]))},
          ['.list', {style: {height: `${count * NAME_HEIGHT}px`}}, ...results.map((x, i) =>
            ['button.name', {class: {current: x.id == id, bound: x.bound},  disabled: x.exclude,
                             style: {position: 'absolute', top: `${(first+i) * NAME_HEIGHT}px`},  onclick: () => onclick(x),
                             title: x.name + ([" ", " [bound]"][x.bound] || ` [bound×${x.bound}]`)},
              ['i.trash', {class: `fas fa-trash${!x.exclude ? '' : '-restore'}-alt`, title: (x.exclude ? "Restore" : "Exclude"),
                           onclick: $stop(() => (x.exclude || (x.bound == 0)) && rf.disp(['toggle-exclude', type, x.id]))}],
              ['span.title', x.name],
              ...(x.worksOn||"").split("").map(c => OS[c]).map(([title, cls]) => [`i.fab.${cls}.os`, {title}])])]]);
    };

    let _queue = (e, task) => {_queue._.unshift(e);   $withLoading('progress', () => _queue.process(task))};
    _queue._ = [];
    _queue.pop = () => (_queue._ = _queue._.filter(e => e.isConnected)).pop();
    _queue.process = task => delay().then(() => when(_queue.pop(), e => (task(e), _queue.process(task))));

    let _renameWindows = (e) => when(e, () => {
      if (e.title == "PC")     e.title     = "Windows";
      if (e.innerText == "PC") e.innerText = "Windows";
    });

    let $getText = (element, ...hide) => {
      hide.forEach(e => e && $visibility(e, false));
      let text = element.innerText;
      hide.forEach(e => e && $visibility(e, true));
      return text;
    }

    const CHEEVOS = "^([0-9]+ / [0-9]+) Achievements ";
    let _info = (game, data=getIn(game, ['parentNode', '__vue__', '_vnode', 'context', '_data', 'game'])) => {
      let [_platform, _status] = [".platform > * > *", ".status"].map(s => $find(s, game));
      let type = (_platform?.alt || _platform?.innerText || data?.abbr);
      return {id:       when(_status.id.replace(/^game/, ""), x => Number(x)||NIL),
              type:     _type(type),
              name:     data?.title || $getText($find(".title", game), $find(".append", game)),
              status:   $find("img", _status).title?.toLowerCase(),
              cheevos:  $find_(".icons img", game).map(x => x.alt?.match(CHEEVOS)?.[1]).find(s => s) || "0 / 0",
              priority: $find(".priority img", game)?.title||"Normal",
              physical: Array.from(game.parentNode.children).some(e => e.matches(".format[title='Physical']"))};
    };

    let getLogos = game => Array.from(game.parentNode.children).filter(e => e.matches('.logoBL'));
    let $tweak = (game, info, source) =>
      when(['icon', 'image', 'highlight', 'tooltip', 'append', 'platforms', 'link'].map(k => rf.dsub([`game-${k}`, info])),
           ([icon, image, highlight, tooltip, append, platforms, link]) => {
        let $$ = info => (() => rf.disp(['set-hovered', info]));
        Object.assign(game.style, {background: BACKGROUNDS[BORDER ? 'synced' : highlight], borderColor: COLORS[BORDER && highlight]||""});
        let _name = $find(".title", Object.assign(game, {title: tooltip}));
        $find_(".append, .os", _name).forEach(e => e.remove());
        append && $append(_name, $e('span', {className: 'append', innerText: append}));
        platforms.forEach(([title, cls]) => $append(_name, $e('i', {className: `${cls} os`, title})));
        game.parentNode.parentNode.style.position = 'relative';
        let _game = (!game.parentNode.parentNode.matches(".listed_game, .draggable_list") ? game : game.parentNode);
        let onerror, onload = onerror = when(getLogos(_game), oldLogos => (() => oldLogos.forEach(e => e.remove())));
        $append(_game.parentNode, $e('div', {className: `logoBL source-${source} ${!info.force ? "" : 'force'}`,
                                             onmouseleave: $$(), onmouseenter: $$(info)},
                                     $e('a', merge({target: '_blank'}, link), $e('img', {src: icon, onload, onerror}))));
        when($find(".add-game aside"), aside =>
             when($find('.imageBL', aside) || $e('img', {className: 'imageBL'}), e =>
                  (!image ? e.remove() : aside.prepend( Object.assign(e, {src: image}) ))));
      });

    let _tagStyle = s => rf.dsub(['tag-styles'])[ s.match(/^([^:]+): ?.*$/)?.[1] ] || {};
    let _tag = (s, {short}={}) => when((short && s.match(/^([^:]+: ?)(.*)$/))||[], m => (!m[1] ? [s] : [$e('span', {className: 'collapseBL'}, m[1]), m[2]]));
    let $addTags = (game, {id}, tags=rf.dsub(['lists*'])[id], userId=rf.dsub(['userId'])) => ((tags||[]).length > 0) &&
      when([$find('.tagsBL', game.parentNode)||$e('div', {className: 'tagsBL'}), location.href.match(RE.backloggeryLists)?.[2], rf.dsub(['tags-hideprefix'])],
        ([e, listId, short]) => $after(game, $append($clear(e), ...tags.map(([tag, desc, list, rank, note=""]) => (list != listId) &&
          $e('a', {target: '_blank', style: _tagStyle(tag), href: `/${userId}/lists/${list}`, title: (str(desc, `${desc}\n\n`) + note).trimEnd()},
             ..._tag(tag + str(rank, ` [#${rank}]`), {short}))))));

    let enhanceGameItem = (game, {detect=false}={}) => {
      $find(".platform > *", game).children.forEach(_renameWindows);
      let info, {id, type, name, status, priority, physical} = info = _info(game);
      let [libId, source] = [(detect ? 'id*' : 'id'), 'source'].map(k => type && rf.dsub([`library-${k}`, info]));
      detect && libId && rf.dispatchSync(['init-backlog', id, {type, libId}, rf.dsub(['backlog-entry', info])]);
      $addTags(game, info);
      if (game._id || libId || (source == 'custom'))
        $tweak(game, merge(info, game._id && {libId: game._id}, {force: rf.dsub(['backlog-entry', info]).force}), source);
      else {
        game.style.background = "";
        $find_(".title :is(.append, .os)", game).forEach(e => e.remove());
        getLogos(game).forEach(e => e.remove());
        $find(".add-game .imageBL")?.remove();
      }
    };
    let $enhanceGameItem = game => when([$enhanceGameItem.observer], ([x]) =>
      (x ? x.observe(game) : _queue(game, (game => enhanceGameItem(game, {detect: true})))));
    $enhanceGameItem.observer = (typeof IntersectionObserver == 'function') && new IntersectionObserver((xs, self) =>
      xs.forEach(x => when(x.intersectionRatio > 0, () => {enhanceGameItem(x.target, {detect: true});  self.unobserve(x.target)})));

    let enhanceGameEdit = (e, gameItem=e.parentNode.firstElementChild) => when($find(".data", e), form => {
      when($get(FORM_PLATFORM, form), platform => {
        $find_('option', platform).forEach(_renameWindows);
        $addEventListener(platform, 'change', () => enhanceGameEdit(e));
      });
      _renameWindows( $get("//label[normalize-space()='Sub-Platform']/following::select/option[normalize-space()='PC']") );
      let info, {id, type} = info = _info(gameItem);
      when(rf.dsub(['backlog', id]), bl =>
        !bl.custom && _types.some(k => bl[k] && (k != type)) && rf.dispatchSync(['init-backlog', id, {}, bl]));
      when(rf.dsub(['library-id', info]), libId => rf.dispatchSync(['remove-change', libId]));
      $addEventListener($get(".//button[normalize-space()='Delete']", e), 'click', () => {document.body._delId = id});
      enhanceGameItem(gameItem);
      if (type) {
        let editWidget = $find(".edit-widget", e);
        $before(form, editWidget || (editWidget = $e('div', {className: 'edit-widget'})));
        r.render([EditWidget, info, gameItem, e], editWidget);
      }
    });
    let ignoreButton = id => $e('i', {className: "ignoreBL far fa-eye", onclick () {rf.disp(['toggle-ignore', id])}});
    let enhanceForm = (form, id, {achievements, status}={}) => {
      $find_(":is(.achBL, .statusBL)", form).forEach(e => e.remove());
      when($find(".data .cheevos", form), (cheevos, [inputs, [label]]=['input', 'label'].map(s => $find_(s, cheevos))) => {
        label.append( $e('span', {className: 'achBL', innerText: achievements||""}) );
        let _check = () => achievements && (!id || when(rf.dsub(['backlog', id]), bl => !bl?.custom && !bl?.ignore));
        let _matching = () => achievements === inputs.map(e => e.value||0).join(' / ');
        inputs.forEach(e => {e.oninput = () => label.classList[_check() && !_matching() ? 'add' : 'remove']('warnBL')});
        inputs.forEach(e => {e.onblur = () => enhanceGameItem(form.parentNode.firstElementChild)});
        inputs[0].oninput();
      });
      status && when($find(".data .form-tip", form), e => $after(e, $e('div', {className: 'statusBL', innerText: status})));
      !id && _types.forEach(k => when($get(`${FORM_PLATFORM}//option[@value='${TYPES[k]}']`, form), e => {
        ($find('.countBL', e) || $append(e, $e('span', {className: 'countBL'})).lastChild).innerText =
          ` (${rf.dsub(['#data:unbound', k, {excluded: false}])})`;
      }));
      when(id && [$find('#status-changer', form)?.previousElementSibling, rf.dsub(['backlog', id])], ([label, bl]) => when(label, () =>
        (bl?.custom ? $find('.ignoreBL', label)?.remove() :
         when($find('.ignoreBL', label) || $append(label, ignoreButton(id)).lastChild, e => {
           e.classList.remove(bl?.ignore ? 'fa-eye' : 'fa-eye-slash');
           e.classList.add(!bl?.ignore ? 'fa-eye' : 'fa-eye-slash');
           e.title = (!bl?.ignore ? "Watch" : "Ignore");
         }))));
    };

    const FORM_STATUS = "#status-changer, #priority-changer, #format-changer";
    let enhanceGameAdd = e => when(e && $find(".game-info", e), (form, gameItem=$find('.game-item', e).firstElementChild) => {
      when($get(FORM_PLATFORM, form), platform => {
        $find_('option', platform).forEach(_renameWindows);
        $addEventListener(platform, 'change', () => {gameItem._id = NIL;  enhanceGameItem(gameItem);  enhanceGameAdd(e)});
      });
      _renameWindows( $get("//label[normalize-space()='Sub-Platform']/following::select/option[normalize-space()='PC']") );
      when($get(".//label[normalize-space()='Format']//following::select", e), input => {input.id = 'format-changer'});
      $find_(FORM_STATUS, form).forEach(input => $addEventListener(input, 'change', () => enhanceGameItem(gameItem)));
      e._saved = e._saved||[];
      when($find(".add-game aside section ul"), list =>
        list?.firstChild?.tagName || e._saved.forEach(({name, href}, i) => when(list?.children?.[i], item =>
          $clear(item).append( $e('a', {target: '_blank', innerText: name, href}) ))));
      let [info, editWidget] = [dissoc(_info(gameItem), 'id'), $find(".edit-widget", e)];
      editWidget || $after($get(FORM_TITLE, form), editWidget = $e('div', {className: 'edit-widget', style: "width:100%; top:-.5vh"}));
      r.render([EditWidget.Add, e, form, gameItem, info], editWidget);
    });

    let purgeLists = debounce(0, names => rf.disp(['purge-lists', new Set(names)]));
    let scrapeList = debounce(0, (title, items=$find_(`.viewing .listed_game`)) => when(location.href.match(RE.backloggeryLists)?.[2], id => {
      let [name, desc] = [$getText(title, $find('button', title)).trim(), $find('.list-desc')?.innerText||""];
      let games = items.map(e => when($find('.status', e).id.match(/^game(.*)$/)?.[1], id =>
        [id, [$find('.rank', e)?.innerText||"", $find(`:scope > .markdown`, e)?.innerText||""].join(':')]));
      rf.disp(['assoc-list', id, name, desc, dict(games)]);
    }));

    new Promise(resolve => {
      let _userId = (e=document) => $get(".//a[text()='Home']", e)?.href.match("/([^/]+)$")?.[1];
      (_userId() ? resolve(_userId()) : $watcher((e, watcher) => when(_userId(e), _uid => {
        resolve(_uid);
        watcher.disconnect();
      })).observe(nav, {childList: true}));  // eslint-disable-line no-undef
    }).then(USER_ID => {
      console.warn("[BL] activated!");
      rf.dispatchSync(['set-userId', USER_ID]);
      $addEventListener(document.body, 'click', (evt, x=evt.target, id=document.body._delId) =>
        when(id && x.matches('button') && (x.innerText == 'OK') && x.parentNode.previousSibling?.innerText?.startsWith("Really delete "),
             () => {rf.disp(['dissoc-backlog', id]);  document.body._delId = NIL}));
      let _redraw = e => {
        rf.dispatchSync(['check-url']);
        if (location.href.match(RE.backloggery)?.[1] == USER_ID) {
          _renameWindows( $get(".//*[@class='platform-card']/a[@class='title'][normalize-space()='PC']", e) );
          ['h2', 'label'].forEach(tag => _renameWindows( $get(`.//${tag}[normalize-space()='PC']`, e) ));
          _renameWindows( $get(".//*[@id='modal_filter']//label[starts-with(@for, 'ef_platform')][normalize-space()='PC']", e) );
          when(location.href.match(RE.backloggeryLists), ([_, userId, list]) =>
            (!list ? $find('.button-section') && purgeLists( $find_(`.viewing .list .title`).map(x => x.innerText.trim()) ) :
             when($find(`.viewing .title`, e), title => $get(`.//button[normalize-space()="Edit"]`, title) && scrapeList(title))));
          when(location.href.match(RE.backloggeryLists)?.[2] && $find(`.viewing .title`, e), title =>
            $get(`.//button[normalize-space()="Edit"]`, title) && scrapeList(title, $find_(`.viewing .listed_game`)));
          $find_(".game-item > :first-child", e).forEach($enhanceGameItem);
          if (e.matches(".game-info, .data, .cheevos") || ((e.tagName == 'OPTION') && (e.innerText == 'PC'))) {
            while (e && !e.matches(".game-info")) e = e.parentNode;
            enhanceGameEdit(e);
          };
        } else if (location.href.match(RE.backloggeryAdd)) {
          if (e.matches(".game-info, .data, .cheevos") || $find(FORM_STATUS, e) || ((e.tagName == 'OPTION') && (e.innerText == 'PC'))) {
            when($find(".add-game"), enhanceGameAdd);
          }
        } else if (location.href.match(RE.backloggeryTypes))
          when($get(".//*[@class='platform_item']/*[normalize-space()='PC']", e), caption => {caption.innerText = "Windows (PC)"});
      };
      _redraw(document.body);
      $watcher(_redraw).observe(app, {childList: true, subtree: true});  // eslint-disable-line no-undef
      rf.dsub(['overlay']) && $find_(".game-item > :first-child").forEach($enhanceGameItem);

      if (rf.dsub(['oldBacklog'])) {
        GM_registerMenuCommand("Export old custom matches & delete old backlog", () => {
          if (!confirm("Are you sure? This will delete your old backlog!")) return;
          $e('a', {
            href: "data:application/json;base64," + btoa(JSON.stringify(rf.dsub(['old-custom']), null, 2) + '\n'),
            download: `Backloggery-oldcustom_${new Date().toJSON().replace(/T.*/, '')}.json`,
          }).click();
          GM_deleteValue('backlog');
          location.reload();
        });
      } else {
        GM_registerMenuCommand("Import custom matches", () => {
          let _close = (ok=true) => {
            $find('#import-dialogBL').remove();
            ok && $e('input', {type: 'file', accept: 'application/json', onchange () {
              when(this.files?.[0], file => Object.assign(new FileReader(), {
                onload () {GM_setValue('backlog', JSON.parse(this.result));   location.reload()},
              }).readAsText(file));
            }}).click();  // this only works immediately after user input within page (i.e. clicking "Yes")
          };
          document.body.append($e('div', {id: 'import-dialogBL'},
                                 $e('h1', {innerText: "Import custom matches?"}),
                                 $e('button', {innerText: "Yes", autofocus: true, onclick: _close}),
                                 $e('button', {innerText: "No", onclick: () => _close(false)})));
        });
        GM_registerMenuCommand("Export custom matches", () => $e('a', {
          href: "data:application/json;base64," + btoa(JSON.stringify(rf.dsub(['custom']), null, 2) + '\n'),
          download: `Backloggery-custom_${new Date().toJSON().replace(/T.*/, '')}.json`,
        }).click());
        GM_registerMenuCommand("Reset all non-custom matches", () => when(rf.dsub(['custom']), o => {
          if (!confirm(`Are you SURE?\nThis will reset all matches other than the ${keys(o).length} custom ones!`)) return;
          GM_setValue('backlog', o);
          GM_deleteValue('backlog2');
          location.reload();
        }));
      }
      GM_registerMenuCommand("Refresh platforms list", () => {
        GM_deleteValue('platforms');
        _loadTypeNames().then(o => {console.debug('[bl] platforms', o);   rf.disp(['set-typeNames', o])});
      }, {title: "Update cache of names displayed in Synced Platforms list (Settings > Platforms)"});
      GM_registerMenuCommand(`Set highlight mode to '${!BORDER ? "border" : "background"}'`, () => {
        GM_setValue('settings', merge(GM_getValue('settings'), {borders: !BORDER}));
        location.reload();
      });
    });

  }); else if (USER_ID && (PAGE.match(RE.steamLibrary)?.[1] == USER_ID)) {

    console.warn("[BL] activated!");
    // eslint-disable-next-line no-undef
    const DATA = groupBy(JSON.parse(SSR.renderContext.queryData).queries, x => x.queryKey[0]);
    console.debug("[BL] data", DATA);
    const IMAGES = dict(DATA.StoreItem.map(x => [x.queryKey[1].replace(/^app_/, ""), x.state.data?.header]).filter(([k, v]) => v?.includes("/")));
    const ICONS = dict(DATA.StoreItem.map(x => [x.queryKey[1].replace(/^app_/, ""), x.state.data?.small_capsule]).filter(([k, v]) => v?.includes("/")));
    const STATS = GM_getValue('steam-stats', {});
    delay(1000).then(() => {
      $update('steam', dict( DATA.OwnedGames[0].state.data.map(o => [o.appid, {name: o.name,  icon: ICONS[o.appid]||NIL,  image: IMAGES[o.appid]||NIL,
                                                                               hours: parseFloat((o.playtime_forever/60)?.toFixed(1))||NIL}]) ));
      $markUpdate('steam-stats');
      $mergeData('steam-stats', dict(DATA.AchievementProgress.map(({state: {data: o}}) => {
        let old = (STATS[o.appid]||"0 / 0").replace(" (?)", "")            // Steam lists status for some games as 0/0 incorrectly
        return [o.appid, ((o.total == 0) && (old != "0 / 0") ? `${old} (?)` : `${o.unlocked} / ${o.total}`)];
      })));
    });

  } else if (USER_ID && (PAGE.match(RE.steamAchievements)?.[1] == USER_ID)) {  // personal

    console.warn("[BL] activated!");
    when($find('#topSummaryAchievements'), e => when($find('.gameLogo a').href.match(/\d+$/)[0], id =>
      $mergeData('steam-stats', {[id]: e.innerText.match(/(\d+) of (\d+)/).slice(1).join(" / ")})));

  } else if (USER_ID && PAGE.match(RE.steamAchievements2) && $find('#compareAvatar')) {  // global

    console.warn("[BL] activated!");
    when($find('#headerContentLeft'), e => when($find('.gameLogo a').href.match(/\d+$/)[0], id =>
      $mergeData('steam-stats', {[id]: e.innerText.match(/\d+ \/ \d+/)[0]})));

  } else if (USER_ID && PAGE.match(RE.steamDetails) && $find('.game_area_already_owned')) {

    console.warn("[BL] activated!");
    const ID = PAGE.match(RE.steamDetails)[1];
    let hasPlatform = k => $find(`.game_area_purchase_game .platform_img.${k}`);
    when(compact( ['win', 'linux', 'mac'].map(k => hasPlatform(k) && k[0]) ).join(""),
         worksOn => $mergeData('steam-platforms', {[ID]: worksOn}));
    when($find(`[itemprop=aggregateRating]`)?.getAttribute('data-tooltip-html')?.match(/^([0-9]+(.[0-9]+)?)%/)?.[1],
         rating => $mergeData('steam-rating', {[ID]: Math.round( Number(rating) )}));
    let myTags = $find_(".glance_tags_ctn .app_tag.user_defined").map(e => e.innerText.trim()).join(", ");
    (myTags || GM_getValue('steam-my-tags', {})[ID]) && $mergeData('steam-my-tags', {[ID]: myTags||NIL});

  } else if (PAGE.match(RE.steamBadges)) {  // highlighting progress

    console.warn("[BL] activated!");
    GM_addStyle(`.foil {box-shadow: white 0 0 2em}  .badge-exp, .card-name.excess {color:lime}
                 .level0 {color:violet}  .level1 {color:pink}  .card-name.level1 {color:red}  .level2 {color:orange}
                 .level3 {color:yellow}  .level4 {color:yellowgreen}  .card-name.level4 {color:olive}
                 .level5, .foil .level1 {color:limegreen}  .card-name.level5, .foil .card-name.level1 {color:green}`);
    $find_(".badge_row_inner").forEach(panel => {
      let foil = $find(".badge_title", panel)?.innerText.trim().endsWith(" Foil Badge");
      let exp = $find(".badge_info_title, .badge_empty_name", panel)?.nextElementSibling;
      let level = Number(exp.innerText.match("Level ([0-9]+)")?.[1] || 0);
      let levels = dict( (foil ? [0, 1] : [0, 1, 2, 3, 4, 5]).map((n, i) => [`(${n - level})`, `level${i}`]) );

      foil && panel.classList.add('foil');
      exp.classList.add('badge-exp', `level${level}`);
      $find_(".badge_card_set_title", panel).forEach(cardTitle => {
        let amount = $find(".badge_card_set_text_qty", cardTitle)?.innerText || "(0)";
        cardTitle.classList.add('card-name', levels[amount]||'excess');
        cardTitle.parentNode.title = cardTitle.innerText.split('\n').reverse().join('\n');  // "Name\n(X)"
      });
    });

  } else if (USER_ID && PAGE.match(RE.steamDbDetails) && $find('#js-app-install.owned')) {

    console.warn("[BL] activated!");
    const INFO = $find('.span8');
    const ID = $find_('td', INFO)[1].innerText;
    when(compact( ['windows', 'linux', 'macos'].map(s => $find(`.octicon-${s}`, INFO) && s[0]) ).join(''),
          worksOn => $mergeData('steam-platforms', {[ID]: worksOn}));
    when(($find(`[itemprop=aggregateRating]`)?.getAttribute('aria-label')?.match(/^([0-9]+(.[0-9]+)?)%/)?.[1] ||
          $find(`[itemprop=aggregateRating] [itemprop=ratingValue]`)?.getAttribute('content')),
         rating => $mergeData('steam-rating', {[ID]: Math.round( Number(rating) )}));

  } else if (USER_ID && (PAGE.match(RE.steamDbLibrary)?.[1] == USER_ID)) {

    console.warn("[BL] activated!");
    $watcher(e => when(e.firstElementChild?.matches(".hover_buttons"), () => {
      let id = new URL($find('a.hover_title', e).href).pathname.match("^/app/([0-9]+)")[1];
      when(compact( ['windows', 'linux', 'macos'].map(s => $find(`.octicon-${s}`, e) && s[0]) ).join(''),
           worksOn => $mergeData('steam-platforms', {[id]: worksOn}));
      when($find(`.hover_review_summary span:not(.muted)`, e)?.innerText.match(/([0-9]+(.[0-9]+)?)%$/)?.[1],
           rating => $mergeData('steam-rating', {[id]: Math.round( Number(rating) )}));
    })).observe(document, {childList: true, subtree: true});

  } else if (USER_ID && PAGE.match(RE.steamStats) && (PARAMS.SteamID64 == USER_ID)) {

    console.warn("[BL] activated!");
    let _achievements = ss => ss.map(s => s.match(/\d+/)?.[0]||s).join(" / ");
    const STATS = (PARAMS.DisplayType != '2' ? when($find('.tablesorter'), _table => {   // list
                     let _header = $find_('th', $find('thead tr', _table));
                     let _body = $find_('tr', $find('tbody', _table)).map(e => $find_('td', e));
                     let [_name$, _total$, _my$] = ["Name", "Total\nAch.", "Gained\nAch."].map(s => _header.findIndex(e => e.innerText == s));
                     return _body.map(l => [query($find("a[href^='Steam_Game_Info.php']", l[_name$]).href).AppID,
                                            _achievements([l[_my$], l[_total$]].map(e => e.innerText))]);
                   }) : when($get('/html/body/center/center/center/center'), _body => {  // table
                     let _table = Array.from(_body.children).find(x => (x.tagName == 'TABLE') && !x.matches('.Pager'));
                     let _ids = $find_('a', _table).map(e => query(e.href).AppID);
                     return $find_('table', _table).map((e, i) =>
                       [_ids[i], _achievements( last( $find_('p', e) ).innerText.match(/Achievements: (.*) of (.*)/).slice(1) )]);
                   }));
    if ((STATS.length > 0) && (STATS[0][0] == null)) throw "Invalid update";  // ensuring that next layout change won't break updater
    $markUpdate('steam-stats');
    $mergeData('steam-stats', dict(STATS));
    alert(`Game library interop: updated ${STATS.length} games`);

  } else if (PAGE.match(RE.gogLibrary)) {

    console.warn("[BL] activated!");
    let queryPage = (page=0) => $fetchJson(`/account/getFilteredProducts?mediaType=1&page=${page+1}`);
    let worksOn = o => o && {worksOn: compact( entries(o).map(([k, v]) => v && k[0].toLowerCase()) ).join('')};
    let scrape = () => $withLoading('progress', () =>
      queryPage().then(o => when(dict( o.tags.map(x => [x.id, x.name]) ), tags => {
        let completed = keys(tags).find(k => tags[k].toLowerCase() == 'completed');
        let convert = (o => [o.id, merge(pick(o, 'image', 'url'), worksOn(o.worksOn), {rating: o.rating||NIL,   name},
                                         {name: o.title,  tags: o.tags.map(id => tags[id]).join(", ")||NIL,
                                          completed: in_(completed, o.tags)||NIL,  category: o.category||NIL})]);
        return Promise.all([Promise.resolve(o), ...range(1, o.totalPages).map(queryPage)]).then(data =>
          $update('gog', dict( data.flatMap(x => x.products).map(convert) )));
      })));

    $append($find('.collection-header'),
            $e('i', {className: "fas fa-sync-alt _clickable account__filters-option", title: "Sync Backloggery", onclick: scrape}));

  } else if (PAGE.match(RE.gogDetails) && $find(".owned-status:not(.ng-hide)")) {

    console.warn("[BL] activated!");
    const RATING = Number(when($find("script[type='application/ld+json']"), e => JSON.parse(e.innerText))?.aggregateRating?.ratingValue)
    RATING && $mergeData('gog-rating', {[ PAGE.match(RE.gogDetails)[1] ]: RATING});

  } else if (PAGE.match(RE.humbleLibrary)) {

    console.warn("[BL] activated!");
    const PLATFORMS = {windows: 'w',  linux: 'l',  osx: 'm',  android: 'a'};
    let collect = e => ({name:      $find('h2', e).innerText,
                         publisher: $find('p',  e).innerText,
                         icon:      $find('.icon', e).style.backgroundImage.match(/^url\("(.*)"\)$/)?.[1],
                         url:       $find('.details-heading a')?.href,
                         worksOn:   when($find('.js-platform-select-holder'), e =>
                                      compact( entries(PLATFORMS).map(([k, c]) => $find(`.hb-${k}`, e) && c) ).join(''))});
    let scrape = () => $find_('.subproduct-selector').reduce((p, e, i, es) => p.then(xs => {
      syncBL.setAttribute('data-progress', `${i+1}/${es.length}`);
      e.click();
      return delay().then(() => (xs.push(collect(e)), xs));
    }), Promise.resolve([]));

    GM_addStyle(`#syncBL {cursor: pointer;  margin-right: 1em;  vertical-align: text-top}   #loaderBL {inset: auto -150px -250px auto}
                 .waitBL #syncBL:before {content: attr(data-progress) " \\f2f1";}`);
    $append(document.body, $e('span', {id: 'loaderBL'}, $e('i', {className: "fas fa-cog rotatingBL"})));
    let filters = $find(".js-library-holder .header .filter");
    filters.prepend($e('i', {id: 'syncBL', className: "fas fa-sync-alt", title: "Sync Backloggery", onclick: () =>
      $withLoading('wait', () => scrape().then(xs => $update('humble', dict( xs.map(x => x.worksOn && [slugify(x.name), x]) ))))}));
    $visibility(syncBL, false);  /* global syncBL */
    forever(() => when($find('#switch-platform'), e =>
      $visibility(syncBL, (e.value == 'all') && !search.value && (location.pathname == "/home/library"))));  // eslint-disable-line no-undef

  } else if (PAGE.match(RE.itchLibrary)) {

    console.warn("[BL] activated!");
    GM_addStyle(".my_collections_page .game_collection h2 {display: flex}   .fa-sync-alt {padding-left: 1ex;  cursor: pointer}");
    let _div = document.createElement('div');
    let _date = NIL;
    let queryPage = (page=0) => $fetchJson(`/my-purchases?format=json&page=${page+1}`).then(o => when(o.num_items > 0, () =>
      (Object.assign(_div, {innerHTML: o.content}),
       Array.from(_div.childNodes).map(e => when($find(".game_title a", e), title =>
         ({id:     e.getAttribute('data-game_id'),
           name:   title.innerText,
           url:    title.href.replace(/\/download\/[^/]+$/, ""),
           image:  $find("img", e)?.getAttribute('data-lazy_src')?.replace(ITCH_CDN, ""),
           author: $find(".game_author", e)?.innerText,
           date:   (_date = $find(".date_header > span", e)?.title||_date)}))))));
    let collect = (page=0) => queryPage(page).then(xs => (!xs ? [] : collect(page+1).then(ys => [...xs, ...ys])));
    let scrape = () => $withLoading('progress', () => collect().then(xs => $update('itch', dict( xs.map(({id, ...o}) => [id, o]) ))));
    $find_("a[href='/my-purchases']").forEach(e =>
      e.insertAdjacentElement('afterend', $e('i', {className: "fas fa-sync-alt", title: "Sync Backloggery", onclick: scrape})));

  } else if (PAGE.match(RE.itchDetails)) {

    const ID = when(GM_getValue('itch'), o => keys(o).find(k => o[k].url == PAGE));
    if (!ID) return;
    console.warn("[BL] activated!");
    const PLATFORMS = {windows: 'w', linux: 'l', osx: 'm', android: 'a', ios: 'm', web: 'b'};
    let _platforms = check => keys(PLATFORMS).filter(check).map(k => PLATFORMS[k]).join("");
    let _parseDate = e => new Date($find("abbr", e).title).getTime();
    let _info = dict( $find_(".game_info_panel_widget tr").map(e => [e.firstChild.innerText, e.lastChild]) );
    let {Author, Platforms, Rating, ...info} = mapVals(_info, (x, s) => when(slugify(s), k =>
      (k == 'platforms' ? _platforms(k => $find(`a[href$=platform-${k}]`, x)) :
       k == 'rating'    ? Number($find(".aggregate_rating", x).title)         :
       in_(k, ['published', 'updated', 'release-date']) ? _parseDate(x) : x.innerText)));
    $mergeData('itch-info', {[ID]: {at: Date.now(), worksOn: Platforms, rating: Rating, ...info}});

  } else if (PAGE.match(RE.ggateLibrary)) {

    console.warn("[BL] activated!");
    const GAMES = $find_(".my-games-catalog .catalog-item").map(e => when([$find('a', e), $find('img', e)], ([link, image]) =>
      [link.href.match("/account/orders/(.*)")[1].replace("/#", ":"),  {name: link.title, image: image?.src?.replace(GGATE_CDN, "")}]));
    $update('ggate', dict(GAMES));

  } else if (PAGE.match(RE.epicStore)) setTimeout(function _init () {

    const NAV = $find('egs-navigation')?.shadowRoot;
    if (!NAV || !$find("header .dropdown--account", NAV)) return setTimeout(_init, 500);
    if (!$find("header [aria-controls=nav-account-menu]", NAV)) return;
    console.warn("[BL] activated!");
    /*// NodeJS script for parsing Epic launcher cache file (for reference):
      let fs = require('fs');
      var encoded = fs.readFileSync("catcache.bin");  // if running from the folder containing the file
      var json = Buffer.from(encoded, 'base64').toString('utf-8');
      fs.writeFileSync("catcache.json", JSON.stringify(JSON.parse(json), null, 2));  // reformatting for readability
    */
    const CONFDIR = {windows: "C:/Users/%USER%/AppData", linux: "~/.config", mac: "~/Library/Application Support"};
    const TOOLTIP = join("Import catalog to Backloggery from launcher cache (Heroic or Epic):",
                         `* ${CONFDIR[USER_OS]}/heroic/store_cache/legendary_library.json`,
                         `* <EPIC_INSTALL_DIR>/EpicGamesLauncher/Data/Catalog/catcache.bin`,
                         "(Heroic launcher is preferred since its file stores game URLs and doesn't mangle Unicode)");
    $loadIcons(NAV);
    NAV.append($e('style', {innerHTML: "#importBL {display: flex;  align-items: center}   #importBL > * {cursor: pointer;  padding: 1em}"}));
    let convertHeroic = data => data.map(x =>
      ({id:        x.app_name,
        name:      x.title,
        slug:      x.store_url?.replace(EPIC_STORE, ""),
        icon:      (x.art_logo||x.art_cover||x.art_square)?.replace(EPIC_CDN+"/", "/"),
        image:     (x.art_square||x.art_cover||x.art_logo)?.replace(EPIC_CDN+"/", "/"),
        worksOn:   compact(['w', x.is_linux_native && 'l', x.is_mac_native && 'm']).join(""),
        developer: x.developer,
        online:    !x.canRunOffline||NIL,
        cloud:     x.cloud_save_enabled||NIL}));
    let _epicImg = x => dict( x.keyImages.map(y => [y.type.replace(/^DieselGameBox/, "") || 'Cover', y.url]) );
    let _epicGame = x => x.categories.some(y => y.path == 'games');
    const EPIC_PLATFORM = {Windows: 'w', Linux: 'l', Mac: 'm'};
    let convertEpic = data => data.filter(_epicGame).map(x => when([x.releaseInfo[0], _epicImg(x)], ([meta, img]) =>
      ({id:        meta.appId,
        name:      x.title,
        //slug:     not available,
        icon:      (img.Logo||img.Cover||img.Tall)?.replace(EPIC_CDN+"/", "/"),
        image:     (img.Tall||img.Cover||img.Logo)?.replace(EPIC_CDN+"/", "/"),
        worksOn:   vals( filterKeys(EPIC_PLATFORM, k => in_(k, meta.platform)) ).join(""),
        developer: x.developer,
        online:    (x.customAttributes.CanRunOffline?.value == 'false')||NIL,
        cloud:     ('CloudSaveFolder' in x.customAttributes)||NIL})));
    let parseFile = file => $withLoading('progress', readFile(file)
      .then(s => (s[0] == "{" ? convertHeroic(JSON.parse(s).library) : convertEpic(JSON.parse( atob(s) ))))
      .then(games => $update('epic', dict( games.map(({id, ...x}) => [id, x]) )))
      .catch(e => (console.error('[BL]', e),  alert("Invalid catalog cache file"))));
    let readFile = file => new Promise(resolve => when(new FileReader, reader => {
      reader.onload = () => resolve( reader.result.trim() );
      reader.readAsText(file);
    }));
    const IMPORT_FILE = $e('input', {type: 'file', accept: ".bin,.json", onchange () {this.files[0] && parseFile(this.files[0])}});
    const BTN = $e('div', {id: 'importBL'}, $e('i', {className: "fas fa-file-import", title: TOOLTIP, onclick () {IMPORT_FILE.click()}}));
    $find('.toolbar', NAV).prepend(BTN);

  }); else if (PAGE.match(RE.gplay)) {  // SPA & clearly generated; hard to make reliable

    GM_addStyle(`#syncBL  {cursor: pointer;  font-size: smaller;  padding-left: 1ex}
                 #imageBL {cursor: pointer;  font-size: large;  color: white;  display: inline-block;  margin-left: auto;  margin-right: 2em}
                 #imageBL.selected {cursor: no-drop;  color: gold}`);
    $append(document.body, $e('span', {id: 'loaderBL'}, $e('i', {className: "fas fa-cog rotatingBL"})));

    const KEYS = ['name', 'developer'];
    let list = () => $find_(`div[jsdata]`).find(e => e.checkVisibility());
    let _scrape = () => {
      let games = $find_("li a", list()).map(game =>
        [new URLSearchParams(new URL(game.href).search).get('id'),
         merge({icon: $find('img', game)?.src.replace(GPLAY_CDN, "")},
               ...$find_('div div[class]', game).map((e, i) => KEYS[i] && ({[KEYS[i]]: e.innerText})))]);
      $update('gplay', dict(games));
    };
    let scrollToBottom = () => {
      let {scrollHeight} = document.body;
      scrollTo(0, scrollHeight);
      $find(`button[data-disable-idom]`, list())?.click();  // "Show more"
      return delay(2000).then(() => (document.body.scrollHeight !== scrollHeight) && scrollToBottom());  // let's hope 2 seconds is enough…
    };
    let scrape = () => $withLoading('wait', () => scrollToBottom().then(() => scrollTo(0, 0)).then(_scrape));
    let redrawLibrarySync = () => delay(500).then(() => when($find_(`button[href='/library/games']`).find(e => e.checkVisibility()), gamesTab => {
      gamesTab.addEventListener('click', redrawLibrarySync);
      if (!location.href.match(RE.gplayLibrary))
        $find(`#syncBL`)?.remove();
      else {
        console.warn("[BL] activated!");
        let parent = gamesTab.parentNode;
        while (!parent.matches("[data-default-tab-id]"))
          parent = parent.parentNode;
        parent.previousElementSibling.append($find(`#syncBL`) ||
          $e('i', {id: 'syncBL', className: "fas fa-sync-alt", title: "Sync Backloggery", onclick: scrape}));
      }
    }));

    function redrawDetailsSync () {
      when(location.href.match(RE.gplayDetails)?.[1], id =>
        when(GM_getValue('gplay', {})[id] && [GM_getValue('gplay-img', {})[id]], ([uri]) => {
          if (redrawDetailsSync._id != id) {
            redrawDetailsSync._id = id;
            console.warn("[BL] activated!");
            when($find("[itemprop=contentRating]")?.parentNode?.parentNode?.parentNode, stats => {
              let rating = $find("[itemprop=starRating]", stats), reviews = rating?.parentNode.nextElementSibling;
              let downloads = reviews?.parentNode.nextElementSibling || stats.firstElementChild;
              let updated = $find("[data-g-id=description]")?.nextElementSibling,  tags = updated?.nextElementSibling;
              $mergeData('gplay-info', {[id]: {rating:    Number(rating?.firstChild?.firstChild?.data) || NIL,
                                               reviews:   reviews?.innerText?.split(" ")?.[0],
                                               downloads: downloads?.firstChild?.innerText || NIL,
                                               updated:   updated?.firstChild?.lastChild?.innerText || NIL,
                                               genre:     tags && $find_("[itemprop=genre]", tags).map(e => e.innerText).join(", ") || NIL}});
            });
          }
          let bigIcon = $find(`[data-p] > *:first-child > img[itemprop=image]:first-child`);
          !uri && bigIcon && $mergeData('gplay-img', {[id]: bigIcon.src.replace(GPLAY_CDN, "")});
          let image = $find(`c-wiz [role=region] img[itemprop=image]`), container = image.parentNode.previousElementSibling;
          if (!image?.src || !container)
            $find(`#imageBL`)?.remove();
          else {
            let selected = (image.src.replace(GPLAY_CDN, "") == uri);
            let imageBL = $find(`#imageBL`) || $e('i', {id: 'imageBL', className: "fas fa-save"});
            imageBL.classList[selected ? 'add' : 'remove']('selected');
            Object.assign(imageBL, {title: `${selected ? "Deselect" : "Select"} as Backloggery poster`,
                                    onclick: () => $mergeData('gplay-img', {[id]: (selected ? bigIcon : image)?.src.replace(GPLAY_CDN, "")})});
            (imageBL.parentNode === container) || container.append(imageBL);
          }
        }));
    }

    forever(function _loop () {
      redrawDetailsSync();
      if (_loop._href != location.href) {
        _loop._href = location.href;
        redrawLibrarySync();
      }
    });

  } else if (PAGE.match(RE.dekuLibrary) && $find("a[href='/logout']")) {

    console.warn("[BL] activated!");
    const OLD = GM_getValue('deku', {});
    const SELECTORS = ["a.main-link", ".img-frame img, .img-wrapper img", "form", "input[checked][name=rating]"];
    let _gameUrl = link => new URL(link).pathname.replace(/^\/items\//, '/');
    let platform = s => when(slugify(s), k => ({'xbox-x-s': 'xboxsx', 'xbox-one': 'xbo'})[k] || k);
    let convert = (o, [link, image, form, rating], id=new URL(form.action).pathname.replace(/^\/owned_items\//, ''),
                   img=(image.parentNode.matches(".img-frame, .img-wrapper") ? 'image' : 'icon')) =>
      [id, {...pick(OLD[id], 'image', 'icon'),
            name:     link.innerText,
            url:      _gameUrl(link.href),
            [img]:    new URL(image.src).pathname.replace(/^\/images\//, '/'),
            platform: platform(o.platform),   physical: (o.format == 'Physical')||NIL,
            status:   o.status,   notes: o.notes,   rating: Number(rating?.value)||NIL}];

    const GAMES = $find_(".browse-cards .summarized-details.owned").map(e => when(e.parentNode, cell => {
      while (cell && !cell.matches(".d-block.col")) cell = cell.parentNode;
      let [platform, format] = $find(".main", e)?.innerText.trim().split('\uFF5C')||[];
      let o = dict( $find_(".detail", e).map(x => when(x.innerText.trim(), text =>
        (text.includes('\n') || x.previousElementSibling.matches('.spacer')             ? ['notes', text]  :
         text == "Hidden publicly"                                                      ? ['hidden', true] :
         ["Want to play", "Currently playing", "Completed", "Abandoned"].includes(text) ? ['status', text] :
         when(text.match(/^Paid (.*[.0-9]+.*)$/)?.[1], paid => ['paid', paid]) || ['notes', text]))) );
      return cell && platform && convert({platform, format, ...o}, SELECTORS.map(s => $find(s, cell)));
    }));
    $mergeData('deku', dict(GAMES), {showAlert: true});
    GM_registerMenuCommand("Reset image data", () => when(confirm("Remove old image data?\nYou'll need to rescan your collection to fetch all images!"),
      () => {$mergeData('deku', mapVals(GM_getValue('deku'), x => dissoc(x, 'image', 'icon')));  location.reload()}));
    $find(`a[href$='/collection.json']`) && GM_registerMenuCommand("Prune removed games", () =>
      confirm("Remove data for no longer owned games?\n(Can't detect duplicate entries for existing games, sorry!)") &&
        $fetchJson("/collection.json").then(({items}) => when(new Set(items.map(x => _gameUrl(x.link))), owned =>
          $update('deku', filterVals(GM_getValue('deku'), x => owned.has(x.url))))));

  } else if (PAGE.match(RE.dekuDetails) && $find(".summarized-details.owned")) {

    console.warn("[BL] activated!");
    const PHYSICAL = $find_(".summarized-details.owned .main").some(e => e.innerText.endsWith("Physical"));
    const OPENCRITIC = $find(".opencritic")?.title.split(": ")[1];
    const $ = dict( $find_("ul.details > li").map(e => when(e.firstChild.innerText, label =>
      [pascal(label), e.innerText.replace(label, "").trim() + str(label == "OpenCritic:", ` (${OPENCRITIC})`)])) );
    const RELEASED = when($.ReleaseDate, s => chunks(s.split('\n'), 2).map(ss => compact(ss).join(": ")).join("; "));
    $mergeData('deku-info', {[location.pathname.replace(/^\/items\//, '')]: {
      [PHYSICAL ? 'icon' : 'image']: new URL($find("main img").src).pathname.replace(/^\/images\//, '/'),
      size: $.DownloadSize,  genre: $.Genre,  time: $.HowLongToBeat,  released: RELEASED,  openCritic: $.Opencritic,
      metacritic: $.Metacritic?.replace(/\btbd\b/g, "?").replace(/ /g, " | "),   dlc: $find("h4")?.innerText.startsWith("DLC ")||NIL,
    }})

  } else if (PAGE.match(RE.psnLibrary) && (PAGE.match(RE.psnLibrary)[1] != USER_ID) && !['search', 'completion', 'pf'].some(s => s in PARAMS)) {

    console.warn("[BL] can be activated");
    const PSN_ID = PAGE.match(RE.psnLibrary)[1];
    const PANEL = $get("../../../*", $find(".dropdown-toggle.completion"));
    $append(PANEL, $e('i', {
      className: "fas fa-save", style: "cursor: pointer;  color: white;  margin-left: 1ex", title: "[BL] This is my profile!",
      onclick: () => when(confirm(`[BL] Set '${PSN_ID}' as your profile?`), () => {
        GM_setValue('settings', merge(GM_getValue('settings'), {psnId: PSN_ID}));
        ['psn', 'psn-img'].forEach(GM_deleteValue);  // switching profile involves resetting your data
        location = location.href;
      })}));

  } else if (USER_ID && (PAGE.match(RE.psnLibrary)?.[1] == USER_ID) && !['search', 'completion', 'pf'].some(s => s in PARAMS)) {

    console.warn("[BL] activated!");
    const TROPHIES = ['gold', 'silver', 'bronze'];
    const PANEL = $get("../../../*", $find(".dropdown-toggle.completion"));
    const GAMES = $find('#gamesTable');

    $append(document.body, $e('span', {id: 'loaderBL'}, $e('i', {className: "fas fa-cog rotatingBL"})));
    let _loading = () => $find('#table-loading', GAMES);
    let load = () => new Promise(resolve => {
      if (!$find('#load-more', GAMES))
        resolve()
      else {
        loadMoreGames();  // eslint-disable-line no-undef
        let waiting = forever(() => when(!$find('#table-loading', GAMES), () => {
          clearInterval(waiting);
          resolve( load() );
        }));
      }
    });

    let _achievements = s => (replace(s, /All (\d+)/, "$1 of $1") || s).match(/(\d+) of (\d+)/).slice(1).join(" / ");
    let convert = e => when([$find("picture source", e).srcset.match("^.*, (.*) 1.1x$")[1]], ([icon]) =>
      [$find('a', e).href.match(RE.psnDetails)[1],
       {name: $find('.title', e).innerText,   icon: icon?.replace(PSN_CDN, ""),
        rank: $find('.game-rank', e).innerText,   progress: $find('.progress-bar', e).innerText,
        achievements: _achievements($find('.small-info', e).innerText),
        platforms: $find_('.platform', e).map(y => PSN_HW[y.innerText]).join(''),
        status: ['completion', 'platinum'].filter(s => $find(`.${s}.earned`, e)).join(", ")||NIL,
        trophies: $find('.trophy-count div', e).innerText.split('\n').map((s, i) => `${s} ${TROPHIES[i]}`).join(", ")}]);
    let scrape = () => $withLoading('progress', () => load().then(() => $update('psn', dict( $find_('tr', GAMES).map(convert) ))));

    $append(PANEL, $e('i', {className: "fas fa-sync-alt", style: "cursor: pointer;  color: white;  margin-left: 1ex",
                            id: 'syncBL', title: "Sync Backloggery", onclick: scrape}));
    forever(() => $visibility(syncBL, GAMES.style.display != 'none'));

    GM_registerMenuCommand("Remove cached posters", () => confirm("Reset posters cache?") && GM_deleteValue('psn-img'));

  } else if (USER_ID && (PAGE.match(RE.psnDetails)?.[2] == USER_ID)) {

    console.warn("[BL] activated!");
    const GAME_ID = PAGE.match(RE.psnDetails)[1];
    when($find('.game-image-holder a').href?.replace(PSN_CDN, ""), img => $mergeData('psn-img', {[GAME_ID]: img}));

    GM_registerMenuCommand("Remove cached posters", () => confirm("Reset posters cache?") && GM_deleteValue('psn-img'));

  } else if (USER_ID && (PAGE.match(RE.retroProgress)?.[1] == USER_ID)) {

    console.warn("[BL] activated!");
    const ACHIEVEMENTS = /^(?:All|([0-9]+) of) ([0-9]+) achievements$/;
    const DATES = mapVals(GM_getValue('retro', {}), x => x.sync);
    const GAMES = $find_(`.cprogress-pmeta__root`).map(game =>
      when([game.parentNode.parentNode, $find(`a[href*='/game/']`, game)], ([row, title], id=parseInt(title.href.match(RE.retroGame)?.[1])) =>
        [id, {name: title.innerText,
              icon: $find(`img[src^="${RETRO_CDN}"]`, row)?.src.replace(RETRO_CDN, ""),
              platform: $find(`img[src*='/assets/images/system/'] + p`, row)?.innerText,
              sync: Math.max(DATES[id]||0, new Date(game.lastElementChild.innerText.replace(/^Last played /, "")+" 12:00").getTime()||0) || NIL,
              status: $find('.cprogress-ind__root', row).getAttribute('data-award') || NIL,
              achievements: when(game.children[1]?.firstElementChild?.innerText?.match(ACHIEVEMENTS), m => [m[1]||m[2], m[2]].join(" / ")),
              ...keymap(['hardcore', 'softcore'], (k, i) =>
                when(parseInt($find(`[role=progressbar]`, row).children[i]?.style.width.replace(/%$/, "")), n => `${n}%`))}]));
    $mergeData('retro', dict(GAMES), {showAlert: true});

  } else if (PAGE.match(RE.retroGame)) {

    const ID = PAGE.match(RE.retroGame)[1];
    if (!(ID in GM_getValue('retro', {})) && $find(`aside [role=progressbar]`)?.parentNode.previousElementSibling) return;  // progress actions menu
    console.warn("[BL] activated!");
    const META = dict($find_(`img[alt="Game icon"] + * > *`).map(e => [e.firstElementChild.innerText.toLowerCase(), e.lastElementChild.innerText]));
    $mergeData('retro-info', {[ID]: {...META, image: $find(`aside img[src^="${RETRO_CDN}"]`)?.src.replace(RETRO_CDN, "")}});

  }
})();
