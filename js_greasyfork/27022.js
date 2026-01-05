// ==UserScript==
// @name         百度网盘自定义文件分享密码
// @namespace    undefined
// @version      0.1
// @description  百度网盘分享文件时弹出窗口自定义文件分享密码
// @author       Vizards
// @match        https://pan.baidu.com/disk/home
// @match        http://pan.baidu.com/*
// @match        https://pan.baidu.com/*
// @match        http://yun.baidu.com/*
// @match        https://yun.baidu.com/*
// @match        https://eyun.baidu.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27022/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/27022/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%87%E4%BB%B6%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {

    function setPassword() {
        if (document.getElementById('share')) {
            require(["function-widget-1:share/util/service/createLinkShare.js"]).prototype.makePrivatePassword=function(){return prompt("请输入自定义的密码","ymcs");};
        } else {
            return false;
        }
    }

    window.setInterval(setPassword, 1000);
})();