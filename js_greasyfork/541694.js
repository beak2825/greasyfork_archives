// ==UserScript==
// @name        cosplaytele post hider
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自定义关键词模糊帖子内容，并提供可折叠的设置UI面板（支持包含/正则/模糊匹配）
// @author       rainbowflesh
// @match        *://cosplaytele.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541694/cosplaytele%20post%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/541694/cosplaytele%20post%20hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'keywordPostHandlerConfig';

    const defaultConfig = {
        keywords: ['AI'],
        matchMode: 'contains', // contains, regex, fuzzy
        actionMode: 'blur',    // blur, hide
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

    function matchKeyword(text, keyword) {
        if (!text) return false;
        switch (config.matchMode) {
            case 'regex':
                try {
                    return new RegExp(keyword).test(text);
                } catch {
                    return false;
                }
            case 'fuzzy':
                return text.toLowerCase().includes(keyword.toLowerCase());
            case 'contains':
            default:
                return text.includes(keyword);
        }
    }

    function containsBlockedKeyword(element) {
        const text = element.innerText || element.textContent || '';
        return config.keywords.some(keyword => matchKeyword(text, keyword));
    }

    function applyActionToPost(post, match) {
        if (match) {
            if (config.actionMode === 'hide') {
                post.style.display = 'none';
            } else {
                post.style.display = '';
                post.style.filter = 'blur(8px)';
                post.style.pointerEvents = 'none';
            }
        } else {
            post.style.display = '';
            post.style.filter = '';
            post.style.pointerEvents = '';
        }
    }

    function processPosts() {
        const posts = document.querySelectorAll('.post-item');
        posts.forEach(post => {
            const match = containsBlockedKeyword(post);
            applyActionToPost(post, match);
        });
    }

    const observer = new MutationObserver(processPosts);
    observer.observe(document.body, { childList: true, subtree: true });

    processPosts();

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'post-keyword-handler-ui';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fefefe;
            border: 1px solid #999;
            padding: 10px;
            font-size: 14px;
            z-index: 99999;
            max-width: 280px;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
            font-family: sans-serif;
        `;

        panel.innerHTML = `
            <div id="panel-header" style="cursor: pointer; font-weight: bold; user-select: none;">
                ⚙️ 帖子关键词处理器 ${config.uiFolded ? '▶' : '▼'}
            </div>
            <div id="panel-body" style="margin-top: 8px; display: ${config.uiFolded ? 'none' : 'block'};">
                <label><strong>关键词列表：</strong></label><br>
                <textarea id="keywords" rows="4" style="width:100%; resize: vertical;"></textarea><br>

                <label><strong>匹配模式：</strong></label>
                <select id="matchMode" style="width:100%;">
                    <option value="contains">包含</option>
                    <option value="regex">正则</option>
                    <option value="fuzzy">模糊</option>
                </select><br><br>

                <label><strong>处理方式：</strong></label>
                <select id="actionMode" style="width:100%;">
                    <option value="blur">模糊</option>
                    <option value="hide">隐藏</option>
                </select><br><br>

                <button id="saveConfig">保存设置</button>
            </div>
        `;

        document.body.appendChild(panel);

        const textarea = document.getElementById('keywords');
        const matchSelect = document.getElementById('matchMode');
        const actionSelect = document.getElementById('actionMode');
        const header = document.getElementById('panel-header');
        const body = document.getElementById('panel-body');

        textarea.value = config.keywords.join('\n');
        matchSelect.value = config.matchMode;
        actionSelect.value = config.actionMode;

        document.getElementById('saveConfig').onclick = () => {
            config.keywords = textarea.value.split('\n').map(k => k.trim()).filter(k => k);
            config.matchMode = matchSelect.value;
            config.actionMode = actionSelect.value;
            saveConfig(config);
            processPosts();
        };

        header.onclick = () => {
            const folded = body.style.display === 'none';
            body.style.display = folded ? 'block' : 'none';
            header.innerText = `⚙️ 帖子关键词处理器 ${folded ? '▼' : '▶'}`;
            config.uiFolded = !folded;
            saveConfig(config);
        };
    }

    createUI();

})();
