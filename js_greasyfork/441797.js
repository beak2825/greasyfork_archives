// ==UserScript==
// @name Han Traditionalize
// @name:zh 漢字轉換為繁體字
// @description 將頁面上的漢字轉換為繁體字，需要手動添加包含的網站以啟用
// @namespace https://github.com/tiansh
// @version 1.7
// @resource s2t https://tiansh.github.io/reader/data/han/s2t.json
// @include *
// @exclude *
// @grant GM_getResourceURL
// @grant GM.getResourceUrl
// @run-at document-start
// @license MIT
// @supportURL https://github.com/tiansh/us-han-simplify/issues
// @downloadURL https://update.greasyfork.org/scripts/441797/Han%20Traditionalize.user.js
// @updateURL https://update.greasyfork.org/scripts/441797/Han%20Traditionalize.meta.js
// ==/UserScript==

/** @type {'t2s'|'s2t'} */
const RULE = 's2t';

/* global RULE */
/**
 * @name RULE
 * @type {'t2s'|'s2t'}
 */
/* eslint-env browser, greasemonkey */

; (async function () {

  const fetchTable = async function (url) {
    return (await fetch(url)).json();
  };
  const loadTable = async function () {
    try {
      return fetchTable(GM_getResourceURL(RULE));
    } catch {
      return fetchTable(await GM.getResourceUrl(RULE));
    }
  };

  /** @type {{ [ch: string]: [string, number] }[]} */
  const table = await loadTable();
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  /** @param {string} text */
  const translate = function (text) {
    let output = '';
    let state = 0;
    for (let char of text) {
      while (true) {
        const current = table[state];
        const hasMatch = hasOwnProperty.call(current, char);
        if (!hasMatch && state === 0) {
          output += char;
          break;
        }
        if (hasMatch) {
          const [adding, next] = current[char];
          if (adding) output += adding;
          state = next;
          break;
        }
        const [adding, next] = current[''];
        if (adding) output += adding;
        state = next;
      }
    }
    while (state !== 0) {
      const current = table[state];
      const [adding, next] = current[''];
      if (adding) output += adding;
      state = next;
    }
    return output;
  };

  // Do not characters marked as following languages
  const skipLang = /^(?:ja|ko|vi)\b/i;
  // Change lang attribute so correct fonts may be available
  const fromLang = {
    t2s: /^zh\b(?:(?!.*-Hans)-(?:TW|HK|MO)|.*-Hant|$)/i,
    s2t: /^zh\b(?:(?!.*-Hant)-(?:CN|SG|MY)|.*-Hans|$)/i,
  }[RULE];
  // Overwrite language attribute with
  const destLang = { t2s: 'zh-Hans', s2t: 'zh-Hant' }[RULE];

  /** @type {WeakMap<Text|Attr, string>} */
  const translated = new WeakMap();
  /** @param {Text|Attr} node */
  const translateNode = function (node) {
    if (!node) return;
    if (translated.has(node) && translated.get(node) === node.nodeValue) return;
    if (/^\s*$/.test(node.nodeValue)) return;
    const result = translate(node.nodeValue);
    translated.set(node, result);
    node.nodeValue = result;
  };

  /** @enum {number} */
  const filterResult = {
    TRANSLATE: 0, // Translate this node
    SKIP_CHILD: 1, // Translate this node but not its children
    SKIP_LANG: 2, // Do not translate nodes in certain language
    SKIP_NODE: 3, // Do not translate this node and its children
  };
  /**
   * @param {Document|Element|Text} node
   * @param {filterResult} context
   */
  const nodeFilter = function (node, context = null) {
    // DOM Root
    if (node instanceof Document) return filterResult.TRANSLATE;
    // Inherit skip
    if (context === filterResult.SKIP_NODE || context === filterResult.SKIP_CHILD) return filterResult.SKIP_NODE;
    // Text Node
    if (node instanceof Text) return context === filterResult.TRANSLATE ? filterResult.TRANSLATE : filterResult.SKIP_NODE;
    // Skip other unknown nodes
    if (!(node instanceof Element)) return filterResult.SKIP_NODE;
    // Do not translate nodes which marked no translate
    if (node.classList.contains('notranslate')) return filterResult.SKIP_NODE;
    const translate = node.getAttribute('translate');
    if (translate === 'no') return filterResult.SKIP_NODE;
    // Do not translate content of certain type elements
    const tagName = node.tagName;
    let child = true;
    if (['CODE', 'VAR'].includes(tagName) && translate !== 'yes') child = false;
    else if (['SVG', 'MATH', 'SCRIPT', 'STYLE', 'TEXTAREA'].includes(tagName)) child = false;
    else if (node.getAttribute('contenteditable') === 'true') child = false;
    const lang = node.getAttribute('lang');
    // If no language is specified
    if (!lang) {
      if (child) return context;
      return context === filterResult.TRANSLATE ? filterResult.SKIP_CHILD : filterResult.SKIP_NODE;
    }
    // If text in languages that should be ignored
    if (skipLang.test(lang)) {
      if (child) return filterResult.SKIP_LANG;
      else return filterResult.SKIP_NODE;
    }
    if (fromLang.test(lang)) {
      node.setAttribute('ori-lang', node.getAttribute('lang'));
      node.setAttribute('lang', destLang);
    }
    if (child) return filterResult.TRANSLATE;
    else return filterResult.SKIP_CHILD;
  };
  /** @param {Text|Element} node */
  const nodeFilterParents = function (node) {
    const parents = [];
    for (let p = node; p; p = p.parentNode) parents.push(p);
    return parents.reverse().reduce((context, node) => nodeFilter(node, context), filterResult.TRANSLATE);
  };
  /**
   * @param {Node} node
   * @param {filterResult} context
   */
  const translateTree = function translateTree(node, context) {
    if (node instanceof Text) {
      if (context === filterResult.TRANSLATE) translateNode(node);
    } else if (node instanceof Element) {
      const filter = nodeFilter(node, context);
      if (filter === filterResult.SKIP_CHILD || filter === filterResult.TRANSLATE) {
        const tagName = node.tagName, attrs = node.attributes;
        if (['APPLET', 'AREA', 'IMG', 'INPUT'].includes(tagName)) translateNode(attrs.alt);
        if (['INPUT', 'TEXTAREA'].includes(tagName)) translateNode(attrs.placeholder);
        if (['A', 'AREA'].includes(tagName)) translateNode(attrs.download);
        translateNode(attrs.title);
        translateNode(attrs['aria-label']);
        translateNode(attrs['aria-description']);
      }
      if (filter === filterResult.TRANSLATE || filter === filterResult.SKIP_LANG) {
        [...node.childNodes].forEach(child => { translateTree(child, filter); });
      }
    } else if (node instanceof Document) {
      [...node.childNodes].forEach(child => { translateTree(child, filterResult.TRANSLATE); });
    }
  };
  /** @param {Text|Element} container */
  const translateContainer = function (container) {
    const filter = nodeFilterParents(container);
    if (filter !== filterResult.SKIP_NODE) translateTree(container, filter);
  };

  const observer = new MutationObserver(function onMutate(records) {
    const translateTargets = new Set();
    records.forEach(record => {
      if (record.type === 'childList') {
        [...record.addedNodes].forEach(node => translateTargets.add(node));
      } else {
        translateTargets.add(record.target);
      }
    });
    [...translateTargets].forEach(translateContainer);
  });
  observer.observe(document, { subtree: true, childList: true, characterData: true, attributes: true });

  if (document.readyState === 'complete') {
    translateContainer(document);
  } else document.addEventListener('DOMContentLoaded', () => {
    translateContainer(document);
  }, { once: true });

}());
