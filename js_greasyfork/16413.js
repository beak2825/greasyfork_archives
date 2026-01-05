// ==UserScript==
// @name        il24.ru
// @namespace   http://il24.ru
// @include     http://il24.ru/*
// @version     1
// @grant       none
// @author	    benipaz
// @description Remove all unnecessary blocks from page.
// @downloadURL https://update.greasyfork.org/scripts/16413/il24ru.user.js
// @updateURL https://update.greasyfork.org/scripts/16413/il24ru.meta.js
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

GM_addStyle('.main_right_col {display:none !important;}');
GM_addStyle('.right {display:none !important;}');
GM_addStyle('.related_news_block {display:none !important;}');
GM_addStyle('.left {width:100% !important;}');
GM_addStyle('.main_content_col {width:100% !important;}');