// ==UserScript==
// @name         Discord 图片助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  该脚本为 Discord 网页版中的图片添加“保存原图”和“复制链接”按钮，以便用户更方便地下载和分享图片。
// @author       Your Name
// @match        https://discord.com/*
// @grant        GM_download
// @grant        GM_setClipboard
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536492/Discord%20%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/536492/Discord%20%E5%9B%BE%E7%89%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PROCESSED_TARGET_MARKER = 'data-image-enhancer-target-processed';
    const BUTTON_CONTAINER_CLASS = 'custom-image-buttons-container';

    const imageParentSelectors = [
        'div[class*="visualMediaItemContainer_"]',
        'div[class*="imageContent-"]',
        'div[class*="imageContainer-"]',
        'div[class*="imageWrapper-"]',
        'div[class*="clickableWrapper-"]',
        'div[class*="embedMedia-"]',
        'div[class*="attachmentContentContainer-"]',
        'div[class*="mediaMosaicSrc-"]',
        'div[class*="mediaAttachmentsContainer-"]',
        'div[class*="messageAttachment-"]',
        'figure[class*="imageContainer-"]'
    ];

    function getImageUrl(element) {
        if (element.tagName === 'IMG' && element.src) {
            return element.src;
        }
        if (element.tagName === 'A' && element.href) {
            const imgElement = element.querySelector('img');
            if (imgElement && imgElement.src && (imgElement.src.includes('discordapp.com') || imgElement.src.includes('discordapp.net'))) {
                return imgElement.src;
            }
            if (element.href.match(/\.(jpeg|jpg|gif|png|webp|avif)(#.*)?$/i) || element.href.includes('discordapp.com') || element.href.includes('discordapp.net')) {
                return element.href;
            }
        }
        if (element.style && element.style.backgroundImage) {
            const bgImage = element.style.backgroundImage;
            const match = bgImage.match(/url\("?([^"]+)"?\)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        const childImg = element.querySelector('img[src*="cdn.discordapp.com"], img[src*="media.discordapp.net"]');
        if (childImg && childImg.src) {
            return childImg.src;
        }
        return null;
    }

    function getShareableCdnUrl(url) {
        if (!url || typeof url !== 'string') {
            return null;
        }
        try {
            const originalUrl = new URL(url);
            const cdnHostname = 'cdn.discordapp.com';
            let finalPathname = originalUrl.pathname;

            if (!finalPathname.startsWith('/')) {
                finalPathname = '/' + finalPathname;
            }

            let newUrlString = `https://${cdnHostname}${finalPathname}`;

            const paramsToKeep = ['ex', 'is', 'hm'];
            const newSearchParams = new URLSearchParams();
            let paramsKept = false;

            originalUrl.searchParams.forEach((value, key) => {
                if (paramsToKeep.includes(key.toLowerCase())) {
                    if (value) {
                        newSearchParams.append(key, value);
                        paramsKept = true;
                    }
                }
            });

            if (paramsKept) {
                newUrlString += '?' + newSearchParams.toString();
            }
            return newUrlString;

        } catch (e) {
            console.warn('[DEBUG] getShareableCdnUrl: Failed to parse or process URL:', url, e);
            return url;
        }
    }

    function addButtonsToImageWrapper(imageElementWrapper, detectedImageUrl) {
        if (!imageElementWrapper || !imageElementWrapper.parentNode) {
            console.error('[DEBUG] addButtonsToImageWrapper: Target wrapper or its parent is invalid.');
            return;
        }

        const shareableCdnUrl = getShareableCdnUrl(detectedImageUrl);

        if (!shareableCdnUrl) {
            console.warn('[DEBUG] addButtonsToImageWrapper: Could not derive a shareable CDN URL from:', detectedImageUrl);
            return;
        }

        let existingButtonContainer = imageElementWrapper.nextElementSibling;
        if (existingButtonContainer && existingButtonContainer.classList.contains(BUTTON_CONTAINER_CLASS) && existingButtonContainer.dataset.imageUrl === shareableCdnUrl) {
            if (!imageElementWrapper.hasAttribute(PROCESSED_TARGET_MARKER)) {
                imageElementWrapper.setAttribute(PROCESSED_TARGET_MARKER, 'true');
            }
            return;
        }
        if (existingButtonContainer && existingButtonContainer.classList.contains(BUTTON_CONTAINER_CLASS)) {
            existingButtonContainer.remove();
        }

        let buttonContainer = document.createElement('div');
        buttonContainer.className = BUTTON_CONTAINER_CLASS;
        buttonContainer.setAttribute('data-image-url', shareableCdnUrl);

        const downloadBtn = document.createElement('button');
        downloadBtn.innerHTML = '保存原图';
        downloadBtn.className = 'custom-image-button custom-download-button';
        downloadBtn.onclick = async (e) => {
            e.stopPropagation(); e.preventDefault();
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '保存中...';
            const response = await fetch(shareableCdnUrl);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            GM_download(objectUrl, "discord_image.png");
            setTimeout(() => {
                downloadBtn.innerHTML = '已保存!';
                downloadBtn.disabled = false;
            }, 2000);
        };

        const copyLinkBtn = document.createElement('button');
        copyLinkBtn.innerHTML = '复制链接';
        copyLinkBtn.className = 'custom-image-button custom-copy-link-button';
        copyLinkBtn.onclick = (e) => {
            e.stopPropagation(); e.preventDefault();
            copyLinkBtn.disabled = true;
            copyLinkBtn.innerHTML = '已复制!';
            GM_setClipboard(shareableCdnUrl);
            setTimeout(() => {
                copyLinkBtn.innerHTML = '复制链接';
                copyLinkBtn.disabled = false;
            }, 2000);
        };

        buttonContainer.appendChild(downloadBtn);
        buttonContainer.appendChild(copyLinkBtn);

        imageElementWrapper.parentNode.insertBefore(buttonContainer, imageElementWrapper.nextSibling);
        imageElementWrapper.setAttribute(PROCESSED_TARGET_MARKER, 'true');
    }

    function scanForImages() {
        const potentialWrappers = document.querySelectorAll(imageParentSelectors.join(', '));

        potentialWrappers.forEach((potentialWrapper) => {
            let elementForUrlExtraction =
                potentialWrapper.querySelector('img[src*="discordapp.com"], img[src*="discordapp.net"]') ||
                potentialWrapper.querySelector('a[href*="discordapp.com"], a[href*="discordapp.net"]') ||
                potentialWrapper;

            const currentDetectedUrlInDom = getImageUrl(elementForUrlExtraction);
            if (currentDetectedUrlInDom) {
                addButtonsToImageWrapper(potentialWrapper, currentDetectedUrlInDom);
            }
        });
    }

    const observer = new MutationObserver((mutationsList) => {
        let shouldScan = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        shouldScan = true;
                        break;
                    }
                }
            }
        }
        if (shouldScan) {
            scanForImages();
        }
    });

    function startObserver() {
        scanForImages();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 添加样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 自定义按钮容器 */
        .custom-image-buttons-container {
          display: flex;
          flex-direction: row;
          gap: 8px;
          background-color: #202225;
          padding: 6px 8px;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          pointer-events: auto;
          margin-top: 8px;
          margin-bottom: 8px;
          justify-self: center;
        }

        /* 通用按钮样式 */
        .custom-image-button {
          color: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.2);
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: "gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
          font-size: 13px;
          font-weight: 600;
          transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, border-color 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 90px;
          box-sizing: border-box;
          text-align: center;
          line-height: 1.2;
        }

        /* 按钮禁用状态 */
        .custom-image-button:disabled {
          background-color: #9e9e9e;
          cursor: not-allowed;
          color: #b0b0b0;
        }

        /* 悬停效果 */
        .custom-image-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        /* 按钮点击时效果 */
        .custom-image-button:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        /* 保存原图按钮 - 绿色 */
        .custom-download-button {
          background-color: #72b572;
          border-color: #5f985f;
        }

        .custom-download-button:hover {
          background-color: #65a565;
          border-color: #508750;
          color: #FFFFFF;
        }

        .custom-download-button:active {
          background-color: #589558;
        }

        /* 复制链接按钮 - 紫色 */
        .custom-copy-link-button {
          background-color: #9b84d7;
          border-color: #836fc0;
        }

        .custom-copy-link-button:hover {
          background-color: #8c73c6;
          border-color: #725ea9;
          color: #FFFFFF;
        }

        .custom-copy-link-button:active {
          background-color: #7d63b5;
        }
    `;
    document.head.appendChild(style);

    startObserver();
})();
