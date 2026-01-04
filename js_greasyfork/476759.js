// ==UserScript==
// @name inftab.com custom background
// @namespace http://tampermonkey.net/
// @version 0.6
// @description custom background for inftab.com
// @author Stijn Bousard | boossy
// @license MIT
// @match https://inftab.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/476759/inftabcom%20custom%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/476759/inftabcom%20custom%20background.meta.js
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
addGlobalStyle('.wallpaper.ready { background-image: url(https://bsy.boossy.be/img/myBackground.jpg) !important; }');
// addGlobalStyle('.wallpaper.ready { background-image: url(https://bsy.boossy.be/img/myBackground.jpg) !important; position: absolute; }');
// addGlobalStyle('.layer.layer { position: unset; }');
// addGlobalStyle('.step-loading.step-loading { display: none; }');
// addGlobalStyle('.step-error.step-error { display: none; }');
