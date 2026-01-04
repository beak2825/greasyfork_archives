// ==UserScript==
// @name         VSCode Extension Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在VS Code marketplace添加VSIX下载按钮
// @author       microchang
// @match        https://marketplace.visualstudio.com/items*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530053/VSCode%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/530053/VSCode%20Extension%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个悬浮按钮
    function createFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = 'download';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#0078D4';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // 悬停效果
        button.onmouseover = function() {
            this.style.backgroundColor = '#106EBE';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#0078D4';
        };

        // 点击事件处理
        button.onclick = function() {
            // 执行第一个下载脚本
            executeFirstScript();
            // 延迟1秒后执行第二个脚本作为备选
            setTimeout(executeSecondScript, 1000);
        };

        document.body.appendChild(button);
    }

    // 实现第一个下载脚本
    function executeFirstScript() {
        const extensionData = {
            version: "",
            publisher: "",
            identifier: "",
            getDownloadUrl: function() {
                // 添加调试日志
                console.log('Debug info:', {
                    version: this.version,
                    publisher: this.publisher,
                    identifier: this.identifier
                });

                const publisher = this.publisher.replace('@', '');
                const extension = this.identifier.split('.')[1];

                // 验证数据是否存在
                if (!publisher || !extension || !this.version) {
                    console.error('Missing required data:', {publisher, extension, version: this.version});
                    return null;
                }

                return `https://${publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${publisher}/extension/${extension}/${this.version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;
            },
            getFileName: function() {
                return `${this.identifier}_${this.version}.vsix`;
            }
        };

        const metadataMap = {
            Version: "version",
            Publisher: "publisher",
            "Unique Identifier": "identifier"
        };

        // 修改选择器以确保能找到正确的元素
        const metadataRows = document.querySelectorAll("table.ux-table-metadata tr, .ux-table-metadata tr");

        let foundData = false;
        for (let i = 0; i < metadataRows.length; i++) {
            const row = metadataRows[i];
            const cells = row.querySelectorAll("td");
            if (cells.length === 2) {
                const key = cells[0].innerText.trim();
                const value = cells[1].innerText.trim();
                if (metadataMap.hasOwnProperty(key)) {
                    extensionData[metadataMap[key]] = value;
                    foundData = true;
                    console.log(`Found ${key}: ${value}`);
                }
            }
        }

        // 验证是否成功获取到数据
        if (!foundData) {
            console.error('Failed to find metadata in the page');
            return;
        }

        // 获取下载URL
        const downloadUrl = extensionData.getDownloadUrl();
        if (!downloadUrl) {
            console.error('Failed to generate download URL');
            return;
        }

        // 创建下载链接并触发下载
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = extensionData.getFileName();
        link.click();
    }

    // 实现第二个下载脚本（作为备选方案）
    function executeSecondScript() {
        const URL_VSIX_PATTERN = 'https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage';
        const itemName = new URL(window.location.href).searchParams.get('itemName');
        if (!itemName) return;

        const [publisher, extension] = itemName.split('.');
        const versionElement = document.querySelector('#versionHistoryTab tbody tr .version-history-container-column');
        if (!versionElement) return;

        const version = versionElement.textContent;
        const url = URL_VSIX_PATTERN
        .replace('${publisher}', publisher)
        .replace('${extension}', extension)
        .replace('${version}', version);

        window.open(url, '_blank');
    }

    // 等待页面加载完成后创建按钮
    window.addEventListener('load', function() {
        createFloatingButton();
    });
})();

