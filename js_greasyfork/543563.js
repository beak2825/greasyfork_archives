// ==UserScript==
// @name         MissAV PLUS
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description   Adds a Web Fullscreen button, enables Alt+A/Click autoplay toggle, 2x preview zoom, shows full titles and remove ads.
// @description:ja ウェブ全画面表示ボタンを追加、Alt+A/クリックによる自動再生トグル、レビュー2倍拡大、タイトル全表示、広告非表示。
// @description:zh 添加网页全屏按钮，启用Alt+A/点击切换自动播放，预览画面2倍放大，并显示完整标题，去除广告。
// @author       Nabbit
// @match        https://missav.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end
// @license      Nabbit
// @downloadURL https://update.greasyfork.org/scripts/543563/MissAV%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/543563/MissAV%20PLUS.meta.js
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
            enter: '网页全屏 (F)', exit: '退出全屏 (F)', tooltip_enter: '网页全屏', tooltip_exit: '退出全屏', label_enter: '网页全屏显示',
            autoplay_on: '▶️ 视频自动播放已开启。', autoplay_off: '⏹️ 视频自动播放已关闭。', autoplay_loaded: '✅ 脚本已加载 | ALT+A 切换',
        },
        'ja': {
            enter: 'ウェブページ全画面表示 (F)', exit: '全画面表示を終了 (F)', tooltip_enter: 'ウェブページ全画面表示', tooltip_exit: '全画面表示を終了', label_enter: 'ウェブページ全画面表示',
            autoplay_on: '▶️ 動画の自動再生がONになりました。', autoplay_off: '⏹️ 動画の自動再生がOFFになりました。', autoplay_loaded: '✅ スクリプト読込完了 | ALT+AでON/OFF',
        },
        'en': {
            enter: 'Web Fullscreen (F)', exit: 'Exit Fullscreen (F)', tooltip_enter: 'Web Fullscreen', tooltip_exit: 'Exit Fullscreen', label_enter: 'Web Fullscreen Display',
            autoplay_on: '▶️ Video autoplay is ON.', autoplay_off: '⏹️ Video autoplay is OFF.', autoplay_loaded: '✅ Script loaded | ALT+A to toggle',
        }
    };
    const currentText = texts[language];

    const adSelectors = [
        '.modal-backdrop', '.modal', '#ad-container', '.ad-wrapper', '.banner-ad', '.ads-here', '.popup-ad', '.video-player-ads', '.sidebar-ad-unit', '.floating-ad',
        '.space-y-6.mb-6', '.hidden.lg\\:block', 'iframe[src*="myavlive.com"]', 'iframe[src*="ad"]', 'iframe[width="300"][height="250"]', 'iframe', '.error-frame-container', '#iframe-wrapper'
    ];

    const webFullscreenCSS = `
        .web-fullscreen-active { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; margin: 0 !important; background-color: #000; display: flex; align-items: center; justify-content: center; }
        body.web-fullscreen-active-body { overflow: hidden !important; }
        .web-fullscreen-active > .aspect-w-16.aspect-h-9 { width: 100% !important; height: 100% !important; padding-bottom: 0 !important; position: relative !important; }
        .web-fullscreen-active .plyr { aspect-ratio: 16 / 9 !important; width: 100% !important; height: 100% !important; object-fit: contain !important; margin: auto !important; flex: none !important; }
        .web-fullscreen-active .plyr__video-wrapper, .web-fullscreen-active .plyr__video-wrapper video { width: 100% !important; height: 100% !important; position: absolute !important; top: 0 !important; left: 0 !important; object-fit: contain !important; }
        .plyr__control[data-plyr="web-fullscreen"] { margin-left: 5px; margin-right: 5px; padding: 8px; background: none; border: none; cursor: pointer; color: currentColor; }
        .plyr__control[data-plyr="web-fullscreen"] svg { width: 18px; height: 18px; fill: currentColor; display: block; }
        .plyr__control[data-plyr="web-fullscreen"] .web-fullscreen-icon { fill: none; stroke: #fff; stroke-width: 2; }
    `;
    GM_addStyle(webFullscreenCSS);

    // --- タイトル全表示関数 ---
    function expandAllTitles() {
        $('.text-nord4.truncate').removeClass('truncate').css({
            'white-space': 'normal',
            'overflow': 'visible',
            'text-overflow': 'clip'
        });

       $('.max-h-14.overflow-y-hidden').removeClass('max-h-14 overflow-y-hidden').css({
            'max-height': 'none',
            'overflow': 'visible'
        });

        $('a[x-text="item.full_title"]').css({
            'display': 'block',
            'word-break': 'break-all'
        });
    }

    // --- プレビュー拡大  ---
    $(document).on('mouseenter', '.thumbnail.group > div:first-child', function() {
        const $target = $(this);
        const $parent = $target.parent();

        $parent.parents().addBack().css('overflow', 'visible');

        $target.css({
            'transform': 'scale(2)',
            'transition': 'transform 0.3s ease',
            'z-index': '9999',
            'position': 'relative'
        });
        $parent.css('z-index', '9999');

    }).on('mouseleave', '.thumbnail.group > div:first-child', function() {
        const $target = $(this);
        const $parent = $target.parent();

        $target.css({ 'transform': 'scale(1)', 'z-index': '' });
        $parent.css('z-index', '');

        $parent.parents().addBack().css('overflow', '');
    });

    // --- Web Fullscreen ロジック ---
    function toggleWebFullscreen(container, button) {
        const isWebFullscreen = container.hasClass('web-fullscreen-active');
        container.toggleClass('web-fullscreen-active');
        $('body').toggleClass('web-fullscreen-active-body');

        if (button && button.length) {
            button.attr('aria-pressed', !isWebFullscreen);
            button.attr('title', !isWebFullscreen ? currentText.exit : currentText.enter);
            const tooltip = button.find('.plyr__tooltip');
            if (tooltip.length) tooltip.text(!isWebFullscreen ? currentText.tooltip_exit : currentText.tooltip_enter);
        }
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }

    function addWebFullscreenButton() {
        const pipButton = $('button[data-plyr="pip"]');
        if (!pipButton.length || $('button[data-plyr="web-fullscreen"]').length) return;

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
        webFullscreenButton.on('click', function() {
            const rootContainer = playerContainer.closest('.relative');
            if (rootContainer.length) toggleWebFullscreen(rootContainer, webFullscreenButton);
        });
    }

    // --- Autoplay ロジック ---
    let isAutoPlayEnabled = false;
    function showNotification(message, duration = 2000) {
        $('#video-autoplay-notifier').remove();
        $('<div>', {
            id: 'video-autoplay-notifier',
            text: message
        })
            .css({
            'position': 'fixed',
            'bottom': '10%',
            'left': '50%',
            'transform': 'translateX(-50%)',
            'padding': '20px 40px',
            'background-color': 'rgba(0, 0, 0, 0.7)',
            'color': 'white',
            'border-radius': '8px',
            'z-index': '99999',
            'font-size': '15px',
            'pointer-events': 'none'
        })
            .appendTo('body')
            .delay(duration)
            .fadeOut(500, function() {
            $(this).remove();
        });
    }

    function startAutoPlay() {
        if (isAutoPlayEnabled) return;
        isAutoPlayEnabled = true;
        showNotification(currentText.autoplay_on);
        $('video').each(function() {
            const v = this;
            if ($(v).data('autoplay-listener-set')) return;
            if (v.paused) v.play().catch(() => {});
            $(v).on('pause', () => { if (isAutoPlayEnabled) v.play().catch(() => {}); });
            $(v).data('autoplay-listener-set', true);
        });
    }

    function stopAutoPlay() { isAutoPlayEnabled = false; showNotification(currentText.autoplay_off); }

    $(window).on('keydown.autoplay', (e) => { if (e.altKey && e.key.toLowerCase() === 'a') { e.preventDefault(); isAutoPlayEnabled ? stopAutoPlay() : startAutoPlay(); } });
    $('.plyr').on('click.autoplay', function(e) { if ($(e.target).closest('.plyr__controls').length) return; isAutoPlayEnabled ? stopAutoPlay() : startAutoPlay(); });

    // --- 初期化 & 監視 (動的要素対応) ---
    const observer = new MutationObserver(() => {
        // 広告削除
        adSelectors.forEach(s => $(s).remove());
        // タイトル全表示の再適用
        expandAllTitles();
        // プレイヤーボタンの追加
        if ($('.plyr__controls').length && !$('button[data-plyr="web-fullscreen"]').length) {
            addWebFullscreenButton();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初回実行
    expandAllTitles();
    adSelectors.forEach(s => $(s).remove());

})();