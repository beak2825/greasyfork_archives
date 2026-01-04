// ==UserScript==
// @name        Ex收藏夹优化
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description 点击缩略图右上角圆点并输入exhentai站内漫画单页网址更换封面
// @author      You
// @match       https://exhentai.org/favorites.php*
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/546103/Ex%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546103/Ex%E6%94%B6%E8%97%8F%E5%A4%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select all div elements that have the specific class and a style attribute
    const elementsToModify = document.querySelectorAll('div[class][style]');

    elementsToModify.forEach(divElement => {
        // Find the gallery's ID from the URL link within the div
        const galleryLink = divElement.querySelector('a[href*="/g/"]');
        if (!galleryLink) {
            return;
        }
        const galleryId = galleryLink.href.split('/').slice(-2).join('/'); // Extracts "gallery_id/token"

        // Step 1: Modify the div element's style
        if (divElement.style.height && divElement.style.width) {
            divElement.style.height = '350px';
            divElement.style.width = '250px';
            divElement.style.position = 'relative';
            // Clear previous centering styles
            divElement.style.display = '';
            divElement.style.alignItems = '';
            divElement.style.justifyContent = '';
        }

        // Step 2: Find the child <img> element and modify its style
        const imgElement = divElement.querySelector('img');
        if (imgElement && imgElement.style) {
            Object.assign(imgElement.style, {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
            });
        }

        // --- 新增功能: 加载记忆中的替换图片 ---
        // 我们现在存储的是图片来源的URL，而不是直接的图片src
        const savedSourceUrl = GM_getValue(galleryId);
        if (savedSourceUrl) {
            fetchAndApplyImage(savedSourceUrl, imgElement, galleryId);
        }
        // ---

        // Step 3: Add a new circular button to the top-right corner
        const button = document.createElement('div');
        button.className = 'custom-favorite-button';

        Object.assign(button.style, {
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            zIndex: '10',
            cursor: 'pointer',
            backgroundColor: savedSourceUrl ? 'black' : 'white', // 根据是否有记忆来设置按钮颜色
            opacity: '0.4'
        });

        // Step 4: Add the click event listener to the button
        button.addEventListener('click', async (e) => {
            e.stopPropagation();

            // --- 新增功能: 重置或替换 ---
            const currentSourceUrl = GM_getValue(galleryId);

            if (currentSourceUrl) {
                // 如果有记忆，执行重置功能
                if (confirm("是否要重置这张图片的显示？")) {
                    GM_setValue(galleryId, null); // 清除记忆
                    if (imgElement) {
                        // 找到原始图片的 URL
                        const originalUrl = divElement.querySelector('img[src]');
                        if (originalUrl) {
                            imgElement.src = originalUrl.src; // 恢复原始图片
                        }
                    }
                    button.style.backgroundColor = 'white'; // 按钮变回白色
                    return;
                }
            }
            // ---

            const url = window.prompt("请输入要替换的图片来源网页链接：");
            if (!url) {
                return;
            }

            // 调用新的函数来获取并应用图片
            const success = await fetchAndApplyImage(url, imgElement, galleryId, true); // true表示这是用户手动设置的
            if (success) {
                button.style.backgroundColor = 'black'; // 替换成功，按钮变黑
            } else {
                button.style.backgroundColor = 'white'; // 失败，按钮保持白色
            }
        });

        // Add the new button element to the div
        divElement.appendChild(button);
    });

    /**
     * Fetches the image from the given URL and applies it to the imgElement.
     * Optionally saves the URL if it's a manual user input.
     * @param {string} sourceUrl The URL of the page containing the image.
     * @param {HTMLImageElement} imgElement The <img> element to update.
     * @param {string} galleryId The ID of the gallery.
     * @param {boolean} [isManualSet=false] Whether this call is triggered by a manual user set.
     * @returns {Promise<boolean>} True if successful, false otherwise.
     */
    async function fetchAndApplyImage(sourceUrl, imgElement, galleryId, isManualSet = false) {
        try {
            const responseText = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: sourceUrl,
                    onload: function(res) {
                        if (res.status === 200) {
                            resolve(res.responseText);
                        } else {
                            reject(new Error(`Failed to fetch page. Status: ${res.status}`));
                        }
                    },
                    onerror: function(err) {
                        reject(err);
                    }
                });
            });

            const parser = new DOMParser();
            const doc = parser.parseFromString(responseText, "text/html");

            const targetImage = doc.getElementById('img');

            if (targetImage) {
                const foundImageSrc = targetImage.src;
                if (imgElement) {
                    imgElement.src = foundImageSrc;
                    // --- 新增功能: 存储原始的来源URL，而不是图片src ---
                    if (isManualSet) { // 只有在用户手动设置时才保存
                        GM_setValue(galleryId, sourceUrl);
                    }
                    // ---
                    return true;
                }
            } else {
                if (isManualSet) { // 只有在用户手动设置时才提示错误
                    alert("在提供的网页中未找到 id='img' 的图像元素。");
                }
                return false;
            }
        } catch (error) {
            console.error("An error occurred:", error);
            if (isManualSet) { // 只有在用户手动设置时才提示错误
                alert("发生错误，请检查链接或稍后重试。");
            }
            return false;
        }
    }
})();