// ==UserScript==
// @name        nnm.me
// @namespace   http://nnm.me
// @include     http://nnm.me/*
// @include     http://nnm2.com/*
// @include     http://mynnm.ru/*
// @include     http://itog.info/*
// @include     http://123box.ru/*
// @version     8
// @grant       none
// @author	benipaz
// @description Remove all unnecessary blocks from page.
// @downloadURL https://update.greasyfork.org/scripts/16420/nnmme.user.js
// @updateURL https://update.greasyfork.org/scripts/16420/nnmme.meta.js
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

GM_addStyle('.pb0 {display:none !important;}');
GM_addStyle('#sidebar {display:none !important;}');
GM_addStyle('#content {margin-left:0px !important; width:100% !important;}');
GM_addStyle('.similar-news {display:none !important;}');
GM_addStyle('.social {display:none !important;}');
GM_addStyle('.comments_list {display:none !important;}');
GM_addStyle('.bar.clearfix {display:none !important;}');
GM_addStyle('#comments {display:none !important;}');
GM_addStyle('#foot {display:none !important;}');
GM_addStyle('#sidebar div.user-menu {display:none !important;}');
GM_addStyle('.likely-box {display:none !important;}');
GM_addStyle('.relap {display:none !important;}');
GM_addStyle('#adbg {display:none !important;}');
GM_addStyle('.box {display:none !important;}');

var panel = document.querySelector("#scrollPanel");
var menu = document.querySelector("#sidebar form.login");
panel.appendChild(menu);