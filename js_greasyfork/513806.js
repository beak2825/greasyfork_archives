// ==UserScript==
// @name         HideImage
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  隐藏所有图片，直到你想看到她
// @author       idealy
// @match        *://linux.do/*
// @match        *://hostloc.com/*
// @match        *://app.follow.is/*
// @match        *://mp.weixin.qq.com/*
// @match        *://baijiahao.baidu.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513806/HideImage.user.js
// @updateURL https://update.greasyfork.org/scripts/513806/HideImage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置项：最小宽度和高度
    const defaultMinWidth = 100;
    const defaultMinHeight = 100;

    // 针对不同网站的配置
    const siteConfigs = {
        'linux.do': {
            excludeClasses: ['mfp-img']
        },
        'hostloc.com': {
            minWidth: 200,
            minHeight: 200
        }
    };

    function getSiteConfig() {
        const domain = window.location.hostname;
        return siteConfigs[domain] || {};
    }

    function shouldExcludeImage(img) {
        const config = getSiteConfig();
        if (config.excludeClasses) {
            return config.excludeClasses.some(className => img.classList.contains(className));
        }
        return false;
    }

    function replaceImagesWithText(img) {
        const config = getSiteConfig();
        const minWidth = config.minWidth || defaultMinWidth;
        const minHeight = config.minHeight || defaultMinHeight;

        if (img.style.display !== 'none' && img.width >= minWidth && img.height >= minHeight && !shouldExcludeImage(img)) {
            const width = img.width;
            const height = img.height;
            const text = document.createElement('span');
            text.textContent = `图片 ${width}*${height}`;
            text.style.cursor = 'pointer';
            text.addEventListener('click', () => {
                img.style.display = '';
                text.style.display = 'none';
                img.addEventListener('click', () => {
                    img.style.display = 'none';
                    text.style.display = '';
                }, { once: true });
            });
            img.parentNode.insertBefore(text, img);
            img.style.display = 'none';
            console.log('已隐藏图片:', img.src);
        }
    }

    function handleImage(img) {
        if (img.dataset.processed) return;
        img.dataset.processed = 'true';
        console.log('检测到图片:', img.src);
        if (img.complete) {
            replaceImagesWithText(img);
        } else {
            img.addEventListener('load', () => replaceImagesWithText(img));
            img.addEventListener('error', () => replaceImagesWithText(img));
        }
    }

    function handleExistingImages() {
        const images = document.querySelectorAll('img');
        images.forEach(handleImage);
    }

    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG') {
                                handleImage(node);
                            } else {
                                const images = node.querySelectorAll('img');
                                images.forEach(handleImage);
                            }
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
                    handleImage(mutation.target);
                }
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }

    window.onload = () => {
        handleExistingImages();
        observeDOMChanges();
    };
})();