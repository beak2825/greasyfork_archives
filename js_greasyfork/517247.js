// ==UserScript==
// @name         ChatGPT聊天记录下载工具一键下载到本地🚀🚀(使用前看说明)
// @namespace    https://h5ma.cn/caicats
// @version      1.15
// @description  一键将ChatGPT网站和相关镜像站的聊天记录导出为HTML 或 Markdown，让你在本地上就能使用看！🚀
// @author       @caicats
// @match        https://chat.openai.com/*
// @match        https://new.oaifree.com/**
// @match        https://share.github.cn.com/**
// @match        https://chatgpt.com/**
// @match        https://*.oaifree.com/**
// @match        https://cc.plusai.me/**
// @match        https://chat.chatgptplus.cn/**
// @match        https://chat.rawchat.cc/**
// @match        https://chat.sharedchat.cn/**
// @match        https://chat.gptdsb.com/**
// @match        https://chat.freegpts.org/**
// @match        https://gpt.github.cn.com/**
// @match        https://chat.aicnn.xyz/**
// @match        https://*.xyhelper.com.cn/**
// @match        https://oai.aitopk.com/**
// @match        https://www.opkfc.com/**
// @match        https://bus.hematown.com/**
// @match        https://chatgpt.dairoot.cn/**
// @match        https://plus.aivvm.com/**
// @match        https://sharechat.aischat.xyz/**
// @match        https://web.tu-zi.com/**
// @match        https://chat1.2233.ai/**
// @match        https://2233.ai/**
// @match        https://yesiamai.com/**
// @match        https://www.azs.ai/**
// @match        https://oai.253282.xyz/**
// @match        https://gpt.universalbus.cn/**
// @match        https://go.gptdsb.com/**
// @match        https://go.gptdie.com/**
// @license      MIT
// @icon         https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://chatgpt.com
// @downloadURL https://update.greasyfork.org/scripts/517247/ChatGPT%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%88%B0%E6%9C%AC%E5%9C%B0%F0%9F%9A%80%F0%9F%9A%80%28%E4%BD%BF%E7%94%A8%E5%89%8D%E7%9C%8B%E8%AF%B4%E6%98%8E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517247/ChatGPT%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%E5%88%B0%E6%9C%AC%E5%9C%B0%F0%9F%9A%80%F0%9F%9A%80%28%E4%BD%BF%E7%94%A8%E5%89%8D%E7%9C%8B%E8%AF%B4%E6%98%8E%29.meta.js
// ==/UserScript==



// ==/UserScript==

