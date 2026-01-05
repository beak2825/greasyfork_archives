// ==UserScript==
// @name         券妈妈消跳转
// @name:zh-CN   券妈妈消跳转
// @namespace    mudan_cn
// @version      0.11
// @description:zh-cn  券妈妈领优惠券地址消除跳转
// @description  发个脚本破事真他妈多，好烦！   
// @author       mudan_cn
// @match        *://www.quanmama.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23633/%E5%88%B8%E5%A6%88%E5%A6%88%E6%B6%88%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/23633/%E5%88%B8%E5%A6%88%E5%A6%88%E6%B6%88%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

$(function(){
    $('body').on('click','a:contains(直达链接),a:contains(点击领)',function(e){e.stopImmediatePropagation();});
});