// ==UserScript==
// @name    vue2文档大额头页面优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  vue2文档大额头页面优化,去掉vue2警告提示
// @author       小明
// @match        https://v2.cn.vuejs.org/v2/*
// @icon         https://v2.cn.vuejs.org/images/logo.svg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491061/vue2%E6%96%87%E6%A1%A3%E5%A4%A7%E9%A2%9D%E5%A4%B4%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491061/vue2%E6%96%87%E6%A1%A3%E5%A4%A7%E9%A2%9D%E5%A4%B4%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('v3-banner').remove();
    document.body.classList = [];
    if(document.getElementsByClassName('v3-warning').length !=0){
	document.getElementsByClassName('v3-warning')[0].remove();
    }
	
})();