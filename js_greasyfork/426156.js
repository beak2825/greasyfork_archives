// ==UserScript==
// @name         Change Verge Font
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Change the font on The Verge.
// @author       You
// @match        https://www.theverge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426156/Change%20Verge%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/426156/Change%20Verge%20Font.meta.js
// ==/UserScript==

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

(function() {
    'use strict';
    GM_addStyle('* { font-family: Arial, Helvetica, sans-serif; } ');
})();