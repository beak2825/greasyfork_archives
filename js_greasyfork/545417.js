// ==UserScript==
// @name         X/Twitter Optimized Tweet Buttons
// @name:zh-TW   X/Twitter 優化推文按鈕
// @name:zh-CN   X/Twitter 优化推文按钮
// @name:ja      X/Twitter ツイートボタン最適化
// @name:ko      X/Twitter 트윗 버튼 최적화
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  You can freely show or hide the buttons on a tweet, including Reply, Retweet, Like, View Count, Bookmark, and Share. The interface supports switching between Chinese and English.
// @description:zh-TW 可以自由顯示/隱藏，推文上的按鈕，包括，回覆、轉推、喜歡、觀看次數、書籤、分享等按鈕，並且有中英兩種功能語言可以切換
// @description:zh-CN 可以自由显示/隐藏，推文上的按钮，包括，回覆、转推、喜欢、观看次数、书签、分享等按钮，并且有中英两种功能语言可以切换
// @description:ja 返信、リポスト、いいね、表示回数、ブックマーク、共有などのツイート上のボタンを自由に表示・非表示にできます。また、表示言語を中国語と英語の2種類から切り替え可能です。
// @description:ko 답글, 리포스트, 좋아요, 조회수, 북마크, 공유 등 트윗 위의 버튼을 자유롭게 표시하거나 숨길 수 있습니다. 또한 기능 언어를 중문과 영문 두 가지로 전환하여 사용할 수 있습니다.
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545417/XTwitter%20Optimized%20Tweet%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/545417/XTwitter%20Optimized%20Tweet%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置系統 ===
    const CONFIG_KEY = 'XButtonSettings';
    const defaults = {
        hideReply: true,
        hideRetweet: true,
        hideBookmark: true,
        hideViews: true,
        hideShare: true,
        hideLike: false,
        language: 'EN'
    };

    const config = {
        get() {
            return { ...defaults, ...GM_getValue(CONFIG_KEY, {}) };
        },
        update(key, value) {
            const current = this.get();
            GM_setValue(CONFIG_KEY, { ...current, [key]: value });
            // 更新後立即觸發樣式與選單重繪
            style.update();
            menu.refresh();
        }
    };

    // === 多語言系統 ===
    const i18n = {
        EN: {
            reply: 'Reply',
            retweet: 'Retweet',
            bookmark: 'Bookmark',
            views: 'View count',
            share: 'Share',
            like: 'Like',
            language: 'Language'
        },
        'ZH-TW': {
            reply: '回覆',
            retweet: '轉推',
            bookmark: '書籤',
            views: '觀看次數',
            share: '分享',
            like: '喜歡',
            language: '語言'
        }
    };

    function t() {
        const { language } = config.get();
        return i18n[language] || i18n.EN;
    }

    // === 樣式管理 ===
    const style = {
        element: null,
        rules: new Map([
            ['hideReply', '[data-testid="reply"] { display: none !important; }'],
            ['hideRetweet', '[data-testid="retweet"] { display: none !important; }'],
            ['hideBookmark', '[data-testid="bookmark"] { display: none !important; }'],
            ['hideViews', 'a[href*="/analytics"] { display: none !important; }'],
            // 只隱藏原生分享，不隱藏帶有下載圖示的（通常是腳本插入）
            ['hideShare', `
                button[aria-label="Share Post"]:not(:has(svg g.download)),
                button[aria-label="分享貼文"]:not(:has(svg g.download)),
                button[aria-label="分享"]:not(:has(svg g.download)),
                button[aria-label="Compartir publicación"]:not(:has(svg g.download))
                { display: none !important; }
            `],
            ['hideLike', '[data-testid="like"], [data-testid="unlike"] { display: none !important; }']
        ]),
        init() {
            if (!document.getElementById('x-btn-hider-styles')) {
                this.element = document.createElement('style');
                this.element.id = 'x-btn-hider-styles';
                document.head.appendChild(this.element);
            } else {
                this.element = document.getElementById('x-btn-hider-styles');
            }
            this.update();
        },
        update() {
            const currentConfig = config.get();
            const activeRules = Array.from(this.rules.entries())
                .filter(([key]) => currentConfig[key])
                .map(([, rule]) => rule);
            this.element.textContent = activeRules.join('\n');
        }
    };

    // === 選單系統 (即時反應版) ===
    const menu = {
        menuIds: [], // 儲存已註冊的選單 ID
        refresh() {
            // 1. 清除舊的選單
            this.menuIds.forEach(id => GM_unregisterMenuCommand(id));
            this.menuIds = [];

            // 2. 取得當前設定
            const currentConfig = config.get();
            const texts = t();

            // 3. 定義選單項目
            const items = [
                { key: 'hideReply', label: texts.reply },
                { key: 'hideRetweet', label: texts.retweet },
                { key: 'hideBookmark', label: texts.bookmark },
                { key: 'hideViews', label: texts.views },
                { key: 'hideShare', label: texts.share },
                { key: 'hideLike', label: texts.like }
            ];

            // 4. 重新註冊功能開關
            items.forEach(({ key, label }) => {
                const status = currentConfig[key] ? '✅' : '❌';
                const id = GM_registerMenuCommand(
                    `${label} ${status}`,
                    () => {
                        // 點擊後更新設定，觸發 style.update 和 menu.refresh
                        config.update(key, !currentConfig[key]);
                    }
                );
                this.menuIds.push(id);
            });

            // 5. 重新註冊語言切換
            const langLabel = currentConfig.language === 'EN' ? 'EN' : '中文';
            const langId = GM_registerMenuCommand(
                `${texts.language}: ${langLabel}`,
                () => {
                    const newLang = currentConfig.language === 'EN' ? 'ZH-TW' : 'EN';
                    config.update('language', newLang);
                }
            );
            this.menuIds.push(langId);
        }
    };

    // === 初始化流程 ===
    (function init() {
        style.init();   // 插入樣式
        menu.refresh(); // 建立選單
    })();
})();