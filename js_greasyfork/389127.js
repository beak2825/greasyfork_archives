// ==UserScript==
// @name         bilibili超链接不新开标签页直接在当前页面打开
// @namespace    EtfB2XVPmbThEv39bdxQR2hzid30iMF9
// @version      0.3
// @description  bilibili超链接不新开标签页直接在当前页面打开，外加移除下载app的广告条
// @author       tomoya
// @include      https://*.bilibili.com*
// @exclude     https://t.bilibili.com*
// @exclude     https://message.bilibili.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389127/bilibili%E8%B6%85%E9%93%BE%E6%8E%A5%E4%B8%8D%E6%96%B0%E5%BC%80%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%9B%B4%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/389127/bilibili%E8%B6%85%E9%93%BE%E6%8E%A5%E4%B8%8D%E6%96%B0%E5%BC%80%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%9B%B4%E6%8E%A5%E5%9C%A8%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  'use strict';

    setInterval(function() {
        let aEles = document.getElementsByTagName("a");
        removeTarget(aEles);

        let appDownloadDiv = document.getElementById("fixed_app_download");
        if (appDownloadDiv) {
            appDownloadDiv.parentNode.removeChild(appDownloadDiv);
        }

    }, 200);

    function removeTarget(aEles) {
        for(let i = 0; i < aEles.length; i++) {
             aEles[i].removeAttribute("target");
        }
    }
})();