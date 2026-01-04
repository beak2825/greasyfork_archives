// ==UserScript==
// @name         nieta图片水印移除工具
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动移除nieta.art网站图片链接中导致水印的额外参数
// @author       Github:Sunset1896
// @match        https://app.nieta.art/picture*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545652/nieta%E5%9B%BE%E7%89%87%E6%B0%B4%E5%8D%B0%E7%A7%BB%E9%99%A4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545652/nieta%E5%9B%BE%E7%89%87%E6%B0%B4%E5%8D%B0%E7%A7%BB%E9%99%A4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    function processImageUrl(url) {
        if (!url) return url;

        
        if (url.includes('?image_process=')) {
            
            const cleanUrl = url.split('?image_process=')[0];
            console.log('[水印移除] 处理前:', url);
            console.log('[水印移除] 处理后:', cleanUrl);
            return cleanUrl;
        }

        return url;
    }

    
    function handleImage(img) {
        if (!img.src) return;

        const originalSrc = img.src;
        const newSrc = processImageUrl(originalSrc);

        if (newSrc !== originalSrc) {
            
            img.src = newSrc;

            
            if (img.complete) {
                img.src = newSrc + '?t=' + Date.now(); 
            }
        }

        
        if (img.srcset) {
            const newSrcset = img.srcset.split(',').map(item => {
                const parts = item.trim().split(' ');
                parts[0] = processImageUrl(parts[0]);
                return parts.join(' ');
            }).join(', ');

            if (newSrcset !== img.srcset) {
                img.srcset = newSrcset;
            }
        }
    }

    
    function processExistingImages() {
        const images = document.querySelectorAll('img');
        images.forEach(handleImage);
    }

    
    function setupObserver() {
        if (typeof MutationObserver === 'undefined') return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'IMG') {
                        handleImage(node);
                    }
                    
                    else if (node.nodeType === 1) {
                        node.querySelectorAll('img').forEach(handleImage);
                    }
                });

                
                if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG') {
                    handleImage(mutation.target);
                }
            });
        });

        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'srcset']
        });
    }

   
    processExistingImages();
    setupObserver();

    
    setTimeout(processExistingImages, 1000);
    setTimeout(processExistingImages, 3000);
})();