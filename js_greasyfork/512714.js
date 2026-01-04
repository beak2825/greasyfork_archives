// ==UserScript==
// @name         GitHub图片预览
// @namespace    topkof
// @version      1.1
// @description  为Github项目简介中的图片提供单击预览功能，而非跳转到图像所在页面，并可通过滚轮进行缩放.
// @author       topkof
// @match        https://github.com/*
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512714/GitHub%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512714/GitHub%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add custom CSS for the modal
    GM_addStyle(`
        .image-preview-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .image-preview-overlay img {
            max-width: 90%;
            max-height: 90%;
            box-shadow: 0 0 20px black;
            transition: transform 0.2s ease;
        }
        .image-preview-overlay .close-button {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }
    `);

    // Function to create and show the image preview modal
    function showImagePreview(src) {
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';

        const img = document.createElement('img');
        img.src = src;
        let scale = 1;

        // Zoom in and out with mouse wheel
        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                // Zoom in
                scale = Math.min(scale + 0.1, 5);
            } else {
                // Zoom out
                scale = Math.max(scale - 0.1, 0.5);
            }
            img.style.transform = `scale(${scale})`;
        });

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.onclick = () => document.body.removeChild(overlay);

        overlay.appendChild(img);
        overlay.appendChild(closeButton);
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };

        document.body.appendChild(overlay);
    }

    // Add click event listener to README images
    document.addEventListener('click', function (e) {
        const target = e.target;
        if (target.tagName === 'IMG' && target.closest('.markdown-body')) {
            e.preventDefault();
            showImagePreview(target.src);
        }
    });

})();
