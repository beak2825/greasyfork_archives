// ==UserScript==
// @name         Yamibo Manga to PDF
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用最后两个<li>内容命名PDF，自动抓取图片并生成PDF
// @author       You
// @match        https://www.yamibo.com/*
// @grant        GM_xmlhttpRequest
// @connect      img.yamibo.com
// @require      https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/538621/Yamibo%20Manga%20to%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/538621/Yamibo%20Manga%20to%20PDF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    createFloatingButton();

    function createFloatingButton() {
        const button = document.createElement('button');
        button.textContent = '📥 下载为PDF';
        Object.assign(button.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '99999',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
        });

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#1976D2';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#2196F3';
        });

        button.onclick = () => {
            console.log('开始收集图片...');
            startCrawling();
        };

        document.body.appendChild(button);
    }

    function startCrawling() {
        const breadcrumbList = document.querySelectorAll('ul.breadcrumb > li');

        if (breadcrumbList.length < 2) {
            showNotification('❌ 未找到足够的面包屑导航项', 'error');
            return;
        }

        const mangaTitle = breadcrumbList[breadcrumbList.length - 2].innerText.trim();
        const chapterTitle = breadcrumbList[breadcrumbList.length - 1].innerText.trim();

        const filename = `${sanitizeFilename(mangaTitle)}-${sanitizeFilename(chapterTitle)}.pdf`;

        showNotification(`📄 文件将保存为：${filename}`);

        const imageUrls = [];
        const imgElement = document.getElementById('imgPic');

        if (!imgElement) {
            showNotification('❌ 未找到图片元素', 'error');
            return;
        }

        imageUrls.push(imgElement.src);
        showNotification(`✅ 已收集第1页图片`);

        let nextPageUrl = document.querySelector('li.next a')?.href;
        let pageCount = 1;

        if (!nextPageUrl) {
            showNotification('🔚 仅发现单页内容，即将生成PDF');
            generatePDF(imageUrls, filename);
            return;
        }

        const processPages = () => {
            if (!nextPageUrl) {
                showNotification(`✅ 完成！共收集到${pageCount}页图片`);
                generatePDF(imageUrls, filename);
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: nextPageUrl,
                headers: {
                    'Referer': location.origin
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        const img = doc.getElementById('imgPic');
                        if (img) {
                            pageCount++;
                            imageUrls.push(img.src);
                            showNotification(`✅ 已收集第${pageCount}页图片`);
                        }

                        const nextLink = doc.querySelector('li.next a');
                        nextPageUrl = nextLink ? new URL(nextLink.href, location.origin).href : null;

                        processPages();
                    }
                },
                onerror: function(err) {
                    showNotification(`网络错误: ${err.statusText}`, 'error');
                }
            });
        };

        processPages();
    }

    function generatePDF(imageUrls, filename) {
        const loading = showLoadingNotification('⏳ 正在生成PDF...');
        const pdf = new jspdf.jsPDF('p', 'pt', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let loadedCount = 0;

        const downloadImage = (index) => {
            if (index >= imageUrls.length) {
                loading.remove();
                pdf.save(filename);
                showNotification('✅ PDF生成完成！');
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: imageUrls[index],
                responseType: 'blob',
                headers: {
                    'Referer': 'https://www.yamibo.com/'
                },
                onload: function(response) {
                    const reader = new FileReader();
                    reader.onload = function() {
                        const imgData = reader.result;
                        if (index > 0) pdf.addPage();
                        pdf.addImage(imgData, 'JPG', 0, 0, pageWidth, pageHeight);
                        loadedCount++;
                        updateProgress(loadedCount, imageUrls.length);
                        downloadImage(index + 1);
                    };
                    reader.readAsDataURL(response.response);
                }
            });
        };

        downloadImage(0);
    }

    function sanitizeFilename(str) {
        const illegalRe = /[\\\/\:\*\?"<>\|]/g;
        const fullWidthRe = /[\uFF01-\uFF5E]/g;
        return str.replace(illegalRe, '')
                 .replace(fullWidthRe, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
                 .trim();
    }

    function showNotification(message, type = 'info') {
        const colors = { info: '#2196F3', success: '#4CAF50', error: '#F44336' };
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 80px;
            background: ${colors[type]};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 99998;
            animation: slideIn 0.3s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        `;
        notification.innerHTML = `
            <style>
                @keyframes slideIn {
                    to { opacity: 1; transform: translateY(0); }
                }
            </style>
            ${message}
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            notification.addEventListener('animationend', () => notification.remove());
        }, 3000);
        return notification;
    }

    function showLoadingNotification(message) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffffee;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
            z-index: 99999;
            font-weight: bold;
            min-width: 200px;
            text-align: center;
        `;
        container.innerHTML = `
            <div style="margin-bottom: 8px"><span class="spinner"></span></div>
            ${message}
            <div id="progress-bar" style="width: 100%; height: 6px; background: #eee; margin-top: 12px; border-radius: 3px; overflow: hidden;">
                <div id="progress-fill" style="width: 0%; height: 100%; background: #2196F3; transition: width 0.3s;"></div>
            </div>
            <style>
                .spinner {
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                    border: 3px solid #2196F3;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s infinite linear;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(container);
        return container;
    }

    function updateProgress(current, total) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const percent = Math.round((current / total) * 100);
            progressFill.style.width = percent + '%';
        }
    }
})();