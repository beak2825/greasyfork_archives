// ==UserScript==
// @name        GGAC作品原图显示
// @namespace   ggac-original-image
// @match       https://www.ggac.com/work/detail/*
// @description 在GGAC作品页面显示原图（通过API获取原始图片URL）
// @version     1.1
// @grant       GM_xmlhttpRequest
// @run-at      document-end
// @icon        https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.ggac.com/home&size=32
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533717/GGAC%E4%BD%9C%E5%93%81%E5%8E%9F%E5%9B%BE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/533717/GGAC%E4%BD%9C%E5%93%81%E5%8E%9F%E5%9B%BE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从URL中提取workId
    function getWorkId() {
        const match = window.location.pathname.match(/\/work\/detail\/(\d+)/);
        return match ? match[1] : null;
    }

    // 获取作品图片数据
    function fetchImageData(workId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.ggac.com/api/work/media_list/${workId}`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.code === "0" && data.data) {
                            resolve(data.data);
                        } else {
                            reject(new Error(data.message || 'API返回数据异常'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    // 替换图片URL
    function replaceImageUrls(imageData) {
        const images = document.querySelectorAll('img.ant-image-img');

        images.forEach((img, index) => {
            if (index < imageData.length) {
                const originalUrl = imageData[index].url;
                if (img.src !== originalUrl) {
                    img.src = originalUrl;
                    console.log('已替换原图:', originalUrl);
                }

                // 移除可能存在的宽度限制
                if (img.style.maxWidth) {
                    img.style.maxWidth = 'none';
                }
            }
        });
    }

    // 主函数
    async function main() {
        const workId = getWorkId();
        if (!workId) {
            console.log('未找到workId');
            return;
        }

        try {
            const imageData = await fetchImageData(workId);
            replaceImageUrls(imageData);

            // 使用MutationObserver监听DOM变化
            const observer = new MutationObserver(function() {
                replaceImageUrls(imageData);
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        } catch (error) {
            console.error('获取图片数据失败:', error);
        }
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .ant-image-img {
            max-width: none !important;
            cursor: zoom-in;
        }
        .ant-image-img:hover {
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);

    // 启动主函数
    main();
})();