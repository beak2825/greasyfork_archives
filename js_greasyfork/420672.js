// ==UserScript==
// @name         清除epubee广告条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清除在下方遮挡epubee阅读器的VIP广告条
// @author       You
// @match        http://reader.epubee.com/books/mobile/f*/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420672/%E6%B8%85%E9%99%A4epubee%E5%B9%BF%E5%91%8A%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/420672/%E6%B8%85%E9%99%A4epubee%E5%B9%BF%E5%91%8A%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
//     $(".reader-to-vip c-pointer").remove();
//     网上抄的,稍改了一点,不知道好不好,反正能用
    var paras = document.getElementsByClassName('reader-to-vip c-pointer');
    for(var i=0;i<paras.length;i++){
        //删除元素 元素.parentNode.removeChild(元素);
        if (paras[i] != null)
        {
            paras[i].parentNode.removeChild(paras[i]);
        }
    }
})();