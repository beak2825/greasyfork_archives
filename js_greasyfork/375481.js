// ==UserScript==
// @name         Shorten Medium URL
// @namespace    https://github.com/FlandreDaisuki
// @version      0.1
// @description  Shorten URL in medium.com
// @author       FlandreDaisuki
// @match        https://medium.com/*
// @grant        none
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375481/Shorten%20Medium%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/375481/Shorten%20Medium%20URL.meta.js
// ==/UserScript==

const shorten = () => {
  if (location.pathname.match(/^\/([^/]*)\/.*-(\w+)$/)) {
    const url = new URL(location.href);
    url.search = '';
    url.pathname = url.pathname.replace(/^\/([^/]*)\/.*-(\w+)$/, '/$1/$2');

    history.replaceState({}, document.title, url.href.replace(url.origin, ''));
  }
};

window.observer = new MutationObserver(shorten);

window.addEventListener('load', shorten);

window.addEventListener('beforeunload', () => {
  window.observer.disconnect();
});

document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.getElementById('container');
  const config = { childList: true };
  window.observer.observe(rootEl, config);
});
