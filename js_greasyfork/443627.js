// ==UserScript==
// @name         使niceso更便捷的打开阿里云盘
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  免去阿里云盘登录账户、可以直接打开阿里云盘APP、去除分享弹窗
// @author       zyaa
// @match        *://www.niceso.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/443627/%E4%BD%BFniceso%E6%9B%B4%E4%BE%BF%E6%8D%B7%E7%9A%84%E6%89%93%E5%BC%80%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/443627/%E4%BD%BFniceso%E6%9B%B4%E4%BE%BF%E6%8D%B7%E7%9A%84%E6%89%93%E5%BC%80%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏详情页分享弹窗
    var shareBoxElement = document.getElementsByClassName("share-box")[0];
    setTimeout(() => {
        shareBoxElement.setAttribute('style', 'display: none;');
    }, 1500);

    // 打开阿里云盘APP
    var urls = document.getElementsByClassName("item-detail-urls");
    var aNode = document.createElement("button");
       aNode.innerHTML = "打开阿里云盘";
    aNode.setAttribute('class', 'btn-full');
    aNode.setAttribute('style', 'margin-left:10px;');
    var rawUrl = document.getElementsByClassName('btn-full')[0].getAttribute("data-url");
    var atobUrl = atob(rawUrl);
    var shareId = atobUrl.substr(atobUrl.indexOf("/s/") + 3, atobUrl.length);
    aNode.addEventListener("click", function () {
        var openUrl = `https://www.aliyundrive.com/applink?app_url=smartdrive://share/browse?shareId=${shareId}&sharePwd=&click_position=page_sharing_top&source_address=Page_sharing_file&source_type=scheme`;
        window.open(openUrl);
    })
    urls[0].appendChild(aNode);
})();