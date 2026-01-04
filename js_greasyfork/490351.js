// ==UserScript==
// @name         InoReader follow inner links
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  Script for InoReader that allows to open links that are presented in the article. Press `:` (`;`) to focus a link, or press `'` (`"`) to focus previous ones. Press `[` (`{`) or `]` (`}`) to open selected link in a new tab.
// @author       Kenya-West
// @require      https://unpkg.com/hotkeys-js@3.13.7/dist/hotkeys.js
// @match        https://*.inoreader.com/feed*
// @match        https://*.inoreader.com/article*
// @match        https://*.inoreader.com/folder*
// @match        https://*.inoreader.com/starred*
// @match        https://*.inoreader.com/library*
// @match        https://*.inoreader.com/channel*
// @match        https://*.inoreader.com/teams*
// @match        https://*.inoreader.com/dashboard*
// @match        https://*.inoreader.com/pocket*
// @icon         https://inoreader.com/favicon.ico?v=8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490351/InoReader%20follow%20inner%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/490351/InoReader%20follow%20inner%20links.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.head.insertAdjacentHTML("beforeend", `<style>a:focus { outline: 2px solid white; }</style>`);

  let firstStart = true;
  let currentLinkIndex = 0;
  let links = []

  hotkeys('\:,\;', function (event, handler){
    event.preventDefault();
    if (links.length === 0 && currentLinkIndex === 0) {
      currentLinkIndex = -1; // because on first start we need to start from 0
    }

    links = getLinks();
    firstStart = false;
    if (links.length) {
      currentLinkIndex = (currentLinkIndex + 1) % links.length;
      links[currentLinkIndex]?.focus();
    }
  });

  hotkeys('\',\"', function (event, handler){
    // all the same as in previous code block but in reverse order
    event.preventDefault();
    links = getLinks();
    if (links.length) {
      currentLinkIndex = (currentLinkIndex - 1 + links.length) % links.length;
      links[currentLinkIndex]?.focus();
    }
  });

  hotkeys('\],\},\{,\[', function (event, handler){
    if (links.length) {
      links[currentLinkIndex]?.click();
    }
  });

  function getLinks() {
    const links = document.querySelectorAll('.article_content a');
    return links;
  }

})();