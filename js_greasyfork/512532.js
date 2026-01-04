// ==UserScript==
// @name         自動替換標題與內容中的日期為當前日期
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動將 [date] 替換成當前日期
// @author       Scott
// @match        *://bbs.ngacn.cc/*.php*
// @match        *://ngabbs.com/*.php*
// @match        *://nga.178.com/*.php*
// @match        *://bbs.nga.cn/*.php*
// @match        *://g.nga.cn/*
// @match        *://forum.gamer.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512532/%E8%87%AA%E5%8B%95%E6%9B%BF%E6%8F%9B%E6%A8%99%E9%A1%8C%E8%88%87%E5%85%A7%E5%AE%B9%E4%B8%AD%E7%9A%84%E6%97%A5%E6%9C%9F%E7%82%BA%E7%95%B6%E5%89%8D%E6%97%A5%E6%9C%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/512532/%E8%87%AA%E5%8B%95%E6%9B%BF%E6%8F%9B%E6%A8%99%E9%A1%8C%E8%88%87%E5%85%A7%E5%AE%B9%E4%B8%AD%E7%9A%84%E6%97%A5%E6%9C%9F%E7%82%BA%E7%95%B6%E5%89%8D%E6%97%A5%E6%9C%9F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定義日期格式，這裡使用 MM/DD 格式
    function getCurrentDate() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}/${day}`;
    }

    // 替換 [date] 為當前日期的函數
    function replaceDateInElement(element) {
        if (element && element.innerHTML.includes('[date]')) {
            element.innerHTML = element.innerHTML.replace(/\[date\]/g, getCurrentDate());
        }
    }

    // 定時檢查標題、內文和 iframe 是否有 [date] 並進行替換
    function checkAndReplaceDate() {
        const inputElement = document.querySelector('#post_subject');
        const textareaElement = document.querySelector('textarea[name="post_content"]');
        const iframe = document.querySelector('#editor');

        // 替換標題中的 [date]
        if (inputElement) {
            replaceDateInElement(inputElement);
        }

        // 替換內文中的 [date]
        if (textareaElement) {
            replaceDateInElement(textareaElement);
        }

        // 替換 iframe 中的 [date]
        if (iframe && iframe.contentDocument) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const iframeBody = iframeDocument.querySelector('body.editstyle');
            if (iframeBody) {
                replaceDateInElement(iframeBody);
            }
        }
    }

    // 每隔 1 秒檢查一次內容
    setInterval(checkAndReplaceDate, 1000);
})();