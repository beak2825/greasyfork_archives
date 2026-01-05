// ==UserScript==
// @name        newsru.co.il
// @namespace   http://www.newsru.co.il/
// @include     http://www.newsru.co.il/*
// @include     http://newsru.co.il/*
// @version     5
// @grant       none
// @author	    benipaz
// @description Remove all unnecessary blocks from page.
// @downloadURL https://update.greasyfork.org/scripts/16419/newsrucoil.user.js
// @updateURL https://update.greasyfork.org/scripts/16419/newsrucoil.meta.js
// ==/UserScript==

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

GM_addStyle('.ad top_1250 {display:none !important;}');
GM_addStyle('.left-column {display:none !important;}');
GM_addStyle('.bottom {display:none !important;}');
GM_addStyle('.links-caption {display:none !important;}');
GM_addStyle('.theme-link {display:none !important;}');
GM_addStyle('.ad.topick_240 {display:none !important;}');
GM_addStyle('.plashka {display:none !important;}');
GM_addStyle('.testnews {display:none !important;}');
GM_addStyle('.nr-big-wrap {display:none !important;}');
GM_addStyle('#main {margin-left:0px !important; width:100% !important;}');
GM_addStyle('.news-body .main-news-body  {width:100% !important;}');