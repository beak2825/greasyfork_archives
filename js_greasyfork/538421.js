// ==UserScript==
// @name         TOKEN取得
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  文字通り、Discordでログイン中のTOKENを取得します。
// @author       Freeze
// @match        https://discord.com/*
// @grant        unsafeWindow
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/538421/TOKEN%E5%8F%96%E5%BE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/538421/TOKEN%E5%8F%96%E5%BE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'authorizationExtractorSettings';

    /**
     * 設定を localStorage から読み込む
     * 戻り値例:
     * {
     *   top: '10px',
     *   left: '10px',
     *   width: '320px',
     *   height: '220px',
     *   showToken: false,
     *   isVisible: false
     * }
     */
    function loadSettings() {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Failed to load settings:', e);
            return null;
        }
    }

    /**
     * 設定を localStorage に保存
     */
    function saveSettings(settings) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.warn('Failed to save settings:', e);
        }
    }

    /**
     * トークンをマスク表示する関数
     */
    function maskToken(token) {
        return '*'.repeat(token.length);
    }

    /**
     * localStorage からトークンを取得して返す
     */
    function getToken() {
        const storage = (typeof unsafeWindow !== 'undefined' && unsafeWindow.localStorage)
            ? unsafeWindow.localStorage
            : window.localStorage;

        let raw = null;
        try {
            raw = storage.getItem('token');
        } catch (e) {
            console.warn('Unable to read from storage:', e);
        }
        if (raw) {
            return raw.slice(1, -1);
        }
        return null;
    }

    /**
     * 要素をドラッグ可能にする関数
     * ヘッダー部分を掴んでドラッグし、mouseup時に saveCallback() を呼ぶ
     */
    function makeElementDraggable(el, saveCallback) {
        el.addEventListener('mousedown', function(event) {
            if (event.target.closest('.header-bar')) {
                event.preventDefault();

                let shiftX = event.clientX - el.getBoundingClientRect().left;
                let shiftY = event.clientY - el.getBoundingClientRect().top;

                function moveAt(pageX, pageY) {
                    const newLeft = pageX - shiftX;
                    const newTop = pageY - shiftY;
                    el.style.left = Math.min(Math.max(0, newLeft), window.innerWidth - el.offsetWidth) + 'px';
                    el.style.top  = Math.min(Math.max(0, newTop), window.innerHeight - el.offsetHeight) + 'px';
                }

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                }

                document.addEventListener('mousemove', onMouseMove);

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    saveCallback();
                }

                document.addEventListener('mouseup', onMouseUp);
            }
        });

        el.ondragstart = function() {
            return false;
        };
    }

    /**
     * UI を作成し、container 要素を返す
     */
    function createUI() {
        const defaultWidth  = '320px';
        const defaultHeight = '220px';
        const settings = loadSettings() || {};

        // コンテナ
        const container = document.createElement('div');
        container.id = 'tokenContainer';
        container.style.position       = 'fixed';
        container.style.top            = settings.top    || '10px';
        container.style.left           = settings.left   || '10px';
        container.style.width          = settings.width  || defaultWidth;
        container.style.height         = settings.height || defaultHeight;
        container.style.backgroundColor= 'rgba(30, 30, 30, 0.95)';
        container.style.color          = '#ffffff';
        container.style.borderRadius   = '8px';
        container.style.boxShadow      = '0 6px 20px rgba(0, 0, 0, 0.6)';
        container.style.resize         = 'both';
        container.style.overflow       = 'auto';
        container.style.zIndex         = '10000';
        container.style.fontFamily     = 'Arial, sans-serif';
        // 初期表示は loadSettings().isVisible に従う。未定義なら非表示
        container.style.display        = settings.isVisible ? 'block' : 'none';
        document.body.appendChild(container);

        // ヘッダー（ドラッグ用バー）
        const headerBar = document.createElement('div');
        headerBar.classList.add('header-bar');
        headerBar.style.width           = '100%';
        headerBar.style.height          = '30px';
        headerBar.style.cursor          = 'move';
        headerBar.style.backgroundColor = '#2c2f33';
        headerBar.style.borderTopLeftRadius  = '8px';
        headerBar.style.borderTopRightRadius = '8px';
        headerBar.style.display         = 'flex';
        headerBar.style.alignItems      = 'center';
        headerBar.style.justifyContent  = 'space-between';
        headerBar.style.padding         = '0 10px';
        headerBar.style.boxSizing       = 'border-box';
        container.appendChild(headerBar);

        // タイトル
        const title = document.createElement('span');
        title.textContent = 'Freeze - TOKEN取得';
        title.style.fontSize   = '14px';
        title.style.fontWeight = '600';
        title.style.userSelect = 'none';
        headerBar.appendChild(title);

        // 閉じるボタン
        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cursor        = 'pointer';
        closeBtn.style.fontSize      = '14px';
        closeBtn.style.padding       = '2px 6px';
        closeBtn.style.borderRadius  = '4px';
        closeBtn.style.userSelect    = 'none';
        closeBtn.style.transition    = 'background-color 0.2s';
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.backgroundColor = '#ff4d4d';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
        closeBtn.addEventListener('click', () => {
            container.style.display = 'none';
            persistSettings();
        });
        headerBar.appendChild(closeBtn);

        // 本文エリア
        const bodyWrapper = document.createElement('div');
        bodyWrapper.style.padding     = '12px';
        bodyWrapper.style.boxSizing   = 'border-box';
        container.appendChild(bodyWrapper);

        // トークン表示
        const tokenDisplay = document.createElement('code');
        tokenDisplay.style.whiteSpace     = 'pre-wrap';
        tokenDisplay.style.wordBreak      = 'break-word';
        tokenDisplay.style.display        = 'block';
        tokenDisplay.style.marginBottom   = '12px';
        tokenDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tokenDisplay.style.color          = '#00FF00';
        tokenDisplay.style.padding        = '10px';
        tokenDisplay.style.borderRadius   = '4px';
        tokenDisplay.style.fontSize       = '13px';
        tokenDisplay.textContent = 'Failed acquisition. Press “Refresh” to try again.';
        bodyWrapper.appendChild(tokenDisplay);

        // ボタンエリア
        const buttonWrapper = document.createElement('div');
        buttonWrapper.style.display         = 'flex';
        buttonWrapper.style.justifyContent  = 'space-between';
        buttonWrapper.style.alignItems      = 'center';
        buttonWrapper.style.gap             = '10px';
        bodyWrapper.appendChild(buttonWrapper);

        // 左ボタン群
        const leftButtons = document.createElement('div');
        leftButtons.style.display = 'flex';
        leftButtons.style.gap     = '8px';
        buttonWrapper.appendChild(leftButtons);

        // Copy ボタン
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.padding          = '6px 14px';
        copyButton.style.backgroundColor  = '#7289da';
        copyButton.style.color            = '#ffffff';
        copyButton.style.border           = 'none';
        copyButton.style.borderRadius     = '4px';
        copyButton.style.cursor           = 'pointer';
        copyButton.style.transition       = 'background-color 0.2s, transform 0.1s';
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.backgroundColor = '#667bc4';
        });
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.backgroundColor = '#7289da';
        });
        copyButton.addEventListener('mousedown', () => {
            copyButton.style.transform = 'scale(0.95)';
        });
        copyButton.addEventListener('mouseup', () => {
            copyButton.style.transform = 'scale(1)';
        });
        leftButtons.appendChild(copyButton);

        copyButton.addEventListener('click', function() {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = tokenDisplay.getAttribute('data-token') || '';
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            copyButton.textContent = 'Copied!';
            setTimeout(() => { copyButton.textContent = 'Copy'; }, 1000);
        });

        // Refresh ボタン
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh';
        refreshButton.style.padding          = '6px 14px';
        refreshButton.style.backgroundColor  = '#ffa500';
        refreshButton.style.color            = '#ffffff';
        refreshButton.style.border           = 'none';
        refreshButton.style.borderRadius     = '4px';
        refreshButton.style.cursor           = 'pointer';
        refreshButton.style.transition       = 'background-color 0.2s, transform 0.1s';
        refreshButton.addEventListener('mouseenter', () => {
            refreshButton.style.backgroundColor = '#e59400';
        });
        refreshButton.addEventListener('mouseleave', () => {
            refreshButton.style.backgroundColor = '#ffa500';
        });
        refreshButton.addEventListener('mousedown', () => {
            refreshButton.style.transform = 'scale(0.95)';
        });
        refreshButton.addEventListener('mouseup', () => {
            refreshButton.style.transform = 'scale(1)';
        });
        leftButtons.appendChild(refreshButton);

        // Show/Hide ボタン
        const toggleButton = document.createElement('button');
        toggleButton.textContent = settings.showToken ? 'Hide' : 'Show';
        toggleButton.style.padding          = '6px 14px';
        toggleButton.style.backgroundColor  = settings.showToken ? '#f04747' : '#43b581';
        toggleButton.style.color            = '#ffffff';
        toggleButton.style.border           = 'none';
        toggleButton.style.borderRadius     = '4px';
        toggleButton.style.cursor           = 'pointer';
        toggleButton.style.transition       = 'opacity 0.2s';
        toggleButton.addEventListener('mouseenter', () => {
            toggleButton.style.opacity = '0.8';
        });
        toggleButton.addEventListener('mouseleave', () => {
            toggleButton.style.opacity = '1';
        });
        buttonWrapper.appendChild(toggleButton);

        /**
         * 設定を保存する
         */
        function persistSettings() {
            const current = {
                top:        container.style.top,
                left:       container.style.left,
                width:      container.style.width,
                height:     container.style.height,
                showToken:  toggleButton.textContent === 'Hide',
                isVisible:  container.style.display === 'block'
            };
            saveSettings(current);
        }

        // 初回表示：保存された showToken に従いトークンを表示
        const initialRaw = getToken();
        if (initialRaw) {
            tokenDisplay.setAttribute('data-token', initialRaw);
            if (settings.showToken) {
                tokenDisplay.textContent = initialRaw;
            } else {
                tokenDisplay.textContent = maskToken(initialRaw);
            }
        }

        // Refresh ボタン押下時
        refreshButton.addEventListener('click', () => {
            refreshButton.disabled = true;
            refreshButton.textContent = 'Refreshing…';
            setTimeout(() => {
                const raw = getToken();
                if (raw) {
                    tokenDisplay.setAttribute('data-token', raw);
                    if (toggleButton.textContent === 'Hide') {
                        tokenDisplay.textContent = raw;
                    } else {
                        tokenDisplay.textContent = maskToken(raw);
                    }
                } else {
                    tokenDisplay.textContent = 'Failed acquisition. Press “Refresh”.';
                    tokenDisplay.removeAttribute('data-token');
                }
                refreshButton.textContent = 'Refresh';
                refreshButton.disabled = false;
            }, 100);
        });

        // Show/Hide トグル押下時
        toggleButton.addEventListener('click', () => {
            const raw = tokenDisplay.getAttribute('data-token');
            if (!raw) return;

            if (toggleButton.textContent === 'Show') {
                tokenDisplay.textContent = raw;
                toggleButton.textContent = 'Hide';
                toggleButton.style.backgroundColor = '#f04747';
            } else {
                tokenDisplay.textContent = maskToken(raw);
                toggleButton.textContent = 'Show';
                toggleButton.style.backgroundColor = '#43b581';
            }
            persistSettings();
        });

        // ドラッグ可能化（ヘッダーのみ）
        makeElementDraggable(container, persistSettings);

        // リサイズ終了後に設定保存
        container.addEventListener('mouseup', () => {
            persistSettings();
        });

        // container に保存用メソッドをアタッチ（外部から呼べるように）
        container.persistSettings = persistSettings;

        return { container };
    }

    /**
     * 「TOKEN取得」ボタンを作成し、クリックで UI の表示・非表示を切り替える
     */
    function createFetchButton(container) {
        const fetchBtn = document.createElement('button');
        fetchBtn.textContent = 'TOKEN取得';
        fetchBtn.style.position       = 'fixed';
        fetchBtn.style.bottom         = '20px';
        fetchBtn.style.right          = '20px';
        fetchBtn.style.padding        = '10px 20px';
        fetchBtn.style.backgroundColor= '#5865f2';
        fetchBtn.style.color          = '#ffffff';
        fetchBtn.style.border         = 'none';
        fetchBtn.style.borderRadius   = '6px';
        fetchBtn.style.cursor         = 'pointer';
        fetchBtn.style.boxShadow      = '0 4px 12px rgba(0, 0, 0, 0.3)';
        fetchBtn.style.fontSize       = '14px';
        fetchBtn.style.fontWeight     = '600';
        fetchBtn.style.zIndex         = '10001';
        fetchBtn.style.transition     = 'background-color 0.2s, transform 0.1s';
        fetchBtn.addEventListener('mouseenter', () => {
            fetchBtn.style.backgroundColor = '#4953c8';
        });
        fetchBtn.addEventListener('mouseleave', () => {
            fetchBtn.style.backgroundColor = '#5865f2';
            fetchBtn.style.transform       = 'scale(1)';
        });
        fetchBtn.addEventListener('mousedown', () => {
            fetchBtn.style.transform = 'scale(0.95)';
        });
        fetchBtn.addEventListener('mouseup', () => {
            fetchBtn.style.transform = 'scale(1)';
        });
        document.body.appendChild(fetchBtn);

        fetchBtn.addEventListener('click', () => {
            const isHidden = container.style.display === 'none';
            container.style.display = isHidden ? 'block' : 'none';
            // 表示状態が変わったので保存
            container.persistSettings();
        });
    }

    // ────────────────────────────────────────────────────
    // スクリプト本体
    // ────────────────────────────────────────────────────

    // UI 作成
    const { container } = createUI();

    // 「TOKEN取得」ボタン作成
    createFetchButton(container);

    // 保存設定があれば表示状態を復元（初期 loadSettings() 内で適用済）
    // 特に何もしなくてOK
})();
