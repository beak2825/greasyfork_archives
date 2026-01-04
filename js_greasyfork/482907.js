// ==UserScript==
// @name         ChatGPT Shortcut Anywhere
// @name:zh-CN   ChatGPT Shortcut Anywhere
// @name:ja      どこでもChatGPTショートカット
// @name:pt      Atalho ChatGPT Em Qualquer Lugar
// @namespace    https://www.aishort.top/
// @version      1.0.1
// @description  Toggle AiShort sidebar on the page
// @author       BensonLi
// @description:zh-CN ChatGPT Shortcut 扩展的增强版，任意网站都能打开 AiShort 侧边栏
// @description:ja ChatGPT Shortcut 拡張の強化版、任意のウェブサイトで AiShort サイドバーを開くことができます
// @description:pt Versão aprimorada da extensão ChatGPT Shortcut, abre a barra lateral AiShort em qualquer site
// @match        https://chatgpt.com/*
// @match        https://chat.deepseek.com/*
// @match        https://gemini.google.com/*
// @match        https://claude.ai/*
// @match        https://yiyan.baidu.com/*
// @match        https://*.siliconflow.cn/*
// @match        https://tongyi.aliyun.com/*
// @match        https://www.tongyi.com/*
// @match        https://chat.qwen.ai/*
// @match        https://kimi.moonshot.cn/*
// @match        https://www.doubao.com/*
// @match        https://chatglm.cn/*
// @match        https://xinghuo.xfyun.cn/*
// @match        https://ying.baichuan-ai.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://groq.com/*
// @match        https://*.groq.com/*
// @match        https://openrouter.ai/*
// @match        https://metaso.cn/*
// @match        https://302.ai/*
// @match        https://chat.scnet.cn/*
// @match        https://www.perplexity.ai/*
// @match        https://grok.com/*
// @match        https://character.ai/*
// @match        https://pi.ai/*
// @match        https://janitorai.com/*
// @match        https://www.tiangong.cn/*
// @match        https://jules.google.com/*
// @exclude      *://www.aishort.top/*
// @icon         https://www.aishort.top/img/logo.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482907/ChatGPT%20Shortcut%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/482907/ChatGPT%20Shortcut%20Anywhere.meta.js
// ==/UserScript==

// You can directly set your preferred language by editing this variable.
// For example, replace 'null' with 'zh' for Chinese, 'en' for English, 'ja' for Japanese, etc.
// Supported language codes include: 'en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', and 'bn'.
// If set to 'null', the script will automatically use the browser's default language.
const userSelectedLanguage = null; // Example: const userSelectedLanguage = 'zh';
// Array of available languages
const AVAILABLE_LANGUAGES = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'ru', 'pt', 'hi', 'ar', 'bn'];

const hostsRequiringPopup = ['chatgpt.com', 'claude.ai', 'gemini.google.com', 'groq.com', 'openrouter.ai','tongyi.aliyun.com'];
const hostname = window.location.hostname;

// Function to get the user-selected language or the browser's default language
function getLanguage() {
    if (AVAILABLE_LANGUAGES.includes(userSelectedLanguage)) {
        return userSelectedLanguage;
    }
    const browserLanguage = navigator.language.split('-')[0];
    return AVAILABLE_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'en';
}

// 获取iframe URL
function getIframeUrl() {
    const userLanguage = getLanguage();
    return userLanguage === 'zh' ? 'https://www.aishort.top/' : `https://www.aishort.top/${userLanguage}/`;
}
function createToggleIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1024 1024');
    svg.setAttribute('width', '35');
    svg.setAttribute('height', '35');

    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d', 'M85.333333 490.666667A64 64 0 0 0 149.333333 554.666667h725.333334a64 64 0 0 0 0-128h-725.333334A64 64 0 0 0 85.333333 490.666667z');
    path1.setAttribute('fill', '#5cac7c');

    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path2.setAttribute('d', 'M405.333333 853.333333a64 64 0 0 1 0-128h469.333334a64 64 0 0 1 0 128h-469.333334z m256-597.333333a64 64 0 0 1 0-128h213.333334a64 64 0 0 1 0 128h-213.333334z');
    path2.setAttribute('fill', '#5cac7c');
    path2.setAttribute('opacity', '0.5');

    svg.appendChild(path1);
    svg.appendChild(path2);

    svg.style.position = 'fixed';
    svg.style.bottom = '300px';
    svg.style.right = '15px';
    svg.style.zIndex = '1000';
    svg.style.cursor = 'pointer';

    return svg;
}
// 创建侧边栏按钮及逻辑
function createSidebar() {
    const iframeUrl = getIframeUrl();
    const toggleIcon = createToggleIcon();
    document.body.appendChild(toggleIcon);

    if (hostsRequiringPopup.includes(hostname)) {
        let popupWindow = null;
        toggleIcon.addEventListener('click', function() {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.close();
                popupWindow = null;
            } else {
                // 如果窗口未打开或已关闭，打开新窗口
                popupWindow = window.open(iframeUrl, '_blank', 'width=500,height=700');
            }
        });
    } else {
        const iframe = document.createElement('iframe');
        iframe.id = 'ai-shortcut-sidebar';
		iframe.style.cssText = `
            width: 400px;
            height: 100%;
            position: fixed;
            right: -400px;
            top: 0;
            z-index: 999;
            border: none;
            transition: right 0.3s ease;
            box-shadow: -2px 0 5px rgba(0,0,0,0.2);
            background: white;
        `;
        iframe.src = iframeUrl;
		iframe.allow = "clipboard-write";
		iframe.sandbox = 'allow-same-origin allow-scripts allow-popups allow-forms allow-downloads';
        document.body.appendChild(iframe);
        toggleIcon.addEventListener('click', function() {
            // 切换iframe显示
            iframe.style.right = (iframe.style.right === '0px') ? '-400px' : '0px';
        });
    }
}

// 检查是否已经存在相同的iframe(包括扩展的)
function checkForExistingIframe() {
    setTimeout(() => {
        const iframes = Array.from(document.getElementsByTagName('iframe'));
        const existingIframe = iframes.some(iframe => {
            try {
                const iframeSrc = new URL(iframe.src);
                return iframeSrc.hostname === 'www.aishort.top' ||
                       iframe.id === 'unique-iframe-id' ||
                       iframe.id === 'ai-shortcut-sidebar';
            } catch (e) {
                return false;
            }
        });

        if (!existingIframe) {
            createSidebar();
        }
    }, 500);
}

(function() {
    'use strict';
    window.onload = () => checkForExistingIframe();
})();
