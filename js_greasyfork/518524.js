// ==UserScript==
// @name         InterfolioNewliner
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show newlines in interfolio.
// @author       You
// @match        https://facultysearch.interfolio.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=interfolio.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518524/InterfolioNewliner.user.js
// @updateURL https://update.greasyfork.org/scripts/518524/InterfolioNewliner.meta.js
// ==/UserScript==

(function() {
    'use strict';

function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

//demo :
GM_addStyle(".intf-table-list-item-subtitle.ng-binding { white-space: pre-wrap; }");

})();