// ==UserScript==
// @name         电子发烧友不登录浏览
// @namespace    http://tampermonkey.net/
// @version      v0.2.1
// @description  自动全文阅读
// @author       Rehtt
// @match        http://www.elecfans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420942/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E4%B8%8D%E7%99%BB%E5%BD%95%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/420942/%E7%94%B5%E5%AD%90%E5%8F%91%E7%83%A7%E5%8F%8B%E4%B8%8D%E7%99%BB%E5%BD%95%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==
function seeHide(){
    $('.seeHide').css('display','none');
    $('.seeHide').prev().css('height','100%');
}
(function(){
    $('.seeHide').on('click',function(){
        seeHide();
    })
})

$(window).load(function(){
    seeHide();
});
