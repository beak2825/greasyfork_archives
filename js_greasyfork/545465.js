// ==UserScript==
// @name         Bluesky⇔Tokimeki 切り替え
// @namespace    https://bsky.app/profile/neon-ai.art
// @homepage     https://bsky.app/profile/neon-ai.art
// @icon         data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⛄️</text></svg>
// @version      7.8
// @description  BlueskyとTokimekiのURLを、ボタン、キーボードショートカット、右クリックメニューで切り替え。
// @author       ねおん
// @match        https://bsky.app/*
// @match        https://tokimeki.blue/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/545465/Bluesky%E2%87%94Tokimeki%20%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/545465/Bluesky%E2%87%94Tokimeki%20%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==

/**
 * ==============================================================================
 * IMPORTANT NOTICE / 重要事項
 * ==============================================================================
 * Copyright (c) 2024 ねおん (Neon)
 * Released under the CC BY-NC 4.0 License.
 * * [EN] Unauthorized re-uploading, modification of authorship, or removal of 
 * author credits is strictly prohibited. If you fork this project, you MUST 
 * retain the original credits.
 * * [JP] 無断転載、作者名の書き換え、およびクレジットの削除は固く禁じます。
 * 本スクリプトを改変・配布する場合は、必ず元の作者名（ねおん）を明記してください。
 * ==============================================================================
 */

