// ==UserScript==
// @name         yssWaitForNode
// @namespace    https://ysslang.com/
// @version      1.2.4.1
// @description  Be smart!
// @author       ysslang
// @match        *://*/*
// @supportURL   https://greasyfork.org/scripts/454354
// @run-at       document-start
// @grant        none
// ==/UserScript==

/* Done
- 去除返回元素中的重复元素, 避免重复执行; bugfix: 忘记加const了;
*/

class WaitForNode {
  #currentURL;
  #observerList = [];
  #waitList = [];

  constructor() { this.#currentURL = window.location.href; }

  #checkIfUrlMatch(matcher) {
    var result = false;
    if (matcher === undefined || matcher === null) result = false;
    if (typeof matcher === "string") result = new RegExp(matcher.trim()).test(this.#currentURL);
    if (matcher instanceof RegExp) result = matcher.test(this.#currentURL);
    return result;
  }

  #determineParentElement(arg) {
    var result = document;
    if (typeof arg === "string" && document.querySelector(arg)) result = document.querySelector(arg);
    if (arg instanceof Element) result = arg;
    return result;
  }

  #mergeOptions(options) {
    options = options || {};
    var result = {
      immediate: [options.immediate, options.imdt, true].find((e) => typeof (e) !== 'undefined'),
      recursive: [options.recursive, options.rcs, true].find((e) => typeof (e) !== 'undefined'),
      once: [options.once, false].find((e) => typeof (e) !== 'undefined'),
      subtree: [options.subtree, options.sbt, true].find((e) => typeof (e) !== 'undefined'),
      childList: [options.childList, options.cld, true].find((e) => typeof (e) !== 'undefined'),
      parentEl: this.#determineParentElement(options.parent),
    };
    return result;
  }

  #extractMatchedElements(mutations, selector, recursive) {
    const matchedElements = [];
    for (const { addedNodes } of mutations) {
      for (const node of addedNodes) {
        if (!node.tagName) continue;
        else if (node.matches(selector)) matchedElements.push(node);
        else if (recursive && node.firstElementChild) matchedElements.push(...node.querySelectorAll(selector));
      }
    }
    const result = [...new Set(matchedElements)]
    return result;
  }

  #on(selector, callback, options) {
    if (options.immediate) {
      [...options.parentEl.querySelectorAll(selector)].forEach(callback);
    }
    const observer = new MutationObserver((mutations) => {
      const elements = this.#extractMatchedElements(mutations, selector, options.recursive);
      elements.forEach(callback);
      if (elements && options.once) this.disconnect();
    });
    observer.observe(options.parentEl, { subtree: options.subtree, childList: options.childList, });
    this.#observerList.push(observer);
    window.x = observer;
    return observer;
  }

  #injectStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    return document.head.append(style);
  }

  add(name, url, selector, callback, options) {
    if (url === '') url = ['.*'];
    const urls = Array.isArray(url) ? url : [url];
    if (!urls.some(this.#checkIfUrlMatch, this)) return;
    const opts = this.#mergeOptions(options);
    const observer = this.#on(selector, callback, opts);
    this.#waitList.push({ 'name': name, 'url': url, 'selector': selector, 'callback': callback, 'options': opts, 'observer': observer });
  }

  batchAdd(name, url, lists, para4, para5) {
    const callback = typeof para4 === 'function' ? para4 : (typeof para5 === 'function' ? para5 : undefined);
    const options = typeof para4 === 'object' ? para4 : (typeof para5 === 'object' ? para5 : undefined)
    lists.forEach((p) => {
      if (!p.find(pp => typeof pp === 'function')) {
        if (p.length === 1) this.add(name, url, p[0], callback, options);
        else if (p.length === 2) this.add(`${name}-${p[0]}`, url, p[1], callback, options);
      }
      else if (typeof p[1] === 'function') this.add(name, url, p[0], p[1], p[2] || options);
      else if (typeof p[2] === 'function') this.add(`${name}-${p[0]}`, url, p[1], p[2], p[3] || options);
      else if (typeof p[3] === 'function') this.add(`${name}-${p[0]}`, p[1], p[2], p[3], p[4] || options);
      else return;
    })
  }

  addCss(name, url, cssString) {
    if (url === '') url = ['.*'];
    const urls = Array.isArray(url) ? url : [url];
    if (!urls.some(this.#checkIfUrlMatch, this)) return;
    this.#injectStyle(cssString);
  }

  stopAll() {
    while (this.#observerList.length) this.#observerList.pop().disconnect();
  }
}

const WFN = new WaitForNode();