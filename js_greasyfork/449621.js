// ==UserScript==
// @name         CSDN免登录复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CSDN不用登录就可以复制
// @author       可爱的草莓君
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449621/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/449621/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取代码块
let codes = document.querySelectorAll("code");
codes.forEach(c =>{
    c.contentEditable = "true";
});
})();