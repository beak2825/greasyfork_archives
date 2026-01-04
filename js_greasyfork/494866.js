// ==UserScript==
// @name         yxlearning-济宁专业技术人员继续教育-济宁职业技术学院专技人员 
// @namespace    ************** 
// @version      0.1
// @description  济宁市专业技术人员继续教育脚本
// @author       542714117
// @match        *://sdjn-gxk.yxlearning.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494866/yxlearning-%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E6%B5%8E%E5%AE%81%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/494866/yxlearning-%E6%B5%8E%E5%AE%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E6%B5%8E%E5%AE%81%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98.meta.js
// ==/UserScript==
(function (){
    //设置20秒循环判断是否学完是否检测挂机
    setInterval(function (){
        var b = new Date();
        var mytime=b.toLocaleTimeString();
        console.log(mytime);
        let test=document.querySelector('#ccJumpOver');
        if( test){console.log('挂机检测');test.click()};
    }, 20000);
})();
