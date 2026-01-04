// ==UserScript==
// @name         手机版移除知乎 App 下载
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @description  移除知乎 App 下载，自动取消下载提示
// @author       sl00p
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/397521/%E6%89%8B%E6%9C%BA%E7%89%88%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%20App%20%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/397521/%E6%89%8B%E6%9C%BA%E7%89%88%E7%A7%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%20App%20%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let autoClickBrowser = function() {
        let btnList = ["ModalWrap-itemBtn"];
        for(let idx = 0; idx < btnList.length; ++idx) {
            let btn = document.getElementsByClassName(btnList[idx]);
            if(btn && btn.length > 1 && window.location.pathname !== "/") {
                btn[1].click();
            }
        }
    };
    let autoClickReader = function() {
        let richContent = document.getElementsByClassName('RichContent-inner RichContent-inner--collapsed');
        let expandButton = document.getElementsByClassName('Button ContentItem-rightButton ContentItem-expandButton Button--plain');
        if(richContent && richContent.length > 0) {
            richContent[0].setAttribute("style", "max-height: 100%;");
            richContent[0].setAttribute("class", "null");
        }
        if(expandButton && expandButton.length > 0) {
            expandButton[0].remove();
        }
    };
    let removeAds = function() {
        let funList = ["Card DownloadGuide DownloadGuide-block", "DownloadGuide-inner",
                       "Card DownloadGuide DownloadGuide-block DownloadGuide-block--active", "Card ViewAllInappCard",
                       "OpenInAppButton OpenInApp is-shown", "Button Button--primary Button--blue", "Card TopstoryItem TopstoryItem--advertCard",
                       "MBannerAd", "OpenInAppButton OpenInApp css-1svfsgz-OpenInAppButton", "OpenInAppButton OpenInApp css-cazai8",
                       "OpenInAppButton  css-cazai8"];
        for(let idx = 0; idx < funList.length; ++idx) {
            let nodes = document.getElementsByClassName(funList[idx]);
            for(let jdx = 0; jdx < nodes.length; ++jdx) {
                if(nodes[jdx] !== undefined) {
                    nodes[jdx].remove();
                }
            }
        }
    };
    let inter = setInterval(function() {
        if(window.location.href.indexOf("oia") > 0) {
            // window.history.back()
        }
        let mainApp = document.getElementsByClassName("Button css-183aq3r Button--blue");
        for(let idx = 0; idx < mainApp.length; ++idx) {
            mainApp[idx].href = "";
            mainApp[idx].innerText = "不上知乎?";
        }
        removeAds();
        autoClickBrowser();
        autoClickReader();
    }, 500);
})();