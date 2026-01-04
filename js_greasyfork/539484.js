// ==UserScript==
// @name m.inftab.com custom background
// @namespace http://tampermonkey.net/
// @version 0.4
// @description custom background for m.inftab.com
// @author Stijn Bousard | boossy
// @license MIT
// @match https://m.inftab.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/539484/minftabcom%20custom%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/539484/minftabcom%20custom%20background.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
 var head, style;
 head = document.getElementsByTagName('head')[0];
 if (!head) { return; }
 style = document.createElement('style');
 style.type = 'text/css';
 style.innerHTML = css;
 head.appendChild(style);
}
addGlobalStyle('.home-wallpaper[data-v-27c40fbb] { background-image: url(https://bsy.boossy.be/img/myBackground.jpg) !important; background-size: cover; background-position: 50%; }');
addGlobalStyle('.home-icon-item .icon-name[data-v-74c35cb7] { font-size: 8px; color: rgb(221, 221, 221); }');
addGlobalStyle('.home-wallpaper .wallpaper-container>.bg-wallpaper[data-v-27c40fbb] { background-image: none; }');