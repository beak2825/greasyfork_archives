// ==UserScript==
// @name         gladiatus text amplifier
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  use gladiatus with a better ui!
// @author       You
// @grant        GM_addStyle
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include     *://*.gladiatus.*
// @downloadURL https://update.greasyfork.org/scripts/444759/gladiatus%20text%20amplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/444759/gladiatus%20text%20amplifier.meta.js
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
    console.log("applied css");
    GM_addStyle('.show-item-quality [data-level]::before { font-size: 16px !important; font-family: initial; }');
})();