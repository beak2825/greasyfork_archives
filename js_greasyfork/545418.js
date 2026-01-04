// ==UserScript==
// @name         X/Twitter Copy Tweet Link Helper
// @name:zh-TW   X/Twitter 複製推文連結助手
// @name:zh-CN   X/Twitter 复制推文连结助手
// @name:ja      X/Twitter ツイートリンクコピー助手
// @name:ko      X/Twitter 트윗 링크 복사 도우미
// @namespace    http://tampermonkey.net/
// @version      4.9
// @description  Copy tweet links via right-click, like button, or dedicated button. Supports fixupx mode and tweet redirect toggle. fixupx format toggle for the copy button, Features can be enabled or disabled directly in the Tampermonkey interface, with a switchable Chinese/English menu display.
// @description:zh-TW 透過右鍵、喜歡或按鈕複製推文鏈接，並支援fixupx模式和推文跳轉開關，複製按鈕的fixupx開關，可在油猴介面中直接開關指定功能，中英菜單顯示切換。
// @description:zh-CN 通过右键、喜欢或按钮复制推文链接，並支持fixupx模式和推文跳转开关，复制按钮的fixupx开关，可在油猴界面中直接开关指定功能，中英菜单显示切换。
// @description:ja 右クリック、いいね、または専用ボタンでツイートリンクをコピーします。fixupxモード、ツイートジャンプ、コピーボタンのfixupx切り替えに対応。Tampermonkeyメニューから直接機能をオン/オフでき、中英メニュー表示の切り替えも可能です。
// @description:ko 우클릭, 좋아요 또는 전용 버튼을 통해 트윗 링크를 복사합니다. fixupx 모드 및 트윗 점프 스위치, 복사 버튼의 fixupx 전환 기능을 지원합니다. Tampermonkey 메뉴에서 직접 기능을 설정할 수 있으며 중·영문 메뉴 표시 전환이 가능합니다.
// @author       Hzbrrbmin + ChatGPT + Gemini
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545418/XTwitter%20Copy%20Tweet%20Link%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/545418/XTwitter%20Copy%20Tweet%20Link%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === 預設設定值 ===
    const defaultSettings = {
        rightClickCopy: true,       // 右鍵複製推文連結
        likeCopy: true,             // 按讚時自動複製連結
        showCopyButton: true,       // 顯示🔗複製按鈕
        disableClickRedirect: true, // 禁止點擊推文跳轉
        forceFixupxOnButton: true,  // 複製按鈕固定使用 fixupx 格式
        useFixupx: false,           // 使用 fixupx.com 格式連結
        language: 'EN'              // 語言設定：EN 或 ZH
    };

    // === 設定操作介面 ===
    const settings = {
        get(key) {
            return GM_getValue(key, defaultSettings[key]);
        },
        set(key, value) {
            GM_setValue(key, value);
            updateMenuCommands(); // 設定變更時更新選單狀態
            applySettingsToDom(); // 設定變更時即時應用到頁面
        }
    };

    // === 語系 ===
    const lang = {
        EN: {
            copySuccess: "Link copied!",
            copyButton: "🔗",
            rightClickCopy: 'Right-click Copy',
            likeCopy: 'Like Copy',
            showCopyButton: 'Show Copy Button',
            disableClickRedirect: 'Disable Tweet Click',
            forceFixupxOnButton: 'Force Fixupx on Copy Button',
            useFixupx: 'Use Fixupx',
            language: 'Language'
        },
        ZH: {
            copySuccess: "已複製鏈結！",
            copyButton: "🔗",
            rightClickCopy: '右鍵複製',
            likeCopy: '喜歡時複製',
            showCopyButton: '顯示複製按鈕',
            disableClickRedirect: '禁止點擊跳轉',
            forceFixupxOnButton: '複製按鈕固定 Fixupx 模式',
            useFixupx: '使用 Fixupx',
            language: '語言'
        }
    };

    const getText = (key) => lang[settings.get('language')][key];

    // === 清理推文網址 ===
    function cleanTweetUrl(rawUrl, forceFixupx = false) {
        try {
            const url = new URL(rawUrl);
            url.search = '';
            url.pathname = url.pathname.replace(/\/photo\/\d+$/, '');
            if (settings.get('useFixupx') || forceFixupx) {
                url.hostname = 'fixupx.com';
            }
            return url.toString();
        } catch {
            return rawUrl;
        }
    }

    // === 複製推文連結 ===
    function copyTweetLink(tweet, forceFixupx = false) {
        const anchor = tweet.querySelector('a[href*="/status/"]');
        if (!anchor) return;
        const cleanUrl = cleanTweetUrl(anchor.href, forceFixupx);
        navigator.clipboard.writeText(cleanUrl).then(() => {
            showToast(getText('copySuccess'));
        });
    }

    // === 顯示提示訊息（toast） ===
    let toastTimer = null;
    function showToast(msg) {
        let toast = document.getElementById('x-copy-tweet-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'x-copy-tweet-toast';
            Object.assign(toast.style, {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#1da1f2',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '20px',
                zIndex: 9999,
                fontSize: '14px',
                pointerEvents: 'none',
                transition: 'opacity 0.3s'
            });
            document.body.appendChild(toast);
        }
        toast.innerText = msg;
        toast.style.display = 'block';
        toast.style.opacity = '1';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 300);
        }, 1000);
    }

    // === 插入🔗按鈕至推文中 ===
    function insertCopyButton(tweet) {
        if (tweet.querySelector('.x-copy-btn')) return;

        const actionGroup = tweet.querySelector('[role="group"]');
        if (!actionGroup) return;

        const actionButtons = Array.from(actionGroup.children);
        const bookmarkContainer = actionButtons[actionButtons.length - 2];
        if (!bookmarkContainer) return;

        const btnContainer = document.createElement('div');
        btnContainer.className = 'x-copy-btn-container';
        // 初始顯示狀態由 CSS 或 JS 控制，這裡先給樣式
        Object.assign(btnContainer.style, {
            display: settings.get('showCopyButton') ? 'flex' : 'none', // 初始判斷
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: '20px',
            maxWidth: '100%',
            marginRight: '8px',
            flex: '1'
        });

        const innerDiv = document.createElement('div');
        Object.assign(innerDiv.style, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '20px'
        });

        const btn = document.createElement('div');
        btn.className = 'x-copy-btn';
        Object.assign(btn.style, {
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            minHeight: '20px',
            borderRadius: '9999px'
        });

        const btnContent = document.createElement('div');
        Object.assign(btnContent.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            minHeight: '20px'
        });

        const textSpan = document.createElement('span');
        textSpan.className = 'x-copy-btn-text'; // 加上 class 方便後續即時更新文字
        textSpan.innerText = getText('copyButton');
        Object.assign(textSpan.style, {
            fontSize: '16px',
            lineHeight: '1'
        });

        btn.onclick = (e) => {
            e.stopPropagation();
            const forceFix = settings.get('forceFixupxOnButton');
            copyTweetLink(tweet, forceFix);
        };

        btnContent.appendChild(textSpan);
        btn.appendChild(btnContent);
        innerDiv.appendChild(btn);
        btnContainer.appendChild(innerDiv);
        actionGroup.insertBefore(btnContainer, bookmarkContainer);

        const computedStyle = window.getComputedStyle(bookmarkContainer);
        btnContainer.style.flex = computedStyle.flex;
        btnContainer.style.justifyContent = computedStyle.justifyContent;
    }

    // === 綁定 Like 複製事件 ===
    function bindLikeCopy(tweet) {
        if (tweet.hasAttribute('data-likecopy')) return;
        tweet.setAttribute('data-likecopy', 'true');

        // 使用事件委派或直接綁定，但在執行時檢查設定
        const likeBtn = tweet.querySelector('[data-testid="like"]');
        if (likeBtn && !likeBtn.hasAttribute('data-likecopy-listener')) {
            likeBtn.setAttribute('data-likecopy-listener', 'true');
            likeBtn.addEventListener('click', () => {
                // 即時檢查設定
                if (settings.get('likeCopy')) {
                    copyTweetLink(tweet);
                }
            });
        }
    }

    // === 綁定右鍵複製事件 ===
    function bindRightClickCopy(tweet) {
        if (tweet.hasAttribute('data-rightclick')) return;
        tweet.setAttribute('data-rightclick', 'true');

        tweet.addEventListener('contextmenu', (e) => {
            // 即時檢查設定
            if (!settings.get('rightClickCopy')) return;

            if (tweet.querySelector('img, video')) {
                copyTweetLink(tweet);
            }
        });
    }

    // === 禁止整篇推文點擊跳轉 ===
    function disableTweetClickHandler(tweet) {
        if (tweet.hasAttribute('data-disableclick')) return;
        tweet.setAttribute('data-disableclick', 'true');

        // 初始化游標樣式
        updateTweetCursor(tweet);

        tweet.addEventListener('click', (e) => {
            // 即時檢查設定：如果功能關閉，則不攔截，直接返回
            if (!settings.get('disableClickRedirect')) return;

            const target = e.target;
            if (
                target.closest('[role="button"]') ||
                target.closest('a[href^="http"]') ||
                target.closest('input') ||
                target.closest('textarea') ||
                target.closest('.x-copy-btn') || // 排除複製按鈕
                target.closest('[data-testid="notification"]') || // 排除通知欄
                target.closest('[data-testid="tweetPhoto"]') || // 排除推特圖片
                target.closest('[data-testid="Tweet-User-Avatar"]') || // 排除用戶頭像
                target.closest('[data-testid="User-Name"]') || // 排除用戶名稱
                target.closest('[data-testid="socialContext"]') || // 排除轉推者名稱
                target.closest('[role="radiogroup"]') || // 排除投票選項組
                target.closest('a time') || // 排除包含 <time> 的時間連結
                target.closest('a[href*="/i/imagine"]') || //排除編輯圖片的按鈕
                target.closest('[aria-label*="Grok"]') // 排除 Grok 相關按鈕
            ) {
                return;
            }
            e.stopPropagation();
            e.preventDefault();
        }, true);
    }

    // === 更新推文游標樣式 ===
    function updateTweetCursor(tweet) {
        if (settings.get('disableClickRedirect')) {
            tweet.style.cursor = 'default';
        } else {
            tweet.style.cursor = ''; // 恢復預設 (通常是 pointer)
        }
    }

    // === 即時應用設定變更到所有現存 DOM ===
    function applySettingsToDom() {
        // 1. 控制複製按鈕顯示/隱藏 & 更新語言
        const btnContainers = document.querySelectorAll('.x-copy-btn-container');
        const showBtn = settings.get('showCopyButton');
        const btnText = getText('copyButton');

        btnContainers.forEach(container => {
            container.style.display = showBtn ? 'flex' : 'none';
            // 更新按鈕內的文字 (語言切換時)
            const textSpan = container.querySelector('.x-copy-btn-text');
            if (textSpan) textSpan.innerText = btnText;
        });

        // 2. 更新所有推文的游標樣式
        document.querySelectorAll('article[data-disableclick="true"]').forEach(tweet => {
            updateTweetCursor(tweet);
        });
    }

    // === 處理新增的推文節點 ===
    function processTweetNode(node) {
        if (!(node instanceof HTMLElement)) return;
        const applyTo = node.tagName === 'ARTICLE' ? [node] : node.querySelectorAll?.('article') || [];

        for (const tweet of applyTo) {
            // 這裡不再判斷 settings，而是全部綁定，控制權交給事件內部或 CSS
            insertCopyButton(tweet);
            bindRightClickCopy(tweet);
            bindLikeCopy(tweet);
            disableTweetClickHandler(tweet);
        }
    }

    // === 初始處理目前所有推文 ===
    document.querySelectorAll('article').forEach(processTweetNode);

    // === 監聽 DOM 變動 ===
    const tweetObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach(processTweetNode);
        }
    });
    tweetObserver.observe(document.body, { childList: true, subtree: true });

    // === MenuCommand 註冊與更新 ===
    let menuIds = [];
    function updateMenuCommands() {
        // 移除舊選單
        menuIds.forEach(id => {
            try { GM_unregisterMenuCommand(id); } catch {}
        });
        menuIds = [];

        // 註冊新選單 (直接綁定 settings.set，不再需要 reloadPage)
        menuIds.push(GM_registerMenuCommand(`${getText('rightClickCopy')} ( ${settings.get('rightClickCopy') ? '✅' : '❌'} )`,
            () => toggleSetting('rightClickCopy')));

        menuIds.push(GM_registerMenuCommand(`${getText('likeCopy')} ( ${settings.get('likeCopy') ? '✅' : '❌'} )`,
            () => toggleSetting('likeCopy')));

        menuIds.push(GM_registerMenuCommand(`${getText('showCopyButton')} ( ${settings.get('showCopyButton') ? '✅' : '❌'} )`,
            () => toggleSetting('showCopyButton')));

        menuIds.push(GM_registerMenuCommand(`${getText('disableClickRedirect')} ( ${settings.get('disableClickRedirect') ? '✅' : '❌'} )`,
            () => toggleSetting('disableClickRedirect')));

        menuIds.push(GM_registerMenuCommand(`${getText('forceFixupxOnButton')} ( ${settings.get('forceFixupxOnButton') ? '✅' : '❌'} )`,
            () => toggleSetting('forceFixupxOnButton')));

        menuIds.push(GM_registerMenuCommand(`${getText('useFixupx')} ( ${settings.get('useFixupx') ? '✅' : '❌'} )`,
            () => toggleSetting('useFixupx')));

        const langs = Object.keys(lang);
        const currentLangIdx = langs.indexOf(settings.get('language'));
        const nextLang = langs[(currentLangIdx + 1) % langs.length];
        let langDisplay = settings.get('language') === 'ZH' ? '中文' : 'EN';

        menuIds.push(GM_registerMenuCommand(`${getText('language')} ( ${langDisplay} )`,
            () => toggleSetting('language', nextLang)));
    }

    // === 通用切換設定函式 ===
    function toggleSetting(key, specificValue = null) {
        const newValue = specificValue !== null ? specificValue : !settings.get(key);
        settings.set(key, newValue);
        // showToast(`${key} -> ${newValue}`); // 可選：顯示設定變更提示
    }

    // 初始化選單
    updateMenuCommands();

})();