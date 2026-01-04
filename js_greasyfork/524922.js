// ==UserScript==
// @name         Deepseek Chat Monitor
// @version      1.4.3
// @description  The blocked thinking and response will be displayed on the right interface. 右侧界面会显示输出后被屏蔽的思考和回复内容。
// @match        https://chat.deepseek.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/762448
// @downloadURL https://update.greasyfork.org/scripts/524922/Deepseek%20Chat%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/524922/Deepseek%20Chat%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pluginUI = document.createElement('div');
    pluginUI.id = 'plugin-ui';
    pluginUI.style.position = 'fixed';
    pluginUI.style.top = '0';
    pluginUI.style.right = '20px';
    pluginUI.style.width = '300px';
    pluginUI.style.height = '100%';
    pluginUI.style.overflowY = 'scroll';
    pluginUI.style.backgroundColor = '#f9f9f9';
    pluginUI.style.color = '#333';
    pluginUI.style.border = '1px solid #ccc';
    pluginUI.style.borderRadius = '5px';
    pluginUI.style.padding = '10px';
    pluginUI.style.zIndex = '9999';
    pluginUI.style.transition = 'right 0.3s ease';

    const returnButton = document.createElement('button');
    returnButton.id = 'return-button';
    returnButton.style.position = 'fixed';
    returnButton.style.top = '10px';
    returnButton.style.right = '330px';
    returnButton.style.width = '40px';
    returnButton.style.height = '40px';
    returnButton.style.backgroundColor = '#444';
    returnButton.style.color = '#fff';
    returnButton.style.border = 'none';
    returnButton.style.borderRadius = '50%';
    returnButton.style.fontSize = '16px';
    returnButton.style.zIndex = '10000';
    returnButton.textContent = '❌';
    returnButton.title = 'Clear Interface';
    returnButton.addEventListener('click', () => {
        pluginUI.innerHTML = '';
    });

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-button';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '60px';
    toggleButton.style.right = '330px';
    toggleButton.style.width = '40px';
    toggleButton.style.height = '40px';
    toggleButton.style.backgroundColor = '#444';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.fontSize = '16px';
    toggleButton.style.zIndex = '10000';
    toggleButton.textContent = '➡️';
    toggleButton.title = 'Toggle Sidebar';
    toggleButton.addEventListener('click', () => {
        if (pluginUI.style.right === '20px') {
            pluginUI.style.right = '-300px';
            returnButton.style.right = '20px';
            toggleButton.style.right = '20px';
            toggleButton.textContent = '⬅️';
            copyButton.style.right = '20px';
            historyButton.style.right = '20px';
        } else {
            pluginUI.style.right = '20px';
            returnButton.style.right = '330px';
            toggleButton.style.right = '330px';
            toggleButton.textContent = '➡️';
            copyButton.style.right = '330px';
            historyButton.style.right = '330px';
        }
    });

    const copyButton = document.createElement('button');
    copyButton.id = 'copy-button';
    copyButton.style.position = 'fixed';
    copyButton.style.top = '110px';
    copyButton.style.right = '330px';
    copyButton.style.width = '40px';
    copyButton.style.height = '40px';
    copyButton.style.backgroundColor = '#444';
    copyButton.style.color = '#fff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '50%';
    copyButton.style.fontSize = '16px';
    copyButton.style.zIndex = '10000';
    copyButton.textContent = '📋';
    copyButton.title = 'Copy Content';
    copyButton.addEventListener('click', () => {
        const content = pluginUI.innerText;
        navigator.clipboard.writeText(content).then(() => {
            alert('Content copied to clipboard!');
        }, () => {
            alert('Failed to copy content');
        });
    });

    const historyButton = document.createElement('button');
    historyButton.id = 'history-button';
    historyButton.style.position = 'fixed';
    historyButton.style.top = '160px';
    historyButton.style.right = '330px';
    historyButton.style.width = '40px';
    historyButton.style.height = '40px';
    historyButton.style.backgroundColor = '#444';
    historyButton.style.color = '#fff';
    historyButton.style.border = 'none';
    historyButton.style.borderRadius = '50%';
    historyButton.style.fontSize = '16px';
    historyButton.style.zIndex = '10000';
    historyButton.textContent = '🕒';
    historyButton.title = 'View History';
    historyButton.addEventListener('click', () => {
        pluginUI.innerHTML = '';
        updateHistoryUI();
    });

    document.body.appendChild(pluginUI);
    document.body.appendChild(returnButton);
    document.body.appendChild(toggleButton);
    document.body.appendChild(copyButton);
    document.body.appendChild(historyButton);

    function updateTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            pluginUI.style.backgroundColor = '#333';
            pluginUI.style.color = '#fff';
            pluginUI.style.border = '1px solid #555';
            returnButton.style.backgroundColor = '#666';
            returnButton.style.color = '#fff';
            toggleButton.style.backgroundColor = '#666';
            toggleButton.style.color = '#fff';
            copyButton.style.backgroundColor = '#666';
            copyButton.style.color = '#fff';
            historyButton.style.backgroundColor = '#666';
            historyButton.style.color = '#fff';
        } else {
            pluginUI.style.backgroundColor = '#f9f9f9';
            pluginUI.style.color = '#333';
            pluginUI.style.border = '1px solid #ccc';
            returnButton.style.backgroundColor = '#888';
            returnButton.style.color = '#fff';
            toggleButton.style.backgroundColor = '#888';
            toggleButton.style.color = '#fff';
            copyButton.style.backgroundColor = '#888';
            copyButton.style.color = '#fff';
            historyButton.style.backgroundColor = '#888';
            historyButton.style.color = '#fff';
        }
    }

    updateTheme();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    let latestChatNum = 2;
    let previousContent = '';
    let longestContent = '';
    let historyContent = [];

    function getLatestChatContent() {
        let retries = 1;
        let element = null;
        const getSelector = (num) => `#root > div > div > div.c3ecdb44 > div._7780f2e > div > div._3919b83 > div > div > div.dad65929 > div:nth-child(${num})`;

        while (retries >= 0) {
            while (true) {
                const selector = getSelector(latestChatNum);
                element = document.querySelector(selector);
                if (!element) {
                    break;
                }
                latestChatNum += 2;
            }
            latestChatNum -= 2;
            const selector = getSelector(latestChatNum);
            element = document.querySelector(selector);
            if (!element) {
                console.log('Cannot find the latest chat');
                latestChatNum = 2;
                retries--;
                if (retries < 0) {
                    return;
                }
            } else {
                break;
            }
        }
        const chatContentElement = element.querySelector('div.ds-markdown.ds-markdown--block');
        const thinkingContentElement = element.querySelector('div._48edb25 > div.e1675d8b');
        let currentContent = '';
        if (thinkingContentElement) {
            const paragraphs = thinkingContentElement.querySelectorAll('p');
            paragraphs.forEach(p => {
                currentContent += p.innerText + '\n';
            });
        }
        if (chatContentElement) {
            currentContent += chatContentElement.innerHTML;
        }
        if (currentContent.length > longestContent.length) {
            longestContent = currentContent;
        }
        if (currentContent.length < previousContent.length) {
            pluginUI.innerHTML = longestContent;
            historyContent.push(longestContent);
            longestContent = '';
        }
        previousContent = currentContent;
    }

    function updateHistoryUI() {
        historyContent.forEach((content, index) => {
            const historyItem = document.createElement('div');
            historyItem.style.borderBottom = '1px solid #ccc';
            historyItem.style.padding = '10px';
            historyItem.style.cursor = 'pointer';
            historyItem.textContent = content.length > 50 ? content.substring(0, 50) + '...' : content;
            historyItem.addEventListener('click', () => {
                pluginUI.innerHTML = content;
            });
            pluginUI.appendChild(historyItem);
        });
    }

    const observer = new MutationObserver(getLatestChatContent);
    const config = { childList: true, subtree: true, characterData: true };

    function startObserving() {
        const targetNode = document.querySelector('#root');
        if (targetNode) {
            observer.observe(targetNode, config);
        } else {
            console.log('Cannot find the target node');
        }
    }

    function stopObserving() {
        observer.disconnect();
    }

    window.onload = function() {
        setTimeout(startObserving, 500);
    };
})();