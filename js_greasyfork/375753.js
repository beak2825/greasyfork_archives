// ==UserScript==
// @name         Smallpdf 解除使用限制
// @namespace    https://limx.win/post/technology/smallpdf_crack
// @version      1.3
// @description  解除 smallpdf.com 免费用户每小时只能使用两次的限制
// @author       WingLim
// @supportURL      https://limx.win/post/technology/smallpdf_crack
// @contributionURL https://limx.win/post/technology/smallpdf_crack
// @match        *://smallpdf.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375753/Smallpdf%20%E8%A7%A3%E9%99%A4%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/375753/Smallpdf%20%E8%A7%A3%E9%99%A4%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.removeItem("usage"); //删除usage
    var interval = 10000;//间隔时间，单位为毫秒
    setInterval(function(){
        if(localStorage.usage){//检测是否存在usage，是则删除
            localStorage.removeItem('usage');
        }
    },interval);
})();