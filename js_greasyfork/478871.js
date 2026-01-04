// ==UserScript==
// @name         利用google api生成当前页面二维码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a "Generate QR Code" button to mp.weixin.qq.com
// @author       Cantan Tam
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478871/%E5%88%A9%E7%94%A8google%20api%E7%94%9F%E6%88%90%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/478871/%E5%88%A9%E7%94%A8google%20api%E7%94%9F%E6%88%90%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isGeneratingQRCode = false;

    // 创建按钮元素
    const qrCodeButton = document.createElement('div');
    const buttonContent = document.createElement('div');
    buttonContent.textContent = '生成二维码';
    qrCodeButton.appendChild(buttonContent);

    // 设置按钮样式
    qrCodeButton.style.position = 'fixed';
    qrCodeButton.style.top = '10px';
    qrCodeButton.style.right = '20.5px';
    qrCodeButton.style.width = '94px';
    qrCodeButton.style.height = '30px';
    qrCodeButton.style.borderRadius = '5px';
    qrCodeButton.style.backgroundColor = '#f2f2f2ff';
    qrCodeButton.style.color = '#ccccccff';
    qrCodeButton.style.textAlign = 'center';
    qrCodeButton.style.fontSize = '14px';
    qrCodeButton.style.cursor = 'pointer';
    qrCodeButton.style.userSelect = 'none';
    qrCodeButton.style.zIndex = '9999';
    qrCodeButton.style.lineHeight = '32px'; // 垂直居中

    // 按钮的悬停效果
    qrCodeButton.addEventListener('mouseover', function() {
        if (isGeneratingQRCode) {
            qrCodeButton.style.backgroundColor = '#ff9955ff';
            buttonContent.style.color = '#ffffffff';
        } else {
            qrCodeButton.style.backgroundColor = '#27ae60ff';
            buttonContent.style.color = '#ffffffff';
        }
    });

    qrCodeButton.addEventListener('mouseout', function() {
        if (isGeneratingQRCode) {
            qrCodeButton.style.backgroundColor = '#ff9955ff';
            buttonContent.style.color = '#ffffffff';
        } else {
            qrCodeButton.style.backgroundColor = '#f2f2f2ff';
            buttonContent.style.color = '#ccccccff';
        }
    });

    // 按钮点击事件
    qrCodeButton.addEventListener('click', function() {
        if (!isGeneratingQRCode) {
            isGeneratingQRCode = true;
            buttonContent.textContent = '下载二维码';
            qrCodeButton.style.backgroundColor = '#ff9955ff';
            buttonContent.style.color = '#ffffffff';
            generateQRCode();
        } else {
            downloadQRCode();
        }
    });

    // 生成二维码并插入到页面
    function generateQRCode() {
        const url = window.location.href;
        const qrCodeUrl = `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${encodeURIComponent(url)}&chld=L|0`; // 设置白边为0

        // 清除页面上生成的125x125二维码图像
        clearGeneratedQRCode();

        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = qrCodeUrl;
        qrCodeImage.style.position = 'fixed';
        qrCodeImage.style.top = '45px'; // 20px + 30px (按钮高度)
        qrCodeImage.style.right = '5px';
        qrCodeImage.style.width = '125px';
        qrCodeImage.style.height = '125px';

        document.body.appendChild(qrCodeImage);
    }

    // 下载二维码
    function downloadQRCode() {
        const url = window.location.href;
        const qrCodeUrl = `https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${encodeURIComponent(url)}&chld=L|0`; // 设置白边为0

        // 获取前网页的<title></title>内容，并将其用作文件名
        const pageTitle = document.title || 'QRCode';

        fetch(qrCodeUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${pageTitle}.png`;
                a.style.display = 'none'; // 隐藏下载链接
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            });

        // 延迟0.5秒后更新按钮文字、颜色
        setTimeout(function() {
            isGeneratingQRCode = false;
            buttonContent.textContent = '下载已开始';
            qrCodeButton.style.backgroundColor = '#f2f2f2ff';
            buttonContent.style.color = '#666666ff';
        }, 500);

        // 清除页面上生成的125x125二维码图像
        clearGeneratedQRCode();
    }

    // 清除页面上生成的125x125二维码图像
    function clearGeneratedQRCode() {
        const qrCodeImages = document.querySelectorAll('img[src*="chart.googleapis.com"]');
        qrCodeImages.forEach(img => {
            img.remove();
        });
    }

    // 将按钮添加到页面
    document.body.appendChild(qrCodeButton);
})();
