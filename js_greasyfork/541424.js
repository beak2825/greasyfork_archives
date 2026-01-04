// ==UserScript==
// @name                    YouTube Premium Lite² (AdBlocker) [Beta]
// @name:zh-TW              YouTube Premium Lite² (擋廣告) [Beta 測試版]
// @name:zh-CN              YouTube Premium Lite² (去广告) [Beta 测试版]
// @name:ja                 YouTube Premium Lite² (広告ブロック) [ベータ版]
// @icon                    https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author                  ElectroKnight22
// @namespace               electroknight22_youtube_premium_lite_squared_namespace
// @version                 0.5.2.2
// @match                   *://m.youtube.com/*
// @match                   *://www.youtube.com/*
// @exclude                 *://www.youtube.com/live_chat*
// @require                 https://update.greasyfork.org/scripts/549881/1717291/YouTube%20Helper%20API.js
// @grant                   none
// @run-at                  document-idle
// @inject-into             page
// @license                 MIT
// @description             Have you ever wanted Premium but think that the real thing is too good? Worry not, this script replaces the loser normal logo with the premium one AND blocks ads on top, tricking you and your friends into thinking you are richer than you really are. Currently still testing so functionality may be rough or incomplete in some places. Please be understanding.
// @description:zh-TW       是否曾渴望擁有 Premium，卻又覺得正版太過美好？別擔心，這個腳本會將那魯蛇般的普通標誌替換為 Premium 圖示，還能順便擋掉廣告，讓你和你的朋友們誤以為你比實際上更有錢。目前仍在測試階段，因此部分功能可能會不穩定或不完整，請多見諒。
// @description:zh-CN       是否曾渴望拥有 Premium，却又觉得正版太过美好？别担心，这个脚本会将那有些寒酸的普通标志替换为 Premium 图标，还能顺便挡掉广告，让你和你的朋友们误以为你比实际上更有钱。目前仍在测试阶段，因此部分功能可能会不稳定或不完整，请多见谅。
// @description:ja          Premium が欲しいけど、本物は立派すぎて手が出せないと思ったことはありませんか？ご心配なく。このスクリリプトは、あの負け犬っぽい普通のロゴを Premium のロゴに置き換え、さらに広告もブロックし、あなたや友達に「実は金持ちなんじゃないか」と勘違いさせることができます。現在まだテスト中のため、一部の機能が不安定であったり、不完全な場合があります。ご了承ください。
// @downloadURL https://update.greasyfork.org/scripts/541424/YouTube%20Premium%20Lite%C2%B2%20%28AdBlocker%29%20%5BBeta%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/541424/YouTube%20Premium%20Lite%C2%B2%20%28AdBlocker%29%20%5BBeta%5D.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

