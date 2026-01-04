// ==UserScript==
// @name         在RARGB种子页面显示大图RARGB Torrent Image Preview Enhanced
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在RARGB种子页面显示大图（增强版）
// @author       Paul Jonas
// @match        https://rargb.to/torrent/*
// @match        https://www.rarbgproxy.to/rarbgproxy_torrent/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @connect      rargb.to
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/531330/%E5%9C%A8RARGB%E7%A7%8D%E5%AD%90%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BERARGB%20Torrent%20Image%20Preview%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/531330/%E5%9C%A8RARGB%E7%A7%8D%E5%AD%90%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E5%A4%A7%E5%9B%BERARGB%20Torrent%20Image%20Preview%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .rarbg-preview-container {
            margin: 15px 0;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: #f9f9f9;
        }
        .rarbg-preview-loading {
            color: #666;
            font-style: italic;
        }
        .rarbg-preview-error {
            color: #d32f2f;
        }
        .rarbg-preview-image {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 8px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .rarbg-preview-image[data-status="error"] {
            display: none;
        }
    `);

    function initPreview() {
        const previewLinks = document.querySelectorAll('.js-modal-url');

        previewLinks.forEach(link => {
            const previewUrl = link.getAttribute('href');

            if (previewUrl) {

                const container = document.createElement('div');
                container.className = 'rarbg-preview-container';

                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'rarbg-preview-loading';
                loadingIndicator.textContent = '正在加载预览...';
                container.appendChild(loadingIndicator);

                link.parentNode.insertBefore(container, link.nextSibling);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: previewUrl,
                    onload: function(response) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');

                            const images = doc.querySelectorAll('img');

                            if (images.length > 0) {
                                container.removeChild(loadingIndicator);

                                images.forEach(img => {
                                    const imgUrl = img.src;

                                    if (!isLikelyPreviewImage(imgUrl)) return;

                                    const previewImg = document.createElement('img');
                                    previewImg.className = 'rarbg-preview-image';
                                    previewImg.src = imgUrl;
                                    previewImg.alt = '预览图片';

                                    previewImg.onerror = function() {

                                        tryProxyImage(imgUrl, previewImg, container);
                                    };

                                    container.appendChild(previewImg);
                                });

                                if (container.children.length === 0) {
                                    showError(container, '未找到有效的预览图片');
                                }
                            } else {
                                showError(container, '预览页面中没有找到图片');
                            }
                        } catch (e) {
                            console.error('解析预览页面出错:', e);
                            showError(container, '解析预览页面出错');
                        }
                    },
                    onerror: function(error) {
                        console.error('加载预览页面失败:', error);
                        showError(container, '加载预览页面失败');
                    }
                });
            }
        });
    }

    function isLikelyPreviewImage(url) {
        const lowerUrl = url.toLowerCase();
        const excludePatterns = [
            'logo', 'icon', 'avatar', 'ad', 'ads', 'pixel', 'track',
            'button', 'spacer', 'placeholder', 'wp-content'
        ];

        return !excludePatterns.some(pattern => lowerUrl.includes(pattern));
    }

    function showError(container, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'rarbg-preview-error';
        errorElement.textContent = message;

        const loading = container.querySelector('.rarbg-preview-loading');
        if (loading) container.removeChild(loading);

        container.appendChild(errorElement);
    }

    function tryProxyImage(imgUrl, imgElement, container) {

        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(imgUrl)}&w=800`;

        const proxyImg = document.createElement('img');
        proxyImg.className = 'rarbg-preview-image';
        proxyImg.src = proxyUrl;

        proxyImg.onload = function() {
            imgElement.src = proxyUrl;
            container.replaceChild(proxyImg, imgElement);
        };

        proxyImg.onerror = function() {

            imgElement.setAttribute('data-status', 'error');
            if (container.querySelectorAll('img[data-status="error"]').length ===
                container.querySelectorAll('img').length) {
                showError(container, '图片加载失败，请尝试直接访问预览页面');
            }
        };
    }

    window.addEventListener('load', initPreview);
})();