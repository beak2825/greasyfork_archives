// ==UserScript==
// @version      1.4.0
// @name         Adventure + Scenario Exporter
// @description  Export any adventure or scenario to a local file.
// @author       Magic <magicoflolis@tuta.io>
// @supportURL   https://github.com/magicoflolis/userscriptrepo/issues
// @namespace    https://github.com/magicoflolis/userscriptrepo/tree/master/userscripts/AIDungeon
// @homepageURL  https://github.com/magicoflolis/userscriptrepo/tree/master/userscripts/AIDungeon
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAIuSURBVHhe7di/Li1RFMfxk0iuiKtC0N5GoxaNQrSi8QJa9zXETYSKF9BSqUlEpziJB6AQfzoSuaXm8BvzdWQyM87Y48zs2Wd9khPMXnvt9dsZiWgZY4wxxpiKdTqdCb4dTK+iS9jhx8ETXUBEl3DBo8FC/ne6hFMeDwYF/kX2Lj1bZzl8CrtK7gSWwxf93pM5hZKwkTXPLGXhImguysKk1/+YnLkoDRMZv6RL2qc8LAq2S8ae2BIWshXClnAo03McrRi2hUGv/l9yFcbW5lP4GTJ9C9ubTeFTf/MXRYtmI4sTWjQXOVy1adNMevVfCOJqlFYJej7Ot/5S+IM4gztapXy15gXNNxoNWYYuMPOfpVoaYn2DR/6JBixD4W5olaK1I8r8fAs04BrzOaNVJko+LPPYHwzmTBc4R6sULU/FVZ9Y8oOG/81cTrT/mlaZtP5EaRdLftA8h/FYbmiTi7IEXcoSy/VjJicK8kibTFq/ojRBz88pqR8zOVGQe9qkaHkkrspGWf2Yp4xhWiWwlouy+jFPWUO0e6c3o+ef05TWT8OeMVMp6vOgL+34p944vn4a/A8zVUZn/ud4PzBXZXQBWxztBw20yWyV4Fi/MFslONIvegvmma+vdM4kR/pHw90yZ1+o/yVH+YtZ+4Ij/Me8P4rWzcHcpem1v6Nl85DBmcKv0Kq5FGKbPIVpzwnbw6FQe+TLpZp/lIdNQaf1WdRnQZ8xHhtjjDHGGFOJVusN4nlaFWZwR4AAAAAASUVORK5CYII=
// @license      MIT
// @compatible     chrome
// @compatible     firefox
// @compatible     edge
// @compatible     opera
// @compatible     safari
// @connect     api.aidungeon.com
// @connect     api-beta.aidungeon.com
// @connect     api-alpha.aidungeon.com
// @connect     api-internal.aidungeon.com
// @connect     play.aidungeon.com
// @connect     beta.aidungeon.com
// @connect     alpha.aidungeon.com
// @connect     internal.aidungeon.com
// @grant     unsafeWindow
// @grant     GM_addElement
// @grant     GM_info
// @grant     GM_registerMenuCommand
// @grant     GM.addElement
// @grant     GM.info
// @grant     GM.registerMenuCommand
// @match     https://play.aidungeon.com/*
// @match     https://beta.aidungeon.com/*
// @match     https://alpha.aidungeon.com/*
// @match     https://internal.aidungeon.com/*
// @match     https://api.aidungeon.com/graphql
// @match     https://api-beta.aidungeon.com/graphql
// @match     https://api-alpha.aidungeon.com/graphql
// @match     https://api-internal.aidungeon.com/graphql
// @noframes
// @run-at     document-start
// @downloadURL https://update.greasyfork.org/scripts/528397/Adventure%20%2B%20Scenario%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/528397/Adventure%20%2B%20Scenario%20Exporter.meta.js
// ==/UserScript==
(() => {
'use strict';
/******************************************************************************/
const inIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();
if (inIframe) return;
let userjs = self.userjs;
/**
 * Skip plain text documents, based on uBlock Origin
 *
 * [vapi.js](https://github.com/gorhill/uBlock/blob/68962453ff6eec7ff109615a738beb8699b9844a/platform/common/vapi.js#L35)
 */
if (
  (document instanceof Document ||
    (document instanceof XMLDocument && document.createElement('div') instanceof HTMLDivElement)) &&
  /^text\/html|^application\/(xhtml|xml)/.test(document.contentType || '') === true &&
  (self.userjs instanceof Object === false || userjs.UserJS !== true)
) {
  userjs = self.userjs = { UserJS: true };
} else {
  console.error('[%cAID Script+%c] %cERROR','color: rgb(69, 91, 106);','','color: rgb(249, 24, 128);', `MIME type is not a document, got "${document.contentType || ''}"`);
}
if (!(typeof userjs === 'object' && userjs.UserJS)) return;
/** [i18n directory](https://github.com/magicoflolis/userscriptrepo/tree/master/userscripts/AIDungeon/src/_locales) */
const translations = {
 "en": {
  "aiVersionsJSON": "Export Instructions (JSON)",
  "aiVersionsTXT": "Export Text Instructions (TXT)",
  "export_in": "Export in",
  "Export": "Export",
  "Import": "Import"
 }
};
/** [CSS directory](https://github.com/magicoflolis/userscriptrepo/tree/master/userscripts/AIDungeon/src/sass) */
const main_css = `mujs-main {
  min-height: var(--t-size-8, 64px);
  margin-top: -1px;
  border-top-color: var(--c-coreA3, rgba(219, 241, 255, 0.22));
  pointer-events: auto !important;
  border-top-style: solid;
  border-top-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  gap: var(--t-space-3, 24px);
  align-items: center;
  position: relative;
  flex-shrink: 0;
  min-width: 0px;
  box-sizing: border-box;
  flex-basis: auto;
  display: flex;
  color: var(--color, rgb(255, 255, 255));
}
mujs-main[data-section=play] {
  display: contents;
}
mujs-main[data-section=play] .mujs-inp {
  color: rgb(239, 68, 68);
  border-color: rgb(223, 49, 38);
  background-color: rgba(223, 49, 38, 0.1);
}
mujs-main[data-section=play] .mujs-inp:hover {
  background-color: rgba(223, 49, 38, 0.2) !important;
  border-color: rgba(223, 49, 38, 0.1) !important;
}

mujs-elem {
  font-family: VoyageIcons;
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
  flex-direction: row;
  align-items: center;
  min-width: 0px;
  min-height: 0px;
  position: relative;
}
mujs-elem.mujs-inp {
  border-width: 0px !important;
}
mujs-elem[data-section=play] {
  padding-left: var(--t-space-2);
  padding-right: var(--t-space-2);
  border-radius: var(--t-radius-1);
  gap: var(--t-space-1);
  border-color: var(--borderColor);
  background-color: rgba(199, 231, 255, 0.13);
  height: var(--t-size-5);
  overflow: hidden;
  border-style: solid;
  border-width: 1px;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 0px;
}
mujs-elem[data-section=play]:hover {
  box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 0px 0px !important;
}
mujs-elem[data-section=play]:not(.mujs-inp):hover {
  background-color: var(--backgroundHover) !important;
  border-color: var(--borderColorHover) !important;
}
mujs-elem[data-section=preview] {
  gap: var(--t-space-3);
  box-sizing: border-box;
  list-style-image: none;
  list-style-position: outside;
  list-style-type: none;
  padding-bottom: var(--t-space-2);
  padding-top: var(--t-space-2);
  pointer-events: auto;
}
mujs-elem[data-section=preview] span[data-section] {
  font-size: var(--f-size-3, 16px);
  font-weight: 500;
}
mujs-elem[data-section=preview] p {
  font-size: var(--f-size-2, 14px);
}
mujs-elem p {
  font-size: var(--f-size-1, 12px);
}
mujs-elem span[data-section] {
  font-family: IBMPlexSans;
  text-transform: uppercase;
  font-size: var(--f-size-2, 14px);
}`;
/******************************************************************************/
// #region Console
class con extends null {
  static #title = '[%cAID Script%c]';
  static #color = 'color: rgb(69, 91, 106);';
  /**
   * @param {unknown[]} msg
   */
  static dbg(...msg) {
    const dt = new Date();
    console.debug(
      `${con.#title} %cDBG`,
      con.#color,
      '',
      'color: rgb(255, 212, 0);',
      `[${dt.getHours()}:${('0' + dt.getMinutes()).slice(-2)}:${('0' + dt.getSeconds()).slice(-2)}]`,
      ...msg
    );
  }
  /**
   * @param {unknown[]} msg
   */
  static err(...msg) {
    console.error(`${con.#title} %cERROR`, con.#color, '', 'color: rgb(249, 24, 128);', ...msg);
    const t = con.#title.replace(/%c/g, '');
    for (const e of msg.filter((i) => i instanceof Error)) {
      if ('cause' in e) con.alert(`${t} (${e.cause}) ${e.message}`);
    }
  }
  /**
   * @param {unknown[]} msg
   */
  static info(...msg) {
    console.info(`${con.#title} %cINF`, con.#color, '', 'color: rgb(0, 186, 124);', ...msg);
  }
  /**
   * @param {unknown[]} msg
   */
  static log(...msg) {
    console.log(`${con.#title} %cLOG`, con.#color, '', 'color: rgb(219, 160, 73);', ...msg);
  }
  static alert(message) {
    if (typeof window.alert !== 'undefined') window.alert(message);
  }
}
// #endregion
// #region Utilities
/**
 * Check if we are running on a mobile device or tablet.
 * @returns {boolean}
 */
const isMobile = (() => {
  try {
    const { userAgent, userAgentData } = navigator;
    const { platform, mobile } = userAgentData ? Object(userAgentData) : {};
    return (
      /Mobile|Tablet/.test(userAgent ? String(userAgent) : '') ||
      Boolean(mobile) ||
      /Android|Apple/.test(platform ? String(platform) : '')
    );
  } catch (ex) {
    if (ex instanceof Error) ex.cause = 'getUAData';
    con.err(ex);
  }
  return false;
})();
/**
 * @template {PropertyKey} K
 * @template T
 * @param {Iterable<T>} items
 * @param {(item: T, index: number) => K} keySelector
 * @returns {Partial<Record<K, T[]>>}
 */
const groupBy = function (items, keySelector) {
  if ('groupBy' in Object) {
    return Object.groupBy(items, keySelector);
  }
  /** [Object.groupBy polyfill](https://gist.github.com/gtrabanco/7c97bd41aa74af974fa935bfb5044b6e) */
  return Array.from(items).reduce((acc, item, index) => {
    const key = keySelector(item, index);
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, /** @type {Partial<Record<K, T[]>>} */ ({}));
};
/**
 * Transform parameter into string
 * @template O
 * @param {O} obj
 * @returns {string}
 */
const objToStr = (obj) => {
  try {
    return Object.prototype.toString.call(obj).match(/\[object (.*)\]/)?.[1] || '';
  } catch {
    return '';
  }
};
/**
 * @template O
 * @param {O} obj
 * @returns {obj is () => unknown}
 */
const isFN = (obj) => /Function/.test(objToStr(obj));
/**
 * @template O
 * @param {O} obj
 * @returns {obj is HTMLElement}
 */
const isHTML = (obj) => /HTML/.test(objToStr(obj));
/**
 * @template O
 * @param {O} obj
 * @returns {obj is Document | Element | HTMLElement | Node}
 */
const isDOM = (obj) => /Document|Element|HTML/.test(objToStr(obj));
/**
 * Transform target into Array
 * @template T
 * @template {Record<string, boolean>} A
 * @param {T | null} [target] - The target to normalize into an array
 * @param {A} [args]
 * @param {Document | Element | HTMLElement | null} [root]
 * @returns {T extends null | undefined ? [] : T extends readonly unknown[] ? T : T extends Document | Element | HTMLElement ? [T] : T extends string ? A extends { split: true } ? string[] : typeof root extends Document | Element | HTMLElement ? Element[] : [T] : A extends { entries: true } ? T extends Record<infer K, infer V> ? Array<[K extends string ? K : string, V]> : Array<[string, unknown]> : A extends { keys: true } ? T extends Record<infer K, unknown> ? Array<K extends string ? K : string> : T extends Set<unknown> | Map<infer K, unknown> ? K[] : string[] : A extends { values: true } ? T extends Record<string, infer V> ? V[] : T extends Set<infer V> | Map<unknown, infer V> ? V[] : unknown[] : T extends Iterable<infer U> ? U[] : unknown[]}
 */
const toArray = (target, args, root) => {
  args = Object.assign({}, args);
  if (target == null) return [];
  if (Array.isArray(target)) return target;
  if (isDOM(target)) return Array.of(target);
  /** @type {keyof typeof args | undefined} */
  const method = ['split', 'entries', 'keys', 'values'].find((key) => args[key]);
  if (typeof target === 'string') {
    if (isDOM(root)) {
      const q = root.querySelectorAll(target);
      return Array.from(q);
    }
    return method === 'split' ? [...target] : [target];
  }
  if (method != null) {
    const s = objToStr(target);
    const m = method === 'split' ? 'keys' : method;
    if (/Object/.test(s)) {
      if (Object[m]) return Array.from(Object[m](target));
    } else if (/Set|Map/.test(s)) {
      /** @type {Set<unknown> | Map<unknown, unknown>} */
      const prim = target;
      if (prim[m]) return Array.from(prim[m]());
    }
  }
  return Array.from(target);
};
/**
 * Parameter is `JSON Object`
 * @template O
 * @param {O} obj
 * @returns {obj is Record<PropertyKey, unknown>}
 */
const isObj = (obj) => /Object/.test(objToStr(obj));
/**
 * Parameter is `null` or `undefined`
 * @template O
 * @param {O} obj
 * @returns {obj is (null | undefined)}
 */
const isNull = (obj) => Object.is(obj, null) || Object.is(obj, undefined);
/**
 * Parameter is Blank
 * @template O
 * @param {O} obj
 * @returns {boolean}
 */
const isBlank = (obj) => {
  if (typeof obj === 'string') return Object.is(obj.replaceAll('\0', '').trim(), '');
  return Object.is(toArray(obj, { split: true }).length, 0);
};
/**
 * Parameter is Empty
 * @template O
 * @param {O} obj
 * @returns {boolean}
 */
const isEmpty = (obj) => isNull(obj) || isBlank(obj);
/**
 * Parameter is Array
 * @template O
 * @param {O} obj
 * @returns {obj is any[]}
 */
const isArr = (obj) => Array.isArray(obj);
/**
 * @param {string} [str]
 * @returns {RegExpExecArray | []}
 */
const getUrlInfo = (str = location.pathname) => /(adventure|scenario)\/([^/]+)/.exec(str) ?? [];
/**
 * Returns the first element that is a descendant of node that matches selectors.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/querySelector)
 * @template {HTMLElement} E
 * @template {string} S
 * @param {S} selectors
 * @param {E} root
 */
const qs = (selectors, root) => {
  try {
    return (root || document).querySelector(selectors);
  } catch (ex) {
    con.err(ex);
    return null;
  }
};
/**
 * Create a MutationObserver for the element.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/MutationObserver)
 * @template {Node} E
 * @param {E} element
 * @param {MutationCallback} listener
 * @param {MutationObserverInit} options
 * @returns {MutationObserver}
 */
const observe = (element, listener, options = { subtree: true, childList: true }) => {
  const observer = new MutationObserver(listener);
  observer.observe(element, options);
  listener.call(element, [], observer);
  return observer;
};
/**
 * Create an event listener for the element.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
 * @template {keyof HTMLElementEventMap} T
 * @template {Element} E
 * @param {E | E[]} el
 * @param {T} type
 * @param {(this: E, event: HTMLElementEventMap[T]) => *} listener
 * @param {boolean | AddEventListenerOptions} [options]
 */
const ael = (el, type, listener, options) => {
  try {
    /** @type {unknown} */
    const _listener = listener;
    for (const elem of toArray(el).filter(isHTML)) {
      if (isMobile && type === 'click') {
        elem.addEventListener('touchstart', _listener, options);
        continue;
      }
      elem.addEventListener(type, _listener, options);
    }
  } catch (ex) {
    if (ex instanceof Error) ex.cause = 'ael';
    con.err(ex);
  }
};
/**
 * Creates an instance of the element for the specified tag.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/createElement)
 * @template {keyof HTMLElementTagNameMap} T
 * @template {HTMLElementTagNameMap[T]} E
 * @template {{ [P in keyof E]: E[P] }} Attr
 * @param {T} tagName - The name of an element.
 * @param {Attr | string | string[]} [cname] - A className for the element.
 * @param {Attr | string} [attrs] - Set attributes for the element.
 * @returns {E}
 * @see {@link document.createElement}
 */
const make = (tagName, cname, attrs) => {
  const el = document.createElement(tagName);
  /**
   * @template {Element} E
   * @param {E} elem - HTMLElement
   * @param {string | string[]} str - Class string(s)
   */
  const addClass = (elem, str) => {
    const arr = (Array.isArray(str) ? str : typeof str === 'string' ? str.split(' ') : []).filter(
      (s) => !isEmpty(s)
    );
    return !isEmpty(arr) && elem.classList.add(...arr);
  };
  /**
   * Set attributes for an element
   * @template {Element} Elem
   * @param {Elem} elem - HTMLElement
   * @param {Elem[keyof Elem]} attr - Attributes for this HTMLElement
   */
  const formAttrs = (elem, attr = {}) => {
    if (elem == null) return elem;
    for (const [key, value] of Object.entries(attr)) {
      if (isObj(value)) {
        formAttrs(elem[key], value);
      } else if (isFN(value)) {
        if (/^on/.test(key)) {
          elem[key] = value;
          continue;
        }
        ael(elem, key, value);
      } else if (/^class/i.test(key)) {
        addClass(elem, value);
      } else if (elem.tagName === 'A' && /^(download|type)/i.test(key)) {
        elem.setAttribute(key, value);
      } else {
        elem[key] = value;
      }
    }
    return elem;
  };
  if ((typeof cname === 'string' || Array.isArray(cname)) && !isEmpty(cname)) addClass(el, cname);
  if (typeof attrs === 'string' && !isEmpty(attrs)) el.textContent = attrs;
  formAttrs(el, (isObj(cname) && cname) || (isObj(attrs) && attrs) || {});
  return el;
};
// #endregion
// #region i18n
class Language extends null {
  static i18nMap = new Map(Object.entries(translations));
  /**
   * @param { string | Date | number } str
   */
  static toDate(str) {
    return new Intl.DateTimeFormat(navigator.language).format(
      typeof str === 'string' ? new Date(str) : str
    );
  }
  /**
   * @param { number | bigint } number
   */
  static toNumber(number) {
    return new Intl.NumberFormat(navigator.language).format(number);
  }
  /**
   * @param {string} key
   * @returns {string}
   */
  static i18n$(key) {
    try {
      const c = Language.i18nMap.get(Language.current) ?? Language.i18nMap.get('en');
      return c?.[key] ?? 'INVALID KEY';
    } catch (e) {
      con.err(e);
      return 'ERROR';
    }
  }
  static get current() {
    const [current = 'en'] = navigator.language.split('-');
    if (!Language.i18nMap.has(current)) return 'en';
    return current;
  }
}
const { i18n$ } = Language;
// #endregion
/**
 * Check if we are executing in a UserScript evironment.
 * @see {@link GM}
 */
const isGM = typeof GM !== 'undefined';
/**
 * Get the Window interface
 * @see {@link unsafeWindow}
 * @see {@link window}
 */
const win = (typeof unsafeWindow !== 'undefined' && unsafeWindow) || window;
/**
 * @see {@link GM_info}
 */
const $info = (() => {
  if (isGM) {
    if (isObj(GM.info)) {
      return GM.info;
    } else if (isObj(GM_info)) {
      return GM_info;
    }
  }
  return {
    script: {
      icon: '',
      name: 'Adventure + Scenario Exporter',
      namespace: 'https://github.com/magicoflolis/userscriptrepo/tree/master/userscripts/AIDungeon',
      updateURL:
        'https://github.com/magicoflolis/userscriptrepo/raw/refs/heads/master/userscripts/AIDungeon/dist/main-userjs.user.js',
      version: 'Bookmarklet',
      bugs: 'https://github.com/magicoflolis/userscriptrepo/issues'
    }
  };
})();
/**
 * @param {string} css - CSS to inject
 * @param {string} [name] - Name of stylesheet
 * @param {boolean} [useMake] - Use {@link make} instead of {@link GM_addElement}
 */
const loadCSS = (css, name, useMake) => {
  if (userjs.stylesheet) return /** @type {NonNullable<typeof sty>} */ (userjs.stylesheet);
  if (useMake == null) useMake = !isGM;
  if (typeof name !== 'string' || isEmpty(name)) name = 'CSS';
  if (typeof css !== 'string')
    throw new Error('"css" must be a typeof "string"', { cause: 'loadCSS' });
  /** @type {?HTMLStyleElement} */
  let sty = null;
  if (isBlank(css)) throw new Error(`"${name}" contains empty CSS string`, { cause: 'loadCSS' });
  const parent = document.head ?? document.body ?? document.documentElement;
  if (useMake) {
    sty = make('style', {
      textContent: css,
      dataset: {
        insertedBy: $info.script.name,
        role: name
      }
    });
    parent.appendChild(sty);
    userjs.stylesheet = sty;
    return sty;
  }
  /** @type {typeof GM_addElement | undefined} */
  const fn =
    (typeof GM.addElement !== 'undefined' && isFN(GM.addElement) && GM.addElement) ||
    (typeof GM_addElement !== 'undefined' && isFN(GM_addElement) && GM_addElement);
  if (!isFN(fn)) return loadCSS(css, name, true);
  sty = fn(parent, 'style', { textContent: css });
  if (/Element/.test(objToStr(sty))) {
    sty.dataset.insertedBy = $info.script.name;
    sty.dataset.role = name;
    userjs.stylesheet = sty;
    return sty;
  }
  return loadCSS(css, name, true);
};
/**
 * Internal network framework
 */
const Network = {
  /**
   * Create a fetch request
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Fetch_API)
   * @template {string | object | Blob | ArrayBuffer | Document | Response} T
   * @template {RequestInfo | URL} U
   * @template {Request["method"]} M
   * @template {VMScriptResponseType} RT
   * @template {VMScriptGMXHRDetails<T> | RequestInit} D
   * @param {U} url
   * @param {M} method
   * @param {RT} responseType
   * @param {D} data
   * @returns {Promise<T>}
   */
  async req(url, method = 'GET', responseType = 'json', data) {
    if (url == null) throw new TypeError('"url" must be a type of request.');
    if (typeof method !== 'string') throw new TypeError(`"${method}" must be a type of string.`);
    if (typeof responseType !== 'string')
      throw new TypeError(`"${responseType}" must be a type of string.`);
    method = method.toUpperCase().replaceAll(/\W/g, '');
    responseType = responseType.toLowerCase().replaceAll(/\W/g, '');
    data = Object.assign({}, { method }, data);
    const r = await fetch(url, data);
    if (!r.ok) throw new Error(r);
    const check = (s = 'text') => (isFN(r[s]) ? r[s]() : r);
    let resp = r;
    if (/arraybuffer/.test(responseType)) {
      resp = check('arrayBuffer');
    } else if (/json/.test(responseType)) {
      resp = check('json');
    } else if (/text/.test(responseType)) {
      resp = check('text');
    } else if (/blob/.test(responseType)) {
      resp = check('blob');
    } else if (/formdata/.test(responseType)) {
      resp = check('formData');
    } else if (/clone/.test(responseType)) {
      resp = check('clone');
    } else if (/document/.test(responseType)) {
      const respTxt = check('text');
      /** @type {?DOMParser} */
      let domParser;
      if (typeof DOMParser !== 'undefined') domParser = new DOMParser();
      /**
       * @param {string} txt
       */
      const fn = (txt) => (domParser ? domParser.parseFromString(txt, 'text/html') : txt);
      if (respTxt instanceof Promise) {
        resp = fn(await respTxt);
      } else {
        resp = fn(respTxt);
      }
    }
    return resp;
  },
  /**
   * @template {{loaded: number; total: number}} E
   * @param {E} evt
   */
  prog(evt) {
    return Object.is(evt.total, 0) ? '0%' : `${+((evt.loaded / evt.total) * 100).toFixed(2)}%`;
  }
};
/**
 * @template { {url: unknown; filename?: string; type?: string} } D
 * @param {D} details
 */
const doDownloadProcess = (details) => {
  if (!isObj(details) || !details.url) return;
  details.url = `data:text/plain;charset=utf-8,${encodeURIComponent(isObj(details.url) ? JSON.stringify(details.url, null, ' ') : details.url)}`;
  make('a', {
    download: details.filename || 'file',
    href: details.url,
    type: details.type || 'text/plain'
  }).dispatchEvent(new MouseEvent('click'));
};
/**
 * Internal {@link GM_registerMenuCommand} framework
 */
const Command = {
  cmds: new Set(),
  register(text, command) {
    if (!isGM || this.cmds.has(command)) return;
    if (isFN(command)) this.cmds.add(command);
    if (isFN(GM.registerMenuCommand)) {
      GM.registerMenuCommand(text, command);
    } else if (isFN(GM_registerMenuCommand)) {
      GM_registerMenuCommand(text, command);
    }
  }
};
/**
 * Grab the users firebase token
 * @param {boolean} [yoga]
 * @returns {Promise<string>}
 */
const getToken = (yoga) => {
  return new Promise((resolve, reject) => {
    /**
     * @template S
     * @param {S} str
     */
    const format = (str) => {
      if (yoga) {
        const textarea = qs('.graphiql-editor:nth-child(2) > .CodeMirror textarea');
        if (textarea) {
          textarea.value = `{\n\x20\x20"Authorization": "firebase ${str}"\n}`;
        }
      }
      return str;
    };
    if (userjs.accessToken !== undefined) {
      resolve(format(userjs.accessToken));
    }
    const dbReq = win.indexedDB.open('firebaseLocalStorageDb');
    dbReq.onerror = reject;
    dbReq.onsuccess = (event) => {
      try {
        const transaction = event.target.result.transaction(['firebaseLocalStorage'], 'readwrite');
        const objectStore = transaction.objectStore('firebaseLocalStorage');
        const allKeys = objectStore.getAllKeys();
        allKeys.onerror = reject;
        allKeys.onsuccess = (evt) => {
          const key = evt.target.result.find((r) => r.includes('firebase:authUser:'));
          objectStore.get(key).onsuccess = (e) => {
            const { value } = e.target.result;
            const accessToken = value.stsTokenManager.accessToken;
            resolve(format(accessToken));
          };
        };
      } catch {
        Network.req(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCnvo_XFPmAabrDkOKBRpbivp5UH8r_3mg',
          'POST',
          'json',
          {
            body: JSON.stringify({ returnSecureToken: true })
          }
        )
          .then((r) => {
            if (isObj(r) && 'idToken' in r && !isEmpty(r.idToken)) {
              resolve(format(r.idToken));
            } else {
              resolve('');
            }
          })
          .catch(reject);
      }
    };
  });
};
//#region fromGraphQL
/**
 * @type { import("../typings/types.d.ts").fromGraphQL }
 */
const fromGraphQL = async (type, shortId) => {
  const resp = {
    data: {}
  };
  try {
    /**
     * @template { import("../typings/types.d.ts").Templates } T
     * @type { T }
     */
    const template = {
      Custom: {
        body: shortId
      },
      GetAdventure: {
        body: {
          query:
            '{\nadventure: adventureState(shortId: "{{shortId}}") {\nid\nshortId\nscenarioId\ndetails\ninstructions\ntitle\ndescription\ntags\ngameState\nactionCount\ncontentType\ndeletedAt\nthirdPerson\nmemory\nauthorsNote\nimage\nactionWindow(limit: 1000000, offset: 0, desc: true) {\nimageText\nid\ntext\ntype\nimageUrl\nshareUrl\nadventureId\ndecisionId\nundoneAt\ndeletedAt\ncreatedAt\n}\nstoryCards {\nid\n... on StoryCard {\nid\ntype\nkeys\nvalue\ntitle\nuseForCharacterCreation\ndescription\ndeletedAt\n}\n}\n}\n}'
        }
      },
      GetScenario: {
        body: {
          query:
            '{\nscenario(shortId: "{{shortId}}") {\nid\nshortId\ntitle\ndescription\nprompt\nmemory\nauthorsNote\ndetails\nimage\nisOwner\nallowComments\ntags\nthirdPerson\ntype\ncontentType\ncontentRating\nparentScenarioId\noptions {\nid\nshortId\ntitle\nprompt\nparentScenarioId\ndeletedAt\n}\ngameCodeSharedLibrary\ngameCodeOnInput\ngameCodeOnOutput\ngameCodeOnModelContext\nstoryCards {\nid\n... on StoryCard {\nid\ntype\nkeys\nvalue\ntitle\nuseForCharacterCreation\ndescription\ndeletedAt\n}\n}\n}\n}'
        }
      },
      GetScenarioScripting: {
        body: {
          query:
            '{\nscenario(shortId: "{{shortId}}") {\nid\nshortId\ntitle\ndescription\nimage\ngameCodeSharedLibrary\ngameCodeOnInput\ngameCodeOnOutput\ngameCodeOnModelContext\nrecentScriptLogs\nlastModelContext\n}}'
        }
      },
      aiVersions: {
        body: {
          query:
            'query {\naiVisibleVersions {\nsuccess\nmessage\naiVisibleVersions {\n...AllDetails\n}\nvisibleTextVersions {\n...AllDetails\n}\nvisibleImageVersions {\n...AllDetails\n}\n}\n}\nfragment AllDetails on AiVisibleVersion {\nid\ntype\nversionName\naiDetails\naiSettings\naccess\nrelease\navailable\ninstructions\nengineNameEngine {\nengineName\navailable\navailableSettings\n}\n}'
        }
      },
      importStoryCards: {
        headers: {
          'x-gql-operation-name': 'ImportStoryCards'
        },
        body: {
          operationName: 'ImportStoryCards',
          variables: {
            input: shortId
          },
          query:
            'mutation ImportStoryCards($input: ImportStoryCardsInput!) {\nimportStoryCards(input: $input) {\nsuccess\nmessage\n}\n}'
        }
      },
      UpdateScenario: {
        headers: {
          'x-gql-operation-name': 'UpdateScenario'
        },
        body: {
          operationName: 'UpdateScenario',
          variables: {
            input: shortId
          },
          query:
            'mutation UpdateScenario($input: ScenarioInput) {\nupdateScenario(input: $input) {\nscenario {\nid\ntitle\ndescription\nprompt\nmemory\nauthorsNote\ntags\nnsfw\ncontentRating\ncontentRatingLockedAt\ncontentRatingLockedMessage\npublished\nthirdPerson\nallowComments\nunlisted\nimage\nuploadId\ntype\ndetails\neditedAt\n__typename\n}\nmessage\nsuccess\n__typename\n}}'
        }
      },
      UpdateOptionTitle: {
        headers: {
          'x-gql-operation-name': 'UpdateOptionTitle'
        },
        body: {
          operationName: 'UpdateOptionTitle',
          variables: {
            input: shortId
          },
          query:
            'mutation UpdateOptionTitle($input: ScenarioInput) {\n updateScenario(input: $input) {\n scenario {\n id\n shortId\n title\n prompt\n parentScenarioId\n deletedAt\n __typename\n }\n message\n success\n __typename\n }}'
        }
      },
      UpdateScenarioScripts: {
        headers: {
          'x-gql-operation-name': 'UpdateScenarioScripts'
        },
        body: {
          operationName: 'UpdateScenarioScripts',
          variables: shortId,
          query:
            'mutation UpdateScenarioScripts($shortId: String, $gameCode: JSONObject) {\n updateScenarioScripts(shortId: $shortId, gameCode: $gameCode) {\n success\n message\n scenario {\n id\n gameCodeSharedLibrary\n gameCodeOnInput\n gameCodeOnOutput\n gameCodeOnModelContext\n __typename\n }\n __typename\n }}'
        }
      },
      UpdateAdventureState: {
        headers: {
          'x-gql-operation-name': 'UpdateAdventureState'
        },
        body: {
          operationName: 'UpdateAdventureState',
          variables: {
            input: shortId
          },
          query:
            'mutation UpdateAdventureState($input: AdventureStateInput) {\n updateAdventureState(input: $input) {\n adventure {\n id\n details\n editedAt\n __typename\n }\n message\n success\n __typename\n }}'
        }
      },
      UpdateAdventurePlot: {
        headers: {
          'x-gql-operation-name': 'UpdateAdventurePlot'
        },
        body: {
          operationName: 'UpdateAdventurePlot',
          variables: {
            input: shortId
          },
          query:
            'mutation UpdateAdventurePlot($input: AdventurePlotInput) {\n updateAdventurePlot(input: $input) {\n adventure {\n id\n thirdPerson\n memory\n authorsNote\n editedAt\n __typename\n }\n message\n success\n __typename\n }}'
        }
      },
      UpdateAdventureDetails: {
        body: {
          operationName: 'UpdateAdventureDetails',
          variables: {
            input: shortId
          },
          query:
            'mutation UpdateAdventureDetails($input: AdventureDetailsInput) {\n updateAdventureDetails(input: $input) {\n adventure {\n id\n title\n description\n image\n uploadId\n tags\n nsfw\n contentRating\n contentRatingLockedAt\n contentRatingLockedMessage\n allowComments\n editedAt\n __typename\n }\n message\n success\n __typename\n }\n}'
        }
      },
      MainMenuViewCreateOptions: {
        body: {
          operationName: 'MainMenuViewCreateOptions',
          variables: shortId,
          query:
            'mutation MainMenuViewCreateOptions($title: String, $shortId: String, $count: Int) { createScenarioOptions(title: $title, shortId: $shortId, count: $count) { scenarios { shortId } success message } }'
        }
      },
      MainMenuViewDeleteScenario: {
        body: {
          operationName: 'MainMenuViewDeleteScenario',
          variables: shortId,
          query:
            'mutation MainMenuViewDeleteScenario($shortId: String) { deleteScenario(shortId: $shortId) { scenario {\n id\n shortId\n title\n parentScenarioId\n deletedAt\n __typename  }  success  message  __typename }}'
        }
      },
      NewMenuCreateScenario: {
        body: {
          operationName: 'NewMenuCreateScenario',
          variables: {
            // { prompt: '', title: '' }
            input: shortId
          },
          query:
            'mutation NewMenuCreateScenario($input: ScenarioInput) { createScenario(input: $input) { success message scenario { id shortId title prompt authorsNote ...CardSearchable __typename } __typename}}fragment CardSearchable on Searchable { publishTable id contentType publicId shortId title description image tags voteCount published unlisted publishedAt createdAt isOwner editedAt deletedAt blockedAt saveCount commentCount userId contentRating user { id isMember profile { id title thumbImageUrl __typename } __typename } ... on Adventure { actionCount userJoined unlisted playerCount contentResponses { userVote isSaved isDisliked __typename } __typename } ... on Scenario { adventuresPlayed contentResponses { userVote isSaved isDisliked __typename } __typename } __typename }'
        }
      },
      UpdateScenarioUpload: {
        body: {
          variables: shortId,
          query:
            'mutation UpdateScenarioUpload($shortId: String!, $uploadId: String!) {\n updateScenarioUpload(shortId: $shortId, uploadId: $uploadId) {\n scenario {\n id\n uploadId\n image\n __typename\n }\n message\n success\n __typename\n }\n}'
        }
      },
      // {
      // 	"autoGenerate": true,
      // 	"contentType": "scenario",
      // 	"description": "",
      // 	"id": "2134213",
      // 	"includeStorySummary": false,
      // 	"instructions": "",
      // 	"keys": "",
      // 	"shortId": "",
      // 	"storyInformation": "",
      // 	"temperature": 1,
      // 	"title": "",
      // 	"type": "character",
      // 	"useForCharacterCreation": true,
      // 	"value": ""
      // }
      UseCreateStoryCard: {
        body: {
          operationName: 'UseCreateStoryCard',
          variables: {
            input: shortId
          },
          query:
            'mutation UseCreateStoryCard($input: CreateStoryCardInput!) {\n createStoryCard(input: $input) {\n success\n message\n storyCard {\n id\n type\n title\n description\n keys\n value\n useForCharacterCreation\n updatedAt\n __typename\n }\n __typename\n }\n}'
        }
      },
      // {
      // 	"contentType": "scenario",
      // 	"description": "",
      // 	"id": "345345",
      // 	"includeStorySummary": true,
      // 	"instructions": "",
      // 	"keys": "",
      // 	"shortId": "",
      // 	"storyInformation": "",
      // 	"temperature": 1,
      // 	"title": "",
      // 	"type": "character",
      // 	"useForCharacterCreation": false,
      // 	"value": ""
      // }
      GenerateStoryCard: {
        body: {
          operationName: 'GenerateStoryCard',
          variables: {
            input: shortId
          },
          query:
            'mutation GenerateStoryCard($input: GenerateStoryCardInput!) {\n generateStoryCard(input: $input) {\n code\n success\n message\n storyCard {\n id\n type\n title\n description\n keys\n value\n useForCharacterCreation\n updatedAt\n __typename\n }\n __typename\n }\n}'
        }
      },
      // Manually create/save Story Card
      // 	{
      // 		"contentType": "scenario",
      // 		"description": "",
      // 		"id": "508647468",
      // 		"keys": ",
      // 		"shortId": "",
      // 		"title": "",
      // 		"type": "tesasdasd",
      // 		"useForCharacterCreation": false,
      // 		"value": "instructions"
      // 	}
      UseAutoSaveStoryCard: {
        body: {
          operationName: 'UseAutoSaveStoryCard',
          variables: {
            input: shortId
          },
          query:
            'mutation UseAutoSaveStoryCard($input: UpdateStoryCardInput!) {\n updateStoryCard(input: $input) {\n success\n message\n storyCard {\n id\n type\n title\n description\n keys\n value\n useForCharacterCreation\n updatedAt\n __typename\n }\n __typename\n }\n}'
        }
      },
      // Same as UseAutoSaveStoryCard, newer?
      SaveQueueStoryCard: {
        body: {
          operationName: 'SaveQueueStoryCard',
          variables: {
            input: shortId
          },
          query:
            'mutation SaveQueueStoryCard($input: UpdateStoryCardInput!) {\n updateStoryCard(input: $input) {\n success\n message\n storyCard {\n id\n type\n title\n description\n keys\n value\n useForCharacterCreation\n updatedAt\n __typename\n }\n __typename\n }\n}'
        }
      }
    };
    if (/scenario/.test(type)) {
      type = 'GetScenario';
    } else if (/adventure/.test(type)) {
      type = 'GetAdventure';
    }
    if (!template[type]) return resp;
    for (const v of Object.values(template)) {
      v.load = () => {
        template[type].headers ??= {};
        template[type].body ??= {};
        const { headers, body } = v;
        if (body.operationName) {
          template[type].body.variables ??= {};
        }
        body.query = body.query.replace(/\{\{shortId\}\}/g, shortId);
        return { headers, body: JSON.stringify(body) };
      };
    }
    const sel = template[type].load();
    const accessToken = await getToken();
    const headers = {
      Accept: 'application/graphql-response+json, application/json, multipart/mixed',
      authorization: `firebase ${accessToken}`,
      'content-type': 'application/json',
      'Sec-GPC': '1',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site'
    };
    /** @type {"api.aidungeon.com" | "api-beta.aidungeon.com" | "api-alpha.aidungeon.com" | "api-internal.aidungeon.com"} */
    const GRAPHQL_HOST = win?.__NEXT_DATA__?.runtimeConfig?.GRAPHQL_HOST || 'api.aidungeon.com';
    /** @type { Record<string, unknown> } */
    const req = await Network.req(`https://${GRAPHQL_HOST}/graphql`, 'POST', 'json', {
      headers: {
        ...headers,
        ...sel.headers
      },
      body: sel.body
    });
    Object.assign(resp, req);
    return resp;
  } catch (ex) {
    con.err(ex);
  }
  return resp;
};
//#endregion
/**
 * @param {string} language
 * @param {string} [content]
 */
const codeBlock = (language, content) => {
  return content === undefined
    ? `\`\`\`\n${language}\n\`\`\``
    : `\`\`\`${language}\n${content}\n\`\`\``;
};
const add = (s = '', l = 50, template = '-') => {
  let base = '';
  while (base.length < l / 2) {
    base += template;
  }
  base += s;
  while (base.length < l * 2) {
    base += template;
  }
  return base;
};
/**
 * @param {string} fileFormat
 * @param {'Export'|'Import'} type
 * @param {import("../typings/types.d.ts").fromPath} content
 */
const startDownload = async (fileFormat = 'json', type = 'Export', content = {}) => {
  const elem = qs(`mujs-elem[data-file-format="${fileFormat}"] > span[data-type="${type}"]`);
  if (isNull(elem)) return;
  const [, contentType, shortId] = getUrlInfo();
  if (!contentType)
    throw new Error('Navigate to an adventure or scenario first!', { cause: 'startDownload' });
  const world = await fromGraphQL(contentType, shortId).catch(con.err);
  if (isNull(world.data)) return;
  const worldData = world.data.adventure ?? world.data.scenario;
  if (isNull(worldData)) return;
  /**
   * @param {import("../typings/types.d.ts").StoryCard[]} sc
   */
  const transformCards = (sc) =>
    sc
      .filter((op) => op.deletedAt == null)
      .map(({ type, keys, value, title, description, useForCharacterCreation }) => {
        return {
          type,
          keys,
          value,
          title,
          description,
          useForCharacterCreation
        };
      });
  if (type === 'Import') {
    if (isEmpty(content)) throw new Error('"content" field is empty', { cause: 'startDownload' });
    if (worldData.isOwner === false)
      throw new Error(`You are not the owner of this ${contentType}.`, {
        cause: worldData.title ?? 'startDownload'
      });
    const r = content?.data.adventure ?? content?.data.scenario;
    /** @type {unknown[]} */
    const fetchRecords = [];
    const $add = (type, data) => fetchRecords.push(fromGraphQL(type, data).catch(con.err));
    const update = {
      adventureState: {
        shortId,
        details: r.details ?? content.data.adventureState?.details
      },
      adventureDetails: {
        shortId,
        allowComments: r.allowComments,
        contentRating: r.contentRating,
        description: r.description,
        image: r.image,
        tags: r.tags,
        title: r.title
      },
      adventurePlot: {
        shortId,
        memory: r.memory,
        authorsNote: r.authorsNote,
        thirdPerson: r.thirdPerson
      },
      scenario: {
        shortId,
        title: r.title,
        description: r.description,
        prompt: r.prompt,
        memory: r.memory,
        authorsNote: r.authorsNote,
        tags: r.tags,
        contentRating: r.contentRating,
        thirdPerson: r.thirdPerson,
        allowComments: r.allowComments,
        image: r.image,
        type: r.type,
        details: r.details
      },
      scripting: {
        shortId,
        gameCode: {
          onInput: r.gameCodeOnInput,
          onModelContext: r.gameCodeOnModelContext,
          onOutput: r.gameCodeOnOutput,
          sharedLibrary: r.gameCodeSharedLibrary
        }
      },
      storyCards: {
        contentType,
        shortId,
        storyCards: []
      }
    };
    const customQuery = (obj, execute = false) => {
      const custom = {
        variables: {},
        queryBody: [],
        queryParams: [],
        query: ''
      };
      const templates = {
        adventureState:
          'updateAdventureState(input: $adventureState) {\nadventure {\nid\ndetails\neditedAt\n__typename\n}\nmessage\nsuccess\n}',
        adventureDetails:
          'updateAdventureDetails (input: $adventureDetails) {\nadventure {\nid\ntitle\ndescription\nimage\nuploadId\ntags\nnsfw\ncontentRating\ncontentRatingLockedAt\ncontentRatingLockedMessage\nallowComments\neditedAt\n}\nmessage\nsuccess\n}',
        adventurePlot:
          'updateAdventurePlot(input: $adventurePlot) {\nadventure {\nid\nthirdPerson\nmemory\nauthorsNote\neditedAt\n}\n message\n success\n}',
        scenario:
          'updateScenario(input: $scenario) {\nscenario {\nid\ntitle\ndescription\n}\nmessage\nsuccess\n}',
        scripting: '',
        storyCards: 'importStoryCards(input: $storyCards) {\nsuccess\nmessage\n}'
      };
      const templateParams = {
        adventureState: 'AdventureStateInput',
        adventureDetails: 'AdventureDetailsInput',
        adventurePlot: 'AdventurePlotInput',
        scenario: 'ScenarioInput',
        scripting: '',
        storyCards: 'ImportStoryCardsInput!'
      };
      for (const [k, v] of Object.entries(obj)) {
        if (isEmpty(templates[k])) continue;
        custom.variables[k] = v;
        custom.queryBody.push(`_${k}: ${templates[k]}`);
        custom.queryParams.push(`$${k}: ${templateParams[k]}`);
      }
      custom.query = `mutation UserJSUpdate(${custom.queryParams.join(',')}) { ${custom.queryBody.join('\n')} }`;
      delete custom.queryBody;
      delete custom.queryParams;
      if (execute) {
        return fromGraphQL('Custom', custom).catch(con.err);
      }
      $add('Custom', custom);
    };
    if (isArr(r.storyCards) && !isBlank(r.storyCards)) {
      update.storyCards.storyCards = transformCards(r.storyCards);
    }
    if (contentType === 'scenario') {
      delete update.adventureState;
      delete update.adventureDetails;
      delete update.adventurePlot;
      $add('UpdateScenarioScripts', update.scripting);
      const gotIds = new Set();
      /**
       * @template {import("../typings/types.d.ts").aidDataList['scenario']['scenario']} Root
       * @param {Root} root
       * @param {string} $shortId
       */
      const createOptions = async (root, $shortId) => {
        root = Object.assign({}, root);
        if (gotIds.has(root.id)) return;
        gotIds.add(root.id);
        elem.textContent = `Importing: ${root.title}`;
        const Options = root.options.filter((op) => op.deletedAt == null);
        if (!isBlank(Options) && root.type === 'multipleChoice') {
          const g = groupBy(Options, (option) => option.parentScenarioId || root.id);
          const arr = g[root.id] || [];
          if (arr.length < 2) return;
          const createScenarioOptions = (
            await fromGraphQL('MainMenuViewCreateOptions', {
              shortId: $shortId,
              count: arr.length
            })
          ).data.createScenarioOptions;
          /** @type { { id: string; userId: string; shortId: string; title: string; prompt: string | null; parentScenarioId: string | null; deletedAt: string | null; __typename: "Scenario"; }[] } */
          const scenarios = createScenarioOptions.scenarios;
          for (let i = 0; i < scenarios.length; i++) {
            const thisWorld = scenarios[i];
            const option = arr[i];
            const obj = {
              scenario: {
                shortId: thisWorld.shortId,
                title: option.title || root.title,
                description: option.description || root.description,
                prompt: option.prompt || root.prompt,
                memory: option.memory || root.memory,
                authorsNote: option.authorsNote || root.authorsNote,
                tags: option.tags || r.tags,
                contentRating: option.contentRating || root.contentRating,
                thirdPerson: option.thirdPerson,
                allowComments: option.allowComments || root.allowComments,
                image: option.image || root.image,
                type: option.type || root.type,
                details: option.details || root.details || r.details
              },
              scripting: {
                shortId: thisWorld.shortId,
                gameCode: {
                  onInput: option.gameCodeOnInput || root.gameCodeOnInput,
                  onModelContext: option.gameCodeOnModelContext || root.gameCodeOnModelContext,
                  onOutput: option.gameCodeOnOutput || root.gameCodeOnOutput,
                  sharedLibrary: option.gameCodeSharedLibrary || root.gameCodeSharedLibrary
                }
              },
              storyCards: {
                contentType,
                shortId: thisWorld.shortId,
                storyCards: []
              }
            };
            elem.textContent = `Importing: ${option.title}`;
            if (isArr(option.storyCards) && !isBlank(option.storyCards)) {
              obj.storyCards.storyCards = transformCards(option.storyCards);
            }
            await customQuery(obj, true);
            $add('UpdateScenarioScripts', obj.scripting);
            if (option.type === 'multipleChoice') {
              const subWorlds = g[option.id] || [];
              if (subWorlds.length > 0) {
                await createOptions(
                  {
                    ...option,
                    options: [...new Set([...Options, ...subWorlds])].filter(
                      (op) => op.deletedAt == null
                    )
                  },
                  thisWorld.shortId
                );
              }
            }
          }
        }
      };
      await createOptions(r, shortId);
    } else if (contentType === 'adventure') {
      delete update.scenario;
      delete update.scripting;
    }
    customQuery(update);
    const records = await Promise.allSettled(fetchRecords);
    const msgs = ['Page reload required!'];
    for (const {
      value: { data }
    } of records) {
      for (const key of Object.keys(data)) {
        const resp = data[key];
        if (resp.success === false)
          throw new Error(`Failed to import "${key}"`, { cause: 'startDownload' });
        msgs.push(`${resp.message} - ${key}`);
      }
    }
    con.alert(msgs.join('\n\n'));
    return;
  }
  if (isArr(worldData.options)) {
    const subData = [];
    for (const opt of worldData.options.filter((o) => o.shortId !== shortId)) {
      elem.textContent = `Exporting: ${opt.title}`;
      const r = await fromGraphQL(contentType, opt.shortId).catch(con.err);
      if (!r.data) {
        con.err(r);
        continue;
      }
      const d = r.data.adventure ?? r.data.scenario;
      if (typeof d.deletedAt === 'string') continue;
      const subWorld = {
        id: d.id,
        type: d.type,
        title: d.title,
        description: d.description,
        prompt: d.prompt,
        memeory: d.memeory,
        authorsNote: d.authorsNote,
        thirdPerson: d.thirdPerson,
        details: d.details,
        parentScenarioId: d.parentScenarioId
      };
      if (isArr(d.storyCards) && !isBlank(d.storyCards)) {
        subWorld.storyCards = transformCards(d.storyCards);
      }
      if (d.gameCodeSharedLibrary) {
        subWorld.gameCodeSharedLibrary = d.gameCodeSharedLibrary;
      }
      if (d.gameCodeOnInput) {
        subWorld.gameCodeOnInput = d.gameCodeOnInput;
      }
      if (d.gameCodeOnOutput) {
        subWorld.gameCodeOnOutput = d.gameCodeOnOutput;
      }
      if (d.gameCodeOnModelContext) {
        subWorld.gameCodeOnModelContext = d.gameCodeOnModelContext;
      }
      if (isArr(d.options)) {
        subWorld.options = d.options
          .filter((op) => op.deletedAt == null)
          .map(({ id, title, prompt, parentScenarioId }) => {
            return { id, title, prompt, parentScenarioId };
          });
      }
      subData.push(subWorld);
    }
    worldData.options = subData;
  }
  const arr = [];
  let str;
  if (fileFormat === 'txt') {
    /**
     * @param {import("../typings/types.d.ts").StoryCard[]} sc
     */
    const storycards = (sc) => {
      const a = [];
      const count = {
        loaded: 0,
        total: sc.length * 1000
      };
      for (const card of sc) {
        const c = [];
        let title = '';
        for (const [k, v] of Object.entries(card)) {
          if (isEmpty(v)) continue;
          if (k === 'keys') {
            c.push(`TRIGGERS: ${v}`);
          } else if (k === 'value') {
            count.loaded += v.length;
            const p = Network.prog({
              loaded: v.length,
              total: 1000
            });
            c.push(`ENTRY (${v.length}/1000=${p}): ${v}`);
          } else if (k === 'description') {
            c.push(`NOTES: ${v}`);
          } else if (k === 'type') {
            c.push(`${k.toUpperCase()}: ${v}`);
          } else if (k === 'prompt') {
            c.push(v);
          } else if (k === 'title') {
            title = v;
          }
        }
        a.push(`${title ? `${title} ` : ''}[\n  ${c.join('\n  ')}\n]`);
      }
      return {
        ...count,
        percent: Network.prog(count),
        cards: a.join('\n')
      };
    };
    /**
     * @param { import("../typings/types.d.ts").actionWindow[] } actions
     */
    const actionWindow = (actions) => {
      const a = [];
      for (const action of actions) {
        const c = [];
        for (const [k, v] of Object.entries(action)) {
          if (isNull(v) || isBlank(v)) continue;
          if (k === 'text') {
            c.push(v);
          } else if (k === 'type') {
            c.push(`${add(v.toUpperCase(), 25, '=')}\n`);
          }
        }
        a.push(c.join('\n'));
      }
      return a.join('\n');
    };
    for (const [k, v] of Object.entries(worldData)) {
      if (isEmpty(v)) continue;
      if (/title|description|prompt/.test(k)) {
        arr.push(`${add(k.toUpperCase())}\n${v}`);
      } else if (/memory/.test(k)) {
        arr.push(`${add('PLOT ESSENTIALS')}\n${v}`);
      } else if (/authorsNote/.test(k)) {
        arr.push(`${add("AUTHOR'S NOTE")}\n${v}`);
      } else if (/storyCards/.test(k)) {
        const sc = storycards(v);
        arr.push(
          `${add(`STORY CARDS [${v.length} cards | ${sc.loaded}/${sc.total}=${sc.percent}]`)}\n${sc.cards}`
        );
      } else if (/actionWindow/.test(k)) {
        arr.push(`${add('ACTIONS')}\n${actionWindow(v)}`);
      } else if (/options/.test(k)) {
        arr.push(`${add('OPTIONS')}\n${storycards(v).cards}`);
      } else if (/details/.test(k)) {
        for (const [key, value] of Object.entries(v)) {
          if (isEmpty(value)) continue;
          if (/instructions/.test(key)) {
            arr.push(`${add('AI Instructions')}\n${JSON.stringify(value, null, ' ')}`);
          } else {
            arr.push(`${add(key.toUpperCase())}\n${value}`);
          }
        }
      } else if (/gameCodeSharedLibrary/.test(k)) {
        arr.push(`${add('SCRIPTING LIBRARY')}\n${v}`);
      } else if (/gameCodeOnInput/.test(k)) {
        arr.push(`${add('SCRIPTS INPUT')}\n${v}`);
      } else if (/gameCodeOnOutput/.test(k)) {
        arr.push(`${add('SCRIPTS OUTPUT')}\n${v}`);
      } else if (/gameCodeOnModelContext/.test(k)) {
        arr.push(`${add('SCRIPTS CONTEXT')}\n${v}`);
      } else if (/lastModelContext/.test(k)) {
        arr.push(`${add('SCRIPTS MODEL CONTEXT')}\n${v}`);
      } else if (/recentScriptLogs/.test(k)) {
        arr.push(`${add('SCRIPT LOGS')}\n${v.join('\n')}`);
      }
    }
    str = arr.join('\n');
  } else if (fileFormat === 'md' || fileFormat === 'html') {
    const fragment = fileFormat === 'html' ? document.createDocumentFragment() : null;
    const mkSection = (innerHTML = '') => {
      const d = make('details', 'flex');
      d.appendChild(make('summary', { innerHTML }));
      return d;
    };
    class Section {
      /** @type {HTMLDetailsElement} */
      elem;
      constructor(str = '') {
        this.elem = mkSection(str);
      }
      /**
       * @param  {...string} nodes
       */
      add(...nodes) {
        if (fragment) {
          const div = make('div', 'flex');
          for (const n of nodes) {
            const textarea = make('textarea', {
              placeholder: n,
              defaultValue: n,
              value: n
            });
            div.appendChild(textarea);
          }
          this.elem.appendChild(div);
        } else {
          for (const n of nodes) {
            this.elem.innerHTML += `\n\n${codeBlock('txt', n)}\n\n`;
          }
        }

        return this;
      }
      addObj(obj = {}, elem = this.elem) {
        if (fragment) {
          const div = make('div', 'flex');
          for (const [k, v] of Object.entries(obj)) {
            if (isEmpty(v)) continue;
            const container = make('div', 'flex', {
              style: 'flex-direction: row;'
            });
            if (isObj(v)) {
              this.addObj(v, container);
            } else if (isArr(v)) {
              if (k === 'storyCards') {
                const arr = v.filter((op) => op.deletedAt == null);
                const section = new Section(`Story Cards (${arr.length})`);
                for (const card of arr) {
                  new Section(`${card.title} (${card.type})`)
                    .addStoryCard(card)
                    .close(section.elem);
                }
                section.close(container);
              } else if (k === 'options') {
                const arr = v.filter((op) => op.deletedAt == null);
                const section = new Section(`Options (${arr.length})`);
                for (const opt of arr) {
                  delete opt.options;
                  delete opt.details;
                  new Section(opt.title).addObj(opt).close(section.elem);
                }
                section.close(container);
              } else {
                for (const val of v) this.addObj(val, container);
              }
            } else {
              container.appendChild(
                make('span', {
                  textContent: k
                })
              );
              const e = make('textarea', {
                placeholder: v,
                defaultValue: v,
                value: v
              });
              container.appendChild(e);
            }
            div.appendChild(container);
          }
          elem.appendChild(div);
        }
        return this;
      }
      /**
       *
       * @param {import("../typings/types.d.ts").storyCard} card
       */
      addStoryCard(card) {
        if (fragment) {
          const div = make('div', 'flex');
          for (const [k, v] of Object.entries(card)) {
            if (k === 'deletedAt' || k === 'useForCharacterCreation') continue;
            const container = make('div', 'flex', {
              style: 'flex-direction: row;'
            });
            const span = make('span', {
              textContent: k
            });
            const e = make(/value|keys|description/i.test(k) ? 'textarea' : 'input', {
              placeholder: v,
              defaultValue: v,
              value: v
            });
            container.append(span, e);
            div.appendChild(container);
          }
          this.elem.appendChild(div);
        } else {
          this.add(card.value, card.keys, card.description);
        }
        return this;
      }
      /**
       * @param {HTMLElement} [parent]
       */
      close(parent) {
        if (fragment) {
          (parent || fragment).append(this.elem);
        } else {
          arr.push(this.elem.outerHTML);
        }
      }
    }
    const closeDiv = make('div', 'flex');
    new Section(`Information (${worldData.title})`)
      .addObj({
        ID: worldData.id,
        Title: worldData.title,
        Description: worldData.description,
        Prompt: worldData.prompt,
        "Author's Note": worldData.authorsNote,
        Memory: worldData.memory
      })
      .close(closeDiv);
    if (!isEmpty(worldData.options)) {
      const o = new Section('Options');
      for (const opt of worldData.options.filter((op) => op.deletedAt == null)) {
        delete opt.options;
        delete opt.details;
        new Section(opt.title).addObj(opt).close(o.elem);
      }
      o.close(closeDiv);
    }
    if (!isEmpty(worldData.gameState)) {
      new Section('Game State')
        .addObj({ state: JSON.stringify(worldData.gameState, null, ' ') })
        .close(closeDiv);
    }
    if (
      [
        worldData.gameCodeSharedLibrary,
        worldData.gameCodeOnInput,
        worldData.gameCodeOnOutput,
        worldData.gameCodeOnModelContext
      ].find((i) => !isEmpty(i))
    ) {
      new Section('Scripts')
        .addObj({
          SharedLibrary: worldData.gameCodeSharedLibrary,
          Input: worldData.gameCodeOnInput,
          Output: worldData.gameCodeOnOutput,
          Context: worldData.gameCodeOnModelContext
        })
        .close(closeDiv);
    }
    if (!isEmpty(worldData.storyCards)) {
      const section = new Section(`Story Cards (${worldData.storyCards.length})`);
      for (const card of worldData.storyCards) {
        new Section(`${card.title} (${card.type})`).addStoryCard(card).close(section.elem);
      }
      section.close(closeDiv);
    }
    if (!isEmpty(worldData.actionWindow)) {
      const section = new Section(`Actions (${worldData.actionWindow.length})`);
      for (const action of worldData.actionWindow.filter((op) => op.deletedAt == null)) {
        const createdAt = new Date(action.createdAt);
        new Section(`${createdAt.toLocaleString(navigator.language)} ${action.type.toUpperCase()}`)
          .add(action.text, `# Discord TimeStamp\n<t:${+createdAt}></t:${+createdAt}>`)
          .close(section.elem);
      }
      section.close(closeDiv);
    }
    if (fragment) {
      const style = make('style', {
        textContent:
          'details { cursor: pointer; } .flex { display: flex; gap: 1em; flex-wrap: wrap; flex-direction: column; }'
      });
      fragment.append(closeDiv, style);
      const serializer = new XMLSerializer();
      str = serializer.serializeToString(fragment);
    } else {
      str = arr.join('\n');
    }
  }
  doDownloadProcess({
    url: fileFormat === 'json' ? world : str,
    filename: `${worldData.title}_${worldData.shortId}.${contentType}.${fileFormat}`
  });
};
/**
 * @template {HTMLElement} P
 * @param {P} parent
 * @param {string} section
 * @param {string} fileFormat
 * @param {'Export'|'Import'} type
 */
const inject = (parent, section = 'play', fileFormat = 'json', type = 'Export') => {
  if (!parent) return;
  if (section === 'play' && type === 'Export') {
    parent.style = 'flex-direction: column;';
  }
  const o = {
    Export: {
      class: 'mujs-btn',
      color: 't_coreA1',
      text: 'w_export'
    },
    Import: {
      class: 'mujs-inp',
      color: 't_redA',
      text: 'w_import'
    }
  };
  if (qs(`.${o[type].class}[data-file-format="${fileFormat}"]`)) return;
  /**
   * @type { HTMLInputElement }
   */
  let inpJSON;
  const [, contentType] = getUrlInfo();
  const btn = make('mujs-elem', o[type].class, {
    dataset: {
      fileFormat,
      section
    }
  });
  const textContent = `${i18n$(type)} ${contentType} (${fileFormat.toUpperCase()})`;
  const txt = make('span', {
    textContent,
    dataset: {
      section,
      type
    }
  });
  const ico = make('p', {
    textContent: o[type].text
  });
  const s = make('mujs-main', {
    dataset: {
      section
    }
  });
  const resetText = () => {
    txt.innerHTML = textContent;
  };
  ico.setAttribute('importantforaccessibility', 'no');
  ico.setAttribute('aria-hidden', 'true');
  btn.append(ico, txt);
  btn.onclick = async (evt) => {
    evt.preventDefault();
    if (type === 'Export') {
      txt.textContent = `Exporting (${fileFormat.toUpperCase()})...`;
      await startDownload(fileFormat, type).catch(con.err);
      resetText();
    } else if (type === 'Import' && inpJSON) {
      txt.textContent = `Importing ${contentType}...`;
      inpJSON.click();
    }
  };
  s.append(btn);
  parent.appendChild(s);
  if (type === 'Import') {
    inpJSON = make('input', {
      type: 'file',
      accept: '.json',
      style: 'display: none;'
    });
    ael(inpJSON, 'cancel', resetText);
    ael(inpJSON, 'change', function () {
      if (this.files == null) return;
      const file = this.files[0];
      if (file === undefined || file.name === '') return resetText();
      const fr = new FileReader();
      fr.onload = function () {
        if (typeof this.result === 'string') {
          const content = JSON.parse(this.result);
          startDownload(fileFormat, type, content).catch(con.err).finally(resetText);
        } else {
          resetText();
        }
      };
      fr.onerror = resetText;
      fr.readAsText(file);
    });
    parent.appendChild(inpJSON);
  }
};

/**
 * @template F
 * @param { (this: F, doc: Document) => * } onDomReady
 */
const loadDOM = (onDomReady) => {
  if (typeof onDomReady === 'function') {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      onDomReady.call(/** @type {F} */ (undefined), document);
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        (evt) =>
          onDomReady.call(/** @type {F} */ (undefined), /** @type {Document} */ (evt.target)),
        {
          once: true
        }
      );
    }
  }
};

if (!('userjs' in win)) {
  Object.assign(win, {
    userjs: {
      getToken,
      fromGraphQL,
      doDownloadProcess
    }
  });
}

loadDOM((doc) => {
  try {
    if ([window.location, doc].filter((i) => i == null).length > 0) {
      throw new Error(
        '"window.location" or "document" is null, reload the webpage or use a different one',
        {
          cause: 'loadDOM'
        }
      );
    }
    if (location.hostname.startsWith('api-') && location.pathname === '/graphql') {
      return getToken(true);
    }
    if (isNull(loadCSS(main_css, 'primary-stylesheet')))
      throw new Error('Failed to initialize script!', { cause: 'loadCSS' });
    const fileFormats = ['json', 'txt', 'html'];
    const ignoreTags = new Set(['br', 'head', 'link', 'meta', 'script', 'style']);
    observe(doc, (mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (ignoreTags.has(node.localName)) continue;
          if (node.parentElement === null) continue;
          if (!(node instanceof HTMLElement)) continue;
          let n = qs('div[aria-label="Content stats"]', node);
          if (n) {
            for (const f of fileFormats) inject(n, 'preview', f);
            inject(n, 'preview', 'json', 'Import');
          }
          const p = toArray('p[aria-level="2"]', {}, node).find((elem) =>
            elem.textContent.includes('story card management')
          );
          if (p) {
            n = p.parentElement;
            for (const f of fileFormats) inject(n, 'play', f);
            inject(n, 'play', 'json', 'Import');
          }
        }
      }
    });
    Command.register(i18n$('aiVersionsJSON'), async () => {
      try {
        const o = await fromGraphQL('aiVersions');
        if (!o.data.aiVisibleVersions)
          throw new Error('failed to load', {
            cause: `${i18n$('aiVersionsJSON')} - aiVersions`
          });
        doDownloadProcess({
          url: o,
          filename: `Instructions-${Date.now()}.json`
        });
      } catch (e) {
        con.err(e);
      }
    });
    Command.register(i18n$('aiVersionsTXT'), async () => {
      try {
        const o = await fromGraphQL('aiVersions');
        const root = o.data.aiVisibleVersions;
        if (!root)
          throw new Error('failed to load', {
            cause: `${i18n$('aiVersionsTXT')} - aiVersions`
          });
        /** @type {string[]} */
        const arr = [];
        const $line = (v, end = '\n') => {
          arr.push(`${v}${end}`);
        };
        for (const v of root.visibleTextVersions) {
          $line(add(v.aiDetails.title));
          $line(v.instructions, '\n\n');
        }
        doDownloadProcess({
          url: arr.join('\n'),
          filename: `Text_Versions-${Date.now()}.txt`
        });
      } catch (e) {
        con.err(e);
      }
    });
    for (const f of fileFormats) {
      Command.register(`${i18n$('export_in')} (${f.toUpperCase()})`, async () => {
        await startDownload(f).catch(con.err);
      });
    }
  } catch (ex) {
    con.err(ex);
  }
});

})();
