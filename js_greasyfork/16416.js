// ==UserScript==
// @name        news.israelinfo.co.il
// @namespace   http://news.israelinfo.co.il/
// @include     http://news.israelinfo.co.il/*
// @include     https://news.israelinfo.co.il/*
// @author	benipaz
// @version     4
// @description Remove all unnecessary blocks from page.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16416/newsisraelinfocoil.user.js
// @updateURL https://update.greasyfork.org/scripts/16416/newsisraelinfocoil.meta.js
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

GM_addStyle('.innertab {display:none !important;}');
GM_addStyle('#line {display:none !important;}');
GM_addStyle('#IIstringWrap {display:none !important;}');
GM_addStyle('.replCont {display:none !important;}');
GM_addStyle('#weatherBlock {display:none !important;}');
GM_addStyle('.mini-block {display:none !important;}');
GM_addStyle('.fblike-gplus {display:none !important;}');
GM_addStyle('.tag {display:none !important;}');
GM_addStyle('.orphus {display:none !important;}');
GM_addStyle('#left-col {display:none !important;}');
GM_addStyle('#right-col {display:none !important;}');
GM_addStyle('footer {display:none !important;}');
GM_addStyle('.tbline {display:none !important;}');
GM_addStyle('.pluso {display:none !important;}');
GM_addStyle('#content {width:100% !important;}');