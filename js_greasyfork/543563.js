// ==UserScript==
// @name         MissAVAutoPlay
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Adds a Web Fullscreen button (F key) and enables Alt+A/Click autoplay toggle,
// @description:ja ウェブ全画面表示ボタン(Fキー)を追加し、Alt+A/クリックによる自動再生トグルを有効化します。
// @description:zh 添加网页全屏按钮(F键)，并启用Alt+A/点击切换自动播放功能。
// @author       Nabbit
// @match        https://missav.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @license      Nabbit
// @downloadURL https://update.greasyfork.org/scripts/543563/MissAVAutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/543563/MissAVAutoPlay.meta.js
// ==/UserScript==

/* global $ */
$(function() {

    function getUILanguage() {
        const lang = (navigator.language || document.documentElement.lang || 'en').toLowerCase();
        if (lang.startsWith('zh')) return 'zh';
        if (lang.startsWith('ja')) return 'ja';
        return 'en';
    }

    const language = getUILanguage();

    const texts = {

        'zh': {
            enter: '网页全屏 (F)',
            exit: '退出全屏 (F)',
            tooltip_enter: '网页全屏',
            tooltip_exit: '退出全屏',
            label_enter: '网页全屏显示',

            autoplay_on: '▶️ 视频自动播放已开启。',
            autoplay_off: '⏹️ 视频自动播放已关闭。',
            autoplay_loaded: '✅ 脚本已加载 | ALT+A 切换开关',
        },
        'ja': {
            enter: 'ウェブページ全画面表示 (F)',
            exit: '全画面表示を終了 (F)',
            tooltip_enter: 'ウェブページ全画面表示',
            tooltip_exit: '全画面表示を終了',
            label_enter: 'ウェブページ全画面表示',

            autoplay_on: '▶️ 動画の自動再生がONになりました。',
            autoplay_off: '⏹️ 動画の自動再生がOFFになりました。',
            autoplay_loaded: '✅ スクリプト読込完了 | ALT+AでON/OFF',
        },
        'en': {
            enter: 'Web Fullscreen (F)',
            exit: 'Exit Fullscreen (F)',
            tooltip_enter: 'Web Fullscreen',
            tooltip_exit: 'Exit Fullscreen',
            label_enter: 'Web Fullscreen Display',

            autoplay_on: '▶️ Video autoplay is ON.',
            autoplay_off: '⏹️ Video autoplay is OFF.',
            autoplay_loaded: '✅ Script loaded | ALT+A to toggle',
        }
    };

    const currentText = texts[language];

    //広告要素の定義
    const adSelectors = [
        '.modal-backdrop',
        '.modal',
        '#ad-container',
        '.ad-wrapper',
        '.banner-ad',
        '.ads-here',
        '.popup-ad',
        '.video-player-ads',
        '.sidebar-ad-unit',
        '.floating-ad',

        '.space-y-6.mb-6',
        '.hidden.lg\\:block',

        'iframe[src*="myavlive.com"]',
        'iframe[src*="ad"]',
        'iframe[width="300"][height="250"]',
        'iframe',
        '.error-frame-container',
        '#iframe-wrapper'
    ];

    // --- CSSの定義と適用 ---

    const webFullscreenCSS = `
            /* === Web Fullscreen Mode Styles === */
            .web-fullscreen-active {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 2147483647 !important;
                margin: 0 !important;
                background-color: #000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            body.web-fullscreen-active-body {
                overflow: hidden !important;
            }

            .web-fullscreen-active > .aspect-w-16.aspect-h-9 {
                width: 100% !important;
                height: 100% !important;
                padding-bottom: 0 !important;
                position: relative !important;
            }

            .web-fullscreen-active .plyr {
                aspect-ratio: 16 / 9 !important;
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
                margin: auto !important;
                flex: none !important;
            }

            .web-fullscreen-active .plyr__video-wrapper,
            .web-fullscreen-active .plyr__video-wrapper video {
                width: 100% !important;
                height: 100% !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                object-fit: contain !important;
            }

            /* Web Fullscreen Button Style */
            .plyr__control[data-plyr="web-fullscreen"] {
                margin-left: 5px;
                margin-right: 5px;
                padding: 8px;
                background: none;
                border: none;
                cursor: pointer;
                color: currentColor;
            }

            /* Icon styling */
            .plyr__control[data-plyr="web-fullscreen"] svg {
                width: 18px;
                height: 18px;
                fill: currentColor;
                display: block;
            }

            .plyr__control[data-plyr="web-fullscreen"] .web-fullscreen-icon {
                fill: none;
                stroke: #fff;
                stroke-width: 2;
            }
        `;

    GM_addStyle(webFullscreenCSS);

    // ---  Web Fullscreen (Fキー) ロジック ---

    function toggleWebFullscreen(container, button) {
        const isWebFullscreen = container.hasClass('web-fullscreen-active');
        container.toggleClass('web-fullscreen-active');
        $('body').toggleClass('web-fullscreen-active-body');

        if (button.length) {
            button.attr('aria-pressed', !isWebFullscreen);
            button.attr('title', !isWebFullscreen ? currentText.exit : currentText.enter);
            button.attr('aria-label', !isWebFullscreen ? currentText.label_enter : currentText.label_enter);

            const tooltip = button.find('.plyr__tooltip');
            if (tooltip.length) {
                tooltip.text(!isWebFullscreen ? currentText.tooltip_exit : currentText.tooltip_enter);
            }
        }

        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }

    function addWebFullscreenButton() {
        const pipButton = $('button[data-plyr="pip"]');

        if (!pipButton.length || $('button[data-plyr="web-fullscreen"]').length) {
            return;
        }

        const webFullscreenButtonHTML = `
                <button class="plyr__controls__item plyr__control"
                        type="button"
                        data-plyr="web-fullscreen"
                        aria-label="${currentText.label_enter}"
                        title="${currentText.enter}">

                    <svg aria-hidden="true" focusable="false" role="presentation" viewBox="0 0 20 20">
                        <rect class="web-fullscreen-icon" x="1" y="4" width="18" height="12" rx="3" ry="3"/>
                    </svg>
                    <span class="plyr__tooltip">${currentText.tooltip_enter}</span>
                </button>
            `;

        const webFullscreenButton = $(webFullscreenButtonHTML);
        webFullscreenButton.insertAfter(pipButton);

        const playerContainer = $('.plyr--video');
        if (!playerContainer.length) {
            console.error('Plyr video container not found.');
            return;
        }

        // イベントリスナーを設定
        webFullscreenButton.on('click', function() {
            const rootContainer = playerContainer.closest('.relative');
            if (rootContainer.length) {
                toggleWebFullscreen(rootContainer, webFullscreenButton);
            }
        });

        // キーボードショートカット(Fフルスクリーン　ESC；退出)
        $(document).on('keydown.webfullscreen', function(e) {
            if (e.key === 'f' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                e.preventDefault();
                const rootContainer = playerContainer.closest('.relative');
                if (rootContainer.length && (rootContainer.is(':focus') || rootContainer.is(':hover') || $.contains(rootContainer[0], document.activeElement))) {
                    toggleWebFullscreen(rootContainer, webFullscreenButton);
                }
            }
            if (e.key === 'Escape') {
                const rootContainer = playerContainer.closest('.relative');
                if (rootContainer.hasClass('web-fullscreen-active')) {
                    e.preventDefault();
                    toggleWebFullscreen(rootContainer, webFullscreenButton, true);
                }
            }
        });
    }


    // --- Autoplay (Alt + A / Click) ロジック ---

    const playerContainerCheck = $('.plyr__poster'); // 動画ページかどうかのチェック
    if (playerContainerCheck.length === 0) return;

    let isAutoPlayEnabled = false;

    /**
         * 画面に通知メッセージを表示する関数 (jQuery版)
         */
    function showNotification(message, duration = 2000) {
        $('#video-autoplay-notifier').remove();

        const $notifier = $('<div>', {
            id: 'video-autoplay-notifier',
            text: message
        }).css({
            'position': 'fixed',
            'bottom': '10%',
            'left': '50%',
            'transform': 'translateX(-50%)',
            'padding': '50px 100px',
            'background-color': 'rgba(0, 0, 0, 0.7)',
            'color': 'white',
            'border-radius': '8px',
            'z-index': '99999',
            'font-size': '15px',
            'font-family': 'sans-serif',
            'opacity': '1',
            'transition': 'opacity 0.5s ease-out'
        });

        $notifier.appendTo('body').delay(duration).fadeOut(500, function() {
            $(this).remove();
        });
    }

    function startAutoPlay() {
        if (isAutoPlayEnabled) return;
        isAutoPlayEnabled = true;
        showNotification(currentText.autoplay_on);

        $('video').each(function() {
            const videoElement = this;

            if ($(videoElement).data('autoplay-listener-set')) {
                return;
            }

            if (videoElement.paused) {
                videoElement.play().catch(e => {});
            }

            $(videoElement).on('pause', function() {
                if (isAutoPlayEnabled) {
                    videoElement.play().catch(e => {});
                }
            });

            $(videoElement).on('error', function() {
                if (isAutoPlayEnabled) {
                    setTimeout(() => {
                        videoElement.load();
                        videoElement.play().catch(e => {});
                    }, 1000);
                }
            });

            $(videoElement).data('autoplay-listener-set', true);
        });
    }

    function stopAutoPlay() {
        if (!isAutoPlayEnabled) return;
        isAutoPlayEnabled = false;
        showNotification(currentText.autoplay_off);
    }

    // キーボードショートカット (Alt + A)
    $(window).on('keydown.autoplay', (event) => {
        if (event.altKey && event.key.toLowerCase() === 'a') {
            event.preventDefault();
            if (isAutoPlayEnabled) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        }
    });

    // 動画要素（plyrコンテナ）がクリックされたときに、自動再生をトグルする
    $('.plyr').on('click.autoplay', function(event) {
        if (isAutoPlayEnabled) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });

    // --- DOM構築を待つ & 初期化 ---
    // プレーヤーのDOM構築を待つ (MutationObserverはネイティブJSのまま使用)
    const observer = new MutationObserver((mutationsList, observer) => {
        if ($('.plyr__controls').length) {
            addWebFullscreenButton();
            observer.disconnect();

            // 最初のロード通知を表示
            showNotification(currentText.autoplay_loaded);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // --- 広告Remove ---
    adSelectors.forEach(selector => {
        const $elements = $(selector);
        if ($elements.length > 0) {
            $elements.remove();
        }
    });

})();