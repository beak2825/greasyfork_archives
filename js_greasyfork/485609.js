// ==UserScript==
// @name         yunxuetang禁用弹窗
// @namespace    https://greasyfork.org/zh-CN/scripts/485609-yunxuetang%E7%A6%81%E7%94%A8%E5%BC%B9%E7%AA%97
// @version      1.0.1
// @description  轻松学习无压力
// @author       JackyYe
// @match        https://jxxy.yunxuetang.cn/kng/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485609/yunxuetang%E7%A6%81%E7%94%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/485609/yunxuetang%E7%A6%81%E7%94%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(function () {
    try{
        const AlertButton = document.getElementsByClassName('yxtf-button yxtf-button--primary yxtf-button--large');
        AlertButton[0].click();
    }
    catch{
    }
    try{
    const LearnButton = document.getElementsByClassName('yxtf-button yxtf-button--primary yxtf-button--larger');
    LearnButton[0].click();
    }
    catch{
    }
}, 2000)
    console.log('轻松学习无压力')
})();