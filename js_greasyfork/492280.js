// ==UserScript==
// @name         【🫡🫡NBZX】超星学习通扫码绕过🔫（使用前先看说明）
// @namespace    nbzx
// @version      2024-4-13-v2
// @description  超星学习通扫码绕过，进入课程只需扫一次码采集一次人脸即可。
// @author       nbzx
// @match        *://*.chaoxing.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492280/%E3%80%90%F0%9F%AB%A1%F0%9F%AB%A1NBZX%E3%80%91%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%AB%E7%A0%81%E7%BB%95%E8%BF%87%F0%9F%94%AB%EF%BC%88%E4%BD%BF%E7%94%A8%E5%89%8D%E5%85%88%E7%9C%8B%E8%AF%B4%E6%98%8E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/492280/%E3%80%90%F0%9F%AB%A1%F0%9F%AB%A1NBZX%E3%80%91%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%89%AB%E7%A0%81%E7%BB%95%E8%BF%87%F0%9F%94%AB%EF%BC%88%E4%BD%BF%E7%94%A8%E5%89%8D%E5%85%88%E7%9C%8B%E8%AF%B4%E6%98%8E%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndRemoveDivs() {
        const selectors = [
            'div.popDiv1.wid640.popClass.faceRecognition_0',
            'div.maskDiv1',
            'div.maskDiv1.__web-inspector-hide-shortcut__'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(div => {
                if(div.parentNode) {
                    div.parentNode.removeChild(div);
                }
            });
        });
    }

 
    function autoplayVideos() {
        document.querySelectorAll('div video').forEach(video => {
            if (video.readyState >= 3) {
                video.play().catch(e => {
                    console.error('Auto-play failed:', e);
                });
            }
        });
    }

    
    const observer = new MutationObserver(mutations => {
        let shouldCheckDivs = false;
        let shouldAutoplayVideos = false;

        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                shouldCheckDivs = true;
                shouldAutoplayVideos = true;
            }
        });

        if (shouldCheckDivs) {
            checkAndRemoveDivs();
        }

        if (shouldAutoplayVideos) {
            autoplayVideos();
        }
    });

    
    observer.observe(document.body, { childList: true, subtree: true });

    
    checkAndRemoveDivs();
    autoplayVideos();
})();