(function() {
    'use strict';

    // --- バージョン情報 ---
    const SCRIPT_VERSION = "7.8";
    // 設定を保存するキー
    const CONFIG_KEY = 'bskyTokimekiConfig';

    // 現在のドメインを判定
    function getCurrentDomain() {
        if (window.location.hostname.includes('bsky.app')) {
            return 'bsky';
        } else if (window.location.hostname.includes('tokimeki.blue')) {
            return 'tokimeki';
        }
        return null;
    }

    // --- カスタムアラート関数 ---
    function showMessage(message) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: '99999',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Inter, sans-serif'
        });

        const container = document.createElement('div');
        Object.assign(container.style, {
            backgroundColor: '#1a1a1a',
            color: '#f0f0f0',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            maxWidth: '90%',
            width: '300px',
            border: '1px solid #333'
        });
        container.innerHTML = `
            <p style="margin: 0 0 15px; font-size: 16px;">${message}</p>
            <button class="close-button" style="padding: 10px 20px; border-radius: 6px; border: none; background-color: #007bff; color: white; font-weight: bold; cursor: pointer; transition: all 0.2s ease;">閉じる</button>
        `;

        container.querySelector('.close-button').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }

    /**
     * bsky.appで現在選択中のタブのパスを取得する関数
     * @returns {string|null} tokimeki.blueで対応するパス名、または見つからない場合はnull
     */
    function getActiveBskyTabPath() {
        const tabMappings = {
            'メディア': '/media', 'Media': '/media',
            'ビデオ': '/video', 'Videos': '/video',
            'いいね': '/likes', 'Likes': '/likes',
            'フィード': '/feed', 'Feeds': '/feed',
            'リスト': '/lists', 'Lists': '/lists'
        };

        // 選択中のタブを示す青い下線のstyle属性を直接探す
        const selectedIndicator = document.querySelector('[style*="background-color: rgb(16, 131, 254)"]');

        if (selectedIndicator) {
            // 下線要素の親要素（タブ本体）を取得
            const tabContentElement = selectedIndicator.parentElement;
            if (tabContentElement && tabContentElement.dataset.testid && tabContentElement.dataset.testid.startsWith('profilePager-')) {
                const testId = tabContentElement.getAttribute('data-testid');
                const activeTabName = testId.replace('profilePager-', '');

                if (tabMappings[activeTabName]) {
                    console.log(`アクティブなbskyタブを検出: ${activeTabName}`);
                    return tabMappings[activeTabName];
                }
            }
        }

        console.log('アクティブなbskyタブは検出されませんでした（投稿タブなど）。');
        return null;
    }

    // --- URL切り替え処理 ---
    function switchUrl() {
        const currentUrl = window.location.href;
        let newUrl = currentUrl;
        let bskyTabToClick = null; // bsky→tokimekiで使う

        // bsky.app → tokimeki.blue
        if (currentUrl.includes('bsky.app')) {
            // プロフィールページの場合、アクティブなタブのパスを追加
            if (currentUrl.includes('/profile/')) {
                const activeTabPath = getActiveBskyTabPath();
                if (activeTabPath) {
                    const urlObject = new URL(currentUrl);
                    // 投稿、フィード、リストの詳細ページではないことを確認
                    if (!urlObject.pathname.match(/\/(post|feed|lists)\//)) {
                        // クエリパラメータやハッシュを維持しつつ、パスの末尾に追加
                        newUrl = `${urlObject.origin}${urlObject.pathname.replace(/\/$/, '')}${activeTabPath}${urlObject.search}${urlObject.hash}`;
                    }
                }
            }

            // --- 追加・修正パターン（bsky → tokimeki）---

            // bsky.app/moderation → tokimeki.blue/settings/moderation
            if (currentUrl.includes('/moderation')) {
                newUrl = 'https://tokimeki.blue/settings/moderation';
            }
            // bsky.app/notification → tokimeki.blue/
            else if (currentUrl.includes('/notifications')) {
                newUrl = 'https://tokimeki.blue/';
            }
            // bsky.app/saved → tokimeki.blue/
            else if (currentUrl.includes('/saved')) {
                newUrl = 'https://tokimeki.blue/';
            }
            // bsky.app/feeds → tokimeki.blue/
            else if (currentUrl.includes('/feeds')) {
                newUrl = 'https://tokimeki.blue/?switchTab=feeds'; // メイン画面のフィードに移動するフラグ
            }
            // bsky.app/lists → tokimeki.blue/
            else if (currentUrl.includes('/lists')) {
                newUrl = 'https://tokimeki.blue/?switchTab=lists'; // メイン画面のリストに移動するフラグ
            }
            // 設定ページの場合、特定のURLに変換（/moderationの後に実行）
            else if (currentUrl.includes('/settings')) {
                newUrl = 'https://tokimeki.blue/settings/general';
            }
            // メッセージページの場合、特定のURLに変換
            else if (currentUrl.includes('/messages')) {
                newUrl = 'https://tokimeki.blue/chat';
            }
            // フォローリストのパスを変換
            else if (currentUrl.endsWith('/follows')) {
                newUrl = newUrl.slice(0, -8) + '/follow';
            }
            // フォロワーリストのパスを変換
            else if (currentUrl.endsWith('/followers')) {
                newUrl = newUrl.slice(0, -10) + '/follower';
            }

            // ドメインをtokimeki.blueに切り替え
            newUrl = newUrl.replace('bsky.app', 'tokimeki.blue');

            // bskyのハッシュタグをtokimekiの検索クエリに変換
            newUrl = newUrl.replace(/hashtag\/([^/]+)/, 'search?q=%23$1');
            // bskyの?author=をtokimekiのfrom:に変換
            newUrl = newUrl.replace(/\?author=([^&]+)/, ' from:$1');

            // bsky.appで末尾がquotesの場合は削除
            if (currentUrl.endsWith('quotes')) {
                newUrl = newUrl.slice(0, -7);
            }

            console.log("URLを切り替えます:", newUrl);
            window.location.href = newUrl;

        // tokimeki.blue → bsky.app
        } else if (currentUrl.includes('tokimeki.blue')) {
            
            // --- 追加・修正パターン（tokimeki → bsky）---
            
            // tokimeki.blue/settings/moderation → bsky.app/moderation
            if (currentUrl.includes('/settings/moderation')) {
                newUrl = 'https://bsky.app/moderation';
            }
            // 設定ページ（一般）の場合、特定のURLに変換
            else if (currentUrl.includes('/settings/')) {
                newUrl = 'https://bsky.app/settings';
            }
            // チャットページの場合、特定のURLに変換
            else if (currentUrl.includes('/chat')) {
                newUrl = 'https://bsky.app/messages';
            }
            // --- 既存のパス変換 ---

            // tokimeki.blue独自のプロフィールページパスを検出
            const profileMatch = currentUrl.match(/\/profile\/[^/]+\/(media|video|likes|feed|lists)$/);
            if (profileMatch) {
                const tab = profileMatch[1];

                // bsky.appのプロフィールURLに変換
                newUrl = newUrl.replace(/\/(media|video|likes|feed|lists)$/, '');

                // タブを切り替えるフラグを設定
                if (tab === 'media') bskyTabToClick = 'media';
                else if (tab === 'video') bskyTabToClick = 'video';
                else if (tab === 'likes') bskyTabToClick = 'likes';
                else if (tab === 'feed') bskyTabToClick = 'feeds';
                else if (tab === 'lists') bskyTabToClick = 'lists';
            }
            // フォローリストのパスを変換
            else if (currentUrl.endsWith('/follow')) {
                newUrl = newUrl.slice(0, -7) + '/follows';
            }
            // フォロワーリストのパスを変換
            else if (currentUrl.endsWith('/follower')) {
                newUrl = newUrl.slice(0, -9) + '/followers';
            }

            // ドメインをbsky.appに切り替え
            newUrl = newUrl.replace('tokimeki.blue', 'bsky.app');

            console.log("URLを切り替えます:", newUrl);

            // タブを切り替える必要があれば、URLにパラメータを付加
            if (bskyTabToClick) {
                newUrl += '?switchTab=' + bskyTabToClick;
            }

            window.location.href = newUrl;
        } else {
            showMessage('bsky.app または tokimeki.blue ではありません。');
            console.log("無効なURLです:", currentUrl);
        }
    }

    // ブラウザの言語設定を取得する
    function getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('ja') ? 'ja' : 'en';
    }

    // --- bsky.app側のページロード後の処理 ---
    function handleBskyPageLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const tabToClick = urlParams.get('switchTab');

        if (tabToClick) {
            console.log(`BSkyのタブを切り替えます: ${tabToClick}`);

            const language = getBrowserLanguage();
            let tabName = null;

            if (language === 'ja') {
                switch (tabToClick) {
                    case 'media': tabName = 'メディア'; break;
                    case 'video': tabName = 'ビデオ'; break;
                    case 'likes': tabName = 'いいね'; break;
                    case 'feeds': tabName = 'フィード'; break;
                    case 'lists': tabName = 'リスト'; break;
                }
            } else {
                switch (tabToClick) {
                    case 'media': tabName = 'Media'; break;
                    case 'video': tabName = 'Videos'; break;
                    case 'likes': tabName = 'Likes'; break;
                    case 'feeds': tabName = 'Feeds'; break;
                    case 'lists': tabName = 'Lists'; break;
                }
            }

            if (tabName) {
                const selector = `div[data-testid="profilePager-${tabName}"]`;

                const observer = new MutationObserver((mutations, obs) => {
                    const tabElement = document.querySelector(selector);
                    if (tabElement) {
                        tabElement.click();
                        console.log(`タブをクリックしました: ${tabName}`);
                        obs.disconnect();
                    }
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                // 念のため10秒後に監視を停止するタイムアウトを追加
                setTimeout(() => {
                    observer.disconnect();
                    console.log('[Bsky] 10秒経過したため、タブ検索の監視を停止しました。');
                }, 10000);
            }

            const newUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    // --- TOKIMEKI側のページロード後の処理 ---
    function handleTokimekiPageLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const tokiToClick = urlParams.get('switchTab');

        // フラグが 'feeds' または 'lists' でなければ何もしない
        if (tokiToClick !== 'feeds' && tokiToClick !== 'lists') {
            // もしURLにパラメータが残っていたら消しておく
            if (urlParams.has('switchTab')) {
                const newUrl = window.location.href.split('?')[0];
                window.history.replaceState({}, document.title, newUrl);
            }
            return;
        }

        console.log(`[Toki] 自動ナビゲーションを開始します: ${tokiToClick}`);

        const primaryButtonSelector = 'button.side-nav__button--feeds';

        // URLパラメータをクリーンアップするヘルパー関数
        const cleanUrl = () => {
            const newUrl = window.location.href.split('?')[0];
            window.history.replaceState({}, document.title, newUrl);
        };

        // --- ステップ 2: ネストされたタブの出現を待ってクリックする関数 ---
        const clickNestedTab = () => {
            // tokiToClick の値に基づいて、クリック対象のタブを決定
            let nestedButtonSelector;
            let nestedButtonName;

            if (tokiToClick === 'feeds') {
                // 「フィード」タブは2番目のボタン
                nestedButtonSelector = '.side-feeds-nav .profile-tab__item:nth-child(2) button';
                nestedButtonName = 'フィード';
            } else if (tokiToClick === 'lists') {
                // 「リスト」タブは3番目のボタン
                nestedButtonSelector = '.side-feeds-nav .profile-tab__item:nth-child(3) button';
                nestedButtonName = 'リスト';
            } else {
                return; // 想定外の値なら何もしない
            }

            const nestedObserver = new MutationObserver((mutations, obs) => {
                const nestedButton = document.querySelector(nestedButtonSelector);
                if (nestedButton) {
                    obs.disconnect(); // ボタンが見つかったら監視を終了
                    nestedButton.click();
                    console.log(`[Toki] "${nestedButtonName}" タブに自動ナビゲーションしました。`);

                    // 最後にURLをクリーンアップ
                    cleanUrl();
                }
            });

            // body全体を監視対象とする（モーダルが動的に追加されるため）
            nestedObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 念のため5秒後に監視を停止
            setTimeout(() => {
                nestedObserver.disconnect();
                console.log('[Toki] 5秒経過したため、ネストされたタブ検索の監視を停止しました。');
            }, 5000);
        };

        // --- ステップ 1: メインボタンの出現を待つ ---
        const primaryObserver = new MutationObserver((mutations, obs) => {
            const mainButton = document.querySelector(primaryButtonSelector);
            if (mainButton) {
                obs.disconnect(); // メインボタンが見つかったら監視を終了
                mainButton.click();
                console.log(`[Toki] サイドバーの「フィード」アイコンをクリックしました。`);

                // メインボタンをクリックした後、ネストされたタブをクリックする処理を開始
                clickNestedTab();
            }
        });

        // body全体を監視対象とする
        primaryObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 念のため10秒後に監視を停止
        setTimeout(() => {
            primaryObserver.disconnect();
            console.log('[Toki] 10秒経過したため、メインボタン検索の監視を停止しました。');
        }, 10000);
    }


    // --- 設定の読み込みと保存 ---
    function getConfig() {
        const defaultConfig = {
            global: {
                enabled: true,
                shortcutKey: 'Ctrl+Shift+K'
            },
            bsky: {
                buttonPosition: 'bottom-left',
                buttonPadding: 60
            },
            tokimeki: {
                buttonPosition: 'bottom-left',
                buttonPadding: 60
            }
        };

        const savedConfig = GM_getValue(CONFIG_KEY);
        let currentConfig;

        try {
            currentConfig = savedConfig ? JSON.parse(savedConfig) : defaultConfig;
            if (!currentConfig.global) currentConfig.global = defaultConfig.global;
            if (!currentConfig.bsky) currentConfig.bsky = defaultConfig.bsky;
            if (!currentConfig.tokimeki) currentConfig.tokimeki = defaultConfig.tokimeki;
        } catch (e) {
            console.error("設定の読み込みに失敗しました。デフォルト設定を使用します。", e);
            currentConfig = defaultConfig;
        }

        const domain = getCurrentDomain();
        return {
            ...currentConfig.global,
            ...(domain ? currentConfig[domain] : {})
        };
    }

    function saveConfig(config) {
        let savedData;
        try {
            const savedConfig = GM_getValue(CONFIG_KEY);
            savedData = savedConfig ? JSON.parse(savedConfig) : {};
        } catch (e) {
            savedData = {};
        }

        const domain = getCurrentDomain();

        savedData.global = {
            enabled: config.enabled,
            shortcutKey: config.shortcutKey
        };

        if (domain) {
            savedData[domain] = {
                buttonPosition: config.buttonPosition,
                buttonPadding: config.buttonPadding
            };
        }

        GM_setValue(CONFIG_KEY, JSON.stringify(savedData));
    }

    // --- ボタンのUI生成とイベントリスナー設定 ---
    function createButtonUI() {
        const existingButton = document.getElementById('bsky-tokimeki-switch-button');
        if (existingButton) existingButton.remove();

        const config = getConfig();
        if (!config.enabled) return;

        const button = document.createElement('button');
        button.id = 'bsky-tokimeki-switch-button';
        Object.assign(button.style, {
            position: 'fixed',
            padding: '12px 18px',
            borderRadius: '9999px',
            border: 'none',
            backgroundColor: '#2563eb',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            zIndex: '99998',
            transition: 'all 0.3s ease-in-out',
        });

        const domain = getCurrentDomain();
        button.textContent = domain === 'bsky' ? '⇆' : (domain === 'tokimeki' ? '⇆' : '切り替え');
        button.addEventListener('click', switchUrl);
        document.body.appendChild(button);
        updateButtonPosition(button, config.buttonPosition, config.buttonPadding);
    }

    // --- ボタン位置の更新関数 ---
    function updateButtonPosition(button, position, padding) {
        button.style.removeProperty('top');
        button.style.removeProperty('bottom');
        button.style.removeProperty('left');
        button.style.removeProperty('right');

        switch (position) {
            case 'top-left':
                Object.assign(button.style, { top: `${padding}px`, left: `${padding}px` });
                break;
            case 'top-right':
                Object.assign(button.style, { top: `${padding}px`, right: `${padding}px` });
                break;
            case 'bottom-left':
                Object.assign(button.style, { bottom: `${padding}px`, left: `${padding}px` });
                break;
            case 'bottom-right':
            default:
                Object.assign(button.style, { bottom: `${padding}px`, right: `${padding}px` });
                break;
        }
    }

    // --- キーボードショートカットのイベントハンドラ ---
    function handleKeyDown(e) {
        const config = getConfig();
        const shortcut = config.shortcutKey;
        if (!shortcut) return;

        // 設定画面が開いてるときは無効化
        if (document.querySelector('.bsky-settings-modal-overlay')) return;

        const keys = shortcut.split('+');
        const isCtrl = keys.includes('Ctrl');
        const isShift = keys.includes('Shift');
        const isAlt = keys.includes('Alt');
        const key = keys.pop().toLowerCase();

        if (e.ctrlKey === isCtrl && e.shiftKey === isShift && e.altKey === isAlt && e.key.toLowerCase() === key) {
            const tag = (e.target && e.target.tagName) || '';
            if (/(INPUT|TEXTAREA|SELECT)/.test(tag)) return;
            e.preventDefault();
            switchUrl();
        }
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = `
            position: fixed; bottom: 20px; left: 50%;
            transform: translateX(-50%);
            background: var(--primary-color);
            color: white; padding: 10px 20px;
            border-radius: 6px;
            z-index: 100000;
            font-size: 14px;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // --- カスタム設定画面のUIとロジック ---
    function createSettingsUI() {
        const styles = `
            :root { --bg-color: #1a1a1a; --text-color: #f0f0f0; --border-color: #333; --primary-color: #007bff; --primary-hover: #0056b3; --secondary-color: #343a40; --modal-bg: #212529; --shadow: 0 8px 16px rgba(0, 0, 0, 0.5); --border-radius: 12px; }
            .bsky-settings-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 100000; display: flex; justify-content: center; align-items: center; }
            .bsky-settings-modal { background-color: var(--modal-bg); color: var(--text-color); width: 90%; max-width: 400px; border-radius: var(--border-radius); box-shadow: var(--shadow); border: 1px solid var(--border-color); font-family: 'Inter', sans-serif; overflow: hidden; }
            .bsky-settings-header { padding: 15px 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
            .bsky-settings-header h2 { margin: 0; font-size: 1.25rem; font-weight: 600; display: flex; align-items: center; gap: 10px; }
            .bsky-settings-header button { background: none; border: none; color: var(--text-color); font-size: 1.5rem; cursor: pointer; }
            .bsky-settings-body { padding: 20px; }
            .bsky-settings-section { background-color: #2c2c2c; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
            .bsky-settings-section-title { font-size: 1.1rem; font-weight: bold; margin-top: 0; margin-bottom: 15px; color: #e0e0e0; border-bottom: 1px solid #444; padding-bottom: 5px; }
            .bsky-settings-option { margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; }
            .bsky-settings-option:last-child { margin-bottom: 0; }
            .bsky-settings-option label { font-size: 1rem; font-weight: 500; }
            .bsky-settings-option select, .bsky-settings-option input[type="number"], .bsky-settings-option input[type="text"] { background-color: var(--secondary-color); color: var(--text-color); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px 12px; cursor: pointer; width: 100px; }
            .bsky-settings-option input[type="text"] { width: 150px; cursor: text; }
            .bsky-settings-option input:focus { border-color: var(--primary-color); box-shadow: 0 0 4px var(--primary-color); }
            .bsky-settings-footer { padding: 15px 20px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
            .bsky-settings-footer .version { font-size: 0.8rem; font-weight: 400; color: #aaa; }
            .bsky-settings-footer button { padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: all 0.2s ease; }
            .bsky-settings-footer .save-button { background-color: var(--primary-color); color: white; }
            .bsky-settings-footer .save-button:hover { background-color: var(--primary-hover); }
            .bsky-switch { position: relative; display: inline-block; width: 50px; height: 28px; }
            .bsky-switch input { opacity: 0; width: 0; height: 0; }
            .bsky-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 28px; }
            .bsky-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .bsky-slider { background-color: var(--primary-color); }
            input:focus + .bsky-slider { box-shadow: 0 0 1px var(--primary-color); }
            input:checked + .bsky-slider:before { transform: translateX(22px); }
        `;

        const domain = getCurrentDomain();
        const domainName = domain === 'bsky' ? 'bsky.app' : 'tokimeki.blue';

        const html = `
            <div class="bsky-settings-modal-overlay">
                <div class="bsky-settings-modal">
                    <div class="bsky-settings-header">
                        <h2>設定</h2>
                        <button class="close-modal-button">&times;</button>
                    </div>
                    <div class="bsky-settings-body">
                        <div class="bsky-settings-section">
                            <h3 class="bsky-settings-section-title">共通設定</h3>
                            <div class="bsky-settings-option">
                                <label>ボタンを表示する</label>
                                <label class="bsky-switch">
                                  <input type="checkbox" id="bsky-enabled-toggle">
                                  <span class="bsky-slider"></span>
                                </label>
                            </div>
                            <div class="bsky-settings-option">
                                <label for="bsky-shortcut-key-input">ショートカットキー</label>
                                <input type="text" id="bsky-shortcut-key-input" placeholder="キーを押して設定" value="">
                            </div>
                        </div>
                        <div class="bsky-settings-section">
                            <h3 class="bsky-settings-section-title">${domainName}</h3>
                            <div class="bsky-settings-option">
                                <label for="bsky-button-position-select">ボタンの表示位置</label>
                                <select id="bsky-button-position-select">
                                    <option value="top-left">左上</option>
                                    <option value="top-right">右上</option>
                                    <option value="bottom-left">左下</option>
                                    <option value="bottom-right">右下</option>
                                </select>
                            </div>
                            <div class="bsky-settings-option">
                                <label for="bsky-button-padding-input">ボタンの余白 (px)</label>
                                <input type="number" id="bsky-button-padding-input" min="0" max="100" value="60">
                            </div>
                        </div>
                    </div>
                    <div class="bsky-settings-footer">
                        <span class="version">(v${SCRIPT_VERSION})</span>
                        <button class="save-button">保存</button>
                    </div>
                </div>
            </div>
        `;

        if (!document.getElementById('bsky-settings-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'bsky-settings-style';
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }

        const existingModal = document.querySelector('.bsky-settings-modal-overlay');
        if (existingModal) existingModal.remove();
        document.body.insertAdjacentHTML('beforeend', html);

        const currentConfig = getConfig();
        const enabledToggle = document.getElementById('bsky-enabled-toggle');
        const positionSelect = document.getElementById('bsky-button-position-select');
        const paddingInput = document.getElementById('bsky-button-padding-input');
        const shortcutInput = document.getElementById('bsky-shortcut-key-input');
        shortcutInput.readOnly = true; // 入力欄は直接入力できないようにする

        enabledToggle.checked = currentConfig.enabled;
        positionSelect.value = currentConfig.buttonPosition;
        paddingInput.value = currentConfig.buttonPadding;
        shortcutInput.value = currentConfig.shortcutKey;

        const modalOverlay = document.querySelector('.bsky-settings-modal-overlay');
        const closeModalButton = document.querySelector('.close-modal-button');
        const saveButton = document.querySelector('.save-button');

        closeModalButton.addEventListener('click', () => modalOverlay.remove());
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.remove();
        });

        shortcutInput.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            // ESCキーは閉じる用にパス
            if (e.key === 'Escape') {
                modalOverlay.remove();
                return;
            }

            const modifiers = [];
            if (e.ctrlKey) modifiers.push('Ctrl');
            if (e.shiftKey) modifiers.push('Shift');
            if (e.altKey) modifiers.push('Alt');

            if (!['Control', 'Shift', 'Alt', 'Meta', 'Tab', 'Escape', 'Backspace', 'Delete'].includes(e.key)) {
                const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
                modifiers.push(key);
            }
            shortcutInput.value = modifiers.join('+');
        });

        saveButton.addEventListener('click', () => {
            const newConfig = {
                enabled: enabledToggle.checked,
                buttonPosition: positionSelect.value,
                buttonPadding: parseInt(paddingInput.value, 10) || 0,
                shortcutKey: shortcutInput.value
            };
            saveConfig(newConfig);
            createButtonUI();
            modalOverlay.remove();
            showToast('設定を保存しました！');
        });

        // ESCキーで閉じる（任意のキーで消えないように once を使わない）
        const onEsc = (e) => {
            if (e.key === 'Escape') {
                modalOverlay.remove();
                document.removeEventListener('keydown', onEsc);
            }
        };
        document.addEventListener('keydown', onEsc);
    }

    // --- 初期化処理 ---
    function init() {
        createButtonUI();
        document.removeEventListener('keydown', handleKeyDown);
        document.addEventListener('keydown', handleKeyDown);

        if (getCurrentDomain() === 'bsky') {
            handleBskyPageLoad();
        } else if (getCurrentDomain() === 'tokimeki') {
            handleTokimekiPageLoad();
        }

        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand("URLを切り替える", switchUrl);
            GM_registerMenuCommand("設定を開く", createSettingsUI);
        }
    }

    init();

})();
