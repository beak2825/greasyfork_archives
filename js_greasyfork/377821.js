// ==UserScript==
// @name         Visited Link Color for Dynasty Scans
// @version      0.2
// @author       warireku
// @description  Mark those yuri doujins you've already read with lighter blue color!
// @include      http://dynasty-scans.com/*
// @include      https://dynasty-scans.com/*
// @license      CC0; https://creativecommons.org/publicdomain/zero/1.0/legalcode
// @namespace https://greasyfork.org/users/237709
// @downloadURL https://update.greasyfork.org/scripts/377821/Visited%20Link%20Color%20for%20Dynasty%20Scans.user.js
// @updateURL https://update.greasyfork.org/scripts/377821/Visited%20Link%20Color%20for%20Dynasty%20Scans.meta.js
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
addGlobalStyle("#main a:visited:not(.label) {color:#006CCF !important;}");
addGlobalStyle("#main a:visited .title {color:#004C99 !important;}");