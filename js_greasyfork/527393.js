// ==UserScript==
// @name         DeepSeek 对话导出
// @namespace    https://www.yffjglcms.com/
// @version      1.0.3
// @description  直接点击右上角导出按钮，即可导出对话为png图片！
// @author       yffjglcms
// @match        *://*.chat.deepseek.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/dom-to-image-more/3.5.0/dom-to-image-more.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527393/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/527393/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建下载按钮
    const downloadButton = document.createElement("button");
    downloadButton.innerText = "导出";
    downloadButton.style.position = "fixed";
    downloadButton.style.top = "10px";
    downloadButton.style.right = "10px";
    downloadButton.style.zIndex = "1000";
    downloadButton.style.padding = "8px 20px";
    downloadButton.style.backgroundColor = "#414158";
    downloadButton.style.color = "white";
    downloadButton.style.border = "none";
    downloadButton.style.cursor = "pointer";
    downloadButton.style.borderRadius="14px"
    document.body.appendChild(downloadButton);

    // 获取目标元素（这里假设为 '#root > div > div' 中的第二个元素）
    // const targetDiv = document.querySelectorAll('#root > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(2) > div > div > div:nth-child(1)')[0];

    const passLimit = 10;

    // 进行截图
    const takeScreenshot = async (element, width, height, additionalScale = 1, currentPass = 1) => {
        const ratio = window.devicePixelRatio || 1;
        const scale = ratio * 2 * additionalScale;
        let canvas = null;
        try {
            canvas = await html2canvas(element, {
                scale,
                useCORS: true,
                width: width,
                height: height,
                scrollX: 0,
                scrollY: 0,
                backgroundColor: 'rgb(41, 42, 45)'
            });
        } catch (error) {
            console.error(`截图失败，参数 height=${height} width=${width} scale=${scale}`, error);
        }
        if (!canvas) {
            if (currentPass > passLimit) return null;
            return takeScreenshot(element, width, height, additionalScale / 1.4, currentPass + 1);
        }
        const context = canvas.getContext("2d");
        if (context) context.imageSmoothingEnabled = false;
        const dataUrl = canvas.toDataURL("image/png", 1);
        if (!dataUrl || dataUrl === "data:,") {
            if (currentPass > passLimit) return null;
            return takeScreenshot(width, height, additionalScale / 1.4, currentPass + 1);
        }
        return dataUrl;
    };

    downloadButton.addEventListener("click", async () => {

        const targetDiv = document.querySelectorAll('div.scrollable:nth-child(1) > div > div:nth-child(1)')[0];
        const tmpHideDiv = document.querySelectorAll('div.scrollable:nth-child(1) > div > div:nth-child(1)');
        if (!targetDiv) {
            console.error("目标DIV未找到，请检查选择器！");
            return;
        }

        // 使用元素的实际内容尺寸
        const width = targetDiv.scrollWidth;
        const height = targetDiv.scrollHeight;

        // 暂时隐藏不必要元素
        const bakDisplay = {}
        // tmpHideDiv.forEach(e=>{
        //     bakDisplay[e.id] = e.style.display
        //     e.style.display = 'none'
        // })

        // 截图
        const dataUrl = await takeScreenshot(targetDiv, width, height);

        // // 恢复隐藏不必要元素
        // tmpHideDiv.forEach(e=>{
        //     e.style.display = bakDisplay[e.id]
        // })

        if (!dataUrl) {
            alert("截图失败！");
            return;
        }
        // 创建下载链接并触发下载
        const downloadLink = document.createElement("a");
        downloadLink.href = dataUrl;
        downloadLink.download = document.title || "download.png";
        downloadLink.click();
    });
})();
