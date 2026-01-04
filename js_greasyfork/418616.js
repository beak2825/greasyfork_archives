// ==UserScript==
// @name         sex8
// @namespace    acp
// @version      1.0
// @description  sex8 AD remove
// @author       ACP
// @match        http*://mrituiasm.info/*
// @match        http*://luntannxnv.fun/*
// @match        https://duoduoxbx.fun/*
// @match        *://*/portal.html
// @match        *://*/thread-*
// @grant GM_log

// @grant GM_getResourceText

// @grant GM_addStyle

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418616/sex8.user.js
// @updateURL https://update.greasyfork.org/scripts/418616/sex8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = `
#loginasx
{
display:none;}
#info #logincon01,
#info #logincon02{
background:#ccc!important;
}
.b_oscar1,
.gd-list,
#ifocus,
.full.float-left12,
#carousel1,
.j-oscar,
.uk-block1-list1 .active-nav,.newsbanner
,.web-game-report,.zxy,
#forum_rules_149,.trioCarousel,.b_mu
{display:none}
#threadlist tbody{
display:none}
#separatorline ~tbody,#postlist tbody{
display:table-row-group;}
.b_pr,iframe,
.b_pr +div,.sign,.ad,.a_oscar,
.bm_c.cl.pbn
{display:none;}
.qd-top .qd-block ~.qd-block
{display:none!important;}
.text-ada,.uk-block3-list1,.hot-news-img,.hot-news-info{display:none;}
.tie-list li{width:50%!important;float:left;margin-bottom: 18px!important;}
.uk-block1-list2, .uk-block3-list2{width:890px!important;}
.vip-rank li,.hot-people{display:none;}
.hot-people, .vip-rank{height:auto!important;}
.vip-rank li:nth-child(4)~li{display:list-item;}

.content.margin-top10.clearfix +div,.floor-ad,
#fixed-bottom-modal,.V-video-float,.b_oscar1,#shortcut{display:none!important;}


`;
    var style=document.createElement("style");
    style.innerText=css;
    document.getElementsByTagName('head')[0].appendChild(style);


})();