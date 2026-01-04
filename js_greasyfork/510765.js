// ==UserScript==
// @name        Display Real R18 Product Images on PChome
// @name:zh-TW  PChome正確顯示R18商品圖片
// @description Ensures R18 product images are displayed correctly.
// @description:zh-TW  確保R18商品圖片正確顯示。
// @namespace   https://github.com/jmsch23280866
// @author      特務E04
// @license     MIT
// @version     1.0
// @match       https://*.pchome.com.tw/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/510765/PChome%E6%AD%A3%E7%A2%BA%E9%A1%AF%E7%A4%BAR18%E5%95%86%E5%93%81%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/510765/PChome%E6%AD%A3%E7%A2%BA%E9%A1%AF%E7%A4%BAR18%E5%95%86%E5%93%81%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義處理被覆蓋圖片的函數
    const removeOverlayFromImages = () => {
        const coveredImages = document.querySelectorAll('.c-prodInfoV2__img--notR18');
        coveredImages.forEach(container => {
            container.classList.remove('c-prodInfoV2__img--notR18');
            const img = container.querySelector('img');
            if (img) {
                img.style.opacity = '1';
                img.style.zIndex = 'auto';
            }
        });
    };

    // 初始加載時處理已有的覆蓋物
    removeOverlayFromImages();

    // 使用 MutationObserver 監測動態加載的內容
    const observer = new MutationObserver(() => {
        removeOverlayFromImages();  // 每當 DOM 變動時，重新檢查圖片是否被覆蓋
    });

    // 監控主要商品列表區域，監聽其子節點變動
    const targetNode = document.querySelector('body');
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

})();
