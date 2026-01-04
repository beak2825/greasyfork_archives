// ==UserScript==
// @name         coze布局调整工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调整coze界面为两栏式
// @author       DengXinWei
// @match        https://www.coze.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491403/coze%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/491403/coze%E5%B8%83%E5%B1%80%E8%B0%83%E6%95%B4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
//     'use strict';
    setInterval(function() {
    let element = document.querySelector('.sidesheet-container.qrPNrOyVEBA326VHThBn');
    if(element) {
		element.style.gridTemplateColumns='0fr 6fr 20fr';
        clearInterval(element);// 元素找到后清除定期检查
    }
}, 1000);
})();