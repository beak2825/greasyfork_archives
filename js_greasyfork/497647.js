// ==UserScript==
// @name         X/Twitter Clean menu and sidebar (Supports multiple language)
// @name:ja      X/Twitter きれいなメニューとサイドバー（多言語対応）
// @name:zh-TW   X/Twitter 乾淨的選單和側邊欄（支持多種語言）
// @name:zh-CN   X/Twitter 干净的选单和侧边栏（支持多种语言）
// @version      3.5
// @description  Hidden Menu,Grok,Premium subscription,Verified Orgs,other,Explore,Notifications,Messages,Communities,Bookmarks,Right Column, Muted Account Notices and Customizable Settings
// @description:ja    清潔なメニュー、Grok、高度なサブスクリプション、認証済み組織、他の、探索、通知、メッセージ、コミュニティ、ブックマーク、右側カラム、ミュート通知、およびカスタム設定
// @description:zh-TW 乾淨的 選單、Grok、高級訂閱、已認證組織、其他、探索、通知、訊息、社群、書籤、右側邊欄、靜音通知和可自訂設定
// @description:zh-CN 干净的 选单、Grok、高级订阅、已认证组织、其他、探索、通知、私信、书签、右侧边栏、静音通知和可自订设定
// @license      MIT
// @author       movwei
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1041101
// @downloadURL https://update.greasyfork.org/scripts/497647/XTwitter%20Clean%20menu%20and%20sidebar%20%28Supports%20multiple%20language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/497647/XTwitter%20Clean%20menu%20and%20sidebar%20%28Supports%20multiple%20language%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultSettings = {
        hideGrok: true,
        hidePremiumSignUp: true,
        hideSelectors: true,
        hideVerifiedOrgs: true,
        hideother: true,
        hideExplore: false,
        hideNotifications: false,
        hideBookmarks: false,
        hideMessages: false,
        hideCommunities: false,
        hideMutedNotices: false,
        hideRightColumn: false,
        hideChatButton: false,
        hideCreatorsStudio: false,
        useLargerCSS: false,
        cssWidth: 680,
        useCustomPadding: false,
        paddingWidth: 20,
    };

    const settings = {
        hideGrok: GM_getValue('hideGrok', defaultSettings.hideGrok),
        hidePremiumSignUp: GM_getValue('hidePremiumSignUp', defaultSettings.hidePremiumSignUp),
        hideSelectors: GM_getValue('hideSelectors', defaultSettings.hideSelectors),
        hideVerifiedOrgs: GM_getValue('hideVerifiedOrgs', defaultSettings.hideVerifiedOrgs),
        hideother: GM_getValue('hideother', defaultSettings.hideother),
        hideExplore: GM_getValue('hideExplore', defaultSettings.hideExplore),
        hideNotifications: GM_getValue('hideNotifications', defaultSettings.hideNotifications),
        hideBookmarks: GM_getValue('hideBookmarks', defaultSettings.hideBookmarks),
        hideMessages: GM_getValue('hideMessages', defaultSettings.hideMessages),
        hideCommunities: GM_getValue('hideCommunities', defaultSettings.hideCommunities),
        hideRightColumn: GM_getValue('hideRightColumn', defaultSettings.hideRightColumn),
        hideMutedNotices: GM_getValue('hideMutedNotices', defaultSettings.hideMutedNotices),
        hideChatButton: GM_getValue('hideChatButton', defaultSettings.hideChatButton),
        hideCreatorsStudio: GM_getValue('hideCreatorsStudio', defaultSettings.hideCreatorsStudio),
        useLargerCSS: GM_getValue('useLargerCSS', defaultSettings.useLargerCSS),
        cssWidth: GM_getValue('cssWidth', defaultSettings.cssWidth),
        useCustomPadding: GM_getValue('useCustomPadding', defaultSettings.useCustomPadding),
        paddingWidth: GM_getValue('paddingWidth', defaultSettings.paddingWidth),
    };

    const language = navigator.language || navigator.userLanguage;
    const languages = {
        'en': {
            'hideGrok': 'Hide Grok',
            'hidePremiumSignUp': 'Hide Premium Sign-up',
            'hideSelectors': 'Hide Subscribe Message',
            'hideVerifiedOrgs': 'Hide Verified Orgs',
            'hideExplore': 'Hide Explore',
            'hideNotifications': 'Hide Notifications',
            'hideMessages': 'Hide Messages',
            'hideCommunities': 'Hide Communities',
            'hideBookmarks': 'Hide Bookmarks',
            'hideother': 'Hide other',
            'hideMutedNotices': 'Hide Muted Account Notices',
            'hideRightColumn': 'Hide Right Column',
            'hideChatButton': 'Hide Floating Chat',
            'supportDeveloper': '❤ Support Developer',
            'buyMeCoffee': 'Buy me a coffee',
            'hideCreatorsStudio': 'Hide Creators Studio',
            'useLargerCSS': 'Larger Post Area',
            'cssWidth': 'Custom width',
            'useCustomPadding': 'Right Sidebar Spacing',
            'paddingWidth': 'Padding Width',
            'settings': 'Settings',
            'saveRefresh': 'Save & refresh',
            'close': 'Close'
        },
        'zh-TW': {
            'hideGrok': '隱藏 Grok',
            'hidePremiumSignUp': '隱藏 高級訂閱',
            'hideSelectors': '隱藏 訂閱訊息',
            'hideVerifiedOrgs': '隱藏 已認證組織',
            'hideExplore': '隱藏 探索',
            'hideNotifications': '隱藏 通知',
            'hideMessages': '隱藏 訊息',
            'hideCommunities': '隱藏 社群',
            'hideBookmarks': '隱藏 書籤',
            'hideother': '隱藏 其他',
            'hideMutedNotices': '隱藏 靜音帳戶通知',
            'hideRightColumn': '隱藏 右側邊欄',
            'hideChatButton': '隱藏懸浮聊天',
            'supportDeveloper': '❤ 支持開發者',
            'buyMeCoffee': '點我請杯咖啡',
            'hideCreatorsStudio': '隱藏 創作者工作室',
            'useLargerCSS': '更大貼文區域',
            'cssWidth': '自訂寬度',
            'useCustomPadding': '右側邊欄間距',
            'paddingWidth': '間距寬度',
            'settings': '設定',
            'saveRefresh': '保存並刷新',
            'close': '關閉'
        },
        'zh-CN': {
            'hideGrok': '隐藏 Grok',
            'hidePremiumSignUp': '隐藏 高级订阅',
            'hideSelectors': '隐藏 订阅消息',
            'hideVerifiedOrgs': '隐藏 已认证组织',
            'hideExplore': '隐藏 探索',
            'hideNotifications': '隐藏 通知',
            'hideMessages': '隐藏 私信',
            'hideCommunities': '隐藏 社群',
            'hideBookmarks': '隐藏 书签',
            'hideother': '隐藏 其他',
            'hideMutedNotices': '隐藏 静音账户通知',
            'hideRightColumn': '隐藏 右侧边栏',
            'hideChatButton': '隐藏悬浮聊天',
            'supportDeveloper': '❤ 支持开发者',
            'buyMeCoffee': '点我请杯咖啡',
            'hideCreatorsStudio': '隐藏 创作者工作室',
            'useLargerCSS': '更大帖子区域',
            'cssWidth': '自定义宽度',
            'useCustomPadding': '右侧边栏间距',
            'paddingWidth': '间距宽度',
            'settings': '设置',
            'saveRefresh': '保存并刷新',
            'close': '关闭'
        },
        'ja': {
            'hideGrok': 'Grokを非表示',
            'hidePremiumSignUp': 'プレミアムサインアップを非表示',
            'hideSelectors': 'サブスクライブメッセージを非表示',
            'hideVerifiedOrgs': '認証済み組織を非表示',
            'hideExplore': '話題を検索を非表示',
            'hideNotifications': '通知を非表示',
            'hideMessages': 'メッセージを非表示',
            'hideCommunities': 'コミュニティを非表示',
            'hideBookmarks': 'ブックマークを非表示',
            'hideother': '他のを非表示',
            'hideMutedNotices': 'ミュートアカウント通知を非表示',
            'hideRightColumn': '右側カラムを非表示',
            'hideChatButton': 'フローティングチャットを非表示',
            'supportDeveloper': '❤ 開発者をサポート',
            'buyMeCoffee': 'コーヒーをおごってください',
            'hideCreatorsStudio': 'クリエイタースタジオを非表示',
            'useLargerCSS': 'より大きな投稿エリア',
            'cssWidth': 'カスタム幅',
            'useCustomPadding': '右側サイドバーの間隔',
            'paddingWidth': 'パディング幅',
            'settings': '設定',
            'saveRefresh': '保存して更新',
            'close': '閉じる'
        },
    };

    const currentLanguage = languages[language] || languages['en'];

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.id = 'settingsPanel';
        panel.innerHTML = `
            <div id="settingsPanelContent">
                <div class="settings-header">
                    <h2>${currentLanguage['settings']}</h2>
                </div>

                <div class="settings-container">
                    <div class="settings-section">
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideGrokCheckbox" ${settings.hideGrok ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideGrok']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hidePremiumSignUpCheckbox" ${settings.hidePremiumSignUp ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hidePremiumSignUp']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideSelectorsCheckbox" ${settings.hideSelectors ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideSelectors']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideVerifiedOrgsCheckbox" ${settings.hideVerifiedOrgs ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideVerifiedOrgs']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideotherCheckbox" ${settings.hideother ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideother']}</span>
                        </label>
                    </div>

                    <div class="settings-section">
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideExploreCheckbox" ${settings.hideExplore ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideExplore']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideNotificationsCheckbox" ${settings.hideNotifications ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideNotifications']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideMessagesCheckbox" ${settings.hideMessages ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideMessages']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideChatButtonCheckbox" ${settings.hideChatButton ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideChatButton']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideCommunitiesCheckbox" ${settings.hideCommunities ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideCommunities']}</span>
                        </label>
                    </div>

                    <div class="settings-section">
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideBookmarksCheckbox" ${settings.hideBookmarks ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideBookmarks']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideMutedNoticesCheckbox" ${settings.hideMutedNotices ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideMutedNotices']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideCreatorsStudioCheckbox" ${settings.hideCreatorsStudio ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideCreatorsStudio']}</span>
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="hideRightColumnCheckbox" ${settings.hideRightColumn ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['hideRightColumn']}</span>
                        </label>
                    </div>
                </div>

                <div class="horizontal-settings-container">
                    <div class="horizontal-settings-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="useLargerCSSCheckbox" ${settings.useLargerCSS ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['useLargerCSS']}</span>
                        </label>
                        <div class="width-input-container">
                            <span class="width-label">${currentLanguage['cssWidth']}</span>
                            <div class="width-input-wrapper">
                                <input type="number" id="cssWidthInput" class="width-input" value="${settings.cssWidth}" min="400" max="1200">
                                <span class="width-unit">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="horizontal-settings-item">
                        <label class="toggle-switch">
                            <input type="checkbox" id="useCustomPaddingCheckbox" ${settings.useCustomPadding ? 'checked' : ''}>
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">${currentLanguage['useCustomPadding']}</span>
                        </label>
                        <div class="width-input-container">
                            <span class="width-label">${currentLanguage['paddingWidth']}</span>
                            <div class="width-input-wrapper">
                                <input type="number" id="paddingWidthInput" class="width-input" value="${settings.paddingWidth}" min="0" max="100">
                                <span class="width-unit">px</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="buttons-container">
                    <div class="support-banner">
                        <span class="support-text-inline">${currentLanguage['supportDeveloper']}</span>
                        <a href="https://ko-fi.com/pocket377" target="_blank" class="support-link-inline">
                            <span class="support-emoji">☕</span>
                            <span>${currentLanguage['buyMeCoffee']}</span>
                            <span class="support-heart">❤</span>
                        </a>
                    </div>
                    <div class="buttons-row">
                        <button id="saveSettingsButton" class="panel-button primary-button">${currentLanguage['saveRefresh']}</button>
                        <button id="closeSettingsButton" class="panel-button secondary-button">${currentLanguage['close']}</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('saveSettingsButton').addEventListener('click', saveSettings);
        document.getElementById('closeSettingsButton').addEventListener('click', () => {
            document.getElementById('settingsPanel').style.display = 'none';
        });

        document.getElementById('hideRightColumnCheckbox').addEventListener('change', function() {
            if (this.checked) {
                document.getElementById('useLargerCSSCheckbox').checked = true;
            } else {
                document.getElementById('useLargerCSSCheckbox').checked = false;
            }
        });
    }

    function saveSettings() {
        settings.hideGrok = document.getElementById('hideGrokCheckbox').checked;
        settings.hidePremiumSignUp = document.getElementById('hidePremiumSignUpCheckbox').checked;
        settings.hideSelectors = document.getElementById('hideSelectorsCheckbox').checked;
        settings.hideVerifiedOrgs = document.getElementById('hideVerifiedOrgsCheckbox').checked;
        settings.hideExplore = document.getElementById('hideExploreCheckbox').checked;
        settings.hideNotifications = document.getElementById('hideNotificationsCheckbox').checked;
        settings.hideBookmarks = document.getElementById('hideBookmarksCheckbox').checked;
        settings.hideMessages = document.getElementById('hideMessagesCheckbox').checked;
        settings.hideCommunities = document.getElementById('hideCommunitiesCheckbox').checked;
        settings.hideother = document.getElementById('hideotherCheckbox').checked;
        settings.hideRightColumn = document.getElementById('hideRightColumnCheckbox').checked;
        settings.hideMutedNotices = document.getElementById('hideMutedNoticesCheckbox').checked;
        settings.hideChatButton = document.getElementById('hideChatButtonCheckbox').checked;
        settings.hideCreatorsStudio = document.getElementById('hideCreatorsStudioCheckbox').checked;
        settings.useLargerCSS = document.getElementById('useLargerCSSCheckbox').checked;
        settings.cssWidth = parseInt(document.getElementById('cssWidthInput').value) || 680;
        settings.useCustomPadding = document.getElementById('useCustomPaddingCheckbox').checked;
        settings.paddingWidth = parseInt(document.getElementById('paddingWidthInput').value) || 20;

        GM_setValue('hideGrok', settings.hideGrok);
        GM_setValue('hidePremiumSignUp', settings.hidePremiumSignUp);
        GM_setValue('hideSelectors', settings.hideSelectors);
        GM_setValue('hideVerifiedOrgs', settings.hideVerifiedOrgs);
        GM_setValue('hideExplore', settings.hideExplore);
        GM_setValue('hideNotifications', settings.hideNotifications);
        GM_setValue('hideBookmarks', settings.hideBookmarks);
        GM_setValue('hideMessages', settings.hideMessages);
        GM_setValue('hideCommunities', settings.hideCommunities);
        GM_setValue('hideother', settings.hideother);
        GM_setValue('hideRightColumn', settings.hideRightColumn);
        GM_setValue('hideMutedNotices', settings.hideMutedNotices);
        GM_setValue('hideChatButton', settings.hideChatButton);
        GM_setValue('hideCreatorsStudio', settings.hideCreatorsStudio);
        GM_setValue('useLargerCSS', settings.useLargerCSS);
        GM_setValue('cssWidth', settings.cssWidth);
        GM_setValue('useCustomPadding', settings.useCustomPadding);
        GM_setValue('paddingWidth', settings.paddingWidth);
        location.reload();
    }

    GM_addStyle(`
        #settingsPanel {
            width: 90%;
            max-width: 800px;
            min-width: 300px;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            border: none;
            padding: 0;
            z-index: 10000;
            display: none;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            border-radius: 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
        }

        #settingsPanelContent {
            display: flex;
            flex-direction: column;
            width: 100%;
        }

        .settings-header {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        #settingsPanel h2 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: #0f1419;
            text-align: center;
        }

        .settings-container {
            display: flex;
            justify-content: space-between;
            padding: 12px 20px;
            flex-wrap: wrap;
            border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .settings-section {
            flex: 1;
            min-width: 200px;
            padding: 0 10px;
        }

        .horizontal-settings-container {
            display: flex;
            justify-content: space-between;
            padding: 12px 20px;
            border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .horizontal-settings-item {
            flex: 1;
            min-width: 200px;
            padding: 0 10px;
        }

        .toggle-switch {
            position: relative;
            display: flex;
            align-items: center;
            margin: 12px 0;
            padding: 6px 0;
            cursor: pointer;
        }

        .toggle-switch:first-child {
            border-top: none;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: relative;
            display: inline-block;
            width: 42px;
            height: 24px;
            background-color: #cfd9de;
            border-radius: 24px;
            transition: .3s;
            margin-right: 12px;
            flex-shrink: 0;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            border-radius: 50%;
            transition: .3s;
        }

        input:checked + .toggle-slider {
            background-color: #1d9bf0;
        }

        input:checked + .toggle-slider:before {
            transform: translateX(18px);
        }

        .toggle-label {
            font-size: 16px;
            color: #0f1419;
        }

        .buttons-container {
            display: flex;
            flex-direction: column;
            padding: 16px 20px;
            gap: 12px;
            border-top: 1px solid rgba(0,0,0,0.08);
        }

        .support-banner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 0;
            font-size: 14px;
        }

        .support-text-inline {
            color: #536471;
        }

        .support-link-inline {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: #1d9bf0;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.2s;
        }

        .support-link-inline:hover {
            color: #1a8cd8;
            text-decoration: underline;
        }

        .support-link-inline .support-emoji {
            font-size: 16px;
        }

        .support-link-inline .support-heart {
            font-size: 14px;
            color: #e91e63;
            animation: heartbeat 1.5s ease-in-out infinite;
        }

        .buttons-row {
            display: flex;
            gap: 10px;
        }

        .panel-button {
            flex: 1;
            padding: 12px 0;
            font-size: 15px;
            font-weight: 600;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            transition: background-color 0.2s;
            text-align: center;
        }

        .primary-button {
            color: white;
            background-color: #1d9bf0;
        }

        .primary-button:hover {
            background-color: #1a8cd8;
        }

        .secondary-button {
            color: #0f1419;
            background-color: #e6e7e7;
        }

        .secondary-button:hover {
            background-color: #d1d1d1;
        }

        .width-input-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 12px 0;
            padding: 25px 0;
        }

        .width-label {
            font-size: 16px;
            color: #0f1419;
            flex-grow: 0.1;
        }

        .width-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        .width-input {
            width: 90px;
            padding: 8px 30px 8px 12px;
            border: 1px solid #cfd9de;
            border-radius: 9999px;
            font-size: 14px;
            transition: border-color 0.2s;
            text-align: center;
        }

        .width-input:focus {
            outline: none;
            border-color: #1d9bf0;
            box-shadow: 0 0 0 1px rgba(29, 155, 240, 0.3);
        }

        .width-unit {
            position: absolute;
            right: 12px;
            font-size: 14px;
            color: #536471;
            pointer-events: none;
        }

        .width-input::-webkit-inner-spin-button,
        .width-input::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .width-input[type=number] {
            -moz-appearance: textfield;
        }

        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
    `);

    createSettingsPanel();
    GM_registerMenuCommand(currentLanguage['settings'], () => {
        const panel = document.getElementById('settingsPanel');
        panel.style.display = 'block';
    });

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    var cssRules = '';

    if (settings.hideSelectors) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const elements = document.querySelectorAll('.css-175oi2r.r-1habvwh.r-eqz5dr.r-uaa2di.r-1mmae3n.r-3pj75a.r-bnwqim');
                elements.forEach(element => {
                    const parentDiv = element.closest('div');
                    if (parentDiv) {
                        parentDiv.remove();
                    }
                });

                const additionalElements = document.querySelectorAll('.css-175oi2r.r-1habvwh.r-1ssbvtb.r-1mmae3n.r-3pj75a');
                additionalElements.forEach(element => {
                    const parentDiv = element.closest('div');
                    if (parentDiv) {
                        parentDiv.remove();
                    }
                });

                const asideElements = document.querySelectorAll('aside.css-175oi2r.r-1habvwh.r-eqz5dr.r-uaa2di.r-w7s2jr.r-u9wvl5.r-bnwqim');
                asideElements.forEach(element => {
                    const parentDiv = element.closest('div');
                    if (parentDiv) {
                        parentDiv.remove();
                    }
                });

                const superUpsellElements = document.querySelectorAll('div[data-testid="super-upsell-UpsellCardRenderProperties"]');
                superUpsellElements.forEach(element => {
                    const parentDiv = element.closest('div.css-175oi2r.r-1ifxtd0');
                    if (parentDiv) {
                        parentDiv.remove();
                    } else {
                        element.remove();
                    }
                });

                const superUpsellContainers = document.querySelectorAll('div.css-175oi2r.r-1ifxtd0');
                superUpsellContainers.forEach(container => {
                    const hasSuperUpsell = container.querySelector('div[data-testid="super-upsell-UpsellCardRenderProperties"]');
                    if (hasSuperUpsell) {
                        container.remove();
                    }
                });

                const verifiedUpsell = document.querySelectorAll('.css-175oi2r.r-yfoy6g.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x[data-testid="verified_profile_upsell"]');
                verifiedUpsell.forEach(element => {
                    const parentDiv = element.closest('div');
                    if (parentDiv) {
                        parentDiv.remove();
                    } else {
                        element.remove();
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        GM_addStyle(`
            .css-175oi2r.r-1xpp3t0 { display: none !important; }
            .css-175oi2r.r-yfoy6g.r-18bvks7.r-1q9bdsx.r-rs99b7 { display: none !important; }
            .css-175oi2r.r-1habvwh.r-1ssbvtb.r-1mmae3n.r-3pj75a { display: none !important; }

        `);
    }

    if (settings.hideGrok) {
        const targetPathD = "M2.205 7.423L11.745 21h4.241L6.446 7.423H2.204zm4.237 7.541L2.2 21h4.243l2.12-3.017-2.121-3.02zM16.957 0L9.624 10.435l2.122 3.02L21.2 0h-4.243zm.767 6.456V21H21.2V1.51l-3.476 4.946z";
        const targetGrokImageGenPathD = "M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544M10.48 22.531c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466";
        const targetGrokNewPathD = "M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466";
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const svgs = document.querySelectorAll('svg[aria-hidden="true"].r-4qtqp9');
                svgs.forEach(svg => {
                    const path = svg.querySelector('path');
                    if (path) {
                        const pathD = path.getAttribute('d');
                        if (pathD === targetPathD || pathD === targetGrokNewPathD) {
                            const container = svg.closest('button') || svg.closest('div');
                            if (container) {
                                container.remove();
                            }
                        }
                    }
                });

                const grokImgGenButtons = document.querySelectorAll('button[data-testid="grokImgGen"]');
                grokImgGenButtons.forEach(button => {
                    button.remove();
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        GM_addStyle(`
            a[href="/i/grok"] { display: none !important; }
            .css-175oi2r.r-1867qdf.r-xnswec.r-13awgt0.r-1ce3o0f.r-1udh08x.r-u8s1d.r-13qz1uu.r-173mn98.r-1e5uvyk.r-ii8lfi.r-40lpo0.r-rs99b7.r-12jitg0 { display: none; }
            .css-175oi2r.r-16y2uox.r-1wbh5a2.r-tzz3ar.r-1pi2tsx.r-buy8e9.r-mfh4gg.r-2eszeu.r-10m9thr.r-lltvgl.r-18u37iz.r-9aw3ui { display: none; }
            .css-175oi2r.r-1s2bzr4.r-dnmrzs.r-bnwqim { display: none; }
        `);
    }

    if (settings.hideCommunities) {
        const targetCommunitiesPathD = "M7.501 19.917L7.471 21H.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977.963 0 1.95.212 2.87.672-.444.478-.851 1.03-1.212 1.656-.507-.204-1.054-.329-1.658-.329-2.767 0-4.57 2.223-4.938 6.004H7.56c-.023.302-.05.599-.059.917zm15.998.056L23.528 21H9.472l.029-1.027c.184-6.618 3.736-8.977 7-8.977s6.816 2.358 7 8.977zM21.437 19c-.367-3.781-2.17-6.004-4.938-6.004s-4.57 2.223-4.938 6.004h9.875zm-4.938-9c-.799 0-1.527-.279-2.116-.73-.836-.64-1.384-1.638-1.384-2.77 0-1.93 1.567-3.5 3.5-3.5s3.5 1.57 3.5 3.5c0 1.132-.548 2.13-1.384 2.77-.589.451-1.317.73-2.116.73zm-1.5-3.5c0 .827.673 1.5 1.5 1.5s1.5-.673 1.5-1.5-.673-1.5-1.5-1.5-1.5.673-1.5 1.5zM7.5 3C9.433 3 11 4.57 11 6.5S9.433 10 7.5 10 4 8.43 4 6.5 5.567 3 7.5 3zm0 2C6.673 5 6 5.673 6 6.5S6.673 8 7.5 8 9 7.327 9 6.5 8.327 5 7.5 5z";
        const observerCommunities = new MutationObserver(mutations => {
            mutations.forEach(() => {
                const svgs = document.querySelectorAll('svg[aria-hidden="true"].r-4qtqp9');
                svgs.forEach(svg => {
                    const path = svg.querySelector('path');
                    if (path && path.getAttribute('d') === targetCommunitiesPathD) {
                        const container = svg.closest('a') || svg.closest('div');
                        if (container) {
                            container.remove();
                        }
                    }
                });
            });
        });
        observerCommunities.observe(document.body, { childList: true, subtree: true });
    }

    if (settings.hidePremiumSignUp) {
        cssRules += 'a[href="/i/premium_sign_up"] { display: none !important; }';
    }
    if (settings.hideVerifiedOrgs) {
        cssRules += 'a[href="/i/verified-orgs-signup"] { display: none !important; }';
    }
    if (settings.hideother) {
        cssRules += 'a[href="/jobs"] { display: none !important; }';
        cssRules += 'a[href="/i/premium-business"] { display: none !important; }';
        cssRules += 'a[href="https://ads.twitter.com/?ref=gl-tw-tw-twitter-ads-rweb"] { display: none !important; }';
        cssRules += 'a[href="https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb"] { display: none !important; }';
        cssRules += '.css-175oi2r.r-l00any.r-109y4c4.r-kuekak { display: none !important; }';
        cssRules += 'a.css-175oi2r.r-5oul0u.r-knv0ih.r-faml9v.r-2dysd3.r-13qz1uu.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21 { display: none !important; }';
        cssRules += 'a.css-175oi2r.r-5oul0u.r-1wzrnnt.r-1c4vpko.r-1c7gwzm.r-13qz1uu.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21 { display: none !important; }';
    }
    if (settings.hideExplore) {
        cssRules += 'a[href="/explore"] { display: none !important; }';
    }
    if (settings.hideNotifications) {
        cssRules += 'a[href="/notifications"] { display: none !important; }';
    }
    if (settings.hideBookmarks) {
        cssRules += 'a[href="/i/bookmarks"] { display: none !important; }';
    }
    if (settings.hideMessages) {
        cssRules += 'a[href="/i/chat"] { display: none !important; }';
    }
    if (settings.hideRightColumn) {
        cssRules += '.css-175oi2r.r-yfoy6g.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x { display: none !important; }';
        cssRules += '.css-175oi2r.r-18bvks7.r-1867qdf.r-1phboty.r-1ifxtd0.r-1udh08x.r-1niwhzg.r-1yadl64 { display: none !important; }';
    }
    if (settings.hideChatButton) {
        cssRules += '.css-175oi2r.r-105ug2t.r-1867qdf.r-xnswec.r-u8s1d { display: none !important; }';
    }
    if (settings.hideCreatorsStudio) {
        cssRules += 'a[href="/i/jf/creators/studio"] { display: none !important; }';
    }
    if (settings.useLargerCSS) {
        cssRules += `div[data-testid="sidebarColumn"] { padding-left:20px; }`;
        cssRules += `.r-1ye8kvj { max-width: ${settings.cssWidth}px !important; }`;
        cssRules += '.r-10f7w94 { margin-tuning-right: 0px !important; }';
    }
    if (settings.useCustomPadding) {
        cssRules += `div[data-testid="sidebarColumn"] { padding-left: ${settings.paddingWidth}px !important; }`;
    }

    if (settings.hideMutedNotices) {
        function hideMutedPostNotices() {
            const replyCells = document.querySelectorAll('[data-testid="cellInnerDiv"]');
            replyCells.forEach((cell) => {
                const mutedNotices = cell.querySelectorAll('.css-175oi2r.r-1awozwy.r-g6ijar.r-cliqr8.r-1867qdf.r-1phboty.r-rs99b7.r-18u37iz.r-1wtj0ep.r-1mmae3n.r-n7gxbd');
                mutedNotices.forEach((notice) => {
                    const parentCell = notice.closest('[data-testid="cellInnerDiv"]');
                    if (parentCell) {
                        parentCell.remove();
                    }
                });
            });
        }

        const observer = new MutationObserver(() => {
            hideMutedPostNotices();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        hideMutedPostNotices();
    }

    addGlobalStyle(cssRules);
})();