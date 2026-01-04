// ==UserScript==
// @name         Bilibili 字幕文本提取器（按钮右下角）
// @namespace    https://greasyfork.org/users/d
// @version      1.2
// @description  提取 Bilibili 视频页面中字幕的纯文本内容（不含时间戳），并一键复制，按钮显示在右下角。
// @author       d
// @match        *://www.bilibili.com/video/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544793/Bilibili%20%E5%AD%97%E5%B9%95%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E6%8C%89%E9%92%AE%E5%8F%B3%E4%B8%8B%E8%A7%92%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/544793/Bilibili%20%E5%AD%97%E5%B9%95%E6%96%87%E6%9C%AC%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E6%8C%89%E9%92%AE%E5%8F%B3%E4%B8%8B%E8%A7%92%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function log(msg) {
        console.log('[字幕提取器] ' + msg);
    }

    window.addEventListener('load', function () {
        const btn = document.createElement('button');
        btn.innerText = '提取字幕文本';
        Object.assign(btn.style, {
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: '9999',
            padding: '8px 12px',
            backgroundColor: '#00a1d6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        });

        btn.onclick = async function () {
            log('开始提取流程...');

            const panelOpened = !!document.querySelector('div._InteractWrapper_tepst_1');
            const activeTab = document.querySelector('div._TabItem_krx6h_8._Active_krx6h_36');
            const isSubtitleTabActive = activeTab && activeTab.innerText.includes('字幕列表');

            // ✅ 如果面板已经打开且字幕标签已经激活，直接提取
            if (panelOpened && isSubtitleTabActive) {
                log('面板和字幕标签已打开，直接提取字幕...');
                extractAndCopySubtitles();
                return;
            }

            // 否则，继续自动操作
            const aiBtn = document.querySelector('.video-ai-assistant');
            if (!aiBtn) {
                alert('未找到 AI 按钮，可能页面结构已变或不支持该功能。');
                return;
            }

            log('点击 AI 按钮...');
            aiBtn.click();

            // 等待面板展开
            try {
                await waitForElement('div._InteractWrapper_tepst_1', 5000);
            } catch (e) {
                alert('字幕面板加载超时，请重试。');
                return;
            }

            log('等待字幕列表标签...');
            const subtitleTab = await waitForSubtitleTab();

            if (!subtitleTab) {
                alert('未找到“字幕列表”标签，可能结构变化。');
                return;
            }

            subtitleTab.click();
            log('已点击“字幕列表”标签，等待字幕加载...');

            await delay(2000); // 等待字幕内容加载
            extractAndCopySubtitles();
        };

        document.body.appendChild(btn);

        function extractAndCopySubtitles() {
            const textElements = document.querySelectorAll('._Text_1iu0q_64');
            if (textElements.length === 0) {
                alert('未找到字幕内容，可能加载失败或结构变化。');
                return;
            }

            const texts = Array.from(textElements)
                .map(el => el.innerText.trim())
                .filter(text => text);

            const result = texts.join('\n');
            console.log('[字幕提取器] 提取内容：\n' + result);

            navigator.clipboard.writeText(result).then(() => {
                alert(`✅ 成功提取并复制 ${texts.length} 条字幕文本！`);
            }).catch(() => {
                alert('❌ 复制失败，请手动查看控制台输出');
            });
        }

        // 等待某元素出现
        function waitForElement(selector, timeout = 5000) {
            return new Promise((resolve, reject) => {
                const interval = 100;
                let elapsed = 0;
                const timer = setInterval(() => {
                    const el = document.querySelector(selector);
                    if (el) {
                        clearInterval(timer);
                        resolve(el);
                    }
                    elapsed += interval;
                    if (elapsed >= timeout) {
                        clearInterval(timer);
                        reject(`等待 ${selector} 超时`);
                    }
                }, interval);
            });
        }

        // 等待“字幕列表”标签加载并返回该元素
        function waitForSubtitleTab(timeout = 5000) {
            return new Promise((resolve) => {
                const interval = 100;
                let elapsed = 0;

                const timer = setInterval(() => {
                    const tabs = document.querySelectorAll('div._TabItem_krx6h_8');
                    for (const tab of tabs) {
                        if (tab.innerText.includes('字幕列表')) {
                            clearInterval(timer);
                            resolve(tab);
                            return;
                        }
                    }

                    elapsed += interval;
                    if (elapsed >= timeout) {
                        clearInterval(timer);
                        resolve(null);
                    }
                }, interval);
            });
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    });
})();

