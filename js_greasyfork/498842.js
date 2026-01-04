// ==UserScript==
// @name        国家中小学教育智慧平台教材及教学视频下载
// @namespace   http://tampermonkey.net/
// @version     2024-06-25
// @description 国家中小学教育智慧平台教材及教学视频下载 免责声明 请勿用于任何商业等行为目的 请遵守原站点对于内容的引用规定 此脚本仅用作交流学习
// @author      You
// @match       *basic.smartedu.cn/tchMaterial/detail*
// @icon        data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       看后续反馈再决定是否增加视频下载的需求
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498842/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E5%8F%8A%E6%95%99%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/498842/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E5%B9%B3%E5%8F%B0%E6%95%99%E6%9D%90%E5%8F%8A%E6%95%99%E5%AD%A6%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 等待页面完全加载后执行操作
    window.addEventListener('load', function() {
        // 等待 PDF.js 渲染的容器元素加载
        var interval = setInterval(function() {
            var pdfViewer = document.querySelector('.toolBar-module_wrapper_NU9GV'); // 替换成实际的 PDF.js 容器的类名或选择器
            var element = document.querySelector('h3.index-module_title_bnE9V').textContent;
            if (pdfViewer) {
                clearInterval(interval); // 清除定时器，停止检测

                // 创建下载按钮
                var downloadButton = document.createElement('button');
                downloadButton.textContent = '下载文件';
                downloadButton.style.marginLeft = '10px'; // 样式可以根据需要自行调整

                // 添加按钮点击事件处理程序
                downloadButton.addEventListener('click', function() {
                    // 获取 PDF.js 渲染的 PDF 文件 URL
                    var iframe = document.getElementById('pdfPlayerFirefox');
                    var pdfUrl = decodeURIComponent(iframe.src);
                    console.log(pdfUrl);
                    if (!pdfUrl) {
                        console.error('PDF file URL not found.');
                        return;
                    }
                    // 使用 URLSearchParams 获取参数值
                    var params = new URLSearchParams(pdfUrl.split('?')[1]);
                    var fileParam = params.get('file');
                    var headersParam1 = params.get('headers');

                    //剔除多余参数 确保格式正确
                    var headersParam = headersParam1.replace(/#.*/, '');
                     console.log(headersParam);
                    // 解析 headers 参数为对象
                    var headers;
                    try {
                      headers = JSON.parse(headersParam);
                    } catch (error) {
                      console.error("Error parsing headers JSON:", error);
                    }

                    // 打印提取的参数值
                    console.log("Extracted file parameter value:", fileParam);
                    console.log("Extracted headers parameter value:", headers);
                    // 发起请求获取 PDF 文件内容
                    fetch(fileParam,{method: 'GET',headers: headers,})
                        .then(function(response) {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.blob();
                        })
                        .then(function(pdfBlob) {
                            // 创建 Blob URL 并创建下载链接
                            var blobUrl = URL.createObjectURL(pdfBlob);
                            var downloadLink = document.createElement('a');
                            downloadLink.href = blobUrl;
                            downloadLink.download = element +'.pdf';
                            downloadLink.click();

                            // 释放 Blob URL
                            URL.revokeObjectURL(blobUrl);
                        })
                        .catch(function(error) {
                            console.error('Error fetching PDF file:', error);
                        });
                });

                // 将下载按钮添加到页面上
                pdfViewer.appendChild(downloadButton);
            }
        }, 100); // 每 100 毫秒检查一次是否已加载 PDF.js 容器
    });
})();