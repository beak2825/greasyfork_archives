// ==UserScript==
// @name         4khd.com Post hider
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  屏蔽含指定关键词的帖子，支持隐藏或模糊显示，附带可折叠UI设置面板。
// @author       rainbowflesh
// @match        *://*.4khd.com/*
// @match       *://*.xxtt.ink/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541693/4khdcom%20Post%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/541693/4khdcom%20Post%20hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = '4khdPostBlockerConfig';

    const defaultConfig = {
        keywords: ['AI'],
        matchMode: 'contains', // contains, regex, fuzzy
        actionMode: 'hide',    // hide, blur
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

    function shouldBlockElement(el) {
        // 跳过 UI 面板本身
        if (el.closest('#post-block-ui')) return false;

        const aTags = el.querySelectorAll('a');
        for (const a of aTags) {
            const text = a.textContent || '';
            for (const keyword of config.keywords) {
                if (matchKeyword(text, keyword)) return true;
            }
        }
        return false;
    }

    function applyAction(el, match) {
        if (el.closest('#post-block-ui')) return; // 不处理UI面板
        if (match) {
            if (config.actionMode === 'hide') {
                el.style.display = 'none';
            } else {
                el.style.filter = 'blur(8px)';
                el.style.pointerEvents = 'none';
            }
        } else {
            el.style.display = '';
            el.style.filter = '';
            el.style.pointerEvents = '';
        }
    }

    function processPosts() {
        const posts = document.querySelectorAll('li.wp-block-post');
        posts.forEach(post => {
            // 跳过 UI 面板
            if (post.closest('#post-block-ui')) return;
            const match = shouldBlockElement(post);
            applyAction(post, match);
        });
    }

    const observer = new MutationObserver(() => {
        // 防抖：避免频繁触发 processPosts
        requestAnimationFrame(processPosts);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    processPosts();

    // ================= UI 面板 =================
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'post-block-ui';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            color: black;
            font-size: 14px;
            z-index: 99999999;
            max-width: 280px;
            box-shadow: 0 0 6px rgba(0,0,0,0.3);
            font-family: sans-serif;
        `;

        panel.innerHTML = `
            <div id="panel-header" style="cursor: pointer; font-weight: bold;">
                📌 关键词屏蔽器 ${config.uiFolded ? '▶' : '▼'}
            </div>
            <div id="panel-body" style="display: ${config.uiFolded ? 'none' : 'block'};">
                <label><strong>关键词：</strong></label><br>
                <textarea id="keywords" rows="4" style="width:100%; resize: vertical;"></textarea><br>

                <label><strong>匹配模式：</strong></label>
                <select id="matchMode" style="width:100%;">
                    <option value="contains">包含</option>
                    <option value="regex">正则</option>
                    <option value="fuzzy">模糊</option>
                </select><br><br>

                <label><strong>处理方式：</strong></label>
                <select id="actionMode" style="width:100%;">
                    <option value="hide">隐藏</option>
                    <option value="blur">模糊</option>
                </select><br><br>

                <button id="saveConfig">保存</button>
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
          console.log("save conifg");
            config.keywords = textarea.value.split('\n').map(k => k.trim()).filter(Boolean);
            config.matchMode = matchSelect.value;
            config.actionMode = actionSelect.value;
            saveConfig(config);
            processPosts(); // 立即刷新
        };

        header.onclick = () => {
            const folded = body.style.display === 'none';
            body.style.display = folded ? 'block' : 'none';
            header.innerText = `📌 关键词屏蔽器 ${folded ? '▼' : '▶'}`;
            config.uiFolded = !folded;
            saveConfig(config);
        };
    }

    createUI();

})();