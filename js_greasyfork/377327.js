// ==UserScript==
// @name         Kitsu MALonnaised
// @description  Shows MyAnimeList.net data on kitsu.app
// @version      1.1.0
// @icon         data:image/png;base64,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
//
// @author       tophf
// @namespace    https://github.com/tophf
// @inspired-by  https://greasyfork.org/scripts/5890
//
// @match        https://kitsu.app/*
//
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        unsafeWindow
//
// @resource     LZString https://cdn.jsdelivr.net/gh/openstyles/lz-string-unsafe@22af192175b5e1707f49c57de7ce942d4d4ad480/lz-string-unsafe.min.js
// @run-at       document-start
//
// @connect      myanimelist.net
// @connect      self
// @downloadURL https://update.greasyfork.org/scripts/377327/Kitsu%20MALonnaised.user.js
// @updateURL https://update.greasyfork.org/scripts/377327/Kitsu%20MALonnaised.meta.js
// ==/UserScript==

/* global LZStringUnsafe */
'use strict';

const API_URL = 'https://kitsu.app/api/edge/';
const MAL_URL = 'https://myanimelist.net/';
const MAL_CDN_URL = 'https://cdn.myanimelist.net/';
let MAL_IMG_EXT = '.jpg';
// maximum number present in a MAL page initially
const MAL_RECS_LIMIT = 24;
const MAL_CAST_LIMIT = 10;
const MAL_STAFF_LIMIT = 4;
const MAL_CSS_CHAR_IMG = 'a[href*="/character/"] img[data-src]';
const MAL_CSS_VA_IMG = 'a[href*="/people/"] img[data-src]';
const KITSU_RECS_PER_ROW = 4;
const KITSU_RECS_HOVER_DELAY = 250;
const KITSU_RECS_HOVER_DURATION = 500;
const KITSU_GRAY_LINK_CLASS = 'import-title';
// IntersectionObserver margin
const LAZY_MARGIN = 200;
const LAZY_ATTR = 'malsrc';
const $LAZY_ATTR = '$' + LAZY_ATTR;

const DB_NAME = 'MALonnaise';
const DB_STORE_NAME = 'data';
const DB_FIELDS = 'path TID time score users favs chars recs'.split(' ');

const HOUR = 3600e3;
const DAY = 24 * HOUR;
const AIR_DATE_MAX_DIFF = 30 * DAY;
const CACHE_DURATION = DAY;
const GZIP = window.CompressionStream;

const ID = (name => Object.defineProperties({
  SCORE: `${name}-SCORE`,
  USERS: `${name}-USERS`,
  FAVS: `${name}-FAVS`,
  CHARS: `${name}-CHARS`,
  RECS: `${name}-RECS`,
}, {
  me: {
    value: name,
  },
  selectAll: {
    value: (suffix = '') =>
      Object.keys(ID)
        .map(id => `#${ID.me}-${id} ${suffix}`)
        .join(','),
  },
}))(GM_info.script.name.replace(/\W/g, ''));

const EXT_LINK = {
  tag: 'SVG:svg',
  viewBox: '0 0 22 22',
  children: [{
    tag: 'SVG:path',
    d: 'M13,0v2h5.6L6.3,14.3l1.4,1.4L20,3.4V9h2V0H13z M0,4v18h18V9l-2,2v9H2V6h9l2-2H0z',
  }],
};

const agent = (() => {
  const data = new Proxy({}, {
    get: (self, name) =>
      self[name] ||
      (self[name] = new Map()),
  });
  return {
    on(name, fn, thisArg) {
      data[name].set(fn, [thisArg]);
    },
    resolveOn(name, thisArg) {
      return new Promise(resolve =>
        data[name].set(resolve, [thisArg, true]));
    },
    fire(name, ...args) {
      const listeners = data[name];
      for (const [fn, [thisArg, once]] of listeners) {
        fn.apply(thisArg, args);
        if (once)
          listeners.delete(fn);
      }
    },
  };
})();


const API = (() => {
  const API_OPTIONS = {
    headers: {
      Accept: 'application/vnd.api+json',
    },
  };
  const handler = {
    get({path}, endpoint) {
      const fn = () => {};
      fn.path = path + (path ? '/' : '') + endpoint;
      return new Proxy(fn, handler);
    },
    async apply(target, thisArg, [options]) {
      for (const [k, v] of Object.entries(options)) {
        if (typeof v === 'object') {
          delete options[k];
          for (const [kk, vv] of Object.entries(v))
            options[`${k}[${kk}]`] = vv;
        }
      }
      const url = `${API_URL}${target.path}?${new URLSearchParams(options)}`;
      return (await fetch(url, API_OPTIONS)).json();
    },
  };
  return new Proxy({path: ''}, handler);
})();

/**
 * @property {Object} data
 * @property {String} renderedPath
 */
class App {

  static async init() {
    App.data = {};
    agent.on(InterceptXHR.register(), App.processMappings);
    agent.on(InterceptHistory.register(), App.onUrlChange);
    window.addEventListener('popstate', () => App.onUrlChange());

    await Cache.init();
    App.onUrlChange();
    App.initStyles();

    // detect WebP support
    $create({
      tag: 'img',
      src: 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
      onload() {
        MAL_IMG_EXT = '.webp';
      },
    });
  }

