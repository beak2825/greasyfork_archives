// ==UserScript==
// @name         SankakuComplex post Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filter <article> on sankakucomplex.com by data-auto_page content, configurable via UI with hide or blur modes.
// @author       rainbowflesh
// @match        *://chan.sankakucomplex.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543331/SankakuComplex%20post%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/543331/SankakuComplex%20post%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'sankakuArticleFilterConfig';
    const defaultConfig = {
        keywords: ['AI','ai-created','Hishou_Kussaku','comic','Non-h','kakkuu_mogura','sankaku_ai'],
        actionMode: 'hide', // 'hide' or 'blur'
        uiFolded: false
    };

    function loadConfig() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultConfig;
    }

    function saveConfig(config) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }

    let config = loadConfig();

    function shouldBlock(dataAttr) {
        return config.keywords.some(keyword => dataAttr.includes(keyword));
    }

    function applyAction(el, blocked) {
        if (blocked) {
            if (config.actionMode === 'hide') {
                el.style.display = 'none';
            } else if (config.actionMode === 'blur') {
                el.style.filter = 'blur(8px)';
                el.style.pointerEvents = 'none';
            }
        } else {
            el.style.display = '';
            el.style.filter = '';
            el.style.pointerEvents = '';
        }
    }

    function process() {
        document.querySelectorAll('article.post-preview').forEach(article => {
            const img = article.querySelector('img.post-preview-image[data-auto_page]');
            if (img) {
                const dataAttr = img.getAttribute('data-auto_page') || '';
                const matched = shouldBlock(dataAttr);
                applyAction(article, matched);
            }
        });
    }

    const observer = new MutationObserver(() => requestAnimationFrame(process));
    observer.observe(document.body, { childList: true, subtree: true });

    process();
    createUI();

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'filter-ui';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 8px;
            font-size: 14px;
            z-index: 99999;
            max-width: 250px;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
            font-family: sans-serif;
        `;

        panel.innerHTML = `
            <div id="ui-header" style="cursor: pointer; font-weight: bold;">
                🔍 Article Filter ${config.uiFolded ? '▶' : '▼'}
            </div>
            <div id="ui-body" style="display: ${config.uiFolded ? 'none' : 'block'};">
                <label>Keywords (one per line):</label><br>
                <textarea id="keywords" rows="4" style="width:100%;"></textarea><br>

                <label>Action:</label>
                <select id="actionMode" style="width:100%;">
                    <option value="hide">Hide</option>
                    <option value="blur">Blur</option>
                </select><br><br>

                <button id="saveConfig">Save</button>
            </div>
        `;
        document.body.appendChild(panel);

        const textarea = document.getElementById('keywords');
        const actionMode = document.getElementById('actionMode');
        const header = document.getElementById('ui-header');
        const body = document.getElementById('ui-body');

        textarea.value = config.keywords.join('\n');
        actionMode.value = config.actionMode;

        document.getElementById('saveConfig').onclick = () => {
            config.keywords = textarea.value.split('\n').map(k => k.trim()).filter(Boolean);
            config.actionMode = actionMode.value;
            saveConfig(config);
            process();
        };

        header.onclick = () => {
            const folded = body.style.display === 'none';
            body.style.display = folded ? 'block' : 'none';
            header.innerText = `🔍 Article Filter ${folded ? '▼' : '▶'}`;
            config.uiFolded = !folded;
            saveConfig(config);
        };
    }
})();
