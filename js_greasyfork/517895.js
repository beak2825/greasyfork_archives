// ==UserScript==
// @name         Ozon Product Info Export to Excel with Draggable UI
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  获取Ozon商品信息并导出到Excel，带可拖动的用户界面和版权信息，优化关键词获取
// @author       Nicole
// @match        https://www.ozon.ru/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.1/xlsx.full.min.js
// @icon         https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif
// @supportURL   https://gitcode.com/nicole2088/ozon
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/517895/Ozon%20Product%20Info%20Export%20to%20Excel%20with%20Draggable%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/517895/Ozon%20Product%20Info%20Export%20to%20Excel%20with%20Draggable%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const styles = `
        #ozon-export-container {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #ffffff;
            border: 2px solid #007bff;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            font-family: Arial, sans-serif;
            width: 320px;
            cursor: move;
        }
        #ozon-export-container h2 {
            margin-top: 0;
            color: #007bff;
            font-size: 16px;
            cursor: move;
        }
        #ozon-export-container .instruction {
            font-size: 14px;
            color: #333;
            margin-top: 5px;
        }
        #ozon-export-container button {
            padding: 8px 15px;
            margin-top: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #ozon-export-container button:hover {
            background-color: #0056b3;
        }
        #ozon-export-container .progress-container {
            margin-top: 15px;
        }
        #ozon-export-container .progress-container progress {
            width: 100%;
            height: 15px;
        }
        #ozon-export-container .close-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #007bff;
        }
        #ozon-export-container .status-text {
            font-size: 14px;
            margin-bottom: 5px;
        }
        #ozon-export-container .footer {
            margin-top: 10px;
            text-align: right;
            font-size: 12px;
            color: #888;
        }
    `;

    // 添加样式到页面
    function addStyles(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    // 创建用户界面
    function createUI() {
        const container = document.createElement('div');
        container.id = 'ozon-export-container';
        container.innerHTML = `
            <button class="close-btn">&times;</button>
            <h2>Ozon商品信息抓取小助手v4.4</h2>
            <p class="instruction">请在商品页面加载完成后进行导出</p>
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <button id="export-btn">导出到Excel</button>
                <span class="footer">Made by Nicole</span>
            </div>
            <div class="progress-container" style="display:none;">
                <p id="progressStatus" class="status-text">准备中...</p>
                <progress id="progressBar" value="0" max="100"></progress>
            </div>
        `;
        document.body.appendChild(container);

        container.querySelector('.close-btn').addEventListener('click', () => {
            container.style.display = 'none';
        });

        container.querySelector('#export-btn').addEventListener('click', collectAndExport);

        makeDraggable(container);

        return {
            progressContainer: container.querySelector('.progress-container'),
            progressBar: container.querySelector('#progressBar'),
            progressStatus: container.querySelector('#progressStatus'),
            container: container
        };
    }

    // 添加拖动功能
    function makeDraggable(element) {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        const header = element.querySelector('h2');
        header.style.cursor = 'move';

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        function mouseMoveHandler(e) {
            if (isDragging) {
                element.style.left = (e.clientX - offsetX) + 'px';
                element.style.top = (e.clientY - offsetY) + 'px';
                element.style.right = 'auto';
            }
        }

        function mouseUpHandler() {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }
    }

    // 获取商品名称
    function getProductName() {
        const nameElement = document.querySelector('h1.m5t_27.tsHeadline550Medium');
        return nameElement ? nameElement.innerText.trim() : '无商品名称';
    }

    // 获取商品图片URL
    function getProductImages() {
        const images = [];
        const imageElements = document.querySelectorAll('div.k1q_27.qk1_27 img');
        imageElements.forEach((img) => {
            if (img.src) {
                images.push(img.src);
            }
        });
        return images;
    }

    // 获取商品详情（存储条件和组成）
    function getProductDetails() {
        const details = [];
        const detailSections = document.querySelectorAll('.RA-a1 h3');
        detailSections.forEach((section) => {
            const title = section.innerText.trim();
            const content = section.nextElementSibling ? section.nextElementSibling.innerText.trim() : '';
            details.push(`${title}: ${content}`);
        });
        return details.join('\n');
    }

    // 获取商品信息
    function getProductInfo() {
        const info = [];
        const infoElements = document.querySelectorAll('.y8m_27 .my9_27');
        infoElements.forEach((item) => {
            const label = item.querySelector('.tsBodyM');
            const value = item.querySelector('.tsBody400Small');
            if (label && value) {
                info.push(`${label.innerText.trim()}: ${value.innerText.trim()}`);
            }
        });
        return info.join(', ');
    }

    // 获取关键词
    function getKeywords() {
        const keywordElements = document.querySelectorAll('.re5_10 .e4r_10');
        let keywords = [];
        keywordElements.forEach((el) => {
            keywords.push(el.innerText.trim());
        });
        return keywords.join(', ');
    }

    // 获取视频URL
    function getVideoUrl() {
        const videoElement = document.querySelector('video[qa-id="video-player.video-element"]');
        return videoElement ? videoElement.src : null;
    }

    // 导出为Excel
    function exportToExcel(data) {
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Product Info");

        const range = XLSX.utils.decode_range(ws['!ref']);

        // 设置表头样式
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!ws[cellAddress]) continue;

            ws[cellAddress].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "007BFF" } },
                alignment: { horizontal: "center", vertical: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } },
                }
            };
        }

        // 设置内容样式
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            const fillColor = R % 2 === 0 ? "DDEBF7" : "FFFFFF";
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;

                ws[cellAddress].s = {
                    alignment: { horizontal: "center", vertical: "center" },
                    fill: { fgColor: { rgb: fillColor } },
                    border: {
                        top: { style: "thin", color: { rgb: "CCCCCC" } },
                        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                        left: { style: "thin", color: { rgb: "CCCCCC" } },
                        right: { style: "thin", color: { rgb: "CCCCCC" } },
                    }
                };
            }
        }

        ws['!cols'] = [
            { wpx: 200 }, // 商品名称
            { wpx: 300 }, // 商品图片
            { wpx: 250 }, // 商品信息
            { wpx: 180 }, // 关键词
            { wpx: 200 }  // 商品详情
        ];

        XLSX.writeFile(wb, "ozon_product_info_styled.xlsx");
    }

    // 下载商品图片
    function downloadImages(images, progressBar, progressStatus) {
        const total = images.length;
        let completed = 0;

        images.forEach((imageUrl, index) => {
            GM_download({
                url: imageUrl,
                name: `product_image_${index + 1}.jpg`,
                saveAs: false,
                onload: () => {
                    completed++;
                    const progress = ((completed) / total) * 100;
                    progressBar.value = progress;
                    progressStatus.innerText = `下载图片 ${completed} / ${total}`;
                },
                onerror: (error) => {
                    console.error('下载图片失败:', error);
                    progressStatus.innerText = `下载图片 ${index + 1} 失败`;
                }
            });
        });
    }

    // 下载视频
    function downloadVideo(videoUrl, progressBar, progressStatus) {
        if (videoUrl) {
            GM_download({
                url: videoUrl,
                name: `product_video.mp4`,
                saveAs: false,
                onload: () => {
                    progressBar.value = 100;
                    progressStatus.innerText = `视频下载完成`;
                },
                onerror: (error) => {
                    console.error('下载视频失败:', error);
                    progressStatus.innerText = `视频下载失败`;
                }
            });
        }
    }

    // 创建用户界面并返回控制元素
    const ui = createUI();

    // 更新进度
    function updateProgress(progressBar, progressStatus, progress, message) {
        progressBar.value = progress;
        progressStatus.innerText = message;
    }

    // 主功能：抓取信息并导出到Excel
    function collectAndExport() {
        ui.progressContainer.style.display = 'block';
        updateProgress(ui.progressBar, ui.progressStatus, 0, '开始抓取商品信息...');

        setTimeout(() => {
            const productName = getProductName();
            updateProgress(ui.progressBar, ui.progressStatus, 10, '获取商品名称');

            const productImages = getProductImages();
            updateProgress(ui.progressBar, ui.progressStatus, 30, '获取商品图片');

            const productDetails = getProductDetails();
            updateProgress(ui.progressBar, ui.progressStatus, 50, '获取商品详情');

            const productInfo = getProductInfo();
            updateProgress(ui.progressBar, ui.progressStatus, 70, '获取商品信息');

            const keywords = getKeywords();
            updateProgress(ui.progressBar, ui.progressStatus, 80, '获取关键词');

            const videoUrl = getVideoUrl();
            updateProgress(ui.progressBar, ui.progressStatus, 85, '检查视频');

            const productData = [
                ["商品名称", "商品图片", "商品信息", "关键词", "商品详情"],
                [productName, productImages.join(','), productInfo, keywords, productDetails]
            ];

            exportToExcel(productData);
            updateProgress(ui.progressBar, ui.progressStatus, 90, '数据已导出到Excel');

            if (productImages.length > 0) {
                updateProgress(ui.progressBar, ui.progressStatus, 90, '开始下载图片...');
                downloadImages(productImages, ui.progressBar, ui.progressStatus);
            }

            if (videoUrl) {
                updateProgress(ui.progressBar, ui.progressStatus, 95, '开始下载视频...');
                downloadVideo(videoUrl, ui.progressBar, ui.progressStatus);
            }

            updateProgress(ui.progressBar, ui.progressStatus, 100, '操作完成');

        }, 100);
    }

    // 添加样式
    addStyles(styles);

    // 在用户打开 https://www.ozon.ru/ 时显示界面
    if (window.location.href === 'https://www.ozon.ru/' || window.location.href === 'https://www.ozon.ru') {
        ui.container.style.display = 'block';
    }

})();


