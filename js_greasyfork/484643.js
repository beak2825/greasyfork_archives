// ==UserScript==
// @name         Liblib tool
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  一键下载Liblib.art模型+配图+简介
// @author       宇泽同学
// @license      MIT
// @match        https://www.liblib.art/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/484643/Liblib%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/484643/Liblib%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮和选择器的样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
    .custom-button {
        background: linear-gradient(to right, #23caff,#56e5a9); /* 渐变色 */
        color: white;
        width: 100px;
        height: 35px;
        padding: 5px 15px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 5px 2px;
        cursor: pointer;
        border: none;
        border-radius: 20px;
     }
    .image-count-selector {
        width: 65px; /* 边框宽度 */
        height: 35px;
        padding: 5px;
        border: 1px solid #4CAF50; /* Green border */
        border-radius: 20px;
        margin-left: 5px;
        display: inline-block;
        border-width:1.5px 1.5px 1.5px 1.5px
    }
    `;
    document.head.appendChild(style);

// 检查并添加按钮的函数
    function checkAndAddButtons() {
        const generateButton = document.querySelector('.ModelActionCard_runPic__0I9wi');
        if (generateButton && !document.querySelector('.one-click-download')) {
            // 创建"下载全部"按钮
            const downloadButton = document.createElement('button');
            downloadButton.innerHTML = '下载全部';
            downloadButton.className = 'custom-button one-click-download';
            downloadButton.onclick = autoDownload;

            // 创建"下载图片"按钮
            const downloadImageButton = document.createElement('button');
            downloadImageButton.innerHTML = '下载图片';
            downloadImageButton.className = 'custom-button download-images-only';
            downloadImageButton.onclick = function() {
                const modelName = getModelName();
                const imageCount = document.querySelector('.image-count-selector').value;
                downloadImages(modelName, imageCount);
            };

            // 创建图片数量选择器
            const imageCountSelector = document.createElement('input');
            imageCountSelector.type = 'number';
            imageCountSelector.min = '1';
            imageCountSelector.value = '1'; // 默认值为1
            imageCountSelector.className = 'image-count-selector';

            // 将"下载图片"按钮和图片数量选择器添加到页面上
            generateButton.parentNode.insertBefore(downloadButton, generateButton.nextSibling);
            generateButton.parentNode.insertBefore(downloadImageButton, downloadButton.nextSibling);
            generateButton.parentNode.insertBefore(imageCountSelector, downloadImageButton.nextSibling);

            // 创建"下载简介"按钮
            const downloadDocButton = document.createElement('button');
            downloadDocButton.innerHTML = '下载简介';
            downloadDocButton.className = 'custom-button download-doc-only';
            downloadDocButton.onclick = function() {
                const modelName = getModelName();
                saveAsPlainText(modelName);
            };

            generateButton.parentNode.insertBefore(downloadDocButton, imageCountSelector.nextSibling);
        }
    }

    // 建立MutationObserver以监视DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                checkAndAddButtons();
            }
        });
    });

    // 在DOMContentLoaded事件中初始化按钮和观察者
    document.addEventListener('DOMContentLoaded', function() {
        checkAndAddButtons();
        observer.observe(document.body, { childList: true, subtree: true });
    });

    // 获取选中的Tab名称
    function getSelectedTabName() {
        //...保留原有的getSelectedTabName函数...
         // 获取所有的tab
 var tabs = document.querySelectorAll('.ant-tabs-tab');

 // 遍历所有的tab
 for (var i = 0; i < tabs.length; i++) {
     // 获取aria-selected属性
     var isSelected = tabs[i].querySelector('.ant-tabs-tab-btn').getAttribute('aria-selected');

     // 检查tab是否被选中
     if (isSelected === 'true') {
         // 获取tab的标题
         var title = tabs[i].textContent;
         return title; // 返回标题
     }
 }

    }

    // 获取模型名称
    function getModelName() {
     var version = getSelectedTabName();
     var modelName = document.querySelector('.ModelInfoHead_title__p5txd').innerText;
     modelName += "_" + version;
     return modelName;
 }

    // 自动下载函数
    function autoDownload() {
    var modelName = getModelName();
    downloadModel();
    saveAsPlainText(modelName);

    var imageCount = document.querySelector('.image-count-selector').value;
    downloadImages(modelName, imageCount);
}

    // 下载模型函数
   function downloadModel() {
     var downloadButton = document.querySelector('.ModelActionCard_inner__XBdzk');
     if (downloadButton) {
         downloadButton.click();
     }
 }
    // 选择简介函数
   function selectReadme() {
    var mainElement = document.querySelector('.mantine-AppShell-main');
    return mainElement.querySelector('[class^="ModelDescription_desc"]');
}

    // 记录URL函数
   function recordURL(modelName) {
    var url = window.location.href;
    var blob = new Blob([url], { type: 'text/plain' });
    var urlObject = window.URL.createObjectURL(blob);
    var downloadLink = document.createElement('a');
    downloadLink.href = urlObject;
    downloadLink.download = modelName + '_URL.txt';
    downloadLink.click();
    window.URL.revokeObjectURL(urlObject);
}

function saveAsHTML(modelName) {
    var descriptionElement = selectReadme();
    if (descriptionElement) {
        var htmlText = descriptionElement.innerHTML;
        var blob = new Blob([htmlText], { type: 'text/html' });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = modelName + '.html';
        link.style.display = 'none';
        document.body.appendChild(link);
        console.log('Attempting to download HTML file:', link.download);
        link.click();
        document.body.removeChild(link);
    } else {
        console.log('Description element not found.');
    }
}



function saveAsPlainText(modelName) {
    var descriptionElement = selectReadme();
    if (descriptionElement) {
        var plainText = descriptionElement.innerText;
        // Append the model URL and empty lines
        plainText += "\n\n☑️本模型地址：" + window.location.href + "\n\n";
        var blob = new Blob([plainText], { type: 'text/plain' });
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = modelName + '.txt';
        link.style.display = 'none';
        document.body.appendChild(link);
        console.log('Attempting to download text file:', link.download);
        link.click();
        document.body.removeChild(link);
    } else {
        console.log('Description element not found.');
    }
}

async function downloadImages(modelName, maxImages) {
    var images = document.querySelectorAll('img');
    var count = 0;
    if (images.length > 0) {
        for (var i = 0; i < images.length && count < maxImages; i++) {
            // 检查图片地址是否符合预期的格式
            if (images[i].src.startsWith('https://liblibai-online.vibrou.com/img/') ||
                images[i].src.startsWith('https://liblibai-online.vibrou.com/web/image/')) {
                var url = new URL(images[i].src);
                var pathSegments = url.pathname.split('/').filter(Boolean); // 分割路径并过滤空值
                // 拼接出清洁的URL，移除任何额外的查询参数或片段
                var cleanUrl = url.protocol + '//' + url.host + '/' + pathSegments.join('/');

                // 如果 count 为 0，不添加后缀，如果 count 大于 0，后缀从 _2 开始
                var fileNameSuffix = count > 0 ? '_' + (count + 1) : '';
                GM_download({
                    url: cleanUrl,
                    name: modelName + fileNameSuffix + '.png', // 添加 fileNameSuffix 以区分下载的图片
                    saveAs: true
                });
                count++; // 增加 count
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒钟以避免服务器过载
            }
        }
    }
}

    //...保留其他必要的代码和函数...

})();