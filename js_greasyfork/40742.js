// ==UserScript==
// @name         降龙影院CSS改造
// @namespace    https://greasyfork.org/zh-CN/users/104201
// @version      0.1
// @description  对降龙影院CSS进行小调整,观看更舒适
// @author       黄盐
// @match        http://xlyy100.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40742/%E9%99%8D%E9%BE%99%E5%BD%B1%E9%99%A2CSS%E6%94%B9%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/40742/%E9%99%8D%E9%BE%99%E5%BD%B1%E9%99%A2CSS%E6%94%B9%E9%80%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_addStyle(`
.topall{position:absolute !important;}/*导航栏*/
div.ershiba{display:none !important;}/*淘宝天猫优惠券图片*/
div.wrap {padding-top:0px !important;}/*播放框上拉*/
`);
    // Your code here...
})();