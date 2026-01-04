// ==UserScript==
// @name         WNACG压缩下载器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  紳士漫畫的漫画首页新增一个“压缩下载”功能按钮。。可以解析漫画页面图片进行打包zip文件下载。。避免下载漫画的下载链接失效问题。。。
// @author
// @match        https://www.wnacg.com/photos-index-aid-*.html
// @match        https://www.wnacg.com/photos-index-page-*-aid-*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @connect      www.wnacg.com
// @downloadURL https://update.greasyfork.org/scripts/526938/WNACG%E5%8E%8B%E7%BC%A9%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526938/WNACG%E5%8E%8B%E7%BC%A9%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建用于显示进度的元素
    const progressDiv = document.createElement("div");
    progressDiv.style.cssText = "margin-top: 10px; font-size: 14px; color: #333;";

    // 更新进度显示信息
    function updateProgress(msg) {
        progressDiv.innerText = msg;
    }

    // 使用 GM_xmlhttpRequest 下载图片，返回 Blob 的 Promise
    function fetchImageBlob(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(response.response);
                    } else {
                        reject(new Error("图片加载失败，状态码：" + response.status));
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // 无限重试下载图片，直到成功
    async function fetchImageWithRetry(url) {
        while (true) {
            try {
                let blob = await fetchImageBlob(url);
                return blob;
            } catch (e) {
                console.error("下载图片失败，正在重试：", url, e);
                // 等待1秒后重试
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    /**
     * 等待 slide 页面中 #img_list 内的图片解析完成，并实时更新解析进度。
     * 如果能在其中任一 <span> 中匹配到类似 "1/13" 格式，则将 13 作为预期总数。
     * 当图片数量在 stableTime 毫秒内不再变化或达到预期总数时，视为解析完成。
     *
     * @param {Document} iframeDoc - slide 页 iframe 内的 document 对象
     * @param {number} timeout - 最大等待时间（毫秒）
     * @param {number} stableTime - 稳定时间（毫秒）
     * @returns {Promise<Element>} 解析完成时返回 #img_list 容器
     */
    function waitForParsedImages(iframeDoc, timeout = 30000, stableTime = 2000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            // 定义所有变量和函数，确保它们在 MutationObserver 回调中可用
            function getContainer() {
                return iframeDoc.getElementById("img_list");
            }
            let container = getContainer();
            let expectedTotal = null;
            let lastCount = 0;
            let stableTimer = null;
            const observer = new MutationObserver(() => { update(); });

            function update() {
                if (!container) return;
                const imgs = container.querySelectorAll("img");
                const count = imgs.length;
                // 尝试从 <span> 中解析预期总数，例如 "1/13"
                if (!expectedTotal) {
                    const spans = container.querySelectorAll("span");
                    spans.forEach(span => {
                        const match = span.textContent.match(/(\d+)\s*\/\s*(\d+)/);
                        if (match) {
                            expectedTotal = parseInt(match[2]);
                        }
                    });
                }
                if (expectedTotal) {
                    updateProgress(`正在解析中: ${count} / ${expectedTotal} 张图片`);
                } else {
                    updateProgress(`正在解析中: ${count} 张图片`);
                }
                if (count !== lastCount) {
                    lastCount = count;
                    if (stableTimer) {
                        clearTimeout(stableTimer);
                    }
                    stableTimer = setTimeout(() => {
                        observer.disconnect();
                        resolve(container);
                    }, stableTime);
                }
                if (expectedTotal && count >= expectedTotal) {
                    if (stableTimer) clearTimeout(stableTimer);
                    observer.disconnect();
                    resolve(container);
                }
                if (Date.now() - startTime > timeout) {
                    observer.disconnect();
                    resolve(container);
                }
            }

            function startObserver() {
                container = getContainer();
                update();
                observer.observe(container, { childList: true, subtree: true });
                setTimeout(() => {
                    observer.disconnect();
                    resolve(container);
                }, timeout);
            }

            // 如果 container 不存在，则先观察 body，等待 container 出现
            if (!container) {
                const containerObserver = new MutationObserver(() => {
                    container = getContainer();
                    if (container) {
                        containerObserver.disconnect();
                        startObserver();
                    }
                });
                containerObserver.observe(iframeDoc.body, { childList: true, subtree: true });
            } else {
                startObserver();
            }
        });
    }

    // 主流程：加载 slide 页并解析图片进行下载与打包
    async function downloadSlideImages() {
        // 先查找下拉閱讀按钮
        updateProgress("查找下拉閱讀按钮...");
        const readMoreButton = document.querySelector('a[href*="/photos-slide-aid-"]');
        if (!readMoreButton) {
            alert("未找到下拉閱讀按钮");
            return;
        }
        const slideRelativeUrl = readMoreButton.getAttribute("href");
        const slideUrl = new URL(slideRelativeUrl, location.origin).href;
        // 开始解析时显示“正在解析中...”
        updateProgress("正在解析中...");

        // 创建隐藏的 iframe 加载 slide 页
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = slideUrl;
        document.body.appendChild(iframe);

        // 等待 iframe 加载完毕
        await new Promise((resolve) => {
            iframe.onload = resolve;
        });

        // 等待 slide 页中 #img_list 内图片解析完成，并实时显示解析进度
        let imgList;
        try {
            imgList = await waitForParsedImages(iframe.contentDocument, 30000, 2000);
        } catch (err) {
            alert("等待图片解析超时: " + err);
            document.body.removeChild(iframe);
            return;
        }

        // 获取解析完成后的图片集合
        const imgElements = imgList.querySelectorAll("img");
        if (imgElements.length === 0) {
            alert("在 img_list 中未找到图片");
            document.body.removeChild(iframe);
            return;
        }
        updateProgress(`解析完成，共解析到 ${imgElements.length} 张图片，开始下载...`);

        const zip = new JSZip();
        const totalImages = imgElements.length;
        let downloadedCount = 0;
        let downloadPromises = [];

        // 遍历所有图片进行下载（下载失败无限重试），并添加到 zip 中
        imgElements.forEach((img, index) => {
            const src = img.getAttribute("src");
            try {
                const absoluteUrl = new URL(src, slideUrl).href;
                let filename = absoluteUrl.split("/").pop() || `image_${index + 1}.jpg`;
                const p = fetchImageWithRetry(absoluteUrl).then(blob => {
                    zip.file(filename, blob);
                    downloadedCount++;
                    updateProgress(`下载图片 ${downloadedCount} / ${totalImages}`);
                });
                downloadPromises.push(p);
            } catch (e) {
                console.error("无效的图片 URL:", src, e);
            }
        });

        await Promise.all(downloadPromises);
        updateProgress("所有图片下载完毕，开始打包 zip...");

        let zipBlob;
        try {
            zipBlob = await zip.generateAsync({ type: "blob" }, metadata => {
                // 根据当前打包百分比换算成已打包图片数量
                const packed = Math.round(totalImages * metadata.percent / 100);
                updateProgress(`打包进度：${packed} / ${totalImages}`);
            });
        } catch (err) {
            alert("生成 zip 文件失败: " + err);
            document.body.removeChild(iframe);
            return;
        }

        // 提取 zip 文件名称：使用索引页 #bodywrap 下 h2 文本（过滤非法字符）
        const zipNameEl = document.querySelector("#bodywrap h2");
        let zipFileName = "images.zip";
        if (zipNameEl && zipNameEl.textContent.trim() !== "") {
            zipFileName = zipNameEl.textContent.trim().replace(/[\/\\:*?"<>|]/g, '_') + ".zip";
        }

        updateProgress("Zip 文件生成完毕，开始下载...");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(zipBlob);
        a.download = zipFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        updateProgress("下载已启动！");
        // 清理 iframe
        document.body.removeChild(iframe);
        setTimeout(() => {
            updateProgress("");
        }, 3000);
    }

    // 在页面 class="asTBcell uwthumb" 的容器底部追加下载按钮（使用 a 标签），样式与页面中其他按钮保持一致（宽度 130px）
    function insertDownloadButton() {
        const container = document.querySelector('.asTBcell.uwthumb');
        if (!container) {
            console.error("未找到 asTBcell uwthumb 容器");
            return;
        }
        const btn = document.createElement("a");
        btn.textContent = "压缩下载";
        btn.href = "javascript:;";
        const refButton = document.querySelector('a[href*="/photos-slide-aid-"]');
        if (refButton) {
            btn.className = refButton.className;
        }
        btn.style.width = "130px";
        if (!btn.className) {
            btn.style.cssText += "display:inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-align:center; text-decoration:none; border-radius: 4px; cursor: pointer; margin-top: 10px;";
        }
        container.appendChild(btn);
        container.appendChild(progressDiv);

        btn.addEventListener("click", function(e) {
            e.preventDefault();
            downloadSlideImages();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", insertDownloadButton);
    } else {
        insertDownloadButton();
    }
})();