  static async onUrlChange(path = location.pathname) {
    const [, type, slug] = path.match(/\/(anime|manga)\/([^/?#]+)(?:[?#].*)?$|$/);
    App.hide();
    if (!slug)
      App.data = {path};
    if (App.data.path === path)
      return;
    let data = await Cache.read(type, slug) || {};
    App.data = data;
    if (!data.path) {
      App.findMalEquivalent(type, slug);
      return;
    }
    if (data.expired)
      App.plant(data);
    if (data.expired || !data.score)
      data = await App.processMal({type, slug, TID: data.TID});
    App.plant(data);
  }

  static async findMalEquivalent(type, slug) {
    const kitsuData = await API[type]({
      filter: {slug},
      include: 'mappings',
      fields: {
        mappings: 'externalSite,externalId',
        [type]: 'id,slug,status,subtype,startDate',
      },
    });
    if (await App.processMappings(kitsuData))
      return;
    const {categories: malData} = await Util.fetchJson(`${MAL_URL}search/prefix.json?${
      new URLSearchParams({type, keyword: encodeURIComponent(slug), v: 1})
    }`);
    try {
      const gist = Util.str2gist(slug);
      const ka = kitsuData.data[0].attributes;
      const kDate = +Date.parse(ka.startDate + ' GMT');
      const kSubType = ka.subtype.toLowerCase();
      for (const c of malData) {
        if (type !== c.type.toLowerCase())
          continue;
        for (const {url, name, payload: p} of c.items) {
          const mDate = Date.parse(p.aired.split(' to ')[0] + ' GMT');
          const dateDiff = kDate ? Math.abs(kDate - mDate) : Date.now() - mDate;
          if (dateDiff < AIR_DATE_MAX_DIFF && (
            dateDiff <= DAY && kSubType !== p.media_type.toLowerCase() ||
            Util.str2gist(name) === gist
          )) {
            const TID = MalTypeId.fromUrl(url);
            App.plant({
              TID,
              expired: true,
              score: [Number(p.score) || 0],
              path: type + '/' + slug,
            });
            App.plant(await App.processMal({type, slug, url, TID}));
            return;
          }
        }
      }
    } catch (e) {}
    console.warn('No match on MAL for %s/%s', type, slug, malData, kitsuData);
  }

  static async processMappings(payload) {
    const url = Mal.findUrl(payload);
    if (!url)
      return;
    const {type, attributes: {slug}} = payload.data[0];
    let data = await Cache.read(type, slug);
    if (!data || data.expired || !data.score)
      data = await App.processMal({type, slug, url});
    App.plant(data);
    return true;
  }

  static async processMal({type, slug, url, TID}) {
    App.shouldFadeOut = true;
    App.hide();
    const data = await Mal.scavenge(url || MalTypeId.toUrl(TID));
    data.TID = TID || MalTypeId.urlToTID(url);
    data.path = type + '/' + slug;
    if (App.data.recs)
      data.recs.push(...MalRecs.subtract(App.data.recs, data.recs));
    setTimeout(Cache.write, 0, type, slug, data);
    return data;
  }

  static async plant(data) {
    if (!data || data.path === App.renderedPath)
      return;
    App.data = data;
    const [type, slug] = data.path.split('/');
    Object.defineProperties(data, {
      type: {value: type, configurable: true},
      slug: {value: slug, configurable: true},
      url: {value: MalTypeId.toUrl(data.TID), configurable: true},
    });

    await Mutant.gotPath(data);

    Render.all(data);

    App.renderedPath = data.expired ? '' : data.path;
    App.shouldFadeOut = !data.score;
  }

  static async hide() {
    App.renderedPath = '';
    await Util.nextTick();
    if (!App.shouldFadeOut)
      return;
    for (const el of $$(ID.selectAll()))
      el.style.opacity = 0;
  }

  static initStyles() {
    Mutant.gotTheme().then(() => {
      if (!document.body)
        return;
      const bgColor = getComputedStyle(document.body).backgroundColor;
      document.head.append(
        $create({
          tag: 'style',
          textContent: `
            #${ID.RECS} {
              --${ID.me}-bg-color: ${bgColor};
            }`,
        }));
    });

    const MAIN_TRANSITION = 'opacity .25s';

    const RECS_MIN_HEIGHT = 220;
    const RECS_MAX_HEIGHT = 20e3;
    const RECS_IMG_MARGIN = '.5rem';
    const RECS_TRANSITION_TIMING = `${KITSU_RECS_HOVER_DURATION}ms ${KITSU_RECS_HOVER_DELAY}ms`;

    const EXT_LINK_SIZE_EM = .8;

    // language=CSS
    GM_addStyle(`
      a[mal] svg {
        fill: currentColor;
        margin-left: ${EXT_LINK_SIZE_EM / 2}em;
        width: ${EXT_LINK_SIZE_EM}em;
        height: ${EXT_LINK_SIZE_EM}em;
        display: inline-block;
        opacity: .5;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      a[mal="title"] svg {
        vertical-align: middle;
      }
      a[mal]:hover svg {
        opacity: 1;
      }
      .media--sidebar .is-sticky {
        position: static !important;
      }
      #SCORE:hover,
      ${ID.selectAll('a:hover')} {
        text-decoration: underline;
      }
      ${ID.selectAll()} {
        transition: ${MAIN_TRANSITION};
      }
      ${ID.selectAll('ins')} {
        display: block;
        width: 100%;
      }
      #SCORE:not(:first-child),
      #USERS,
      #FAVS {
        margin-left: 1em;
      }
      #USERS::before {
        content: '\\1F464';
        margin-right: .25em;
      }
      #FAVS::before {
        content: '\\2764';
        margin-right: .25em;
      }
      /*******************************************************/
      #CHARS h5 {
        display: inline-block;
      }
      #CHARS h5 a {
        font: inherit;
      }
      #CHARS summary {
        cursor: zoom-in;
      }
      #CHARS details[open] summary {
        cursor: zoom-out;
      }
      #CHARS summary:hover {
        color: #fff;
      }
      #CHARS[mal="anime"] div[mal] {
        width: 50%;
        display: inline-block;
      }
      #CHARS[mal="manga"] li {
        width: calc(50% - 4px);
        display: inline-block;
      }
      #CHARS[mal="manga"] ul[hovered] li:nth-child(odd) {
        margin-right: 8px;
      }
      #CHARS div[mal="people"] {
        opacity: .5;
        will-change: opacity;
        transition: opacity .25s .1s;
      }
      #CHARS div[mal="people"] img {
        opacity: .3;
        will-change: opacity;
        transition: opacity .25s .1s;
      }
      #CHARS div[mal="people"]:only-child {
        width: 100%;
        opacity: 1;
      }
      #CHARS div[mal="people"]:only-child img {
        opacity: .15;
      }
      #CHARS:hover div[mal="people"]:only-child img {
        opacity: .45;
      }
      #CHARS:hover div[mal="people"] img {
        opacity: .6;
      }
      #CHARS div[mal="people"]:only-child:hover img,
      #CHARS div[mal="people"]:hover,
      #CHARS div[mal="people"] img:hover {
        opacity: 1;
      }
      #CHARS div[mal]:first-child a {
        font-weight: bold;
      }
      #CHARS li a svg {
        vertical-align: middle;
        line-height: 1.0;
      }
      #CHARS span {
        display: inline-block;
        white-space: pre-line;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: calc(100% - 2 * ${EXT_LINK_SIZE_EM}em); /* room for the ext link icon */
        vertical-align: middle;
        line-height: 1.0;
      }
      #CHARS a div {
        overflow: hidden;
        width: 100%;
      }
      #CHARS div[mal="people"]:only-child {
        width: 100%;
      }
      #CHARS img {
        width: calc(100% + 2px);
        max-width: none;
        margin: -1px;
      }
      #CHARS img[${LAZY_ATTR}]:not([src]) {
        padding: 0 100% ${Util.num2pct(350 / 225)} 0;
      }
      #CHARS div[mal]:not(:only-child) a > :first-child:not(div) {
        margin-top: 60%;
      }
      #CHARS small {
        display: block;
        margin: 0 0 8px 0;
        line-height: 1.0;
      }
      /* replace the site's chars */
      #CHARS ul:not([hovered]) {
        display: flex;
        flex-wrap: wrap;
      }
      #CHARS ul[mal~="one-row"]:not([hovered]) li:nth-child(n + 5),
      #CHARS ul:not([hovered]) li:nth-child(n + 9) {
        display: none;
      }
      #CHARS ul:not([hovered]) li {
        width: calc(25% - 6px);
        margin: 0 3px 6px;
        position: relative;
      }
      #CHARS ul:not([hovered]) div[mal] {
        width: 100%;
      }
      #CHARS ul:not([hovered]) a div {
        border-radius: 3px;
        margin-bottom: .5em;
      }
      #CHARS[mal="anime"] ul:not([hovered]) div[mal="people"],
      #CHARS ul:not([hovered]) small,
      #CHARS ul:not([hovered]) li a[mal] svg{
        display:none;
      }
      #CHARS ul:not([hovered]) span {
        max-width: 100%;
        vertical-align: top;
      }
      /*******************************************************/
      #RECS {
        margin-bottom: 1em;
      }
      #RECS ul {
        display: flex;
        flex-wrap: wrap;
        margin: 0 -${RECS_IMG_MARGIN} 0 0;
        padding: 0;
        max-height: ${RECS_MIN_HEIGHT}px;
        overflow: hidden;
        position: relative;
        contain: layout;
        transition: max-height ${RECS_TRANSITION_TIMING};
      }
      #RECS ul:hover {
        max-height: ${RECS_MAX_HEIGHT}px;
      }
      #RECS ul:not(.hovered) {
        -webkit-mask-image: linear-gradient(#000, transparent);
      }
      #RECS li {
        list-style: none;
        position: relative;
        margin: 0 .5rem .5rem 0;
        width: calc(${Util.num2pct(1 / KITSU_RECS_PER_ROW)} - ${RECS_IMG_MARGIN});
        line-height: 1;
        display: flex;
        flex-direction: column;
      }
      #RECS li[mal="auto-rec"] {
        opacity: .25;
      }
      #RECS li[mal="auto-rec"]:hover {
        opacity: 1;
      }
      #RECS li[mal="more"] {
        width: 100%;
        text-align: center;
        padding: 0;
      }
      #RECS li[mal="more"] a {
        padding: 1em;
      }
      #RECS a[mal="title"] {
        margin: 0 0 ${Util.num2pct(315 / 225)};
        font-size: .8rem;
        font-weight: bolder;
      }
      #RECS div {
        overflow: hidden;
        position: absolute;
        top: 2rem;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: calc(100% + 2px);
        background-position: -1px -1px;
        background-repeat: no-repeat;
        transition: opacity .5s, filter .5s;
        cursor: pointer;
      }
      #RECS li[mal="auto-rec"] div {
        filter: grayscale(1);
      }
      #RECS li[mal="auto-rec"]:hover div {
        filter: none;
      }
      #RECS a[mal="title"] div::after {
        content: "MAL only";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        box-sizing: content-box;
        width: 2rem;
        height: 2rem;
        margin: auto;
        padding: .75rem .6rem .5rem;
        text-align: center;
        line-height: .9;
        font-weight: bold;
        font-size: 1rem;
        letter-spacing: -.05em;
        border: 3px solid #fff;
        border-radius: 4rem;
        background: #2E51A2;
        color: #fff;
        box-shadow: 2px 3px 10px 2px #000a;
        transition: opacity .5s .1s;
        opacity: 0;
      }
      #RECS a[mal="title"] div:hover::after {
        opacity: 1;
      }
      #RECS span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0;
        margin: 0;
        display: inline-block;
        vertical-align: sub;
        max-width: calc(100% - 1.5 * ${EXT_LINK_SIZE_EM}em);
      }
      #RECS small {
        font-size: .75rem;
        opacity: .75;
        margin-bottom: .25em;
      }
    `
    // language=none
    .replace(
      new RegExp(`#(?=${Object.keys(ID).join('|')})\\b`, 'g'),
      `#${ID.me}-`
    ));
  }
}


/**
 * @property {IDB} db
 */
class Cache { // eslint-disable-line no-redeclare

  static async init() {
    Cache.idb = new IDB(DB_NAME, DB_STORE_NAME);
    await Cache.idb.open({
      onupgradeneeded(e) {
        if (!e.oldVersion) {
          const store = e.target.result.createObjectStore(DB_STORE_NAME, {keyPath: 'path'});
          store.createIndex('TID', 'TID', {unique: true});
          store.createIndex('time', 'time', {unique: false});
        }
      },
    });
    if (GZIP) return;
    Cache.initLZ();
    Cache.zip = Cache.LZ;
    Cache.unzip = Cache.unLZ;
  }

  static initLZ() {
    const url = URL.createObjectURL(new Blob([
      GM_getResourceText('LZString'),
      `;(${() => {
        self.onmessage = ({data: {id, action, value}}) =>
          self.postMessage({
            id,
            value: LZStringUnsafe[action](value),
          });
      }})()`,
    ]));
    const q = [];
    const w = new Worker(url);
    const invokeWorker = (action, value) => new Promise(resolve => {
      const id = performance.now();
      const payload = {id, action, value};
      q.push({resolve, payload});
      if (q.length === 1)
        w.postMessage(payload);
    });
    w.onmessage = ({data: {id, value}}) => {
      const i = q.findIndex(_ => _.payload.id === id);
      q[i].resolve(value);
      q.splice(i, 1);
      if (q.length)
        w.postMessage(q[0].payload);
    };
    URL.revokeObjectURL(url);
    Cache.LZ = invokeWorker.bind(null, 'compressToUTF16');
    Cache.unLZ = invokeWorker.bind(null, 'decompressFromUTF16');
  }

  static async read(type, slug) {
    const path = type + '/' + slug;
    const data = await Cache.idb.get(path);
    if (!data)
      return;
    if (Date.now() - data.time > CACHE_DURATION)
      data.expired = true;
    if (data.lz) {
      for (const [k, v] of Object.entries(data.lz))
        data[k] = Util.parseJson(await Cache.unzip(v));
      data.lz = undefined;
    }
    return data;
  }

  static async write(type, slug, data) {
    data.path = type + '/' + slug;
    data.time = Date.now();
    const toWrite = {};
    let lz, lzKeys;
    for (const k of DB_FIELDS) {
      const v = data[k];
      if (v === undefined)
        continue;
      if (v && typeof v === 'object') {
        const str = JSON.stringify(v);
        if (str.length > 100) {
          (lzKeys || (lzKeys = [])).push(k);
          (lz || (lz = [])).push(Cache.zip(str));
          continue;
        }
      }
      toWrite[k] = v;
    }
    if (lz)
      toWrite.lz = (await Promise.all(lz)).reduce((res, v, i) => ((res[lzKeys[i]] = v), res), {});
    try {
      await Cache.idb.put(toWrite);
    } catch (e) {
      if (e instanceof DOMException &&
          e.code === DOMException.QUOTA_EXCEEDED_ERR) {
        await Cache.cleanup();
        await Cache.idb.put(toWrite);
      } else {
        console.error(e);
      }
    }
  }

  static cleanup() {
    return new Promise(resolve => {
      this.idb.exec({index: 'time', write: true, raw: true})
        .openCursor(IDBKeyRange.upperBound(Date.now - CACHE_DURATION))
        .onsuccess = e => {
          const cursor = /** @type IDBCursorWithValue */ e.target.result;
          if (!cursor) {
            resolve();
            return;
          }
          const {value} = cursor;
          if (value.lz) {
            delete value.lz;
            cursor.update(value);
          }
          cursor.continue();
        };
    });
  }

  static zip(str) {
    const zipped = new Response(str).body.pipeThrough(new GZIP('gzip'));
    return new Response(zipped).blob();
  }

  /** @param {Blob|string|undefined} v */
  static unzip(v) {
    if (!v)
      return;
    if (typeof v === 'string')
      return (!Cache.unLZ && Cache.initLZ(), Cache.unLZ(v));
    /* global DecompressionStream */
    return new Response(v.stream().pipeThrough(new DecompressionStream('gzip'))).text();
  }
}


/**
 * @property {IDBDatabase} db
 */
class IDB {

  constructor(name, storeName) {
    this.name = name;
    this.storeName = storeName;
  }

  open(events) {
    return new Promise(resolve => {
      Object.assign(indexedDB.open(this.name), events, {
        onsuccess: e => {
          this.db = e.target.result;
          resolve();
        },
      });
    });
  }

  get(key, index) {
    return this.exec({index}).get(key);
  }

  put(value) {
    return this.exec({write: true}).put(value);
  }

  /**
   * @param _
   * @param {Boolean} [_.write]
   * @param {String} [_.index]
   * @param {Boolean} [_.raw]
   * @return {Promise<IDBObjectStore|IDBIndex>|IDBObjectStore|IDBIndex}
   */
  exec({write, index, raw} = {}) {
    return new Proxy({}, {
      get: (_, method) =>
        (...args) => {
          let op = this.db
            .transaction(this.storeName, write ? 'readwrite' : 'readonly')
            .objectStore(this.storeName);
          if (index)
            op = op.index(index);
          op = op[method](...args);
          return raw ?
            op :
            new Promise((resolve, reject) => {
              op.onsuccess = e => resolve(e.target.result);
              op.onerror = reject;
            });
        },
    });
  }
}


class InterceptHistory {
  static register() {
    const event = Symbol(this.name);
    const pushState = unsafeWindow.History.prototype.pushState;
    unsafeWindow.History.prototype.pushState = function (state, title, url) {
      pushState.apply(this, arguments);
      agent.fire(event, url);
    };
    return event;
  }
}


class InterceptXHR {
  static register() {
    const event = Symbol(this.name);
    const XHR = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = class extends XHR {
      open(method, url, ...args) {
        if (url.startsWith(API_URL)) {
          const newUrl = InterceptXHR.onOpen.call(this, url);
          if (newUrl === false)
            return;
          if (newUrl) {
            url = newUrl;
            this.addEventListener('load', onLoad, {once: true});
          }
        }
        return super.open(method, url, ...args);
      }
    };
    return event;

    function onLoad(e) {
      agent.fire(event, JSON.parse(e.target.responseText));
    }
  }

  static onOpen(url) {
    // https://kitsu.app/api/edge/anime?........&include=categories.......
    if (
      !App.data.TID &&
      url.includes('&include=') && (
        url.includes('/anime?') ||
        url.includes('/manga?'))
    ) {
      const u = new URL(url);
      u.searchParams.set('include', u.searchParams.get('include') + ',mappings');
      u.searchParams.set('fields[mappings]', 'externalSite,externalId');
      return u.href;
    }
    // https://kitsu.app/api/edge/castings?.....&page%5Blimit%5D=4&......
    if (App.data.chars &&
        url.includes('/castings?') &&
        url.includes('page%5Blimit%5D=4')) {
      this.send = InterceptXHR.sendDummy;
      this.setRequestHeader = InterceptXHR.dummy;
      return false;
    }
  }

  static sendDummy() {
    Object.defineProperty(this, 'responseText', {value: '{"data": []}'});
    this.onload({type: 'load', target: this});
  }

  static dummy() {
    // NOP
  }
}


class Mal {

  static findUrl(data) {
    for (const {type, attributes: a} of data.included || []) {
      if (type === 'mappings' &&
          a.externalSite.startsWith('myanimelist')) {
        const malType = a.externalSite.split('/')[1];
        const malId = a.externalId;
        return MAL_URL + malType + '/' + malId;
      }
    }
  }

  static extract(img, stripId) {
    if (!img)
      return;
    const text = Util.decodeHtml(img.alt) || 0;
    // https://myanimelist.net/character/101457/Chika_Kudou
    // https://myanimelist.net/recommendations/anime/31859-35790
    // https://myanimelist.net/anime/19815/No_Game_No_Life?suggestion
    const a = img.closest('a');
    let aId = a && a.href.match(/\/(\d+(?:-\d+)?)|$/)[1] || 0;
    if (stripId && aId && aId.includes('-'))
      aId = aId.replace(stripId, '');
    // https://cdn.myanimelist.net/r/23x32/images/characters/7/331067.webp?s=xxxxxxxxxx
    // https://cdn.myanimelist.net/r/23x32/images/voiceactors/1/47102.jpg?s=xxxxxxxxx
    // https://cdn.myanimelist.net/r/90x140/images/anime/13/77976.webp?s=xxxxxxx
    const {src} = img.dataset;
    const imgId = src && src.match(/\/(\d+\/\d+)\.|$/)[1] || 0;
    return [text, aId >> 0, imgId];
  }

  static extractChars(doc) {
    const processed = new Set();
    const chars = [];
    for (const img of $$(`${MAL_CSS_CHAR_IMG}, ${MAL_CSS_VA_IMG}`, doc)) {
      const parent = img.closest('table');
      if (processed.has(parent))
        continue;
      // we're assuming a character is a table that contains an actor's table
      // and the character's img comes first so we can add the nested actor's table
      // thus skipping it on subsequent matches for 'a[href*="/people/"] img'
      processed.add($('table', parent));
      const char = $(MAL_CSS_CHAR_IMG, parent);
      let actor;
      if (char) {
        for (const el of $$(MAL_CSS_VA_IMG, parent)) {
          const lang = $text('small', el.closest('tr'));
          if (!lang || lang === 'Japanese') {
            actor = el;
            break;
          }
        }
      } else {
        actor = img;
      }
      chars.push([
        $text('small', parent),
        char ? Mal.extract(char) : [],
        ...(actor ? [Mal.extract(actor)] : []),
      ]);
    }
    return chars.length && chars;
  }

  static async scavenge(url) {
    const doc = await Util.fetchDoc(url);
    let el, score, users, favs;

    el = $('[itemprop="ratingValue"],' +
           '[data-id="info1"] > span:not(.dark_text)', doc);
    if (!el)
      return {};
    score = $text(el).trim();
    score = score && Number(score.match(/[\d.]+|$/)[0]) || score;
    const ratingCount = Util.str2num($text('[itemprop="ratingCount"]', doc));

    while (el.parentElement && !el.parentElement.textContent.includes('Members:'))
      el = el.parentElement;
    while ((!users || !favs) && (el = el.nextElementSibling)) {
      const txt = el.textContent;
      users = users || Util.str2num(txt.match(/Members:\s*([\d,]+)|$/)[1]);
      favs = favs || Util.str2num(txt.match(/Favorites:\s*([\d,]+)|$/)[1]);
    }

    const rxStripOwnId = new RegExp('-?\\b' + url.match(/\d+/)[0] + '\\b-?');
    const recs = $$('#anime_recommendation .link,' +
                    '#manga_recommendation .link', doc)
      .map(a => [
        ...Mal.extract($('img', a), rxStripOwnId),
        parseInt($text('.users', a)) || 0,
      ]);

    return {
      users,
      favs,
      score: score ? [score, ratingCount || 0] : undefined,
      chars: Mal.extractChars(doc) || undefined,
      recs: recs.length ? recs : undefined,
    };
  }

  static async scavengeRecs(url) {
    const doc = await Util.fetchDoc(url);
    const data = App.data;
    const oldRecs = data.recs || [];
    const rxType = new RegExp(`^${url.split('/')[3]}: `, 'i');
    data.recs = $$('a[href*="/recommendations/"]', doc)
      .map(a => {
        const entry = a.closest('table');
        const more = $text('a:not([href^="/"]):not([href^="http"])', entry);
        const count = parseInt(more.match(/\s\d+\s|$/)[0]) + 1 || 1;
        const info = Mal.extract($('a img', entry));
        info[0] = info[0].replace(rxType, '');
        info.push(count);
        return info;
      });
    data.recs.sort(MalRecs.sortFn);
    setTimeout(Cache.write, 0, data.type, data.slug, data);
    return MalRecs.subtract(data.recs, oldRecs);
  }
}


const REC_IDX_NAME = 0;
const REC_IDX_ID = 1;
const REC_IDX_COUNT = 3;


class MalRecs {

  static hasId(recs, id) {
    return recs.some(r => r[REC_IDX_ID] === id);
  }

  static subtract(recsA, recsB) {
    return recsA.filter(([, id]) => !MalRecs.hasId(recsB, id));
  }

  static sortFn(a, b) {
    return b[REC_IDX_COUNT] - a[REC_IDX_COUNT] ||
           a[REC_IDX_NAME] < b[REC_IDX_NAME] && -1 ||
           a[REC_IDX_NAME] > b[REC_IDX_NAME] && 1 ||
           0;
  }
}


class MalTypeId {

  static fromUrl(url) {
    return url.match(/((?:anime|manga)\/\d+)|$/)[1] || '';
  }

  static toUrl(typeId) {
    if (!typeId.includes('/'))
      typeId = MalTypeId.fromTID(typeId).join('/');
    return MAL_URL + typeId;
  }

  static fromTID(short) {
    const t = short.slice(0, 1);
    const fullType = t === 'a' && 'anime' ||
                     t === 'm' && 'manga' ||
                     '';
    return [fullType, short.slice(1)];
  }

  static toTID(typeId) {
    return typeId.slice(0, 1) + typeId.split('/')[1];
  }

  static urlToTID(url) {
    return MalTypeId.toTID(MalTypeId.fromUrl(url));
  }
}


class Mutant {

  static async gotPath({path} = {}) {
    const skipCurrent = !path;
    const selector = 'meta[property="og:url"]' +
                     (skipCurrent ? '' : `[content="${location.origin}/${path}"]`);
    if (Mutant.isWaiting(selector, skipCurrent))
      return agent.resolveOn('gotPath');
    const el = await Mutant.waitFor(selector, document.head, {skipCurrent});
    agent.fire('gotPath', path);
    return el;
  }

  static async gotTheme() {
    const head = await Mutant.waitFor('head', document.documentElement);
    const el = await Mutant.waitFor('link[data-theme]', head);
    try {
      el.sheet.cssRules.item(0);
    } catch (e) {
      await new Promise(done => el.addEventListener('load', done, {once: true}));
    }
  }

  static gotMoved(node, timeout = 10e3) {
    return new Promise(resolve => {
      const parent = node.parentNode;
      let timer;
      const ob = new MutationObserver(() => {
        if (node.parentNode !== parent) {
          ob.disconnect();
          clearTimeout(timer);
          resolve(true);
        }
      });
      ob.observe(parent, {childList: true});
      timer = setTimeout(() => {
        ob.disconnect();
        resolve(false);
      }, timeout);
    });
  }

  static async waitFor(selector, base, {skipCurrent} = {}) {
    return !skipCurrent && $(selector, base) ||
      new Promise(resolve => {
        if (!Mutant._waiting)
          Mutant._waiting = new Set();
        Mutant._waiting.add(selector);
        new MutationObserver((mutations, ob) => {
          for (const {addedNodes} of mutations) {
            for (const n of addedNodes) {
              if (n.matches && n.matches(selector)) {
                Mutant._waiting.delete(selector);
                ob.disconnect();
                resolve(n);
              }
            }
          }
        }).observe(base, {childList: true});
      });
  }

  static isWaiting(selector, asPrefix) {
    if (!Mutant._waiting) {
      Mutant._waiting = new Set();
      return false;
    } else if (asPrefix) {
      for (const s of Mutant._waiting) {
        if (s.startsWith(selector))
          return true;
      }
    } else {
      return Mutant._waiting.has(selector);
    }
  }
}


class Render {

  static all(data) {
    if (!Render.scrollObserver)
      Render.scrollObserver = new IntersectionObserver(Render._lazyLoad, {
        rootMargin: LAZY_MARGIN + 'px',
      });
    Render.stats(data);
    Render.characters(data);
    Render.recommendations(data);
    Render.observe();
  }

  static observe(container) {
    for (const el of $$(`[${LAZY_ATTR}]`, container))
      Render.scrollObserver.observe(el);
  }

  static stats({score: [r, count] = ['N/A'], users, favs, url} = {}) {
    const quarter = r > 0 && Math.max(1, Math.min(4, 1 + (r - .001) / 2.5 >> 0));
    $create(Util.externalLink({
      $mal: '',
      id: ID.SCORE,
      parent: $('.media-rating'),
      href: url,
      title: count && `Scored by ${Util.num2str(count)} users` || '',
      textContent: (r > 0 ? Util.num2pct(r / 10) : r) + ' on MAL',
      className: 'media-community-rating' + (quarter ? ' percent-quarter-' + quarter : ''),
      $style: null,
    }));
    $create({
      tag: 'span',
      id: ID.USERS,
      after: $id(ID.SCORE),
      textContent: Util.num2str(users),
      $style: users ? null : 'opacity:0; display:none',
    });
    $create({
      tag: 'span',
      id: ID.FAVS,
      after: $id(ID.USERS),
      textContent: Util.num2str(favs),
      $style: favs ? null : 'opacity:0; display:none',
    });
  }

  static characters({chars = [], url, type, slug, path}) {
    $remove('.media--main-characters');
    if (App.renderedPath !== path) {
      // hide the previous pics of chars and voice actors
      // to prevent them from flashing briefly during fade-in/hover
      const el = $id(ID.CHARS);
      if (el) {
        const hidden = el.style.opacity === '0';
        for (const img of el.getElementsByTagName('img')) {
          if (hidden || img.src.includes('voiceactors'))
            img.removeAttribute('src');
        }
      }
    }
    const numChars = chars.length;
    let numCastPics = 0;
    let numCast = 0;
    for (const [/*type*/, [char, /*charId*/, charImg]] of chars) {
      numCast += char ? 1 : 0;
      numCastPics += charImg ? 1 : 0;
    }
    const moreCharsPossible = numCast === MAL_CAST_LIMIT ||
                              numChars - numCast === MAL_STAFF_LIMIT;
    // prefer chars with pics, except for main chars who stay in place
    chars = chars
      .map((c, i) => [c, i])
      .sort((
        [[typeA, [, , imgA]], i],
        [[typeB, [, , imgB]], j]
      ) =>
        (typeB === 'Main') - (typeA === 'Main') ||
        !!imgB - !!imgA ||
        i - j)
      .map(([c]) => c);

    $create({
      tag: 'section',
      $mal: type,
      id: ID.CHARS,
      after: $('.media--information'),
      className: 'media--related',
      $style: numChars ? null : 'opacity:0; display:none',
      children: numChars && [{
        tag: 'h5',
        children: [
          'Characters ',
          Util.externalLink({
            href: `${url}/${slug}/characters`,
            textContent: 'on MAL',
            $mal: 'chars-all',
          }),
        ],
      }, {
        tag: 'ul',
        $mal: numCastPics <= 6 ? 'one-row' : '',
        onmouseover: Render._charsHovered,
        onmouseout: Render._charsHovered,
        children: chars.map(Render.char),
      }, moreCharsPossible && {
        tag: 'a',
        href: `/${App.data.path}/characters`,
        className: 'more-link',
        textContent: 'View all characters',
      }],
    });
  }

  static char([type, [char, charId, charImg], [va, vaId, vaImg] = []]) {
    return {
      tag: 'li',
      children: [
        char && {
          tag: 'div',
          $mal: 'char',
          children: [
            Util.externalLink({
              $mal: 'char',
              href: `${MAL_URL}character/${charId}`,
              children: [
                charImg && {
                  tag: 'div',
                  children: [{
                    tag: 'img',
                    [$LAZY_ATTR]: `${MAL_CDN_URL}images/characters/${charImg}${MAL_IMG_EXT}`,
                  }],
                }, {
                  tag: 'span',
                  children: Render.malName(char),
                },
              ],
            }),
            type !== 'Supporting' && {
              tag: 'small',
              textContent: type,
            },
          ],
        },

        va && {
          tag: 'div',
          $mal: 'people',
          children: [
            Util.externalLink({
              $mal: 'people',
              href: `${MAL_URL}people/${vaId}`,
              children: [
                vaImg && {
                  tag: 'div',
                  children: [{
                    tag: 'img',
                    [$LAZY_ATTR]: `${MAL_CDN_URL}images/voiceactors/${vaImg}.jpg`,
                  }],
                }, {
                  tag: 'span',
                  children: Render.malName(va),
                },
              ],
            }),
            !char && {
              tag: 'small',
              textContent: type,
            },
          ],
        },
      ],
    };
  }

  static recommendations({recs, url, slug}) {
    $create({
      tag: 'section',
      id: ID.RECS,
      before: $('.media--reactions'),
      $style: recs ? null : 'opacity:0; display:none',
      children: recs && [{
        tag: 'h5',
        children: [
          'Recommendations ',
          Util.externalLink({
            $mal: 'recs-all',
            href: `${url}/${slug}/userrecs`,
            className: KITSU_GRAY_LINK_CLASS,
            textContent: 'on MAL',
          }),
        ],
      }, {
        tag: 'ul',
        onmouseover: Render.recommendationsHidden,
        onmouseenter: Render.onRecsHovered,
        onmouseleave: Render.onRecsHovered,
        children: recs.slice(0, KITSU_RECS_PER_ROW).map(Render.rec, arguments[0]),
      }],
    });
  }

  static recommendationsHidden() {
    this.onmouseover = null;
    const added = $create({tag: 'div'},
      App.data.recs
        .slice(KITSU_RECS_PER_ROW)
        .map(Render.rec, App.data));
    Render.observe(added);
    if (App.data.recs.length === MAL_RECS_LIMIT) {
      $create({
        tag: 'li',
        $mal: 'more',
        parent: added,
        className: 'media-summary',
        children: {
          tag: 'a',
          href: '#',
          onclick: Render.recommendationsMore,
          className: 'more-link',
          textContent: 'Load more recommendations',
        },
      });
    }
    $(`#${ID.RECS} ul`).append(...added.children);
  }

  static onRecsHovered(e) {
    clearTimeout(Render.recsHoveredTimer);
    const on = e.type === 'mouseenter';
    const delay = KITSU_RECS_HOVER_DELAY + (on ? 0 : KITSU_RECS_HOVER_DURATION * .9);
    Render.recsHoveredTimer = setTimeout(() => this.classList.toggle('hovered', on), delay);
  }

  static async recommendationsMore(e) {
    e.preventDefault();
    Object.assign(this, {
      onclick: null,
      textContent: 'Loading...',
      style: 'pointer-events:none; cursor: wait',
    });
    const block = $id(ID.RECS);
    block.style.cursor = 'progress';
    const newRecs = await Mal.scavengeRecs($('a', block).href);
    const added = $create({tag: 'div'}, newRecs.map(Render.rec, App.data));
    Render.observe(added);
    $('ul', block).append(...added.children);
    block.style.cursor = '';
    setTimeout(() =>
      this.parentNode.remove());
  }

  static rec([name, id, img, count]) {
    const {type, TID} = this;
    return {
      tag: 'li',
      $mal: count ? '' : 'auto-rec',
      onclick: Render._kitsuLinkPreclicked,
      onauxclick: Render._kitsuLinkPreclicked,
      onmousedown: Render._kitsuLinkPreclicked,
      onmouseup: Render._kitsuLinkPreclicked,
      onmouseover: Render.kitsuLink,
      children: [{
        tag: 'small',
        children: [
          !count ?
            'auto-rec' :
            Util.externalLink({
              $mal: 'rec',
              href: `${MAL_URL}recommendations/${type}/${id}-${TID.slice(1)}`,
              className: KITSU_GRAY_LINK_CLASS,
              textContent: `${count} rec${count > 1 ? 's' : ''}`,
            }),
        ],
      }, Util.externalLink({
        $mal: 'title',
        title: name,
        href: `${MAL_URL}${type}/${id}`,
        className: KITSU_GRAY_LINK_CLASS,
        children: [{
          tag: 'span',
          textContent: name,
        }],
      }), {
        tag: 'div',
        [$LAZY_ATTR]: `${MAL_CDN_URL}images/${type}/${img}${MAL_IMG_EXT}`,
      }],
    };
  }

  static async kitsuLink() {
    this.onmouseover = null;

    const image = $('div', this);
    const malLink = $('a[mal="title"]', this);
    const typeId = MalTypeId.fromUrl(malLink.href);
    const TID = MalTypeId.toTID(typeId);
    const [type, id] = typeId.split('/');

    const {path = ''} = await Cache.idb.get(TID, 'TID') || {};
    let slug = path.split('/')[1];

    if (!slug) {
      const mappings = await API.mappings({
        filter: {
          externalId: id,
          externalSite: 'myanimelist/' + type,
        },
      });
      const entry = mappings.data[0];
      if (entry) {
        const mappingId = entry.id;
        const mapping = await API.mappings[mappingId].item({
          fields: {
            [type]: 'slug',
          },
        });
        slug = mapping.data.attributes.slug;
        Cache.write(type, slug, {TID});
      }
    }

    if (slug) {
      $create({
        tag: 'a',
        href: `/${type}/${slug}`,
        className: KITSU_GRAY_LINK_CLASS,
        children: image,
        parent: this,
      });
    } else {
      malLink.appendChild(image);
    }

    if (!this.onmousedown && this.onmouseup) {
      await new Promise(resolve => addEventListener('mouseup', resolve, {once: true}));
      await Util.nextTick();
    }
    this.onclick = null;
    this.onauxclick = null;
    this.onmousedown = null;
    this.onmouseup = null;
  }

  static malName(str) {
    const i = str.indexOf(', ');
    // <wbr> wraps even with "white-space:nowrap" so it's better than unicode zero-width space
    if (i < 0) {
      const words = str.split(/\s+/);
      return words.length <= 2
        ? words.join(' ')
        : words[0] + ' ' + words.slice(1).join('\xA0');
    } else {
      return [
        str.slice(i + 2).replace(/\s+/, '\xA0') + ' ',
        {tag: 'wbr'},
        str.slice(0, i).replace(/\s+/, '\xA0'),
      ];
    }
  }

  static _charsHovered() {
    const hovering = this.matches(':hover');
    if (hovering !== this.hasAttribute('hovered')) {
      clearTimeout(this[ID.me]);
      this[ID.me] = setTimeout(Render._charsHoveredTimer, hovering ? 250 : 1000, this);
    }
  }

  static _charsHoveredTimer(el) {
    $attributize(el, 'hovered', el.matches(':hover') ? '' : null);
  }

  static async _kitsuLinkPreclicked(e) {
    if (!e.target.style.backgroundImage)
      return;
    if (e.type === 'mousedown') {
      this.onmousedown = null;
      return;
    }
    if (e.type === 'mouseup') {
      this.onmouseup = null;
      await Util.nextTick();
      if (!this.onclick)
        return;
    }
    this.onclick = null;
    this.onauxclick = null;
    if (e.altKey || e.metaKey || e.button > 1)
      return;

    let link = e.target.closest('a');
    if (!link) {
      const winner = await Promise.race([
        Mutant.gotMoved(e.target),
        Mutant.gotPath(),
      ]);
      if (winner !== true)
        return;
    }

    const {button: btn, ctrlKey: c, shiftKey: s} = e;
    link = e.target.closest('a');
    if (!btn && !c) {
      link.dispatchEvent(new MouseEvent('click', e));
      if (!s)
        App.onUrlChange(link.pathname);
    } else {
      GM_openInTab(link.href, {
        active: btn === 0 && c && s,
        insert: true,
        setParent: true,
      });
    }
  }

  static _lazyLoad(entries) {
    for (const e of entries) {
      if (e.isIntersecting) {
        const el = e.target;
        let url = el.getAttribute(LAZY_ATTR);

        if (el instanceof HTMLImageElement) {
          if (el.src !== url)
            el.src = url;
        } else {
          url = `url(${url})`;
          if (el.style.backgroundImage !== url)
            el.style.backgroundImage = url;
        }

        el.removeAttribute(LAZY_ATTR);
        Render.scrollObserver.unobserve(el);
      }
    }
  }
}


class Util {

  static str2num(str) {
    return str && Number(str.replace(/,/g, '')) || undefined;
  }

  static str2gist(str) {
    return str.replace(/\W+/g, ' ').trim().toLowerCase();
  }

  static num2str(num) {
    return num && num.toLocaleString() || '';
  }

  static num2pct(n, numDecimals = 2) {
    return (n * 100).toFixed(numDecimals).replace(/\.?0+$/, '') + '%';
  }

  static decodeHtml(str) {
    if (str.includes('&#')) {
      str = str.replace(/&#(x?)([\da-f]);/gi, (_, hex, code) =>
        String.fromCharCode(parseInt(code, hex ? 16 : 10)));
    }
    if (!str.includes('&') ||
        !/&\w+;/.test(str))
      return str;
    if (!Mal.parser)
      Mal.parser = new DOMParser();
    const doc = Mal.parser.parseFromString(str, 'text/html');
    return doc.body.firstChild.textContent;
  }

  static parseJson(str) {
    try {
      return JSON.parse(str);
    } catch (e) {}
  }

  static nextTick() {
    return new Promise(setTimeout);
  }

  static fetchDoc(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        url,
        method: 'GET',
        onload(r) {
          const doc = new DOMParser().parseFromString(r.response, 'text/html');
          resolve(doc);
        },
      });
    });
  }

  static fetchJson(url) {
    return new Promise(resolve => {
      GM_xmlhttpRequest({
        url,
        method: 'GET',
        responseType: 'json',
        onload(r) {
          resolve(r.response);
        },
      });
    });
  }

  static externalLink(
    props,
    children = props.children || props.textContent || []
  ) {
    props.tag = 'a';
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
    props.children = Array.isArray(children) ? children : [children];
    props.children.push(EXT_LINK);
    delete props.textContent;
    return props;
  }
}


