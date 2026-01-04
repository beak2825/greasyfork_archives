// ==UserScript==
// @name         Add to LM Studio Button for MCP.so
// @name:ru      Добавить в LM Studio (Кнопка) для MCP.so
// @namespace    https://github.com/MjKey
// @version      1.0
// @description  Adds a button to MCP.so to import MCP server into LM Studio 🧠✨
// @description:ru Добавляет кнопку на MCP.so для импорта MCP сервера в LM Studio 🧠✨
// @description:en Adds a button to MCP.so to import  MCP server into LM Studio 🧠✨
// @author       MjKey
// @match        https://mcp.so/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mcp.so
// @grant        none
// @license      MIT
// @supportURL   https://t.me/devMjKey
// @donate      https://www.donationalerts.com/r/mjk3y
// @downloadURL https://update.greasyfork.org/scripts/543596/Add%20to%20LM%20Studio%20Button%20for%20MCPso.user.js
// @updateURL https://update.greasyfork.org/scripts/543596/Add%20to%20LM%20Studio%20Button%20for%20MCPso.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let currentTheme = null;

    function resolveTheme() {
        const raw = (localStorage.getItem('THEME') || '').toLowerCase();
        if (raw.includes('dark')) return 'dark';
        if (raw.includes('light')) return 'light';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function buildButton(deeplink) {
        const theme = resolveTheme();
        const imgSrc = `https://files.lmstudio.ai/deeplink/mcp-install-${theme}.svg`;

        const a = document.createElement('a');
        a.href = deeplink;
        a.target = '_blank';
        a.className = 'lmstudio-button';
        a.style.display = 'inline-flex';
        a.style.alignItems = 'center';
        a.style.marginRight = '10px';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Add MCP Server to LM Studio';
        img.style.height = '32px';
        img.style.width = 'auto';
        img.className = 'lmstudio-button-img';

        a.appendChild(img);
        return a;
    }

    function extractServerConfig(rawJson) {
        let parsed;
        try {
            parsed = JSON.parse(rawJson);
        } catch (e) {
            console.warn('LM Studio Button: JSON parse error', e);
            return null;
        }

        const serversRoot = parsed.modelcontextprotocol?.mcpServers || parsed.mcpServers;
        if (!serversRoot) return null;

        const firstName = Object.keys(serversRoot)[0];
        if (!firstName) return null;

        return { name: firstName, config: serversRoot[firstName] };
    }

    function addButtonToBlock(block) {
        const title = block.querySelector('h2');
        if (!title || title.dataset.lmstudioAdded) return;

        const codeEl = block.querySelector('code');
        if (!codeEl) return;

        const extracted = extractServerConfig(codeEl.innerText.trim());
        if (!extracted) return;

        const { name, config } = extracted;

        const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(config))));
        const deeplink = `lmstudio://add_mcp?name=${encodeURIComponent(name)}&config=${encodeURIComponent(b64)}`;

        const btn = buildButton(deeplink);
        title.parentElement.insertBefore(btn, title);
        title.dataset.lmstudioAdded = 'true';
    }

    function scanAndInject() {
        document.querySelectorAll('div.rounded-lg').forEach(block => {
            const h2 = block.querySelector('h2');
            if (!h2) return;
            if (h2.textContent.trim().toLowerCase().includes('server config')) {
                addButtonToBlock(block);
            }
        });
    }

    function updateButtonImages() {
        const newTheme = resolveTheme();
        if (newTheme === currentTheme) return;
        currentTheme = newTheme;

        document.querySelectorAll('.lmstudio-button-img').forEach(img => {
            img.src = `https://files.lmstudio.ai/deeplink/mcp-install-${newTheme}.svg`;
        });
    }

    const observer = new MutationObserver(scanAndInject);
    observer.observe(document.body, { childList: true, subtree: true });
    scanAndInject();

    window.addEventListener('storage', (e) => {
        if (e.key === 'THEME') {
            updateButtonImages();
        }
    });

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateButtonImages);
    }
    
    setInterval(updateButtonImages, 3000);
})();
