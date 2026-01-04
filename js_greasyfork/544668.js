// ==UserScript==
// @name         Bilibili 一键跳转 Youtube 同名视频
// @namespace    A user script about something
// @version      1.0
// @description  在 Bilibili/哔哩哔哩 网站上提供一个按钮，点击即可跳转 YouTube 同名视频。
// @icon         https://www.google.com/s2/favicons?domain=www.bilibili.com
// @author       WhiteBr1ck
// @license      MIT
// @match        *://www.bilibili.com/video/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.youtube.com
// @downloadURL https://update.greasyfork.org/scripts/544668/Bilibili%20%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%20Youtube%20%E5%90%8C%E5%90%8D%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/544668/Bilibili%20%E4%B8%80%E9%94%AE%E8%B7%B3%E8%BD%AC%20Youtube%20%E5%90%8C%E5%90%8D%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BUTTON_ID = 'b2yt-finder-button';
    let lastUrl = '';
    let mainLogicInterval;

    function openSettingsMenu() {
        const currentThreshold = GM_getValue('similarity_threshold', 0.6);
        const userInput = prompt('请输入新的匹配阈值 (范围 0.0 - 1.0):', currentThreshold);
        if (userInput === null) return;
        const newThreshold = parseFloat(userInput);
        if (isNaN(newThreshold) || newThreshold < 0.0 || newThreshold > 1.0) {
            alert('输入无效！请输入一个介于 0.0 和 1.0 之间的数字。');
            return;
        }
        GM_setValue('similarity_threshold', newThreshold);
        alert(`匹配阈值已成功保存为: ${newThreshold * 100}%`);
    }

    /**
     * 注册菜单命令: 在菜单中添加一个可点击的命令
     */
    GM_registerMenuCommand('设置匹配阈值', openSettingsMenu);

    // --- 主逻辑 (URL侦测器) ---

    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            console.log("B2YT: 检测到URL变化，准备刷新按钮...");
            lastUrl = currentUrl;
            runMainLogic();
        }
    }, 1000);

    function runMainLogic() {
        clearInterval(mainLogicInterval);
        document.getElementById(BUTTON_ID)?.remove();
        mainLogicInterval = setInterval(() => {
            const toolbar = document.querySelector('.video-toolbar-right');
            if (toolbar) {
                clearInterval(mainLogicInterval);
                createAndSearch(toolbar);
            }
        }, 300);
    }

    function createAndSearch(toolbar) {
        if (document.getElementById(BUTTON_ID)) return;
        console.log("B2YT: 找到工具栏，正在注入新按钮...");
        const ytButton = document.createElement('a');
        ytButton.id = BUTTON_ID;
        ytButton.innerText = 'YT查找中...';
        ytButton.style.cssText = `
            margin-left: 10px; padding: 4px 8px; border-radius: 4px;
            background-color: #00a1d6; color: white; text-decoration: none;
            font-size: 14px; cursor: not-allowed; opacity: 0.7;
        `;
        toolbar.appendChild(ytButton);
        const titleElement = document.querySelector('h1.video-title');
        if (!titleElement || !titleElement.title) {
            updateButtonState(ytButton, 'error', '未能获取B站标题');
            return;
        }
        const biliTitle = titleElement.title;
        searchAndVerifyOnYouTube(biliTitle, ytButton);
    }

    function searchAndVerifyOnYouTube(bTitle, button) {
        // 动态读取已保存的阈值，如果不存在则使用 0.6 作为默认值
        const SIMILARITY_THRESHOLD = GM_getValue('similarity_threshold', 0.6);

        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(bTitle)}`;
        console.log("--- B2YT 开始查找 ---");
        console.log(`B站原始标题: ${bTitle}`);
        console.log(`当前匹配阈值设置为: ${SIMILARITY_THRESHOLD * 100}%`);

        GM_xmlhttpRequest({
            method: 'GET', url: searchUrl, onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const regex = /\/watch\?v=([a-zA-Z0-9_-]{11})/;
                    const match = response.responseText.match(regex);
                    if (match && match[0]) {
                        const firstVideoUrl = `https://www.youtube.com${match[0]}`;
                        console.log(`[步骤1成功] 找到首个候选视频URL: ${firstVideoUrl}`);

                        GM_xmlhttpRequest({
                            method: 'GET', url: firstVideoUrl, onload: function(videoPageResponse) {
                                try {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(videoPageResponse.responseText, "text/html");
                                    const rawYtTitle = doc.title;

                                    if (rawYtTitle && rawYtTitle !== 'YouTube') {
                                        const ytTitle = rawYtTitle.replace(/ - YouTube$/, '').trim();
                                        console.log(`[步骤2成功] 获取到候选视频的真实标题: ${rawYtTitle}`);
                                        console.log(`[步骤2.1] 移除后缀后的YT标题: ${ytTitle}`);
                                        const similarity = calculateStringSimilarity(bTitle, ytTitle);
                                        console.log(`[最终对比] 相似度: ${(similarity * 100).toFixed(2)}%`);

                                        if (similarity >= SIMILARITY_THRESHOLD) {
                                            updateButtonState(button, 'success', firstVideoUrl);
                                        } else {
                                            updateButtonState(button, 'no_match', searchUrl);
                                        }
                                    } else {
                                        console.error("[步骤2失败] 未能从视频页提取到有效标题。");
                                        updateButtonState(button, 'no_match', searchUrl);
                                    }
                                } catch (e) {
                                    console.error("[步骤2失败] 解析视频页面时发生严重错误:", e);
                                    updateButtonState(button, 'error', "解析YT页面失败");
                                }
                            }, onerror: function() { console.error("[步骤2失败] 请求候选视频页面时发生网络错误。"); updateButtonState(button, 'error', "验证视频失败"); }
                        });
                    } else { console.error("[步骤1失败] 未能在搜索结果页找到任何视频链接。"); updateButtonState(button, 'no_match', searchUrl); }
                } else { updateButtonState(button, 'error', '请求失败: ' + response.status); }
            }, onerror: function() { updateButtonState(button, 'error', '网络请求失败'); }
        });
    }

    /**
     * 工具函数：净化标题，移除所有非字母、非数字的字符
     */
    function normalizeTitle(str) {
        if (!str) return '';
        return str.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
    }

    /**
     * 工具函数：计算两个字符串的相似度
     */
    function calculateStringSimilarity(str1, str2) {
        const s1 = normalizeTitle(str1);
        const s2 = normalizeTitle(str2);
        if (s1 === s2) return 1.0;
        if (s1.length < 2 || s2.length < 2) return 0.0;
        const firstBigrams = new Map();
        for (let i = 0; i < s1.length - 1; i++) {
            const bigram = s1.substring(i, i + 2);
            const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
            firstBigrams.set(bigram, count);
        }
        let intersectionSize = 0;
        for (let i = 0; i < s2.length - 1; i++) {
            const bigram = s2.substring(i, i + 2);
            if (firstBigrams.has(bigram) && firstBigrams.get(bigram) > 0) {
                intersectionSize++;
                firstBigrams.set(bigram, firstBigrams.get(bigram) - 1);
            }
        }
        return (2.0 * intersectionSize) / (s1.length + s2.length - 2);
    }

    /**
     * 工具函数：更新按钮的状态
     */
    function updateButtonState(button, state, info) {
        if (!button) return;
        button.style.cursor = 'pointer';
        button.style.opacity = '1';
        button.target = '_blank';
        switch (state) {
            case 'success':
                button.innerText = '✅ 打开 Youtube 视频';
                button.href = info;
                button.style.backgroundColor = '#4CAF50';
                break;
            case 'no_match':
                button.innerText = '🟡 匹配度低';
                button.href = info;
                button.style.backgroundColor = '#FFC107';
                break;
            case 'error':
                button.innerText = `⚠️ ${info}`;
                button.href = 'javascript:void(0);';
                button.target = '';
                button.style.cursor = 'not-allowed';
                button.style.backgroundColor = '#f44336';
                break;
        }
    }

})();