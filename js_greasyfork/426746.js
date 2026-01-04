// ==UserScript==
// @name         网页刷新
// @namespace    https://www.shegou.vip/
// @version      1.0.0
// @description  正在测试不要下载。。。
// @author       LMB
// @match        http://zsbks.sie.edu.cn/*
// @icon         https://qiniu.netzijin.cn/2021/03/20210228171854904.jpg
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426746/%E7%BD%91%E9%A1%B5%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/426746/%E7%BD%91%E9%A1%B5%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    window.setTimeout(function(){
	    window.location.reload();
    },3000);
})();