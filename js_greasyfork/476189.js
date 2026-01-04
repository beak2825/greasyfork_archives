// ==UserScript==
// @name         CleanChat Kick
// @namespace    https://gge.gg
// @version      0.1
// @description  Cleaner chat on kick
// @author       SomeGuy
// @match        https://kick.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/476189/CleanChat%20Kick.user.js
// @updateURL https://update.greasyfork.org/scripts/476189/CleanChat%20Kick.meta.js
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
GM_addStyle("\
            .chat-entry {margin-left: 5px; \
    margin-right: 0.375rem;\
    min-height: 28px;\
    border-radius: 4px;\
    padding: 4px 10px;\
    font-size: .875rem;\
    line-height: 1.25rem;\
    font-weight: 500;\
    font-size: 12px;\
    background: #ffffff0a;}\
 ");



})();