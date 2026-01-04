// ==UserScript==
// @name        Pocket direct links
// @version     5.0.1
// @namespace   http://www.agj.cl/
// @description Clicking on an item directly opens the website, not the Pocket reader.
// @license     Unlicense
// @match       *://getpocket.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39538/Pocket%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/39538/Pocket%20direct%20links.meta.js
// ==/UserScript==

const onLoad = (cb) =>
  /interactive|complete/.test(document.readyState)
    ? setTimeout(cb, 0)
    : document.addEventListener("DOMContentLoaded", cb);
const sel = document.querySelector.bind(document);
const selAll = document.querySelectorAll.bind(document);
const onChanged = (el, cb) => {
  if (!el) throw `onChanged: No element passed.`;
  if (!cb) throw `onChanged: No callback passed.`;
  const observer = new MutationObserver(cb);
  observer.observe(el, { childList: true, subtree: true });
  return observer.disconnect.bind(observer);
};

const attrFixedFlag = "data-link-fixed-agj";
const getUrl = (el) => el.querySelector("a.publisher").getAttribute("href");

onLoad(() => {
  // Actual link fixing.

  const fix = () => {
    Array.from(document.querySelectorAll("article")).forEach(fixOne);
  };

  const fixOne = (el) => {
    const url = getUrl(el);
    if (!el.getAttribute(attrFixedFlag)) {
      const links = el.querySelectorAll(".content .title a, .cardWrap a");
      links.forEach((linkEl) => linkEl.setAttribute("href", url));
      el.setAttribute(attrFixedFlag, true);
    }
  };

  // Fix when links added.

  onChanged(sel("#__next"), fix);
  fix();

  // Fix when history state changed.

  const pushState = history.pushState.bind(history);
  const replaceState = history.replaceState.bind(history);
  const locationChanged = () => {
    fix();
  };

  history.pushState = (...args) => {
    pushState(...args);
    locationChanged();
  };
  history.replaceState = (...args) => {
    replaceState(...args);
    locationChanged();
  };

  window.addEventListener("popstate", locationChanged);
});
