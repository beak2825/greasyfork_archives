// ==UserScript==
// @name         xnyy_Akso_pdftopng（豆包适配版）
// @namespace    http://tampermonkey.net/
// @version      2025-03-04.06
// @description  下载XNYY AKSO PDF（兼容豆包浏览器）
// @author       You
// @match        http://192.10.16.71/web/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=16.71
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528614/xnyy_Akso_pdftopng%EF%BC%88%E8%B1%86%E5%8C%85%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528614/xnyy_Akso_pdftopng%EF%BC%88%E8%B1%86%E5%8C%85%E9%80%82%E9%85%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // **************************
    // 第一步：粘贴完整的jspdf.umd.min.js源码（必须替换下面的占位符）
    // 下载地址：https://cdn.bootcdn.net/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
    // **************************
    window.jsPDF = (function() {
        // 【替换这里】删除下面的示例代码，粘贴完整的jspdf.umd.min.js源码
        // 示例（仅做语法占位，实际需替换）：
        var jsPDF = function(options) {
            this.options = options || { orientation: 'portrait', unit: 'mm', format: 'a4' };
            this.pages = [];
            this.addPage = function() { this.pages.push({}); };
            this.addImage = function(dataURL, type, x, y, w, h) {
                this.pages[this.pages.length - 1].image = dataURL;
            };
            this.save = function(name) {
                const link = document.createElement('a');
                link.href = 'data:application/pdf;base64,dummy'; // 示例，需完整jspdf替换
                link.download = name;
                link.click();
                alert("请替换为完整jspdf源码后再使用！");
            };
            this.addPage();
            return this;
        };
        return jsPDF;
    })();

    // 兼容豆包的页面加载事件
    function waitForPageReady() {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', resolve);
                window.addEventListener('load', resolve);
            }
        });
    }

    // 豆包下的Canvas渲染兼容
    async function getValidCanvases() {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 延长等待
        const canvasElements = document.querySelectorAll('canvas');
        return Array.from(canvasElements).filter(canvas => {
            try {
                return !canvas.classList.contains('hiddenCanvasElement') &&
                       canvas.width > 0 && canvas.height > 0 &&
                       canvas.getContext('2d').getImageData(0, 0, 1, 1).data[3] > 0;
            } catch (e) {
                return false; // 兼容豆包下canvas跨域/权限问题
            }
        });
    }

    // 主逻辑
    waitForPageReady().then(async () => {
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '请输入文件名';
        input.style.cssText = `
            position: fixed; top: 10px; left: 200px; color: red;
            z-index: 9999; padding: 4px; border: 1px solid #ccc;
            background: #fff;
        `;

        // 创建下载按钮
        const button = document.createElement('button');
        button.textContent = '文件加载完点击下载';
        button.style.cssText = `
            position: fixed; top: 10px; left: 10px; color: red;
            z-index: 9999; padding: 4px 8px; cursor: pointer;
            border: 1px solid #ccc; background: #fff;
        `;

        // 按钮点击事件
        button.addEventListener('click', async function() {
            try {
                button.disabled = true;
                button.textContent = '处理中...';

                // 校验文件名
                const fileName = input.value.trim();
                if (!fileName) {
                    alert('请输入文件名！');
                    button.disabled = false;
                    button.textContent = '文件加载完点击下载';
                    return;
                }

                // 重试查找缩放元素（豆包下可能延迟加载）
                let scaleElement = null;
                for (let i = 0; i < 3; i++) {
                    scaleElement = document.querySelector('[data-testid="zoom__popover-target-scale"]');
                    if (scaleElement) break;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                if (scaleElement) {
                    scaleElement.innerHTML = '400%';
                    await new Promise(resolve => setTimeout(resolve, 4000)); // 等待缩放生效
                } else {
                    alert('未找到缩放控制元素，将尝试直接导出！');
                }

                // 获取有效Canvas
                const filteredCanvases = await getValidCanvases();
                if (filteredCanvases.length === 0) {
                    alert('未找到可导出的Canvas内容！');
                    throw new Error('无有效Canvas元素');
                }

                // 初始化PDF
                const doc = new window.jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                // 逐页添加Canvas内容
                for (let i = 0; i < filteredCanvases.length; i++) {
                    const canvas = filteredCanvases[i];
                    await new Promise(resolve => requestAnimationFrame(resolve)); // 等待渲染
                    const canvasDataURL = canvas.toDataURL('image/jpeg', 1.0);
                    if (i > 0) doc.addPage(); // 第一页无需新增
                    doc.addImage(canvasDataURL, 'JPEG', 5, 5, 200, 0);
                }

                // 下载PDF
                doc.save(`${fileName}.pdf`);
                alert(`PDF导出成功！共 ${filteredCanvases.length} 页`);

            } catch (error) {
                console.error('导出失败：', error);
                alert(`导出失败：${error.message}`);
            } finally {
                button.disabled = false;
                button.textContent = '文件加载完点击下载';
            }
        });

        // 追加到页面（核心：这里语法绝对正确）
        document.body.appendChild(button);
        document.body.appendChild(input);
    });

})();