// ==UserScript==
// @name         在VSCode插件中快速地下载特定版本(.vsix)，支持打开Trae和Cursor
// @name:en      Quick Download Specific Versions (.vsix) in VSCode Extensions, Support Opening in Trae and Cursor
// @name:zh      在VSCode插件中快速地下载特定版本(.vsix)，支持打开Trae和Cursor
// @name:zh-CN   在VSCode插件中快速地下载特定版本(.vsix)，支持打开Trae和Cursor
// @name:zh-TW   在VSCode插件中快速下載特定版本(.vsix)，支持打開Trae和Cursor
// @name:ja      VSCodeプラグインで特定バージョン(.vsix)を素早くダウンロード、TraeとCursorでの開封をサポート
// @name:ko      VSCode 플러그인에서 특정 버전(.vsix)을 빠르게 다운로드, Trae 및 Cursor 열기 지원
// @description  在VSCode插件市场中快速下载任意历史版本的扩展(.vsix)，支持一键安装到Cursor和Trae编辑器。
// @description:en  Quickly download any historical version of extensions (.vsix) from VSCode Marketplace, with one-click installation support for Cursor and Trae editors.
// @description:zh  在VSCode插件市场中快速下载任意历史版本的扩展(.vsix)，支持一键安装到Cursor和Trae编辑器。
// @description:zh-CN  在VSCode插件市场中快速下载任意历史版本的扩展(.vsix)，支持一键安装到Cursor和Trae编辑器。
// @description:zh-TW  在VSCode插件市場中快速下載任意歷史版本的擴展(.vsix)，支持一鍵安裝到Cursor和Trae編輯器。
// @description:ja  VSCodeマーケットプレイスから任意の履歴バージョンの拡張機能(.vsix)を素早くダウンロード、CursorとTraeエディタへのワンクリックインストールをサポート。
// @description:ko  VSCode 마켓플레이스에서 모든 이전 버전의 확장(.vsix)을 빠르게 다운로드하고 Cursor 및 Trae 편집기에 원클릭 설치를 지원합니다.
// @author       是东山呀
// @version      1.0.3
// @match        https://marketplace.visualstudio.com/items*
// @icon         data:image/svg+xml;charset=utf-8;base64,PHN2ZyB0PSIxNzQ4NDE2MTI2ODQwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUwNDIiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTA3LjEzNiA1MTQuOTQ0YzMuMDcyLTQuMzYyNjY3IDcuMjEwNjY3LTcuOTI1MzMzIDEyLjAzMi0xMC4zMTQ2NjdhMzcuMzY1MzMzIDM3LjM2NTMzMyAwIDAgMSA0Ni42MzQ2NjcgNi4xNDRsOTcuNDE4NjY2IDEwMi43OTQ2NjdhMzIgMzIgMCAwIDEtNDYuNDQyNjY2IDQ0LjAyMTMzM0w1NjUuMzMzMzMzIDYwMy4zMTczMzNWODUzLjMzMzMzM2EzMiAzMiAwIDEgMS02NCAwVjYwOC43NTczMzNsLTUyLjYxODY2NiA1MC4wMTZhMzIgMzIgMCAwIDEtNDQuMDk2LTQ2LjRsMTAyLjUxNzMzMy05Ny40MjkzMzN6TTUxMiAxMzguNjY2NjY3YzEyMy4wMTg2NjcgMCAyMjguMjEzMzMzIDg1LjY5NiAyNTkuNDI0IDIwNC40NjkzMzNDODY0LjI5ODY2NyAzNDQuNzM2IDkzOC42NjY2NjcgNDIyLjc1MiA5MzguNjY2NjY3IDUxOC4yMTg2NjcgOTM4LjY2NjY2NyA2MTQuNjg4IDg2Mi43NTIgNjkzLjMzMzMzMyA3NjguNTMzMzMzIDY5My4zMzMzMzNhMzIgMzIgMCAwIDEgMC02NEM4MjYuODkwNjY3IDYyOS4zMzMzMzMgODc0LjY2NjY2NyA1NzkuODQgODc0LjY2NjY2NyA1MTguMjE4NjY3YzAtNjEuNjEwNjY3LTQ3Ljc3Ni0xMTEuMTA0LTEwNi4xMzMzMzQtMTExLjEwNC01Ljg1NiAwLTExLjYyNjY2NyAwLjQ5MDY2Ny0xNy4zMDEzMzMgMS40NjEzMzNhMzIgMzIgMCAwIDEtMzcuMDI0LTI2LjY2NjY2N0M2OTguMzQ2NjY3IDI3OS4wNCA2MTIuNzE0NjY3IDIwMi42NjY2NjcgNTEyIDIwMi42NjY2NjdjLTczLjgzNDY2NyAwLTE0MC45MjggNDEuMDY2NjY3LTE3Ny4zNzYgMTA2LjYxMzMzM2EzMiAzMiAwIDAgMS0zMC4xMjI2NjcgMTYuMzczMzMzYy0zLjE2OC0wLjIxMzMzMy02LjM1NzMzMy0wLjMyLTkuNTY4LTAuMzJDMjE0Ljc4NCAzMjUuMzMzMzMzIDE0OS4zMzMzMzMgMzkzLjE0MTMzMyAxNDkuMzMzMzMzIDQ3Ny4zMzMzMzNTMjE0Ljc4NCA2MjkuMzMzMzMzIDI5NC45MzMzMzMgNjI5LjMzMzMzM2EzMiAzMiAwIDEgMSAwIDY0QzE3OC45MTIgNjkzLjMzMzMzMyA4NS4zMzMzMzMgNTk2LjM3MzMzMyA4NS4zMzMzMzMgNDc3LjMzMzMzM2MwLTExNi45Mzg2NjcgOTAuMjkzMzMzLTIxMi41NTQ2NjcgMjAzLjQ1Ni0yMTUuOTA0QzMzOC4wOTA2NjcgMTg1LjY5NiA0MjEuMDEzMzMzIDEzOC42NjY2NjcgNTEyIDEzOC42NjY2Njd6IiBmaWxsPSIjMTI5NmRiIiBwLWlkPSI1MDQzIj48L3BhdGg+PC9zdmc+
// @grant        none
// @license      GPL
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1475771
// @downloadURL https://update.greasyfork.org/scripts/537500/%E5%9C%A8VSCode%E6%8F%92%E4%BB%B6%E4%B8%AD%E5%BF%AB%E9%80%9F%E5%9C%B0%E4%B8%8B%E8%BD%BD%E7%89%B9%E5%AE%9A%E7%89%88%E6%9C%AC%28vsix%29%EF%BC%8C%E6%94%AF%E6%8C%81%E6%89%93%E5%BC%80Trae%E5%92%8CCursor.user.js
// @updateURL https://update.greasyfork.org/scripts/537500/%E5%9C%A8VSCode%E6%8F%92%E4%BB%B6%E4%B8%AD%E5%BF%AB%E9%80%9F%E5%9C%B0%E4%B8%8B%E8%BD%BD%E7%89%B9%E5%AE%9A%E7%89%88%E6%9C%AC%28vsix%29%EF%BC%8C%E6%94%AF%E6%8C%81%E6%89%93%E5%BC%80Trae%E5%92%8CCursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const itemName = urlParams.get('itemName');
    if (!itemName) {
        console.error('无法从URL中获取itemName');
        return;
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 检查是否加载了版本历史表格
                const versionTable = document.querySelector('.version-history-table');
                if (versionTable && !versionTable.hasAttribute('data-enhanced')) {
                    enhanceVersionTable(versionTable);
                    versionTable.setAttribute('data-enhanced', 'true');
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(function() {
        const installButtonContainer = document.querySelector('.ux-oneclick-install-button-container');
        console.log("installButtonContainer", installButtonContainer)
        if (installButtonContainer && !installButtonContainer.hasAttribute('data-enhanced')) {
            enhanceInstallButtons(installButtonContainer);
            installButtonContainer.setAttribute('data-enhanced', 'true');
        }

    }, 2000);

    function enhanceInstallButtons(container) {

        const originalButton = container.querySelector('a');
        if (!originalButton) return;
        const extensionId = itemName;

        // 创建Cursor打开按钮
        const cursorButton = originalButton.cloneNode(true);
        cursorButton.href = `cursor:extension/${itemName}`;
        cursorButton.setAttribute('data-is-focusable', 'true');
        cursorButton.title = '在Cursor中安装';
        cursorButton.innerHTML = '在Cursor中安装';
        cursorButton.style.marginLeft = '10px';
        cursorButton.style.lineHeight = '2';

        const traeButton = originalButton.cloneNode(true);
        
        traeButton.href = `trae:extension/${itemName}`;
        traeButton.setAttribute('data-is-focusable', 'true');
        traeButton.title = '在Trae中安装';
        traeButton.innerHTML = '在Trae中安装';
        traeButton.style.marginLeft = '10px';
        traeButton.style.lineHeight = '2';

        // 添加按钮到容器中
        container.appendChild(cursorButton);
        container.appendChild(traeButton);
    }

    // 监听版本历史按钮的点击事件
    document.addEventListener('click', function(e) {
        if (e.target.id === 'versionHistory' || e.target.closest('#versionHistory')) {
            setTimeout(checkForVersionTable, 500);
        }
    });

    function checkForVersionTable() {
        const versionTable = document.querySelector('.version-history-table');
        if (versionTable) {
            if (!versionTable.hasAttribute('data-enhanced')) {
                enhanceVersionTable(versionTable);
                versionTable.setAttribute('data-enhanced', 'true');
            }
        } else {
            // 如果表格还没加载，继续等待
            setTimeout(checkForVersionTable, 500);
        }
    }

    function enhanceVersionTable(table) {
        const headerRow = table.querySelector('thead tr');
        if (headerRow) {
            const downloadHeader = document.createElement('th');
            downloadHeader.className = 'version-history-container-column';
            downloadHeader.textContent = '下载';
            headerRow.appendChild(downloadHeader);
        }

        const rows = table.querySelectorAll('tbody tr');

        const [fieldA, fieldB] = itemName.split('.');
        rows.forEach(row => {
            // 获取版本号
            const versionCell = row.querySelector('td:first-child');
            if (versionCell) {
                const version = versionCell.textContent.trim();
                const downloadUrl = `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${fieldA}/vsextensions/${fieldB}/${version}/vspackage`;

                const downloadCell = document.createElement('td');
                downloadCell.className = 'version-history-container-column';
 
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                downloadLink._blank = true;
                downloadLink.innerHTML = '下载';
                downloadLink.style.cursor = 'pointer';
                downloadCell.appendChild(downloadLink);
                row.appendChild(downloadCell);
            }
        });
    }
})();