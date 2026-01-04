// ==UserScript==
// @name taobao patch
// @description 修复淘宝店铺‘所有分类’页面和店内搜索
// @namespace dggb Violentmonkey Scripts
// @include *.taobao.com/*
// @grant GM_setValue
// @grant GM_getValue
// @run-at document-end
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/35405/taobao%20patch.user.js
// @updateURL https://update.greasyfork.org/scripts/35405/taobao%20patch.meta.js
// ==/UserScript==
var notice_time=new Date().getHours();
if(notice_time!=GM_getValue('notice_time')){
  alert('taobao patch 脚本通知: 淘宝官方已经修复了店铺问题, 你现在可以尝试禁用taobao patch脚本. 如有问题可到百度firefox吧反馈.');
  GM_setValue('notice_time',notice_time);
}
var arr=['https://g.alicdn.com/shop/wangpu/1.9.5/init-async-min.js?t=20140523.js',/*修复　店铺首页图片*/
         'https://g.alicdn.com/shop/wangpu/1.9.5/init-min.js?t=20140523.js'/*修复　店铺'所有分类'页面和店内搜索功能*/
        ];
for(let i of arr){
var script=document.createElement('script');
script.src=i;
document.body.appendChild(script);
}