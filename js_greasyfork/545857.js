// ==UserScript==
// @name           テスト投稿用
// @version        0.33-fixed3
// @match          *://m.youtube.com/*
// @match          *://www.youtube.com/*
// @exclude        *://www.youtube.com/live_chat*
// @require        https://update.greasyfork.org/scripts/549881/1691982/YouTube%20Helper%20API.js
// @grant          none
// @run-at         document-start
// @inject-into    page
// @license        MIT
// @description    ipadsafariで使用出来る広告ブロックのテスト
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/545857/%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/545857/%E3%83%86%E3%82%B9%E3%83%88%E6%8A%95%E7%A8%BF%E7%94%A8.meta.js
// ==/UserScript==

(function () {

    const INITIAL_OVERLAY_BLOCK_TIME = 3000;
    let initialOverlayActive = true;
    let overlayReady = false;
    let overlayCreatedOnce = false;

    /* --------------------------------------------------------
     * ★ オーバーレイ生成（プレーヤー内部にのみ配置）
     * -------------------------------------------------------- */
    function createVideoOverlay() {
        if (overlayCreatedOnce) return;

        const overlayId = "yt-premium-lite-overlay";
        if (document.getElementById(overlayId)) return;

        const overlay = document.createElement("div");
        overlay.id = overlayId;
        overlay.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            z-index: 2001;
            background: black;
            pointer-events: none;
            opacity: 1;
            transition: opacity .25s ease, visibility .25s ease;
            display: block;
            visibility: visible;
        `;

        /* ★ プレーヤー内部に挿入（位置追従不要になる） */
        const tryInsert = () => {
            const player = document.querySelector(".html5-video-player");
            if (!player) return false;

            const controls = player.querySelector(".ytp-chrome-bottom");
            if (!controls) return false;

            player.insertBefore(overlay, controls);
            return true;
        };

        if (!tryInsert()) {
            const observer = new MutationObserver(() => {
                if (tryInsert()) observer.disconnect();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }

        overlayReady = true;
        overlayCreatedOnce = true;
    }

    /* --------------------------------------------------------
     * ★（削除済み）位置調整はすべて不要のため空処理
     * -------------------------------------------------------- */
    function updateOverlayPositionOnce() {}
    function trackOverlayPosition() {}

    /* --------------------------------------------------------
     * ★ 不要な復活イベント削除済み
     * -------------------------------------------------------- */

    /* --------------------------------------------------------
     * オーバーレイ表示・非表示
     * -------------------------------------------------------- */
    function showVideoOverlay() {
        const overlay = document.getElementById("yt-premium-lite-overlay");
        if (!overlay) return;
        overlay.style.display = "block";
        overlay.style.visibility = "visible";
        requestAnimationFrame(() => overlay.style.opacity = "1");
    }

    function hideVideoOverlay() {
        if (initialOverlayActive) return;
        const overlay = document.getElementById("yt-premium-lite-overlay");
        if (!overlay) return;

        overlay.style.opacity = "0";
        const handler = () => {
            if (overlay.style.opacity === "0") {
                overlay.style.visibility = "hidden";
                overlay.style.display = "none";
            }
            overlay.removeEventListener("transitionend", handler);
        };
        overlay.addEventListener("transitionend", handler);

        setTimeout(() => {
            if (overlay.style.opacity === "0") {
                overlay.style.visibility = "hidden";
                overlay.style.display = "none";
            }
        }, 500);
    }

    /* --------------------------------------------------------
     * ★ プレーヤー変化監視（位置更新はもう不要）
     * -------------------------------------------------------- */
    function observePlayerChanges() {
        const observer = new MutationObserver(() => {
            if (overlayReady) {
                // 位置更新は不要
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /* ------------------（以下は要求通り全てそのまま）------------------ */

    function setAdBlockingStyles() {
        const promoRefuserCss = `
            #ad-created,
            .player-ads,
            #ytd-in-feed-ad-layout-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer,
            ytd-ad-slot-renderer,
            ytd-rich-item-renderer:has(ytd-ad-slot-renderer):not([is-in-first-column]),
            yt-mealbar-promo-renderer,
            ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads'],
            ytd-player-legacy-desktop-watch-ads-renderer,
            ytd-single-option-survey-renderer,
            .video-ads.ytp-ad-module,
            .html5-video-player.ad-showing video,
            .html5-video-player.ad-interrupting video,
            .ytp-ad-persistent-progress-bar-container,
            .ytp-ad-persistent-progress-bar,
            .ad-interrupting .ytp-play-progress.ytp-swatch-background-color {
                display: none !important;
            }

            ytd-rich-item-renderer:has(ytd-ad-slot-renderer)[is-in-first-column] {
                display: unset !important;
                width: 16px !important;
                padding: 0 !important;
                margin: 0 !important;
            }
        `;
        const promoRefuserStyleNode = document.createElement('style');
        promoRefuserStyleNode.textContent = promoRefuserCss;
        document.head.appendChild(promoRefuserStyleNode);
    }

    function fixHomepageLayout() {
        if (window.location.pathname !== '/') return;
        try {
            const adRenderers = document.querySelectorAll('ytd-rich-item-renderer:has(ytd-ad-slot-renderer)');
            if (adRenderers.length === 0) return;
            const rendererParent = adRenderers[0].parentElement;
            const rowLength = parseInt(adRenderers[0].getAttribute('items-per-row'), 10);
            if (!rowLength) throw new Error('Row length cannot be determined.');
            const allRenderers = Array.from(rendererParent.children);
            const blockingRenderers = allRenderers.filter((renderer) => renderer?.querySelector('ytd-rich-shelf-renderer'));

            let processedRenderers = 0;
            blockingRenderers.forEach((blockingRenderer) => {
                let blockingRendererElementIndex = allRenderers.indexOf(blockingRenderer);
                let hiddenAdRenderers = 0;
                adRenderers.forEach((adRenderer) => {
                    const adRendererElementIndex = allRenderers.indexOf(adRenderer);
                    if (blockingRendererElementIndex > adRendererElementIndex) hiddenAdRenderers++;
                });

                blockingRendererElementIndex = blockingRendererElementIndex - processedRenderers - hiddenAdRenderers + 1;
                for (let i = 0; i <= rowLength; i++) {
                    const itemsToMove = (rowLength - ((blockingRendererElementIndex - 1) % rowLength)) % rowLength;
                    if (itemsToMove <= 0) break;
                    const elementsToMove = [];
                    let currentElement = blockingRenderer.nextElementSibling;
                    for (let i = 0; i < itemsToMove && currentElement; i++) {
                        elementsToMove.push(currentElement);
                        currentElement = currentElement.nextElementSibling;
                    }
                    if (elementsToMove.length > 0) {
                        elementsToMove.forEach((element) => {
                            rendererParent.insertBefore(element, blockingRenderer);
                        });
                    }
                    break;
                }
                if (processedRenderers < blockingRenderers.length) processedRenderers++;
            });
        } catch (error) {
            console.error('Error in setHomePageMagic:', error);
        }
    }

    function skipAd() {
        console.log('Found ad. Skipping...');
        showVideoOverlay();

        fakePageInactive(true);
        window.youtubeHelperApi.video.isCurrentlyLive
            ? window.youtubeHelperApi.reloadVideo()
            : window.youtubeHelperApi.reloadToCurrentProgress();

        setTimeout(() => {
            fakePageInactive(false);
            hideVideoOverlay();
        }, 200);
    }

    function fakePageInactive(shouldBeInactive) {
        if (shouldBeInactive) {
            document.hasFocus = () => false;
            Object.defineProperty(document, 'hidden', { value: true, configurable: true });
            Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
            window.dispatchEvent(new Event('blur'));
            document.dispatchEvent(new Event('visibilitychange'));
        } else {
            document.hasFocus = window.pageActivityOriginals.hasFocus;
            Object.defineProperty(document, 'hidden', window.pageActivityOriginals.hidden);
            Object.defineProperty(document, 'visibilityState', window.pageActivityOriginals.visibilityState);
            window.dispatchEvent(new Event('focus'));
            document.dispatchEvent(new Event('visibilitychange'));
        }
    }

    function debounce(func, delay) {
        let timer = null;
        return function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(
                function (...args) {
                    func.apply(this, args);
                }.bind(this),
                delay,
            );
        };
    }

    function handleWindowResize() {
        debounce(fixHomepageLayout, 150);
    }

    function storeBrowserVisibilityFunctions() {
        if (!window.pageActivityOriginals) {
            window.pageActivityOriginals = {
                hasFocus: document.hasFocus,
                hidden: Object.getOwnPropertyDescriptor(Document.prototype, 'hidden'),
                visibilityState: Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState'),
            };
        }
    }

    function initialize() {
        storeBrowserVisibilityFunctions();

        createVideoOverlay();
        showVideoOverlay();

        setTimeout(() => {
            initialOverlayActive = false;
            hideVideoOverlay();
        }, INITIAL_OVERLAY_BLOCK_TIME);

        setAdBlockingStyles();
        fixHomepageLayout();

        document.addEventListener('yt-text-inline-expander-expanded-changed', fixHomepageLayout);
        document.addEventListener('yt-request-elements-per-row', fixHomepageLayout);
        document.addEventListener('resize', handleWindowResize);

        window.youtubeHelperApi.eventTarget.addEventListener('yt-helper-api-ad-detected', skipAd);

        document.addEventListener("play", () => hideVideoOverlay(), true);

        observePlayerChanges();
    }

    createVideoOverlay();
    showVideoOverlay();

    initialize();
})();
