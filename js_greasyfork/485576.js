// ==UserScript==
// @name         Civitai Tool
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  一键下载模型、图例、模型说明（附触发词）
// @author       宇泽同学
// @match        https://civitai.com/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485576/Civitai%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/485576/Civitai%20Tool.meta.js
// ==/UserScript==

(function () {
'use strict';

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
.custom-button {
    background: radial-gradient(circle, #00BFFF,#005ec9); /* 渐变色 */
    color: #b3ffe7;
    width: 100px;
    height: 35px;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border: none;
    margin-left: 5px;
    border-radius: 7px;
}
.image-count-selector {
    width: 85px; /* 边框宽度 */
    height: 35px;
    padding: 5px;
    border: 1px solid #23caff; /* 输入框描边色 */
    border-radius: 7px;
    margin-left: 5px;
    display: inline-block;
}
`;
document.head.appendChild(style);

// 获取当前页面的URL中的模型ID
function getModelIdFromUrl() {
    const urlRegex = /https:\/\/civitai.com\/models\/(\d+)(?:\/|$|\?modelVersionId=\d+)/;
    const match = window.location.href.match(urlRegex);
    return match ? match[1] : null;
}

// 从API获取模型文件名的函数
function fetchModelFileName(modelId, modelVersionId) {
    let apiUrl = `https://civitai.com/api/v1/models/${modelId}`;
    if (modelVersionId) {
        apiUrl += `?modelVersionId=${modelVersionId}`;
    }

    return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (modelVersionId) {
                const modelVersion = data.modelVersions.find(version => version.id.toString() === modelVersionId);
                return modelVersion ? modelVersion.files.find(file => file.primary).name : null;
            } else {
                const publishedVersion = data.modelVersions.find(version => version.status === 'Published');
                return publishedVersion ? publishedVersion.files.find(file => file.primary).name : null;
            }
        })
        .catch(error => {
            console.error('Error fetching model file name:', error);
            return null;
        });
}

// 下载图例
function downloadImages(modelFileName, callback) {
    const numberOfImages = document.getElementById('imageCountInput').value;
    const thumbnailElements = document.querySelectorAll('.mantine-7aj0so');
    for (let i = 0; i < Math.min(numberOfImages, thumbnailElements.length); i++) {
        const thumbnailSrc = thumbnailElements[i].src;
        const highResSrc = thumbnailSrc.replace('/width=450/', '/original=true/');
        const filename = `${modelFileName.split('.')[0]}.preview.png`;
        GM_download(highResSrc, filename);
    }
    // 图例下载完成后执行回调函数
    if (typeof callback === 'function') {
        callback();
    }
}


// 下载说明
function downloadDescription(modelFileName, modelId) {
    // 使用Model ID构造API URL
    const apiUrl = `https://civitai.com/api/v1/models/${modelId}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.description) {
                let descriptionHtml = data.description; // API返回的HTML格式文本

                // 将<p>和<br>标签替换为换行符，保留段落间的空行
                descriptionHtml = descriptionHtml.replace(/<p>/gi, "");
                descriptionHtml = descriptionHtml.replace(/<\/p>/gi, "\n\n");
                descriptionHtml = descriptionHtml.replace(/<br\s*[\/]?>/gi, "\n");

                // 创建一个DOM元素来解析HTML文本，并提取文本内容
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = descriptionHtml;
                // 获取纯文本内容，去除所有HTML标签
                let plainTextDescription = tempDiv.textContent || tempDiv.innerText || "";

                // 确保纯文本中的连续换行被保留
                plainTextDescription = plainTextDescription.replace(/\n\s*\n/g, "\n\n");

                // 获取触发词
                const triggerWordElements = document.querySelectorAll('.mantine-Group-root.mantine-i72d0e');
                let triggerWords = [];
                triggerWordElements.forEach(element => {
                    const word = element.textContent.trim();
                    if (word) {
                        triggerWords.push(word);
                    }
                });
                const triggerWordsText = triggerWords.length > 0 ? triggerWords.join(', ') : '未发现';

                // 组合下载内容
                const modelName = data.name || '模型名称未知';
                const currentUrl = window.location.href;
                const combinedText = `##触发词: ${triggerWordsText}\n\n${plainTextDescription.trim()}\n\n##本模型地址：${currentUrl}\n\n`;

                // 触发下载
                const blob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `${modelFileName.split('.')[0]}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('获取不到模型说明文本。');
            }
        }).catch(error => {
            console.error('Error fetching model description:', error);
        });
}


// 模拟原生下载按钮点击
function simulateNativeButtonClick() {
    const nativeDownloadButton = document.querySelector('.mantine-UnstyledButton-root.mantine-Button-root.mantine-4fe1an');
    nativeDownloadButton && nativeDownloadButton.click();
}

// 下载全部内容
function downloadAll(modelFileName, modelId) {
    downloadImages(modelFileName, () => {
        downloadDescription(modelFileName, modelId);
        setTimeout(() => {
            simulateNativeButtonClick();
        }, 1000);
    });
}

// 创建下载按钮
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'custom-button';
    button.addEventListener('click', onClick);
    return button;
}

// 创建数字输入框
function createNumberInput() {
    const input = document.createElement('input');
    input.className = 'image-count-selector';
    input.id = 'imageCountInput';
    input.type = 'number';
    input.value = '1';
    input.min = '1';
    return input;
}

// 主函数
function main() {
    const modelId = getModelIdFromUrl();
    const urlParams = new URLSearchParams(window.location.search);
    const modelVersionId = urlParams.get('modelVersionId');
    if (modelId) {
        fetchModelFileName(modelId, modelVersionId).then(modelFileName => {
            if (modelFileName) {
                const imageCountInput = createNumberInput();
                const downloadImagesButton = createButton('下载图例', () => downloadImages(modelFileName));
 const downloadDescriptionButton = createButton('下载说明', () => downloadDescription(modelFileName, modelId)); // 更新这一行

                const downloadAllButton = createButton('我全都要', () => downloadAll(modelFileName, modelId));

                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'custom-button-container';
                buttonContainer.appendChild(downloadImagesButton);
                buttonContainer.appendChild(imageCountInput);
                buttonContainer.appendChild(downloadDescriptionButton);
                buttonContainer.appendChild(downloadAllButton);

                const targetElement = document.querySelector('.mantine-UnstyledButton-root.mantine-Accordion-control.mantine-17tws88');
                if (targetElement && !targetElement.parentNode.querySelector('.custom-button-container')) {
                    targetElement.parentNode.insertBefore(buttonContainer, targetElement);
                } else {
                    console.error('未找到目标元素，无法插入按钮容器。');
                }
            }
        });
    }
}

function checkAndInsertButtons() {
    setTimeout(() => {
        main();
        checkAndInsertButtons();
    }, 1000);
}

window.addEventListener('load', checkAndInsertButtons);

 // 监听网址变化
    function checkUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl !== sessionStorage.getItem('previousUrl')) {
            sessionStorage.setItem('previousUrl', currentUrl);
            window.location.reload();
        }
    }

    window.addEventListener('load', main);
    setInterval(checkUrlChange, 50);

})();

