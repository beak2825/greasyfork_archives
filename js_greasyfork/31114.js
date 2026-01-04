// ==UserScript==
// @name        BILIBILI视频描述中的AV号链接的域名替换及脚本
// @namespace   bilibili_vdesc_exchange
// @description 对于不可解析域名acg.tv的用户，可用此脚本把acg.tv替换成www.bilibili.com/video
// @include     *://*.bilibili.*/video/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31114/BILIBILI%E8%A7%86%E9%A2%91%E6%8F%8F%E8%BF%B0%E4%B8%AD%E7%9A%84AV%E5%8F%B7%E9%93%BE%E6%8E%A5%E7%9A%84%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2%E5%8F%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/31114/BILIBILI%E8%A7%86%E9%A2%91%E6%8F%8F%E8%BF%B0%E4%B8%AD%E7%9A%84AV%E5%8F%B7%E9%93%BE%E6%8E%A5%E7%9A%84%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2%E5%8F%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var v_desc = document.querySelector('#v_desc');
var n_v_desc = v_desc.innerHTML.replace(/http:\/\/acg\.tv/g,'https://www.bilibili.com/video');
v_desc.innerHTML = n_v_desc;