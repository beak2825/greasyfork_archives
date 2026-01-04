// ==UserScript==
// @name        删除监测活动功能
// @namespace   a18zhizao
// @match       https://cdn.jlgwypx.gov.cn/course/202007*
// @grant       none
// @version     1.0
// @author      ccms
// @run-at      document-end
// @description 2020/8/18 下午2:54:23
// @downloadURL https://update.greasyfork.org/scripts/408977/%E5%88%A0%E9%99%A4%E7%9B%91%E6%B5%8B%E6%B4%BB%E5%8A%A8%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/408977/%E5%88%A0%E9%99%A4%E7%9B%91%E6%B5%8B%E6%B4%BB%E5%8A%A8%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

window.addEventListener('load',function(){
    console.info("1：----------------");
    console.info(EverySecondFunctionList);
    EverySecondFunctionList.shift();
    console.info("2：----------------");
    console.info(EverySecondFunctionList);
    console.info("去除监测活动完成。");  
})