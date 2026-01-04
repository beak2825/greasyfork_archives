// ==UserScript==
// @name         下载选中的 Canvas 图片
// @namespace    http://tampermonkey
// @version      1.1
// @description  鼠标移动到canvas元素上并按下Ctrl+shift+c来选中，将其转换为 PNG 格式图片文件并自动下载到本地。
// @match        *://*.17font.com/*
// @downloadURL https://update.greasyfork.org/scripts/463415/%E4%B8%8B%E8%BD%BD%E9%80%89%E4%B8%AD%E7%9A%84%20Canvas%20%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/463415/%E4%B8%8B%E8%BD%BD%E9%80%89%E4%B8%AD%E7%9A%84%20Canvas%20%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectedCanvas;

    // 处理鼠标移动事件
    const handleMouseMove = (e) => {
        // 获取鼠标所指向的元素
        const element = document.elementFromPoint(e.clientX, e.clientY);

        // 如果鼠标所指向的元素是一个 canvas 元素，则将其保存为 selectedCanvas 变量
        if (element.tagName && element.tagName.toUpperCase() === "CANVAS") {
            selectedCanvas = element;
        }
        else {
            selectedCanvas = null;
        }
    };

    // 处理快捷键事件
    const handleKeyDown = (e) => {
        // 如果按下 ctrl + shift + C 快捷键，并且 selectedCanvas 不为空
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67 && selectedCanvas) {
            // 创建空画布
            const canvas = document.createElement("canvas");
            canvas.width = selectedCanvas.width;
            canvas.height = selectedCanvas.height;

            // selectedCanvas 内容绘制到空画布上
            const context = canvas.getContext("2d");
            context.drawImage(selectedCanvas, 0, 0);

            // 将画布内容转为图片并下载
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                document.body.appendChild(a);
                a.style.display = "none";
                a.href = url;
                a.download = "canvas_image.png";
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                // 提示用户下载成功
                // GM_notification("下载成功", "Canvas downloader");
            });

            // 阻止默认事件
            e.preventDefault();
            e.stopPropagation();
        }
    };

    // 将鼠标移动事件和快捷键事件绑定到 window 对象上
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);

})();