(function() {
    'use strict';

    // 确保页面加载完成后运行
    document.addEventListener('DOMContentLoaded', () => {
        createFloatingMenu();
    });

    // 使用 MutationObserver 监控 DOM 变化
    const observer = new MutationObserver(() => {
        if (!document.querySelector('#floating-menu')) {
            createFloatingMenu();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function createFloatingMenu() {
        // 检查是否已经添加过按钮，避免重复创建
        if (document.querySelector('#floating-menu')) return;

        const menuContainer = document.createElement('div');
        menuContainer.id = 'floating-menu';
        menuContainer.style.position = 'fixed';
        menuContainer.style.bottom = '80px';
        menuContainer.style.right = '15px';
        menuContainer.style.zIndex = '10000';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.alignItems = 'center';
        menuContainer.style.gap = '10px';

        // 创建提示框
        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '12px';
        tooltip.style.visibility = 'hidden';
        tooltip.style.zIndex = '10001';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.maxWidth = '200px';
        tooltip.style.wordWrap = 'break-word';
        document.body.appendChild(tooltip);

        // Main button as expand icon
        const mainButton = document.createElement('button');
        mainButton.id = 'main-button';
        mainButton.style.width = '40px';
        mainButton.style.height = '40px';
        mainButton.style.borderRadius = '50%';
        mainButton.style.border = 'none';
        mainButton.style.backgroundColor = '#4cafa3';
        mainButton.style.color = 'white';
        mainButton.style.cursor = 'pointer';
        mainButton.style.fontSize = '26px';
        mainButton.textContent = '+';

        let isExpanded = false;
        mainButton.addEventListener('click', () => {
            isExpanded = !isExpanded;
            toggleMenu(isExpanded, menuContainer);
        });
        addTooltip(mainButton, '展开功能列表');

        // Markdown button with orange background
        const markdownButton = createMenuButton('📄', '导出为 Markdown', exportChatAsMarkdown, '#FFA500');
        addTooltip(markdownButton.querySelector('button'), '📄 导出为 Markdown');

        // HTML button with orange background
        const htmlButton = createMenuButton('🌐', '导出为 HTML', exportChatAsHTML, '#FFA500');
        addTooltip(htmlButton.querySelector('button'), '🌐 导出为 HTML');

        // Sponsor button to redirect to the specified page
        const sponsorButton = createMenuButton('❤️', '使用教程和赞赏', () => {
            window.open('https://h5ma.cn/gptdc', '_blank');
        }, '#FF6347');
        addTooltip(sponsorButton.querySelector('button'), '❤️ 使用教程和赞赏');

        // New Shop button to redirect to the specified link
        const shopButton = createMenuButton('🛒', '付费GPT库系统', () => {
            window.open('https://h5ma.cn/caicats', '_blank');
        }, '#32CD32'); // LimeGreen color for shop button
        addTooltip(shopButton.querySelector('button'), '🛒 付费GPT库系统');

        // Append buttons to the menu
        menuContainer.appendChild(mainButton);
        menuContainer.appendChild(markdownButton);
        menuContainer.appendChild(htmlButton);
        menuContainer.appendChild(sponsorButton);
        menuContainer.appendChild(shopButton);
        document.body.appendChild(menuContainer);

        // Initially hide the menu buttons
        toggleMenu(false, menuContainer);

        function addTooltip(element, text) {
            element.addEventListener('mouseenter', (event) => {
                tooltip.textContent = text;
                tooltip.style.visibility = 'visible';
                const rect = element.getBoundingClientRect();
                tooltip.style.left = `${rect.left - tooltip.offsetWidth - 10}px`;
                tooltip.style.top = `${rect.top + (rect.height / 2) - (tooltip.offsetHeight / 2)}px`;
            });

            element.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
            });
        }
    }

    function createMenuButton(icon, text, onClick, bgColor) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'relative';

        const button = document.createElement('button');
        button.className = 'menu-button';
        button.style.width = '36px';
        button.style.height = '36px';
        button.style.borderRadius = '50%';
        button.style.border = 'none';
        button.style.backgroundColor = bgColor;
        button.style.color = 'white';
        button.style.cursor = 'pointer';
        button.textContent = icon;
        button.addEventListener('click', onClick);

        buttonContainer.appendChild(button);
        return buttonContainer;
    }

    function toggleMenu(expand, menuContainer) {
        const buttons = menuContainer.querySelectorAll('.menu-button');
        buttons.forEach(button => {
            button.style.display = expand ? 'block' : 'none';
        });
    }

    async function exportChatAsMarkdown() {
        try {
            let markdownContent = "# ChatGPT 对话记录\n\n";
            let allElements = document.querySelectorAll('div.flex.flex-grow.flex-col.max-w-full');

            allElements.forEach((element, index) => {
                let text = element.textContent.trim();
                if (index % 2 === 0) {
                    markdownContent += `## User\n${text}\n\n`;
                } else {
                    markdownContent += `## Assistant\n${text}\n\n`;
                }
            });

            download(markdownContent, 'chat-export.md', 'text/markdown');
        } catch (error) {
            console.error("导出为 Markdown 时出错：", error);
        }
    }

    async function exportChatAsHTML() {
        try {
            let htmlContent = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Chat Export</title></head><body>";
            let allElements = document.querySelectorAll('div.flex.flex-grow.flex-col.max-w-full');

            allElements.forEach((element, index) => {
                let text = element.innerHTML.trim();
                if (index % 2 === 0) {
                    htmlContent += `<h2>User</h2><div>${text}</div>`;
                } else {
                    htmlContent += `<h2>Assistant</h2><div>${text}</div>`;
                }
            });

            htmlContent += "</body></html>";
            download(htmlContent, 'chat-export.html', 'text/html');
        } catch (error) {
            console.error("导出为 HTML 时出错：", error);
        }
    }

    function download(data, filename, type) {
        const blob = new Blob([data], {type: type});
        const a = document.createElement('a');
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})();

