// ==UserScript==
// @name         Git Image Preview (Ctrl/Option Click)
// @namespace    https://github.com/stuarthua/git-image-preview
// @version      1.0.2
// @description  按住 Ctrl/Option 点击 GitHub 页面中的图片，即可在当前页面预览原图，支持滚轮缩放
// @author       stuarthua
// @match        https://github.com/*
// @icon         https://raw.githubusercontent.com/stuarthua/git-image-preview/main/images/icon.png
// @homepageURL  https://github.com/stuarthua/git-image-preview
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/532682/Git%20Image%20Preview%20%28CtrlOption%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532682/Git%20Image%20Preview%20%28CtrlOption%20Click%29.meta.js
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

    function showImagePreview(src) {
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';

        const img = document.createElement('img');
        img.src = src;
        let scale = 1;

        overlay.addEventListener('wheel', (e) => {
            e.preventDefault();
            scale += e.deltaY < 0 ? 0.1 : -0.1;
            scale = Math.min(Math.max(scale, 0.5), 5);
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

    // Listen in capture phase to intercept before default behavior
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link || !link.querySelector('img')) return;

        const img = link.querySelector('img');
        const isInMarkdown = link.closest('.markdown-body');
        const isCtrlOrOptionPressed = e.ctrlKey || e.altKey || e.metaKey;

        if (img && isInMarkdown && isCtrlOrOptionPressed) {
            e.preventDefault();
            e.stopImmediatePropagation();
            showImagePreview(img.src);
        }
    }, true);
})();
