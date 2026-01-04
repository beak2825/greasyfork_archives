// ==UserScript==
// @name         公众号音频下载（稳定修复版）
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  微信文章页面中显示下载按钮并列出音频链接（可复制），兼容动态渲染音频标签的情况。
// @author       bingo8670 + ChatGPT
// @match        https://mp.weixin.qq.com/s*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539200/%E5%85%AC%E4%BC%97%E5%8F%B7%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%88%E7%A8%B3%E5%AE%9A%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539200/%E5%85%AC%E4%BC%97%E5%8F%B7%E9%9F%B3%E9%A2%91%E4%B8%8B%E8%BD%BD%EF%BC%88%E7%A8%B3%E5%AE%9A%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const collectedItems = new Map(); // 使用 Map 防止重复插入
    let urlPanelInitialized = false;

    function getVoiceElements() {
        return document.querySelectorAll('mp-common-mpaudio, mpvoice, mp-audio, .mp_common_audio');
    }

    function extractVoiceInfo(el) {
        const fileid = el.getAttribute('voice_encode_fileid');
        const title = el.getAttribute('name') || '音频';
        if (!fileid) return null;
        const url = 'https://res.wx.qq.com/voice/getvoice?mediaid=' + fileid;
        return { url, title };
    }

    function addDownloadButton(el, info) {
        if (el.dataset.downloadButtonInjected) return;
        el.dataset.downloadButtonInjected = "true";

        collectedItems.set(info.url, info.title); // 添加到链接集合

        const btn = document.createElement('div');
        btn.style = `
            display:inline-block;
            margin-top:10px;
            padding:8px 12px;
            background:#4CAF50;
            color:#fff;
            font-size:13px;
            text-align:center;
            border-radius:5px;
            cursor:pointer;
        `;
        btn.innerHTML = '下载音频 “' + info.title + '”';
        btn.onclick = function () {
            try {
                GM_download({
                    url: info.url,
                    name: info.title + '.mp3',
                    saveAs: true
                });
            } catch (e) {
                console.error("下载失败：", e);
            }
        };
        el.after(btn);

        updateUrlDisplayArea(); // 每次添加后刷新底部输出
    }

    function createUrlDisplayArea() {
        if (urlPanelInitialized) return;
        urlPanelInitialized = true;

        const panel = document.createElement('div');
        panel.id = 'audio-url-display';
        panel.style = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #f9f9f9;
            border-top: 2px solid #ccc;
            padding: 10px;
            font-size: 13px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 9999;
        `;

        const title = document.createElement('div');
        title.innerHTML = '<b>📥 可复制音频链接：</b>';
        panel.appendChild(title);

        const container = document.createElement('div');
        container.id = 'audio-url-list';
        container.style = `display: flex; flex-wrap: wrap; gap: 6px; margin-top: 5px;`;
        panel.appendChild(container);

        document.body.appendChild(panel);
    }

    function updateUrlDisplayArea() {
        if (!urlPanelInitialized) createUrlDisplayArea();

        const container = document.getElementById('audio-url-list');
        if (!container) return;

        container.innerHTML = ''; // 清空
        collectedItems.forEach((title, url) => {
            const linkDiv = document.createElement('div');
            linkDiv.textContent = `《${title}》 ${url}`;
            linkDiv.title = title;
            linkDiv.style = `
                display:inline-block;
                background:#4CAF50;
                color:#fff;
                padding:6px 10px;
                border-radius:5px;
                font-size:12px;
                cursor:text;
                user-select:text;
            `;
            container.appendChild(linkDiv);
        });
    }

    // 每当 DOM 中插入新节点，就检查是否有音频标签
    const observer = new MutationObserver(() => {
        const els = getVoiceElements();
        els.forEach(el => {
            const info = extractVoiceInfo(el);
            if (info) addDownloadButton(el, info);
        });
    });

    // 页面加载完开始监听 DOM 变化
    window.addEventListener('load', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初次手动触发一次
        const els = getVoiceElements();
        els.forEach(el => {
            const info = extractVoiceInfo(el);
            if (info) addDownloadButton(el, info);
        });
    });
})();
