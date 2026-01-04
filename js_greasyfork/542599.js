// ==UserScript==
// @name         組織人力查詢(欄位調整)及顯示員工編號
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  欄位調整及顯示員工編號
// @author       Shanlan
// @match        http*://ssodspro.cht.com.tw/new_chtds/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cht.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542599/%E7%B5%84%E7%B9%94%E4%BA%BA%E5%8A%9B%E6%9F%A5%E8%A9%A2%28%E6%AC%84%E4%BD%8D%E8%AA%BF%E6%95%B4%29%E5%8F%8A%E9%A1%AF%E7%A4%BA%E5%93%A1%E5%B7%A5%E7%B7%A8%E8%99%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/542599/%E7%B5%84%E7%B9%94%E4%BA%BA%E5%8A%9B%E6%9F%A5%E8%A9%A2%28%E6%AC%84%E4%BD%8D%E8%AA%BF%E6%95%B4%29%E5%8F%8A%E9%A1%AF%E7%A4%BA%E5%93%A1%E5%B7%A5%E7%B7%A8%E8%99%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 調整框架行和列比例，但排除指定URL
    if (!window.location.href.includes("affiliate.jsp")) {
        var InputH = document.getElementsByTagName("frameset")[0];
        var InputW = document.getElementsByTagName("frameset")[1];
        if (InputH) {
            InputH.setAttribute('rows', '15%, *');
        }
        if (InputW) {
            InputW.setAttribute('cols', '16.5%, *');
        }
    }

    // 顯示員工編號的函式
    function showPersonId(img) {
        // 避免重複插入
        if (img.dataset.personidShown) return;
        const id = img.getAttribute("id");
        if (!id || !id.startsWith("personid")) return;
        const truncatedId = id.substring(8);
        const textElement = document.createElement("span");
        textElement.style.fontSize = "10pt";
        textElement.textContent = truncatedId;
        img.parentNode.insertBefore(textElement, img.nextSibling);
        img.dataset.personidShown = "1";
    }

    // 初始載入時處理一次
    function processAll() {
        document.querySelectorAll("img[id^='personid']").forEach(showPersonId);
    }

    // 監聽 DOM 變化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // ELEMENT_NODE
                    if (node.matches && node.matches("img[id^='personid']")) {
                        showPersonId(node);
                    }
                    // 若有子孫節點也要處理
                    node.querySelectorAll && node.querySelectorAll("img[id^='personid']").forEach(showPersonId);
                }
            });
        });
    });

    // 啟動監聽
    observer.observe(document.body, { childList: true, subtree: true });

    // 頁面初始時先處理一次
    processAll();

})();
