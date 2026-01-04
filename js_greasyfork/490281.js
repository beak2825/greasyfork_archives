// ==UserScript==
// @name         Steampy 一键开冲！
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  按 Ctrl+ 单击特定图片 URL 模式时，会在后台打开一个新标签页，其中包含相应的 Steam 应用程序页面，并阻止默认单击操作 ，可以知道浏览过的游戏，并支持导出
// @match        https://steampy.com/*
// @author       zhxilo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490281/Steampy%20%E4%B8%80%E9%94%AE%E5%BC%80%E5%86%B2%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/490281/Steampy%20%E4%B8%80%E9%94%AE%E5%BC%80%E5%86%B2%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for the viewed indicator, buttons, instructions, and collapsible panel
    GM_addStyle(`
        .viewed-indicator {
            position: absolute;
            top: 5px;
            left: 5px;
            background-color: red;
            color: black;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 1000;
            font-weight: bold;
        }
        #scriptControls {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background-color: white;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        #scriptControls button {
            margin: 5px;
            padding: 5px 10px;
        }
        #instructions {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 5px;
        }
        #toggleInstructions {
            cursor: pointer;
            color: blue;
            text-decoration: underline;
        }
        #collapseToggle {
            cursor: pointer;
            user-select: none;
        }
        #controlPanel {
            margin-top: 10px;
        }
        .hidden {
            display: none;
        }
    `);

    // Load viewed games from GM_getValue
    let viewedGames = GM_getValue('viewedGames', {});
    let misclickPrevention = GM_getValue('misclickPrevention', false);

    // Function to get appId from image URL
    function getAppIdFromUrl(url) {
        const match = url.match(/\/apps\/(\d+)\//);
        return match ? match[1] : null;
    }

    // Function to toggle viewed status
    function toggleViewedStatus(appId, imgContainer) {
        if (viewedGames[appId]) {
            delete viewedGames[appId];
            imgContainer.querySelector('.viewed-indicator')?.remove();
        } else {
            viewedGames[appId] = true;
            addViewedIndicator(imgContainer);
        }
        GM_setValue('viewedGames', viewedGames);
    }

    // Function to add viewed indicator
    function addViewedIndicator(container) {
        if (!container.querySelector('.viewed-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'viewed-indicator';
            indicator.textContent = '已浏览';
            container.style.position = 'relative';
            container.appendChild(indicator);
        }
    }

    // Apply viewed indicators
    function applyViewedIndicators() {
        document.querySelectorAll('img').forEach(img => {
            const appId = getAppIdFromUrl(img.src);
            if (appId) {
                const container = img.closest('.item-container') || img.parentElement;
                if (viewedGames[appId]) {
                    addViewedIndicator(container);
                } else {
                    container.querySelector('.viewed-indicator')?.remove();
                }
            }
        });
    }

    // Function to export viewed games
    function exportViewedGames() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(viewedGames));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "steampy_viewed_games.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Function to import viewed games
    function importViewedGames() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;
                viewedGames = JSON.parse(content);
                GM_setValue('viewedGames', viewedGames);
                applyViewedIndicators();
            }
        }
        input.click();
    }

    // Function to open all unviewed games
    function openAllUnviewed() {
        document.querySelectorAll('img').forEach(img => {
            const appId = getAppIdFromUrl(img.src);
            if (appId && !viewedGames[appId]) {
                const steamAppUrl = `https://store.steampowered.com/app/${appId}`;
                window.open(steamAppUrl, '_blank', 'noopener,noreferrer');
                toggleViewedStatus(appId, img.closest('.item-container') || img.parentElement);
            }
        });
    }

    // Function to toggle misclick prevention
    function toggleMisclickPrevention() {
        misclickPrevention = !misclickPrevention;
        GM_setValue('misclickPrevention', misclickPrevention);
        document.getElementById('misclickPreventionStatus').textContent = misclickPrevention ? '开启' : '关闭';
    }

    // Add script control buttons and instructions
    function addScriptControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'scriptControls';

        const collapseToggle = document.createElement('div');
        collapseToggle.id = 'collapseToggle';
        collapseToggle.textContent = '▼ 控制面板';
        collapseToggle.onclick = () => {
            const controlPanel = document.getElementById('controlPanel');
            controlPanel.classList.toggle('hidden');
            collapseToggle.textContent = controlPanel.classList.contains('hidden') ? '▶ 控制面板' : '▼ 控制面板';
        };

        const controlPanel = document.createElement('div');
        controlPanel.id = 'controlPanel';

        const refreshButton = document.createElement('button');
        refreshButton.textContent = '刷新标记';
        refreshButton.onclick = applyViewedIndicators;

        const exportButton = document.createElement('button');
        exportButton.textContent = '导出已浏览';
        exportButton.onclick = exportViewedGames;

        const importButton = document.createElement('button');
        importButton.textContent = '导入已浏览';
        importButton.onclick = importViewedGames;

        const openAllButton = document.createElement('button');
        openAllButton.textContent = '打开所有未浏览';
        openAllButton.onclick = openAllUnviewed;

        const misclickPreventionToggle = document.createElement('button');
        misclickPreventionToggle.textContent = '防误触模式：';
        misclickPreventionToggle.onclick = toggleMisclickPrevention;

        const misclickPreventionStatus = document.createElement('span');
        misclickPreventionStatus.id = 'misclickPreventionStatus';
        misclickPreventionStatus.textContent = misclickPrevention ? '开启' : '关闭';

        const toggleInstructions = document.createElement('span');
        toggleInstructions.id = 'toggleInstructions';
        toggleInstructions.textContent = '显示使用说明';
        toggleInstructions.onclick = () => {
            const instructions = document.getElementById('instructions');
            if (instructions.style.display === 'none') {
                instructions.style.display = 'block';
                toggleInstructions.textContent = '隐藏使用说明';
            } else {
                instructions.style.display = 'none';
                toggleInstructions.textContent = '显示使用说明';
            }
        };

        const instructions = document.createElement('div');
        instructions.id = 'instructions';
        instructions.innerHTML = `
            <p>使用说明：</p>
            <ul>
                <li>Ctrl+左键点击：打开Steam商店页面并标记为已浏览</li>
                <li>Alt+左键点击：切换已浏览/未浏览状态</li>
                <li>刷新标记：手动刷新已浏览标记</li>
                <li>导出已浏览：下载已浏览游戏的数据文件</li>
                <li>导入已浏览：上传之前导出的数据文件</li>
                <li>打开所有未浏览：在新标签页中打开所有未浏览的游戏</li>
                <li>防误触模式：开启时，只有脚本定义的操作生效</li>
            </ul>
        `;
        instructions.style.display = 'none';

        controlPanel.appendChild(refreshButton);
        controlPanel.appendChild(exportButton);
        controlPanel.appendChild(importButton);
        controlPanel.appendChild(openAllButton);
        controlPanel.appendChild(document.createElement('br'));
        controlPanel.appendChild(misclickPreventionToggle);
        controlPanel.appendChild(misclickPreventionStatus);
        controlPanel.appendChild(document.createElement('br'));
        controlPanel.appendChild(toggleInstructions);
        controlPanel.appendChild(instructions);

        controlsContainer.appendChild(collapseToggle);
        controlsContainer.appendChild(controlPanel);

        document.body.appendChild(controlsContainer);
    }

    // Main click event listener
    document.addEventListener('click', function(event) {
        if (misclickPrevention && !event.ctrlKey && !event.altKey) {
            return; // If misclick prevention is on and neither Ctrl nor Alt is pressed, do nothing
        }

        const img = event.target.closest('img');
        if (img) {
            const appId = getAppIdFromUrl(img.src);
            if (appId) {
                const container = img.closest('.item-container') || img.parentElement;
                if (event.ctrlKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    const steamAppUrl = `https://store.steampowered.com/app/${appId}`;
                    window.open(steamAppUrl, '_blank', 'noopener,noreferrer');
                    toggleViewedStatus(appId, container);
                } else if (event.altKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    toggleViewedStatus(appId, container);
                }
            }
        }
    }, true);

    // Use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                applyViewedIndicators();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize
    applyViewedIndicators();
    addScriptControls();

    // Set up adaptive auto-refresh
    let startTime = Date.now();
    let intervalId;

    function adaptiveRefresh() {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 60000) {  // First minute
            applyViewedIndicators();
            intervalId = setTimeout(adaptiveRefresh, 10000);  // Every 10 seconds
        } else {
            applyViewedIndicators();
            intervalId = setInterval(applyViewedIndicators, 30000);  // Every 30 seconds
        }
    }

    adaptiveRefresh();
})();