// ==UserScript==
// @name         南阳师范学院自动评教
// @namespace    http://tampermonkey.net/
// @version      2025-6-3
// @description  自动执行评教流程
// @author       xiaoning
// @match        http://nysyjw.nynu.edu.cn/nysfjw/frame/homes.actions?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nynu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521584/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/521584/%E5%8D%97%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检测iframe是否出现并执行操作
    function monitorIframeAndOperate(iframeId, callback) {
        const iframe = document.getElementById(iframeId);
        if (iframe) {
            iframe.onload = function() {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                callback(iframeDocument);
            };
            // 确保iframe加载完成
            if (iframe.contentWindow.document.readyState === 'complete') {
                iframe.onload();
            } else {
                iframe.addEventListener('load', iframe.onload);
            }
        } else {
            setTimeout(() => monitorIframeAndOperate(iframeId, callback), 500);
        }
    }


    // 自动执行评价流程
    function autoEvaluate() {
        // 监测iframe出现并执行操作
        monitorIframeAndOperate('dialog-frame', function(iframeDocument) {
            // 在iframe内执行操作
            iframeDocument.querySelector("#pjxx0 > label:nth-child(2)").click();
            iframeDocument.querySelector("#pjxx1 > label:nth-child(2)").click();
            iframeDocument.querySelector("#pjxx2 > label:nth-child(2)").click();
            iframeDocument.querySelector("#pjxx3").click();
            iframeDocument.querySelector("#wdt_3_0_1").click();
            iframeDocument.querySelector("#wdt_4_0_1").click();
            iframeDocument.querySelector("#wdt_5_0_1").click();
            iframeDocument.querySelector("#wdt_6_0_1").click();
            iframeDocument.querySelector("#wdt_7_0_1").click();
            iframeDocument.querySelector("#wdt_8_0_1").click();
            iframeDocument.querySelector("#wdt_9_0_1").click();

           // 延迟3秒后提交表单
            setTimeout(() => {
                iframeDocument.querySelector("#butSave").click();
            }, 2000);
        });

    }

    // 执行自动评价流程
    autoEvaluate();
})();