(function () {
    const api = youtubeHelperApi;
    if (!api) return;

    // api.debug.enabled = true;
    // api.debug.level = 'detailed';

    let state = {
        isFixing: false,
        container: null,
        observer: null,
        forceFullRecalc: false,
    };

    function setPremiumLogo() {
        const logoLight =
            "data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' viewBox='0 0 846 174' height='80px' width='391px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23ff0000' id='path6' d='M 242.88,27.11 A 31.07,31.07 0 0 0 220.95,5.18 C 201.6,0 124,0 124,0 124,0 46.46,0 27.11,5.18 A 31.07,31.07 0 0 0 5.18,27.11 C 0,46.46 0,86.82 0,86.82 c 0,0 0,40.36 5.18,59.71 a 31.07,31.07 0 0 0 21.93,21.93 c 19.35,5.18 96.92,5.18 96.92,5.18 0,0 77.57,0 96.92,-5.18 a 31.07,31.07 0 0 0 21.93,-21.93 c 5.18,-19.35 5.18,-59.71 5.18,-59.71 0,0 0,-40.36 -5.18,-59.71 z' /%3E%3Cpath style='fill:%23ffffff' id='path8' d='M 99.22,124.03 163.67,86.82 99.22,49.61 Z' /%3E%3Cpath style='fill:%23282828' id='path10' d='m 358.29,55.1 v 6 c 0,30 -13.3,47.53 -42.39,47.53 h -4.43 v 52.5 H 287.71 V 12.36 H 318 c 27.7,0 40.29,11.71 40.29,42.74 z m -25,2.13 c 0,-21.64 -3.9,-26.78 -17.38,-26.78 h -4.43 v 60.48 h 4.08 c 12.77,0 17.74,-9.22 17.74,-29.26 z m 81.22,-6.56 -1.24,28.2 c -10.11,-2.13 -18.45,-0.53 -22.17,6 v 76.26 H 367.52 V 52.44 h 18.8 L 388.45,76 h 0.89 c 2.48,-17.2 10.46,-25.89 20.75,-25.89 a 22.84,22.84 0 0 1 4.42,0.56 z M 441.64,115 v 5.5 c 0,19.16 1.06,25.72 9.22,25.72 7.8,0 9.58,-6 9.75,-18.44 l 21.1,1.24 c 1.6,23.41 -10.64,33.87 -31.39,33.87 -25.18,0 -32.63,-16.49 -32.63,-46.46 v -19 c 0,-31.57 8.34,-47 33.34,-47 25.18,0 31.57,13.12 31.57,45.93 V 115 Z m 0,-22.35 v 7.8 h 17.91 V 92.7 c 0,-20 -1.42,-25.72 -9,-25.72 -7.58,0 -8.91,5.86 -8.91,25.72 z M 604.45,79 v 82.11 H 580 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8.16,2.48 -10.82,7.09 a 35.59,35.59 0 0 1 0.18,4.43 v 82.11 H 537.24 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8,2.48 -10.64,6.92 v 86.72 H 494.5 V 52.44 h 19.33 L 516,66.28 h 0.35 c 5.5,-10.46 14.37,-16.14 24.83,-16.14 10.29,0 16.14,5.14 18.8,14.37 5.68,-9.4 14.19,-14.37 23.94,-14.37 14.86,0 20.53,10.64 20.53,28.86 z m 12.24,-54.4 c 0,-11.71 4.26,-15.07 13.3,-15.07 9.22,0 13.3,3.9 13.3,15.07 0,12.06 -4.08,15.08 -13.3,15.08 -9.04,-0.01 -13.3,-3.02 -13.3,-15.08 z m 1.42,27.84 h 23.41 v 108.72 h -23.41 z m 103.39,0 v 108.72 h -19.15 l -2.13,-13.3 h -0.53 c -5.5,10.64 -13.48,15.07 -23.41,15.07 -14.54,0 -21.11,-9.22 -21.11,-29.26 V 52.44 h 24.47 v 79.81 c 0,9.58 2,13.48 6.92,13.48 A 12.09,12.09 0 0 0 697,138.81 V 52.44 Z M 845.64,79 v 82.11 H 821.17 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8.16,2.48 -10.82,7.09 A 35.59,35.59 0 0 1 802.9,79 v 82.11 H 778.43 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8,2.48 -10.64,6.92 v 86.72 H 735.69 V 52.44 H 755 l 2.13,13.83 h 0.35 c 5.5,-10.46 14.37,-16.14 24.83,-16.14 10.29,0 16.14,5.14 18.8,14.37 5.68,-9.4 14.19,-14.37 23.94,-14.37 14.95,0.01 20.59,10.65 20.59,28.87 z' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A";

        const logoDark =
            "data:image/svg+xml,%3Csvg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns%23' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns%23' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' id='SVGRoot' version='1.1' viewBox='0 0 846 174' height='24px' width='98px'%3E%3Cdefs id='defs855'%3E%3Cstyle id='style2' /%3E%3C/defs%3E%3Cmetadata id='metadata858'%3E%3Crdf:RDF%3E%3Ccc:Work rdf:about=''%3E%3Cdc:format%3Eimage/svg+xml%3C/dc:format%3E%3Cdc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage' /%3E%3Cdc:title%3E%3C/dc:title%3E%3C/cc:Work%3E%3C/rdf:RDF%3E%3C/metadata%3E%3Cg id='layer1'%3E%3Cg transform='translate(0,0.36)' data-name='Layer 2' id='Layer_2'%3E%3Cg data-name='Layer 1' id='Layer_1-2'%3E%3Cpath style='fill:%23ff0000' id='path6' d='M 242.88,27.11 A 31.07,31.07 0 0 0 220.95,5.18 C 201.6,0 124,0 124,0 124,0 46.46,0 27.11,5.18 A 31.07,31.07 0 0 0 5.18,27.11 C 0,46.46 0,86.82 0,86.82 c 0,0 0,40.36 5.18,59.71 a 31.07,31.07 0 0 0 21.93,21.93 c 19.35,5.18 96.92,5.18 96.92,5.18 0,0 77.57,0 96.92,-5.18 a 31.07,31.07 0 0 0 21.93,-21.93 c 5.18,-19.35 5.18,-59.71 5.18,-59.71 0,0 0,-40.36 -5.18,-59.71 z' /%3E%3Cpath style='fill:%23ffffff' id='path8' d='M 99.22,124.03 163.67,86.82 99.22,49.61 Z' /%3E%3Cpath style='fill:%23ffffff' id='path10' d='m 358.29,55.1 v 6 c 0,30 -13.3,47.53 -42.39,47.53 h -4.43 v 52.5 H 287.71 V 12.36 H 318 c 27.7,0 40.29,11.71 40.29,42.74 z m -25,2.13 c 0,-21.64 -3.9,-26.78 -17.38,-26.78 h -4.43 v 60.48 h 4.08 c 12.77,0 17.74,-9.22 17.74,-29.26 z m 81.22,-6.56 -1.24,28.2 c -10.11,-2.13 -18.45,-0.53 -22.17,6 v 76.26 H 367.52 V 52.44 h 18.8 L 388.45,76 h 0.89 c 2.48,-17.2 10.46,-25.89 20.75,-25.89 a 22.84,22.84 0 0 1 4.42,0.56 z M 441.64,115 v 5.5 c 0,19.16 1.06,25.72 9.22,25.72 7.8,0 9.58,-6 9.75,-18.44 l 21.1,1.24 c 1.6,23.41 -10.64,33.87 -31.39,33.87 -25.18,0 -32.63,-16.49 -32.63,-46.46 v -19 c 0,-31.57 8.34,-47 33.34,-47 25.18,0 31.57,13.12 31.57,45.93 V 115 Z m 0,-22.35 v 7.8 h 17.91 V 92.7 c 0,-20 -1.42,-25.72 -9,-25.72 -7.58,0 -8.91,5.86 -8.91,25.72 z M 604.45,79 v 82.11 H 580 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8.16,2.48 -10.82,7.09 a 35.59,35.59 0 0 1 0.18,4.43 v 82.11 H 537.24 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8,2.48 -10.64,6.92 v 86.72 H 494.5 V 52.44 h 19.33 L 516,66.28 h 0.35 c 5.5,-10.46 14.37,-16.14 24.83,-16.14 10.29,0 16.14,5.14 18.8,14.37 5.68,-9.4 14.19,-14.37 23.94,-14.37 14.86,0 20.53,10.64 20.53,28.86 z m 12.24,-54.4 c 0,-11.71 4.26,-15.07 13.3,-15.07 9.22,0 13.3,3.9 13.3,15.07 0,12.06 -4.08,15.08 -13.3,15.08 -9.04,-0.01 -13.3,-3.02 -13.3,-15.08 z m 1.42,27.84 h 23.41 v 108.72 h -23.41 z m 103.39,0 v 108.72 h -19.15 l -2.13,-13.3 h -0.53 c -5.5,10.64 -13.48,15.07 -23.41,15.07 -14.54,0 -21.11,-9.22 -21.11,-29.26 V 52.44 h 24.47 v 79.81 c 0,9.58 2,13.48 6.92,13.48 A 12.09,12.09 0 0 0 697,138.81 V 52.44 Z M 845.64,79 v 82.11 H 821.17 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8.16,2.48 -10.82,7.09 A 35.59,35.59 0 0 1 802.9,79 v 82.11 H 778.43 V 80.82 c 0,-8.87 -2.31,-13.3 -7.63,-13.3 -4.26,0 -8,2.48 -10.64,6.92 v 86.72 H 735.69 V 52.44 H 755 l 2.13,13.83 h 0.35 c 5.5,-10.46 14.37,-16.14 24.83,-16.14 10.29,0 16.14,5.14 18.8,14.37 5.68,-9.4 14.19,-14.37 23.94,-14.37 14.95,0.01 20.59,10.65 20.59,28.87 z' /%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A";

        const premiumLogoCss = `
            :root {
                --logo-light-theme: url("${logoLight}");
                --logo-dark-theme: url("${logoDark}");
            }

            #logo-container .logo,
            .footer-logo-icon,
            #logo-icon,
            #logo-icon-container {
                width: 98px !important;
                content: var(--logo-light-theme) !important;
            }

            html[dark] #logo-icon,
            html[dark] #logo-icon-container {
                content: var(--logo-dark-theme) !important;
            }
        `;

        const premiumLogoStyleNode = document.createElement('style');
        premiumLogoStyleNode.textContent = premiumLogoCss;
        document.head.appendChild(premiumLogoStyleNode);
    }

    function setAdBlockingStyles() {
        const promoRefuserCss = `
            #ad-created,
            .player-ads,
            #ytd-in-feed-ad-layout-renderer,
            ytd-in-feed-ad-layout-renderer,
            ytd-banner-promo-renderer,
            ytd-ad-slot-renderer,
            ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
            ytd-rich-item-renderer:has(ytd-in-feed-ad-layout-renderer),
            .ytd-ad-slot-renderer,
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
        `;

        const promoRefuserStyleNode = document.createElement('style');
        promoRefuserStyleNode.textContent = promoRefuserCss;
        document.head.appendChild(promoRefuserStyleNode);
    }

    function setCustomGridStyles() {
        const gridCss = `
            ytd-rich-item-renderer[rendered-from-rich-grid][is-in-first-column] {
                margin-left: calc(var(--ytd-rich-grid-item-margin) / 2) !important;
            }
            ytd-rich-item-renderer[rendered-from-rich-grid][data-is-first-col="true"] {
                margin-left: calc(var(--ytd-rich-grid-item-margin) / 2 + var(--ytd-rich-grid-gutter-margin)) !important;
            }
            ytd-rich-grid-renderer ytd-continuation-item-renderer {
                transform: translateY(-1500px);
                pointer-events: none;
                opacity: 0;
            }
        `;
        const styleNode = document.createElement('style');
        styleNode.textContent = gridCss;
        document.head.appendChild(styleNode);
    }

    function invalidateCache() {
        if (state.observer) {
            state.observer.disconnect();
            state.observer = null;
        }
        state.container = null;
    }

    function isNodeVisible(node) {
        return node.offsetWidth > 0 && node.offsetHeight > 0 && getComputedStyle(node).display !== 'none';
    }

    function fixHomepageLayout() {
        if (window.location.pathname !== '/') return;
        if (state.isFixing) return;

        try {
            state.isFixing = true;

            if (!state.container || !state.container.isConnected) {
                const beacon = document.querySelector('ytd-rich-item-renderer');
                if (!beacon) return (state.isFixing = false);
                state.container = beacon.parentElement;

                state.observer = new MutationObserver(() => {
                    if (!state.isFixing) runLayoutFix();
                });
                state.observer.observe(state.container, { childList: true });
            }

            const beacon = state.container.querySelector('ytd-rich-item-renderer');
            if (!beacon) return (state.isFixing = false);

            const rawItemsPerRow = beacon.getAttribute('items-per-row') || beacon.style.getPropertyValue('--ytd-rich-grid-items-per-row');
            const itemsPerRow = parseInt(rawItemsPerRow, 10);

            if (!itemsPerRow || isNaN(itemsPerRow)) return (state.isFixing = false);

            const shelves = Array.from(state.container.querySelectorAll('ytd-rich-section-renderer'));

            shelves.forEach((shelf) => {
                const rect = shelf.getBoundingClientRect();

                if (!state.forceFullRecalc && rect.bottom < -500) return;

                let visibleCount = 0;
                let sibling = shelf.previousElementSibling;

                while (sibling) {
                    if (sibling.tagName.toLowerCase() === 'ytd-rich-section-renderer') break;
                    if (sibling.tagName.toLowerCase() === 'ytd-rich-item-renderer' && isNodeVisible(sibling)) {
                        visibleCount++;
                    }
                    sibling = sibling.previousElementSibling;
                }

                const remainder = visibleCount % itemsPerRow;
                const needed = remainder === 0 ? 0 : itemsPerRow - remainder;

                if (needed > 0) {
                    const itemsToMove = [];
                    let candidate = shelf.nextElementSibling;
                    let guard = 0;

                    while (candidate && itemsToMove.length < needed && guard < 50) {
                        guard++;
                        const isShelf = candidate.tagName.toLowerCase() === 'ytd-rich-section-renderer';
                        const isItem = candidate.tagName.toLowerCase() === 'ytd-rich-item-renderer';

                        if (isShelf) break;
                        if (!candidate.nextElementSibling && !isShelf) break;

                        if (isItem && isNodeVisible(candidate)) itemsToMove.push(candidate);
                        candidate = candidate.nextElementSibling;
                    }

                    if (itemsToMove.length > 0) {
                        itemsToMove.forEach((item) => state.container.insertBefore(item, shelf));
                    }
                }
            });

            const children = state.container.children;
            const updates = [];

            let visualColumn = 0;

            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                const tagName = child.tagName.toLowerCase();

                if (!isNodeVisible(child)) continue;

                if (tagName === 'ytd-rich-section-renderer') {
                    if (visualColumn > 0) visualColumn = 0;
                    continue;
                }

                if (tagName === 'ytd-rich-item-renderer') {
                    const isFirstColumn = visualColumn === 0;
                    const currentlyFirst = child.getAttribute('data-is-first-col') === 'true';

                    if (isFirstColumn && !currentlyFirst) {
                        updates.push({ node: child, val: 'true' });
                    } else if (!isFirstColumn && currentlyFirst) {
                        updates.push({ node: child, val: 'false' });
                    }

                    visualColumn++;
                    if (visualColumn >= itemsPerRow) visualColumn = 0;
                }
            }

            for (const update of updates) {
                if (update.val === 'true') {
                    update.node.setAttribute('data-is-first-col', 'true');
                } else {
                    update.node.removeAttribute('data-is-first-col');
                }
            }
        } catch (error) {
            console.error('[YouTube Premium Lite²] Layout Fix Error:', error);
        } finally {
            state.isFixing = false;
            state.forceFullRecalc = false;
        }
    }

    const runLayoutFix = debounce(fixHomepageLayout, 50);

    let visibilityLock = 0;
    function fakePageInactive(isInactive) {
        if (isInactive) {
            if (++visibilityLock > 1) return;
            document.hasFocus = () => false;
            Object.defineProperty(document, 'hidden', { value: true, configurable: true, writable: true });
            Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true, writable: true });
            window.dispatchEvent(new Event('blur'));
            document.dispatchEvent(new Event('visibilitychange'));
        } else {
            if (--visibilityLock > 0) return;
            document.hasFocus = window.pageActivityOriginals.hasFocus;
            delete document.hidden;
            delete document.visibilityState;
            window.dispatchEvent(new Event('focus'));
            document.dispatchEvent(new Event('visibilitychange'));
        }
    }

    function skipAd() {
        console.log('Detected ad. Skipping...');
        const triggerAdSkip = () => {
            api.video.isCurrentlyLive ? api.reloadVideo() : api.reloadToCurrentProgress();
        };
        fakePageInactive(true);
        queueMicrotask(triggerAdSkip);
        setTimeout(() => fakePageInactive(false), 200);
    }

    function debounce(func, delay) {
        let timer = null;
        return function () {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    function handleWindowResize() {
        state.forceFullRecalc = true;
        runLayoutFix();
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
        setPremiumLogo();
        setAdBlockingStyles();
        setCustomGridStyles();
        fixHomepageLayout();
        document.addEventListener('yt-navigate-finish', invalidateCache);
        document.addEventListener('yt-text-inline-expander-expanded-changed', runLayoutFix);
        document.addEventListener('yt-request-elements-per-row', handleWindowResize);
        document.addEventListener('resize', handleWindowResize);
        document.addEventListener('onAdStart', () => console.log('test native ad start event'));
        api.eventTarget.addEventListener('yt-helper-api-ad-detected', skipAd);
    }

    initialize();
})();
