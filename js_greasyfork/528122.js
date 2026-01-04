// ==UserScript==
// @name         知页简历下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  知页简历下载,支持导出知页简历为pdf。
// @author       白
// @match        https://www.zhiyeapp.com/resume/template/preview?*
// @icon         https://static.nowcoder.com/fe/file/images/nowpick/web/www-favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528122/%E7%9F%A5%E9%A1%B5%E7%AE%80%E5%8E%86%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528122/%E7%9F%A5%E9%A1%B5%E7%AE%80%E5%8E%86%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 动态加载脚本的函数
    function loadScript(src, callback) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = () => {
            console.error(`Failed to load script: ${src}`);
            callback(); // 即使加载失败，也继续执行后续逻辑
        };
        document.head.appendChild(script);
    }
    // 定义需要加载的脚本数组
    const scripts = [
        'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.js'
    ];
    // 标记脚本是否加载完成
    let isScriptsLoaded = false;
    // 按钮元素
    let downloadButton;
    // 递归加载脚本
    function loadScriptsSequentially(scripts, index = 0) {
        if (index >= scripts.length) {
            // 所有脚本加载完成后，标记为完成并更新按钮文本
            isScriptsLoaded = true;
            if (downloadButton) {
                downloadButton.textContent = "下载简历";
            }
            console.log('All scripts loaded successfully!');
            return;
        }
        // 加载当前脚本
        loadScript(scripts[index], () => {
            console.log("load" + scripts[index]);
            // 加载下一个脚本
            loadScriptsSequentially(scripts, index + 1);
        });
    }
    // 初始化下载按钮
    function initDownloadButton() {
        // 创建一个下载按钮
        downloadButton = document.createElement('button');
        downloadButton.textContent = "下载简历【插件初始化中】";
        downloadButton.style.position = "fixed";
        downloadButton.style.top = "10px";
        downloadButton.style.right = "10px";
        downloadButton.style.zIndex = "999999"; // 确保按钮在最上层
        downloadButton.style.padding = "10px";
        downloadButton.style.backgroundColor = "#007bff";
        downloadButton.style.color = "#fff";
        downloadButton.style.border = "none";
        downloadButton.style.borderRadius = "5px";
        downloadButton.style.cursor = "pointer";
        document.body.appendChild(downloadButton);
        // 添加点击事件
        downloadButton.addEventListener('click', async () => {
            if (!isScriptsLoaded) {
                alert("插件初始化未完成，请稍后再试！");
                return;
            }
            // 更新按钮文本为“生成中”
            downloadButton.textContent = "下载简历【生成pdf中】";
            // 获取所有 class="page" 的元素
            const pages = document.querySelectorAll('.page');
            // 初始化 jsPDF
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4'); // 创建 A4 大小的 PDF
            // 遍历每个页面
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                try {
                    // 使用 html2canvas 将页面转换为 canvas
                    const canvas = await html2canvas(page);
                    const imgData = canvas.toDataURL('image/png');
                    // 将图片添加到 PDF
                    const imgWidth = pdf.internal.pageSize.getWidth(); // 获取 PDF 页面宽度
                    const imgHeight = (canvas.height * imgWidth) / canvas.width; // 按比例计算高度
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    // 如果不是最后一页，添加新页面
                    if (i < pages.length - 1) {
                        pdf.addPage();
                    }
                } catch (error) {
                    console.error(`Error generating image for page ${i + 1}:`, error);
                }
            }
            // 获取文件名
            const fileNameElement = document.querySelector('.name-desc .name a');
            let fileName = '简历'; // 默认文件名
            if (fileNameElement && fileNameElement.textContent) {
                fileName = fileNameElement.textContent.trim(); // 使用元素文本作为文件名
            }
            // 下载 PDF
            pdf.save(`${fileName}.pdf`);
            // 恢复按钮文本
            downloadButton.textContent = "下载简历";
            alert("PDF 生成成功，点击确定开始下载!"); // 提示用户
        });
    }
    // 提前显示按钮
    initDownloadButton();
    // 开始加载脚本
    loadScriptsSequentially(scripts);
})();

