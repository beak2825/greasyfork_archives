// ==UserScript==
// @name         QQ当前网页非官方页面自动跳转
// @namespace    https://greasyfork.org/zh-CN/scripts/438306/
// @version      2026.1.0
// @description  电脑QQ当前网页非官方页面自动跳转
// @author       Yong_Hu_Ming
// @match        https://c.pc.qq.com/*
// @icon         https://qzonestyle.gtimg.cn/qzone/qzact/act/external/tiqq/logo.png
// @grant        none
// @run-at       document-start
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/438306/QQ%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438306/QQ%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%E9%9D%9E%E5%AE%98%E6%96%B9%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCleanUrlParam(paramName) {
        let value = new URLSearchParams(window.location.search).get(paramName);
        if (value && value.toLowerCase().endsWith('//')) {
            return value.substring(0, value.length - 1);
        }
        return value;
    }

    let pfurl = getCleanUrlParam('pfurl');
    console.log("Detected pfurl:", pfurl);

    if (pfurl) {
        console.log("Redirecting via pfurl:", pfurl);
        window.location.replace(pfurl);
    } else {
        let url = getCleanUrlParam('url');
        console.log("Detected url:", url);

        if (url) {
            console.log("Redirecting via url:", url);
            window.location.replace(url);
        } else {
            console.log("No 'pfurl' or 'url' parameter found in the URL.");
            document.addEventListener('DOMContentLoaded', function () {
                const warningDiv = document.createElement('div');
                warningDiv.style.cssText = "position:fixed;top:0;left:0;right:0;padding:8px;background:#fff3cd;color:#856404;text-align:center;z-index:999999;";
                warningDiv.innerHTML = '官方更改导致跳转失败或无有效参数，请 <a href="https://greasyfork.org/zh-CN/scripts/438306" target="_blank" style="color:#856404;text-decoration:underline">更新插件</a>';
                document.body.insertAdjacentElement('afterbegin', warningDiv);
            });
        }
    }
})();