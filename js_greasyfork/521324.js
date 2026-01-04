// ==UserScript==
// @name         TF2 Comic Image Fix
// @version      2024-12-20
// @license      MIT 
// @description  Fixes image stretching on fullscreen
// @author       Ben Brady
// @match        https://www.teamfortress.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=teamfortress.com
// @grant        none
// @namespace https://greasyfork.org/users/782714
// @downloadURL https://update.greasyfork.org/scripts/521324/TF2%20Comic%20Image%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/521324/TF2%20Comic%20Image%20Fix.meta.js
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

    GM_addStyle(".cvImg {   object-fit: contain; }");
})();