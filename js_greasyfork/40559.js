// ==UserScript==
// @name        isrageo.com
// @namespace   http://www.isrageo.com/
// @include     http://www.isrageo.com/*
// @version     1
// @grant       none
// @author	    benipaz
// @description Remove all unnecessary blocks from page.
// @downloadURL https://update.greasyfork.org/scripts/40559/isrageocom.user.js
// @updateURL https://update.greasyfork.org/scripts/40559/isrageocom.meta.js
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

GM_addStyle('.td-banner-wrap-full {display:none !important;}');
GM_addStyle('.td-pb-span4 {display:none !important;}');
GM_addStyle('.wp-embedded-content {display:none !important;}');
GM_addStyle('.sharedaddy {display:none !important;}');
GM_addStyle('.post footer {display:none !important;}');
//GM_addStyle('.td_block_wrap {display:none !important;}');
GM_addStyle('.comments {display:none !important;}');
GM_addStyle('.td-more-articles-box {display:none !important;}');
GM_addStyle('.td-footer-wrapper {display:none !important;}');
GM_addStyle('.td-pb-span8  {width:100% !important;}');