// ==UserScript==
// @name         禁止 Web 延迟加载图片（一次性加载）
// @name:en      Disable web lazy loading images (one-time loading)
// @description  在 Web 页面中直接显示图片，禁止延迟加载，一次性加载所有图片
// @description:en Display images directly on the web page, disable lazy loading, load all images at once.
// @version      0.8.5
// @author       DUN
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/662094
// @downloadURL https://update.greasyfork.org/scripts/471420/%E7%A6%81%E6%AD%A2%20Web%20%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87%EF%BC%88%E4%B8%80%E6%AC%A1%E6%80%A7%E5%8A%A0%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/471420/%E7%A6%81%E6%AD%A2%20Web%20%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87%EF%BC%88%E4%B8%80%E6%AC%A1%E6%80%A7%E5%8A%A0%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isExcluded(url) {
        const excludedKeywords = [
            // 在这里添加你要排除的关键词
        ];
        return excludedKeywords.some(keyword => url.includes(keyword));
    }

    function updateImageSource(imgElement) {
        const srcAttribute = imgElement.getAttribute("data-src") || imgElement.getAttribute("data-original") || imgElement.src;
        if (srcAttribute && !isExcluded(srcAttribute)) {
            if (srcAttribute.startsWith('data:image')) {
                imgElement.src = srcAttribute;
            } else {
                imgElement.src = new URL(srcAttribute, window.location.href).href;
            }
        }

        const srcsetAttribute = imgElement.getAttribute("data-srcset");
        if (srcsetAttribute) {
            imgElement.srcset = srcsetAttribute;
        }

        imgElement.removeAttribute('data-src');
        imgElement.removeAttribute('data-srcset');
        imgElement.removeAttribute('srcset');
        imgElement.removeAttribute('sizes');
        imgElement.classList.remove('lazyload', 'lazy');
    }

    function processAddedNodes(addedNodes) {
        addedNodes.forEach(node => {
            if (node.tagName === 'IMG') {
                updateImageSource(node);
            } else if (node.querySelectorAll) {
                node.querySelectorAll('img').forEach(updateImageSource);
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                processAddedNodes(mutation.addedNodes);
            } else if (mutation.type === 'attributes' && (mutation.attributeName === 'data-src' || mutation.attributeName === 'data-original')) {
                updateImageSource(mutation.target);
            }
        });
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-src', 'data-original']
    });

    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img').forEach(updateImageSource);
    });
})();
