// ==UserScript==
// @name         Threads.net Media Downloader v5
// @namespace    http://tampermonkey.net/
// @version      5.0.0
// @license      MIT
// @description  Download images (原始副檔名) + videos from Threads posts, auto open spoiler, auto-like.
// @author       StevenJon0826
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/508541/Threadsnet%20Media%20Downloader%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/508541/Threadsnet%20Media%20Downloader%20v5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ⭐ 自動點開 Spoiler 遮罩
    const openSpoilers = () => {
        document.querySelectorAll(".x5yr21d.x1n2onr6.xh8yej3").forEach(el => {
            if (el.__openedSpoiler) return; // 避免重複點擊

            const text = el.textContent?.trim();
            if (text !== "劇透" && text !== "Spoiler") return;

            el.__openedSpoiler = true;
            el.click(); // 🔥 Threads 原生行為：click 即可解除 spoiler
        });
    };

    // ⭐ 從 srcset 選擇解析度最高的網址
    const pickBestFromSrcset = (srcset) => {
        if (!srcset) return null;
        return srcset
            .split(",")
            .map(s => s.trim())
            .map(entry => {
                const [url, descriptor] = entry.split(/\s+/);
                const num = descriptor?.endsWith("w")
                    ? parseInt(descriptor, 10)
                    : descriptor?.endsWith("x")
                        ? parseFloat(descriptor) * 1000 // 粗略轉成權重
                        : 0;
                return { url, weight: isNaN(num) ? 0 : num };
            })
            .filter(item => !!item.url)
            .sort((a, b) => b.weight - a.weight)[0]?.url || null;
    };

    // ⭐ 取出媒體網址（支援圖片與影片），盡量抓最高畫質
    const resolveMediaUrl = (node) => {
        if (!node) return null;
        if (node.tagName.toLowerCase() === "video") {
            // 影片優先抓 currentSrc，其次 src/source，再退而求其次使用封面
            const source = node.querySelector("source[src]");
            return node.currentSrc || node.src || source?.src || node.getAttribute("poster") || null;
        }

        // 圖片：優先從自身 srcset 取最大，其次從父層 <picture> 的 <source>，最後回退 src
        const srcsetBest = pickBestFromSrcset(node.srcset);
        if (srcsetBest) return srcsetBest;

        const picture = node.closest("picture");
        if (picture) {
            const sourceBest = Array.from(picture.querySelectorAll("source[srcset]"))
                .map(srcEl => pickBestFromSrcset(srcEl.srcset))
                .filter(Boolean)
                .sort((a, b) => b.length - a.length)[0]; // 粗略選擇較長網址（多為大圖）
            if (sourceBest) return sourceBest;
        }

        return node.src || null;
    };

    // ⭐ 根據網址抓副檔名，盡量維持原始檔案類型
    const pickExtension = (url, fallback) => {
        if (!url) return fallback;
        const cleanUrl = url.split("?")[0];
        const match = cleanUrl.match(/\.([a-zA-Z0-9]+)$/);
        return match ? `.${match[1]}` : fallback;
    };

    // ⭐ 生成安全的檔名片段，避免非法字元
    const safePart = (text, defaultVal = "Threads") =>
        (text || defaultVal).replace(/[\\/:*?"<>|]/g, "_").trim() || defaultVal;

    function addButtonToElement(element) {
        // 檢查該元素是否已經存在按鈕，避免重複加入
        if (!element.querySelector('button.my-custom-button')) {
            // 建立按鈕
            const button = document.createElement('button');
            button.textContent = 'Download';
            button.classList.add('my-custom-button');
            button.style.position = 'relative';
            // 當按鈕被點擊時，往上找兩層並統計<picture>元素內的<img>數量
            button.addEventListener('click', function(event) {
                // 阻止事件的預設行為和冒泡
                event.preventDefault();
                event.stopPropagation();

                // 往上找兩層 //x1s688f
                const grandparentElement = element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
                if (grandparentElement) {
                    // 在祖先層級中尋找所有圖片與影片
                    const mediaNodes = grandparentElement.querySelectorAll('picture img, video');
                    // 找到 class 包含 x1s688f 的 <span> 並取得其文字內容
                    const spanElement = grandparentElement.querySelector('span[class*="x1s688f"]');
                    const spanText = spanElement ? spanElement.textContent : undefined; // 取得文字內容
                    const timeElement = grandparentElement.querySelector('time'); // 假設只有一個time元素
                    let formattedTime;
                    if (timeElement) {
                        const datetimeValue = timeElement.getAttribute('datetime'); // 取得datetime屬性
                        const dateObject = new Date(datetimeValue); // 將datetime轉換為Date物件

                        // 格式化日期為YYYYMMDD_hhmmss
                        const year = dateObject.getFullYear();
                        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // 月份從0開始，所以加1
                        const day = String(dateObject.getDate()).padStart(2, '0');
                        const hours = String(dateObject.getHours()).padStart(2, '0');
                        const minutes = String(dateObject.getMinutes()).padStart(2, '0');
                        const seconds = String(dateObject.getSeconds()).padStart(2, '0');

                        formattedTime = `${year}${month}${day}_${hours}${minutes}${seconds}`;
                    }
                    const safeSpan = safePart(spanText);

                    mediaNodes.forEach((node, index) => {
                        const mediaUrl = resolveMediaUrl(node);
                        if (!mediaUrl) return;

                        const isVideo = node.tagName.toLowerCase() === "video";
                        const ext = pickExtension(mediaUrl, isVideo ? ".mp4" : ".jpg");
                        const filename = `Threads-${safeSpan}-${formattedTime}-${index + 1}${ext}`;

                        // 使用 GM_download 支援跨來源下載
                        GM_download({
                            url: mediaUrl,
                            name: filename,
                        });
                    });

                    // 找到 aria-label 為 "讚" 或 "Like" 的按鈕（同時支援中文與英文）
                    const likeButton = grandparentElement.querySelector('[aria-label="讚"], [aria-label="Like"]');

                    if (likeButton) {
                        if (typeof likeButton.click === 'function') {
                            likeButton.click(); // 如果元素有 click 方法，模擬點擊
                        } else {
                            // 如果該元素是SVG，則創建一個事件手動觸發
                            const event = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true
                            });
                            likeButton.dispatchEvent(event); // 模擬點擊事件
                        }
                        console.log('Like button clicked');
                    } else {
                        console.log('No like button with aria-label "讚" found');
                    }

                } else {
                    console.log('Could not find grandparent element');
                }
            });
            // 將按鈕加入到該元素中
            element.appendChild(button);
        }
    }

    function scanForElements() {
        // 定期掃描符合條件的元素
        const elements = document.querySelectorAll('div[class*="x1fc57z9"]');
        elements.forEach(addButtonToElement);
    }

    // 使用setInterval每隔一段時間檢查畫面上是否有符合條件的元素
    setInterval(scanForElements, 500); // 每秒檢查一次
    setInterval(openSpoilers, 500); // 每秒檢查一次
})();
