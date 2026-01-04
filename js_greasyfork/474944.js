// ==UserScript==
// @name         广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.3.7
// @update       2023.09.10
// @description  自用，测试
// @author       jolly
// @run-at document-body
// @license GPL
// @match http*://www.jianpian6.co/
// @match http*://www.cnblogs.com/*
// @match http*://www.wn01.uk/*
// @downloadURL https://update.greasyfork.org/scripts/474944/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/474944/%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
 
//屏蔽列表
  var jianpian = RegExp("http.*://www.jianpian6.co/.*");
(function() {
    if(jianpian.test(location.href)){//测试
        //右下角屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#HMRichBox,#pop_ad,#HMCOVER_ID1,.header-banner{display:none !important;}</style>');
        //左右横幅屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#HMcoupletDivleft,#HMcoupletDivright{display:none !important;}</style>');
         console.log('广告屏蔽:........');
 
    }else{
        //右下角屏蔽
        document.head.insertAdjacentHTML('beforeend','<style>#ckrppt,.dlh{display:none !important;}</style>');
        console.log('广告屏蔽:无匹配');
    }
})();