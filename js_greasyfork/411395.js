// ==UserScript==
// @name        Dark Scrollbar
// @namespace   https://github.com/jairjy
// @match       *://*/*
// @exclude     https://outlook.live.com/mail/*
// @exclude     https://discord.com/channels/*
// @exclude     https://web.whatsapp.com/*
// @exclude     https://app.slack.com/client/*
// @grant       none
// @version     1.7
// @author      JairJy
// @run-at       document-start
// @description  Changes the color of your scrollbar to fit your browser's dark theme.
// @downloadURL https://update.greasyfork.org/scripts/411395/Dark%20Scrollbar.user.js
// @updateURL https://update.greasyfork.org/scripts/411395/Dark%20Scrollbar.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.prepend(style);
}

addGlobalStyle('::-webkit-scrollbar { width: 15px; }');

addGlobalStyle('::-webkit-scrollbar-track { background: #3B3B3B; }');
 
addGlobalStyle('::-webkit-scrollbar-thumb { background: #777777; }');

addGlobalStyle('::-webkit-scrollbar-thumb:hover { background: #999999; }');