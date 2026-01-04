// ==UserScript==
// @name         LiblibAI Helper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Download model, preview, model description by one-click
// @author       Sleepy & NewBing
// @license      MIT
// @match        https://www.liblib.art/modelinfo/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/482082/LiblibAI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/482082/LiblibAI%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSelectedTabName() {
        // 获取所有的tab
        var tabs = document.querySelectorAll('.ant-tabs-tab');

        // 遍历所有的tab
        for (var i = 0; i < tabs.length; i++) {
            // 检查tab是否被选中
            if (tabs[i].classList.contains('ant-tabs-tab-active')) {
                // 获取tab的标题
                var title = tabs[i].textContent;
                return title;  // 返回标题
            }
        }
    }

    function getModelName() {
        var version = getSelectedTabName();
        var modelName = document.querySelector('.ModelInfoHead_title__p5txd').innerText;
        modelName += "_" + version;
        // 使用正则表达式替换特殊字符
        modelName = modelName.replace(/[\/\\:*?"<>|]/g, "_");
        return modelName;
    }

	// Create a MutationObserver to monitor DOM changes
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.type === 'childList') {
				var generateButton = document.querySelector('.ModelActionCard_runPic__0I9wi');
				if (generateButton && !document.querySelector('.one-click-download')) {

					var downloadButton = document.createElement('button');
					downloadButton.innerHTML = '一键下载';
					downloadButton.className = 'one-click-download';
					downloadButton.onclick = autoDownload;

					var modelName = getModelName();

					// 创建"仅下载图片"按钮
					var downloadImageButton = document.createElement('button');
					downloadImageButton.innerHTML = '仅下载图片';
					downloadImageButton.className = 'download-images-only';
					downloadImageButton.style = 'margin-left: 10px; display: inline-block;';
					downloadImageButton.onclick = function() {
						var imageCount = document.querySelector('.image-count-selector').value;
						downloadImages(modelName, imageCount);
					};

					// 创建"仅下载文档"按钮
					var downloadDocButton = document.createElement('button');
					downloadDocButton.innerHTML = '仅下载文档';
					downloadDocButton.className = 'download-doc-only';
					downloadDocButton.style = 'margin-left: 10px; display: inline-block;';
					downloadDocButton.onclick = function() {
						recordURL(modelName);
						saveAsHTML(modelName);
						// saveAsMarkdown(modelName);
						saveAsPlainText(modelName);
					};

					// 创建图片数量选择器
					var imageCountSelector = document.createElement('input');
					imageCountSelector.type = 'number';
					imageCountSelector.min = '1';
					imageCountSelector.value = '10';  // 默认值为10
					imageCountSelector.className = 'image-count-selector';
					imageCountSelector.style = 'margin-left: 10px; display: inline-block;';

					// 将新的按钮和选择器添加到页面上
					generateButton.parentNode.insertBefore(downloadButton, generateButton.nextSibling);
					generateButton.parentNode.insertBefore(downloadImageButton, downloadButton.nextSibling);
					generateButton.parentNode.insertBefore(downloadDocButton, downloadImageButton.nextSibling);
					generateButton.parentNode.insertBefore(imageCountSelector, downloadImageButton.nextSibling);

					observer.disconnect();
				}
			}
		});
	});

    observer.observe(document.body, { childList: true, subtree: true });

    function autoDownload() {
        var modelName = getModelName();

        downloadModel();

		recordURL(modelName);
        saveAsHTML(modelName);
        // saveAsMarkdown(modelName);
        saveAsPlainText(modelName);

		var imageCount = document.querySelector('.image-count-selector').value;
		downloadImages(modelName, imageCount);
    }

    function downloadModel() {
        var downloadButton = document.querySelector('.ModelActionCard_inner__XBdzk');
        if (downloadButton) {
            downloadButton.click();
        }
    }

    async function downloadImages(modelName, maxImages) {
        var containers = document.querySelectorAll('.flex.flex-nowrap.w-full');
        console.log('找到的容器数量：' + containers.length);
        var count = 0;
        for (var j = 0; j < containers.length; j++) {
            var images = containers[j].querySelectorAll('img');
            console.log('在容器' + (j+1) + '中找到的图片数量：' + images.length);
            for (var i = 0; i < images.length && count < maxImages; i++) {
                if (images[i].src.startsWith('https://liblibai-online.vibrou.com/')) {
                    var url = new URL(images[i].src);
                    var cleanUrl = url.protocol + "//" + url.hostname + url.pathname;
                    console.log('下载图片：' + cleanUrl);
                    GM_download({
                        url: cleanUrl,
                        name: modelName + (count === 0 ? '' : '_preview_' + count) + '.png',
                        saveAs: true
                    });
                    count++;
                    console.log('已下载图片数量：' + count);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    }


/*
	async function downloadImages(modelName, maxImages) {
		var images = document.querySelectorAll('img');
		var count = 0;
		if (images.length > 0) {
			for (var i = 0; i < images.length && count < maxImages; i++) {
				if (images[i].src.startsWith('https://liblibai-online.vibrou.com/img/')) {
					var url = new URL(images[i].src);
					var cleanUrl = url.protocol + "//" + url.hostname + url.pathname;
					GM_download({
						url: cleanUrl,
						name: modelName + (count === 0 ? '' : '_preview_' + count) + '.png',
						saveAs: true
					});
					count++;
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
		}
	}*/

    function selectReadme() {
        var mainElement = document.querySelector('.mantine-AppShell-main');
        return mainElement.querySelector('[class^="ModelDescription_desc"]');
    }

	function recordURL(modelName) {
		var url = window.location.href;
		var blob = new Blob([url], {type: 'text/plain'});
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
            var blob = new Blob([htmlText], {type: 'text/html'});
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

    function saveAsMarkdown(modelName) {
        var descriptionElement = selectReadme();
        if (descriptionElement) {
            var markdownText = convertHtmlToMarkdown(descriptionElement.innerHTML);
            var blob = new Blob([markdownText], {type: 'text/markdown'});
            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = modelName + '.md';
            link.style.display = 'none';
            document.body.appendChild(link);
            console.log('Attempting to download markdown file:', link.download);
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
            var blob = new Blob([plainText], {type: 'text/plain'});
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

    function convertHtmlToMarkdown(html) {
        // This is a very basic implementation and might not work for all HTML.
        // Consider using a library like Turndown for a more robust solution.
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.innerText;
    }


})();