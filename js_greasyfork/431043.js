// ==UserScript==
// @name         允许 CSDN 不登录复制代码
// @namespace    romengine.com
// @version      0.1.1
// @description  不知道什么时候开始，CSDN 不登录不给复制代码了，于是写了几行代码解决问题，顺便去掉版权信息
// @author       You
// @match        *://*.csdn.net/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431043/%E5%85%81%E8%AE%B8%20CSDN%20%E4%B8%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/431043/%E5%85%81%E8%AE%B8%20CSDN%20%E4%B8%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = () => {
        // 取消复制事件冒泡
        var targets = document.querySelectorAll('div#article_content');
	    for(let i=0;i<targets.length;i++){
	  	    targets[i].oncopy=(e)=>{e.stopPropagation();};
	    }
        // 允许选中文本
        let process = el => {
            el.style.userSelect = 'initial'
        }
        let pres = document.querySelectorAll('pre').forEach(process)
        let codes = document.querySelectorAll('code').forEach(process)
    }
})();