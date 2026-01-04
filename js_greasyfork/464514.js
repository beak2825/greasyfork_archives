// ==UserScript==
// @name         guancha网排版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  guancha排版
// @author       foolmos
// @match        https://www.guancha.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464514/guancha%E7%BD%91%E6%8E%92%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464514/guancha%E7%BD%91%E6%8E%92%E7%89%88.meta.js
// ==/UserScript==
 
GM_addStyle(".left.left-main {width:70% !important;margin-left:14% !important;}");
GM_addStyle("li.right, .full_nav1, .editor.fix, .share, .comment-component, a.zhidu, a.go-center, a.go-post, .tab-control.list-order, .footer, .content-bottom-ad, .cmt-top-pic, #comments-container-kuang { display:none !important;}");
GM_addStyle("p { font-size:19px !important;line-height:2 !important;}");

 
(function() {
    'use strict';
 
    // Your code here...
})();