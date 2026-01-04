// ==UserScript==
// @name         替换亚马逊图片看效果
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  支持Base64/URL，替换主图（#detailImg）、固定目标和鼠标悬停图片，同时保留原有固定目标替换，鼠标描边1秒后消失。
// @author       z-l.top
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490198/%E6%9B%BF%E6%8D%A2%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%9B%BE%E7%89%87%E7%9C%8B%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/490198/%E6%9B%BF%E6%8D%A2%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%9B%BE%E7%89%87%E7%9C%8B%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 清空 zoomWindow 的 id **/
    function setIdToEmpty() {
        const zoomWindow = document.getElementById("zoomWindow");
        if (zoomWindow) zoomWindow.id = "";
    }

    /** 创建按钮 **/
    const button = document.createElement("button");
    button.innerHTML = "换主图";
    Object.assign(button.style, {
        position: "fixed",
        left: "10px",
        top: "10px",
        zIndex: "9999",
        padding: "10px 14px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
    });
    document.body.appendChild(button);

    /** 鼠标悬停图片记录 **/
    let currentHoveredImg = null;
    document.addEventListener("mousemove", (e) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        const foundImg = elements.find(el => el.tagName && el.tagName.toLowerCase() === "img");
        currentHoveredImg = foundImg || null;
    });

    /** 替换图片函数 **/
    function replaceImgAttributes(img, imageUrl) {
        if (!img) return false;

        // 替换 src 属性
        img.src = imageUrl;

        // 替换 srcset 属性
        if (img.hasAttribute('srcset')) {
            img.srcset = imageUrl;
        }

        // 替换懒加载属性
        if (img.dataset) {
            img.dataset.oldHires = imageUrl;
            img.dataset.src = imageUrl;
        }

        // 替换 data-a-dynamic-image 属性
        if (img.getAttribute("data-a-dynamic-image")) {
            try {
                const dynamicObj = {};
                dynamicObj[imageUrl] = [img.width || 1000, img.height || 1000];
                img.setAttribute("data-a-dynamic-image", JSON.stringify(dynamicObj));
            } catch (e) {
                console.warn("设置 data-a-dynamic-image 失败", e);
            }
        }

        return true;
    }

    /** 替换主图（#detailImg）增强版 **/
    function replaceDetailImg(imageUrl) {
        const detailImg = document.getElementById("detailImg") || document.querySelector("#main-image-container img");
        return replaceImgAttributes(detailImg, imageUrl);
    }

    /** 替换图片函数 **/
    async function replaceImagesFromClipboard() {
        try {
            const text = (await navigator.clipboard.readText()).trim();
            const isImageUrl = /\.(jpeg|jpg|gif|png|webp)$/i.test(text);
            const isBase64 = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(text);

            if (!isImageUrl && !isBase64) {
                alert("⚠️ 剪贴板内容不是有效的图片链接或 Base64 图片。");
                return;
            }

            const imageUrl = text;
            let replacedCount = 0;

            // 🎯 固定目标替换
            if (replaceDetailImg(imageUrl)) replacedCount++;

            const imgTagWrapper = document.querySelector(".imgTagWrapper img");
            if (imgTagWrapper && replaceImgAttributes(imgTagWrapper, imageUrl)) replacedCount++;

            const firstButtonImg = document.querySelector(".a-button-text img");
            if (firstButtonImg && replaceImgAttributes(firstButtonImg, imageUrl)) replacedCount++;

            const grayOverlays = document.querySelectorAll(".imageBlockThumbnailImageGrayOverlay");
            if (grayOverlays.length >= 2) {
                const secondGray = grayOverlays[1];
                const nextImg = secondGray.nextElementSibling;
                if (nextImg && nextImg.tagName.toLowerCase() === "img") {
                    if (replaceImgAttributes(nextImg, imageUrl)) replacedCount++;
                }
            }

            // 🖱 鼠标悬停图片替换（稳妥描边消失）
            if (currentHoveredImg) {
                const img = currentHoveredImg; // 保存局部引用
                replaceImgAttributes(img, imageUrl);
                img.style.outline = "3px solid #007bff";
                setTimeout(() => {
                    if (img && img.style) img.style.removeProperty("outline");
                }, 1000);
                replacedCount++;
            }

            if (replacedCount > 0) {
                console.log(`✅ 已替换 ${replacedCount} 张图片：`, imageUrl.slice(0, 120) + (imageUrl.length > 120 ? "..." : ""));
            } else {
                alert("未找到可替换的图片节点，请确认页面主图已加载。");
            }

        } catch (err) {
            console.error("❌ 无法读取剪贴板内容:", err);
            alert("无法读取剪贴板内容，请确保浏览器允许访问剪贴板。");
        }
    }

    /** 点击按钮替换 **/
    button.addEventListener("click", replaceImagesFromClipboard);

    /** 快捷键 S 替换 **/
    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "s") replaceImagesFromClipboard();
    });

    /** 初始化监控 **/
    setIdToEmpty();
    new MutationObserver(() => setIdToEmpty()).observe(document.body, { childList: true, subtree: true });

})();
