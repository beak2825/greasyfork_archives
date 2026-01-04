// ==UserScript==
// @name 微信公众号文章阅读模式
// @description 对微信公众号文章进行重新排版，方便阅读
// @author midpoint
// @version 1.0.7
// @grant none
// @noframes
// @include http://mp.weixin.qq.com/*
// @include https://mp.weixin.qq.com/*
// @include http*://*.weixin.qq.com/*
// @icon https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @namespace https://greasyfork.org/users/5506
// @downloadURL https://update.greasyfork.org/scripts/438529/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/438529/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
/*jshint multistr: true */

var styleEl = document.createElement('style');
styleEl.type = 'text/css';
styleEl.innerHTML = "\
.rich_media_area_primary_inner,.rich_media_area_extra_inner {max-width:90%;font-size:20px!important;}\
p,section,span[style] {font-size:20px!important;}\
.not_in_mm[style] .qr_code_pc_outer[style] {display: block!important;position: absolute;z-index: 9;}\
";

document.documentElement.appendChild(styleEl);