/** @return {HTMLElement} */
function $(selector, node = document) {
  return node.querySelector(selector);
}

/** @return {HTMLElement} */
function $id(id, doc = document) {
  return doc.getElementById(id);
}

/** @return {HTMLElement[]} */
function $$(selector, node = document) {
  return [...node.querySelectorAll(selector)];
}

/** @return {String} */
function $text(selector, node = document) {
  const el = typeof selector === 'string' ?
    node.querySelector(selector) :
    selector;
  return el ? el.textContent.trim() : '';
}

/** @return {HTMLElement} */
function $create(props,
                 children = props.children || [],
                 referenceNode = props.id && $id(props.id)) {
  let el;
  let childIndex = -1;
  const hasOwnProperty = Object.hasOwnProperty;
  const toAppend = [];

  if (!Array.isArray(children))
    children = [children];

  for (
    let index = 0, node, info = props, ref = referenceNode;
    index <= children.length;
    info = children[index], ref = el.childNodes[childIndex], index++
  ) {

    if (!info)
      continue;

    childIndex++;

    let ns;
    const isNode = info instanceof Node;

    if (isNode) {
      node = info;
    } else {
      let {tag} = info;
      const i = tag ? tag.indexOf(':') : -1;
      if (i >= 0) {
        ns = tag.slice(0, i);
        tag = tag.slice(i + 1);
      }
      node = ref && ref.localName === (tag && tag.toLowerCase()) && ref || (
        !tag ?
          document.createTextNode(info) :
          /^SVG$/i.test(ns) ?
            document.createElementNS('http://www.w3.org/2000/svg', tag) :
            document.createElement(tag));
    }

    const type = node.nodeType;

    if (index === 0)
      el = node;
    else if (!ref)
      toAppend.push(node);
    else if (isNode || ref.localName !== node.localName)
      ref.parentNode.replaceChild(node, ref);

    if (isNode)
      continue;

    if (type === Node.TEXT_NODE) {
      if (ref && ref.nodeValue !== info)
        ref.nodeValue = info;
      continue;
    }

    if (index > 0 && info.children) {
      $create(info, undefined, node);
      continue;
    }

    for (const k in info) {
      if (!hasOwnProperty.call(info, k) ||
          k === 'tag' ||
          k === 'children' ||
          k === 'parent' ||
          k === 'after' ||
          k === 'before')
        continue;
      const v = info[k];
      const attr = k.startsWith('$') ? k.slice(1) : null;
      if (attr || ns)
        $attributize(node, attr || k, v);
      else if (node[k] !== v)
        node[k] = v;
    }
  }

  if (toAppend.length)
    el.append(...toAppend);
  else {
    const numExpected = childIndex + (props.textContent ? 1 : 0);
    const numZombies = el.childNodes.length - numExpected;
    for (let i = 0; i < numZombies; i++)
      el.lastChild.remove();
  }

  if (props.parent &&
      props.parent !== el.parentNode)
    props.parent.appendChild(el);

  if (props.before &&
      props.before !== el.nextSibling)
    props.before.insertAdjacentElement('beforeBegin', el);

  if (props.after &&
      props.after !== el.previousSibling)
    props.after.insertAdjacentElement('afterEnd', el);

  return el;
}

function $remove(selectorOrNode, base) {
  const el = selectorOrNode instanceof Node ?
    selectorOrNode :
    $(selectorOrNode, base);
  if (el)
    el.remove();
}

function $attributize(node, attr, value) {
  if (value === null)
    node.removeAttribute(attr);
  else if (value !== node.getAttribute(attr))
    node.setAttribute(attr, value);
}

App.init();
