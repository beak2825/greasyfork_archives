// ==UserScript==
// @name         自动获取商品信息并保存为excel
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Capture all goods data and save to Excel with different formats, and allow exporting specific fields with column width adjustment.
// @author       Your Name
// @match        *://*h5.bestpay.com.cn/subapps/bestpaymall*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/511821/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E5%B9%B6%E4%BF%9D%E5%AD%98%E4%B8%BAexcel.user.js
// @updateURL https://update.greasyfork.org/scripts/511821/%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E5%B9%B6%E4%BF%9D%E5%AD%98%E4%B8%BAexcel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let capturedGoods = []; // 存储所有商品信息
    let isCapturing = false; // 控制捕获过程的状态
    let isInitialRequestCaptured = false; // 标识是否已经捕获了初始请求的响应数据
    let isScrolling = false; // 控制滚动状态，防止多次触发滚动
    let currentScrollAttempts = 0; // 当前滚动次数
    let maxScrollAttempts = 100; // 最大滚动次数，防止死循环

    // 添加“开始捕获”按钮
    const captureButton = document.createElement('button');
    captureButton.textContent = "捕获商品信息";
    captureButton.style.position = 'fixed';
    captureButton.style.top = '10px';
    captureButton.style.right = '10px';
    captureButton.style.zIndex = 1000;
    captureButton.style.padding = '10px';
    captureButton.style.backgroundColor = '#FF9800';
    captureButton.style.color = 'white';
    captureButton.style.border = 'none';
    captureButton.style.cursor = 'pointer';

    document.body.appendChild(captureButton);

    // 添加“下载完整数据”按钮
    const downloadButton = document.createElement('button');
    downloadButton.textContent = "下载完整数据excel";
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '50px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = 1000;
    downloadButton.style.padding = '10px';
    downloadButton.style.backgroundColor = '#4CAF50';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.display = 'none'; // 初始隐藏
    document.body.appendChild(downloadButton);

    // 添加“下载简化版数据”按钮
    const downloadSimpleButton = document.createElement('button');
    downloadSimpleButton.textContent = "下载精简数据excel";
    downloadSimpleButton.style.position = 'fixed';
    downloadSimpleButton.style.top = '90px';
    downloadSimpleButton.style.right = '10px';
    downloadSimpleButton.style.zIndex = 1000;
    downloadSimpleButton.style.padding = '10px';
    downloadSimpleButton.style.backgroundColor = '#2196F3';
    downloadSimpleButton.style.color = 'white';
    downloadSimpleButton.style.border = 'none';
    downloadSimpleButton.style.cursor = 'pointer';
    downloadSimpleButton.style.display = 'none'; // 初始隐藏
    document.body.appendChild(downloadSimpleButton);

    // 页面加载后立即开始监听所有 queryGoodsList 请求
    (function (open) {
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener("readystatechange", function () {
                if (this.readyState === 4 && this.responseURL.includes("queryGoodsList")) {
                    try {
                        const responseJson = JSON.parse(this.responseText);
                        if (responseJson.result && Array.isArray(responseJson.result.goods)) {
                            console.log("Captured goods from response: ", responseJson.result.goods);

                            // 只在初始请求时捕获一次数据
                            if (!isInitialRequestCaptured) {
                                console.log("Initial request goods captured.");
                                isInitialRequestCaptured = true;
                            }

                            // 记录商品信息，避免重复添加
                            capturedGoods = [...capturedGoods, ...responseJson.result.goods];
                            console.log(`Total goods captured: ${capturedGoods.length}`);
                        }
                    } catch (e) {
                        console.error("Error parsing response data: ", e);
                    }
                }
            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    // 自动滚动页面，触发新请求
    const autoScrollPage = () => {
        return new Promise((resolve) => {
            const scrollInterval = setInterval(() => {
                window.scrollBy(0, 2000); // 向下滚动页面
                currentScrollAttempts++;

                // 当达到最大滚动次数或页面已经到底部时停止滚动
                if (currentScrollAttempts >= maxScrollAttempts || (window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
                    clearInterval(scrollInterval);
                    resolve();
                }
            }, 1000); // 每1秒滚动一次
        });
    };

    // 点击“开始捕获”按钮时开始自动滚动页面并监听后续请求数据
    captureButton.addEventListener('click', async () => {
        if (!isInitialRequestCaptured) {
            alert("未获取到初始商品，请先刷新页面");
            return;
        }

        alert("点击确定获取商品信息，页面会自动滚动，无需操作，完成后会有提示");

        capturedGoods = [...new Set(capturedGoods)]; // 去重
        currentScrollAttempts = 0; // 重置滚动次数
        isCapturing = true; // 设置捕获状态为 true

        let previousCount = capturedGoods.length; // 记录之前捕获的商品数量

        try {
            while (isCapturing) {
                await autoScrollPage(); // 自动滚动页面
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待请求完成

                // 检查是否还有新商品未捕获，如果没有，则停止
                if (capturedGoods.length === previousCount) {
                    isCapturing = false;
                } else {
                    previousCount = capturedGoods.length; // 更新商品数量
                }
            }

            alert("全部商品获取成功！");

            // 显示“下载文件”按钮
            downloadButton.style.display = 'block';
            downloadSimpleButton.style.display = 'block';
        } catch (error) {
            alert("An error occurred during capturing. Check console for details.");
            console.error("Capturing error: ", error);
        }
    });

    // 生成文件名并下载 Excel
    const downloadExcel = (data, fileName) => {
        if (data.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "GoodsData");

            // 自动调整列宽
            const maxLengths = data.reduce((maxLen, row) => {
                return Object.keys(row).map((key, i) => {
                    // 计算宽度时，将中文字符长度设置为英文字符长度的 2 倍
                    const charLength = String(row[key]).replace(/[^\x00-\xff]/g, "xx").length;
                    return Math.max(maxLen[i] || 0, charLength);
                });
            }, []);

            worksheet['!cols'] = maxLengths.map(length => ({ wch: length + 2 })); // 每列增加2个单位宽度

            const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
            const buffer = new ArrayBuffer(excelData.length);
            const view = new Uint8Array(buffer);
            for (let i = 0; i < excelData.length; i++) {
                view[i] = excelData.charCodeAt(i) & 0xFF;
            }

            const blob = new Blob([buffer], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName; // 使用生成的文件名
            a.click();
            URL.revokeObjectURL(url);
        } else {
            alert("No goods data captured to save.");
        }
    };

    // 点击“下载完整数据”按钮时导出 Excel
    downloadButton.addEventListener('click', () => {
        const pageTitle = document.title.replace(/[\/\\:*?"<>|]/g, ''); // 去除文件名中不允许的特殊字符
        const currentLocalTime = new Date().toLocaleString('zh-CN', { hour12: false,year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit'})
                              .replace(/[\s:/]/g, ''); // 使用本地时间并替换空格、斜杠和冒号为 '-'
        const fileName = `${pageTitle}_${currentLocalTime}.xlsx`;
        downloadExcel(capturedGoods, fileName);
    });

    // 点击“下载简化版数据”按钮时导出简化后的 Excel
    downloadSimpleButton.addEventListener('click', () => {
        const simplifiedGoods = capturedGoods.map((item, index) => ({
            序号: index + 1,
            productId: item.productId || '',
            id: item.id || '',
            name: item.name || '',
            tag: item.tag || '',
            priceToYuan: item.priceToYuan || '',
            photos: item.photos ? item.photos.split(',')[0] : '' // 只保留第一个地址
        }));

        const pageTitle = document.title.replace(/[\/\\:*?"<>|]/g, ''); // 去除文件名中不允许的特殊字符
        const currentLocalTime = new Date().toLocaleString('zh-CN', { hour12: false,year: 'numeric',month: '2-digit',day: '2-digit',hour: '2-digit',minute: '2-digit'})
                              .replace(/[\s:/]/g, ''); // 使用本地时间并替换空格、斜杠和冒号为 '-'
        const fileName = `${pageTitle}_Simplified_${currentLocalTime}.xlsx`;
        downloadExcel(simplifiedGoods, fileName);
    });
})();
