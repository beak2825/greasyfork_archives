// ==UserScript==
// @name         ascii2d粘贴图像搜图
// @namespace    none
// @license      MIT
// @version      0.1
// @description  ascii2d搜图粘贴图像支持
// @match        https://ascii2d.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519235/ascii2d%E7%B2%98%E8%B4%B4%E5%9B%BE%E5%83%8F%E6%90%9C%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/519235/ascii2d%E7%B2%98%E8%B4%B4%E5%9B%BE%E5%83%8F%E6%90%9C%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('paste', function(event) {
        const clipboardData = event.clipboardData || window.clipboardData;

        if (clipboardData) {
            const items = clipboardData.items;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];

                if (item.kind === 'file') {
                    const file = item.getAsFile();

                    const fileInput = document.querySelector('input[name="file"]');

                    if (fileInput) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);

                        fileInput.files = dataTransfer.files;

                        const event = new Event('change', { bubbles: true });
                        fileInput.dispatchEvent(event);

                        console.log('File pasted:', file);
                    }
                    break;
                }
            }
        }
    });
})();
