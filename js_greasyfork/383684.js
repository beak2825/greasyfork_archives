// ==UserScript==
// @author       Gocc
// @version      1.0
// @name         什么值得买自动签到
// @namespace    什么值得买自动签到
// @description  张大妈自动签到脚本,smzdm首页自动签到
// @icon         https://www.smzdm.com/favicon.ico
// @match        http*://*.smzdm.com/*
// @downloadURL https://update.greasyfork.org/scripts/383684/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/383684/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    var sign =document.querySelector('.J_punch');//获取签到按钮
    var text =sign.innerText;//获取签到文字
    if(text.indexOf('签到领奖')!=-1){//签 = 0
        sign.click();
    }
})();