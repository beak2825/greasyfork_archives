// ==UserScript==
// @name         sponsorskip btn
// @namespace    gjwse90gj98we
// @version      1
// @description  hide button
// @author       anon
// @match        https://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/393014/sponsorskip%20btn.user.js
// @updateURL https://update.greasyfork.org/scripts/393014/sponsorskip%20btn.meta.js
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

(function() {
    'use strict';
    addGlobalStyle('#startSponsorButton { display: none; }');
    addGlobalStyle('div[id^=sponsorSkipNotice] { display: none; }')
    var root = document.getElementsByTagName( 'html' )[0];
})();








//var noticediv = document.querySelector('div[id^=sponsorSkipNotice]');