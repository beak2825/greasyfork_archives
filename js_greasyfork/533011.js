// ==UserScript==
// @name         [Shift+R]YouTube 刪除影片浮水印快捷鍵
// @namespace    https://youtube.com/
// @version      1.0
// @description  按下 Shift+R 刪除影片右下角浮水印
// @author       萊姆醬
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license            MIT
// @icon         https://i.imgur.com/ahqSBX4.png
// @downloadURL https://update.greasyfork.org/scripts/533011/%5BShift%2BR%5DYouTube%20%E5%88%AA%E9%99%A4%E5%BD%B1%E7%89%87%E6%B5%AE%E6%B0%B4%E5%8D%B0%E5%BF%AB%E6%8D%B7%E9%8D%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/533011/%5BShift%2BR%5DYouTube%20%E5%88%AA%E9%99%A4%E5%BD%B1%E7%89%87%E6%B5%AE%E6%B0%B4%E5%8D%B0%E5%BF%AB%E6%8D%B7%E9%8D%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBranding() {
        const branding = document.querySelector('.annotation.annotation-type-custom.iv-branding');
        if (branding) {
            branding.remove();
            console.log('浮水印已刪除');
        } else {
            console.log('找不到浮水印元素');
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.shiftKey && e.key.toLowerCase() === 'r') {
            removeBranding();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();