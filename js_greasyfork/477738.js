// ==UserScript==
// @name         知乎屏蔽带货链接
// @namespace    龙风
// @version      0.1
// @description  浏览知乎时，屏蔽京东带货链接
// @author       龙风
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477738/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E5%B8%A6%E8%B4%A7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/477738/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E5%B8%A6%E8%B4%A7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    function zhihu_hideJD(){
        var ads = document.getElementsByClassName("RichText-MCNLinkCardContainer");
        for (var i=0; i<ads.length; i++)
        {
            ads[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
        }
        setTimeout(function() { zhihu_hideJD(); }, 1000);
    }
 
    zhihu_hideJD();
})();