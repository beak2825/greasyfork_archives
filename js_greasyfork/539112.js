// ==UserScript==
// @name         Export Chat History to Obsidian
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Export ChatGPT, DeepSeek, Yuanbao, and Gemini conversations to Obsidian.
// @author       You
// @match        https://chatgpt.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://chat.deepseek.com/*
// @match        https://gemini.google.com/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539112/Export%20Chat%20History%20to%20Obsidian.user.js
// @updateURL https://update.greasyfork.org/scripts/539112/Export%20Chat%20History%20to%20Obsidian.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var source = "others"
    var cssArticle = "article"
    var cssUser = "div.whitespace-pre-wrap"
    var cssCopyButton = "div.touch\\:-me-2 > button:nth-child(1)"

    // 域名识别逻辑
    if (window.location.hostname == 'chatgpt.com') {
        source = "chatgpt";
    } else if (window.location.hostname == 'yuanbao.tencent.com') {
        source = "yuanbao";
        cssArticle = "div.agent-chat__list__item"
        cssUser = "div.hyc-content-text"
        cssCopyButton = "div.agent-chat__toolbar__item.agent-chat__toolbar__copy"
    } else if (window.location.hostname == 'chat.deepseek.com') {
        source = "deepseek"
    } else if (window.location.hostname == 'gemini.google.com') {
        source = "gemini";
    }

    async function addExportButton() {
        if (document.getElementById('export-to-obsidian-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'export-to-obsidian-btn';
        btn.innerText = '💾 Export';

        const savedTop = await GM_getValue(source + '_exportBtnTop', 50);
        const savedRight = await GM_getValue(source + '_exportBtnRight', 20);

        btn.style.position = 'fixed';
        btn.style.top = savedTop + 'px';
        btn.style.right = savedRight + 'px';
        btn.style.zIndex = '9999';
        btn.style.padding = '8px 12px';
        btn.style.fontSize = '14px';
        btn.style.backgroundColor = '#2670dd';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'move';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        btn.title = "拖动以移动位置，点击导出";

        makeButtonDraggable(btn);
        document.body.appendChild(btn);
    }

    function makeButtonDraggable(button) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = button.getBoundingClientRect();
            button._offsetX = startX - rect.right;
            button._offsetY = startY - rect.top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', async (e) => {
            if (!isDragging) return;
            const newTop = e.clientY - button._offsetY;
            const newRight = window.innerWidth - (e.clientX - button._offsetX);
            button.style.top = `${newTop}px`;
            button.style.right = `${newRight}px`;
            await GM_setValue(source + '_exportBtnTop', newTop);
            await GM_setValue(source + '_exportBtnRight', newRight);
        });

        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.userSelect = '';
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 3) {
                exportToObsidian();
            }
        });
    }

    function findElementsByStyle(property, value) {
        const allElements = document.querySelectorAll('[style*="z-index"], div');
        const result = [];
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const propValue = computedStyle.getPropertyValue(property);
            if (propValue === String(value)) {
                result.push(element);
            }
        });
        return result;
    }

    // 通用抓取函数 (ChatGPT / Yuanbao)
    async function getContents() {
        const articles = document.querySelectorAll(cssArticle);
        const contents = [];
        for (var idx = 0; idx < articles.length; idx++) {
            const article = articles[idx]
            if (idx % 2 === 0) {
                const user = article.querySelector(cssUser);
                if (!user) continue;
                contents.push(user.textContent);
            } else {
                const copyButton = article.querySelector(cssCopyButton);
                if (!copyButton) continue;
                copyButton.click();
                await new Promise(resolve => setTimeout(resolve, 250));
                const text = await navigator.clipboard.readText();
                contents.push(text);
            }
        }
        return contents;
    }

    // DeepSeek 抓取逻辑
    async function getDeepSeekContents() {
        const contents = [];
        var copyButtons = document.querySelectorAll("div.ds-flex > div.ds-icon-button:nth-child(1)")
        for (const copyButton of copyButtons) {
            copyButton.click();
            await new Promise(resolve => setTimeout(resolve, 250));
            const text = await navigator.clipboard.readText();
            contents.push(text);
        }
        return contents;
    }

    // Gemini 抓取逻辑
    async function getGeminiContents() {
        const contents = [];
        // Gemini 使用 Web Components 标签
        const entries = document.querySelectorAll('user-query, model-response');
        for (const entry of entries) {
            if (entry.tagName.toLowerCase() === 'user-query') {
                const question = entry.querySelector('div.query-text');
                contents.push(question.textContent.trim());
            } else if (entry.tagName.toLowerCase() === 'model-response') {
                const copyButton = entry.querySelector('copy-button > button');
                if (copyButton) {
                    console.log(copyButton);
                    copyButton.focus();
                    await new Promise(resolve => setTimeout(resolve, 30));
                    copyButton.click();
                    await new Promise(resolve => setTimeout(resolve, 200));
                    const text = await navigator.clipboard.readText();
                    contents.push(text);
                }
            }
        }
        return contents;
    }

    // 核心导出逻辑
    async function exportToObsidian() {
        var contents;
        if (source == "deepseek") {
            contents = await getDeepSeekContents();
        } else if (source == "gemini") {
            contents = await getGeminiContents();
        } else {
            contents = await getContents();
        }

        if (contents.length === 0) {
            alert("没有找到任何对话记录！");
            return;
        }

        let body = '';
        contents.forEach((text, idx) => {
            if (idx % 2 === 0) {
                body += `# 🧑🏻‍💻 User:\n> ${text.replace(/\n/g, '\n> ')}\n\n`;
            } else {
                body += `# 🤖 AI:\n${text}\n\n`;
            }
        });

        var title = document.title.replace(/[/\\?%*:|"<>]/g, '-').trim();
        if (source == "yuanbao") {
            var titleElement = document.querySelector("span.agent-dialogue__content--common__header__name__title");
            if (titleElement) title = titleElement.textContent;
        } else if (source == "deepseek") {
            var elements = findElementsByStyle('z-index', 12);
            if (elements.length) title = elements[0].textContent;
        } else if (source == "gemini") {
            const firstQuery = document.querySelector('span.conversation-title');
            if (firstQuery) {
                title = firstQuery.textContent.trim().substring(0, 30);
            }
        }

        const timestamp = new Date().toLocaleString();
        const url = document.URL;
        const dateOnly = new Date().toLocaleDateString('sv-SE').replace(/-/g, '');
        const yaml = `---\ntitle: "${title}"\ndate: ${timestamp}\nsource: ${source}\nURL: ${url}\n---\n\n`;
        const fullContent = yaml + body;

        GM_setClipboard(fullContent);

        const obsidianUrl = `obsidian://new?file=Chat/${source}/${dateOnly}_${encodeURIComponent(title)}&clipboard`;
        const link = document.createElement('a');
        link.href = obsidianUrl;
        link.click();
    }

    GM_registerMenuCommand("📥 导出到 Obsidian", exportToObsidian);

    setTimeout(addExportButton, 1000);
    const observer = new MutationObserver(addExportButton);
    observer.observe(document.body, { childList: true, subtree: true });
})();