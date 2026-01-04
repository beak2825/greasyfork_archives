// ==UserScript==
// @name        文献部落
// @namespace    http://459.org/
// @version      1.0.1
// @description  文献部落取消弹窗
// @author       Daniel
// @home-url	 https://greasyfork.org/zh-CN/scripts/452925-%E6%96%87%E7%8C%AE%E9%83%A8%E8%90%BD
// @match        *://459.org/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452925/%E6%96%87%E7%8C%AE%E9%83%A8%E8%90%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/452925/%E6%96%87%E7%8C%AE%E9%83%A8%E8%90%BD.meta.js
// ==/UserScript==
 
(function() {
 
        if(!localStorage.getItem('mydata')){
            localStorage.setItem('mydata',30)   
        }   
})();