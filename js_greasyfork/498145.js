// ==UserScript==
// @name                YouTube HD Premium
// @name:zh-TW          YouTube HD Premium
// @name:zh-CN          YouTube HD Premium
// @name:ja             YouTube HD Premium
// @icon                https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author              ElectroKnight22
// @namespace           electroknight22_youtube_hd_namespace
// @version             2026.01.14
// @match               *://www.youtube.com/*
// @match               *://m.youtube.com/*
// @match               *://www.youtube-nocookie.com/*
// @exclude             *://www.youtube.com/live_chat*
// @require             https://update.greasyfork.org/scripts/549881/1733676/YouTube%20Helper%20API.js
// @grant               GM.getValuez
// @grant               GM.setValue
// @grant               GM.deleteValue
// @grant               GM.listValues
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_listValues
// @run-at              document-idle
// @inject-into         page
// @license             MIT
// @description         Automatically switches to your pre-selected resolution. Enables premium when possible.
// @description:zh-TW   自動切換到你預先設定的畫質。會優先使用Premium位元率。
// @description:zh-CN   自动切换到你预先设定的画質。会优先使用Premium比特率。
// @description:ja      自動的に設定した画質に替わります。Premiumのビットレートを優先的に選択します。
// @downloadURL https://update.greasyfork.org/scripts/498145/YouTube%20HD%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/498145/YouTube%20HD%20Premium.meta.js
// ==/UserScript==

/*jshint esversion: 11 */
/* global youtubeHelperApi */

(function () {
    'use strict';

    const api = youtubeHelperApi;
    if (!api) return console.error('Helper API not found. Likely incompatible script manager or extension settings.');

    api.debug.enabled = true;

    const STORAGE_KEY = 'YTHD_settings';
    const DEFAULT_SETTINGS = {
        targetResolution: 'hd2160',
    };

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const CSS_STYLES = `
        #ythd-animation-wrapper {
            position: relative;
            overflow: hidden;
            transition: height 0.25s ease-in-out;
        }
        .ythd-slide-panel {
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            transition: transform 0.25s ease-in-out;
        }
        #ythd-mobile-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); display: flex; align-items: center;
            justify-content: center; z-index: 9999; backdrop-filter: blur(4px);
        }
        .ythd-mobile-menu-box {
            background: #282828; color: white; padding: 16px;
            border-radius: 12px; min-width: 280px; max-width: 90%;
            font-family: "Roboto", "Arial", sans-serif;
        }
        .ythd-mobile-title { font-size: 1.2em; margin-bottom: 16px; font-weight: 500; }
        .ythd-menu-item { padding: 14px; cursor: pointer; border-radius: 8px; }
        .ythd-menu-item.active { font-weight: bold; background: rgba(255, 255, 255, 0.1); }
    `;

    const ICONS = {
        createPinIcon: () => {
            const svg = document.createElementNS(SVG_NS, 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.setAttribute('height', '24');
            svg.setAttribute('width', '24');
            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('d', 'M16,12V4H17V2H7V4H8V12L6,14V16H11.5V22H12.5V16H18V14L16,12Z');
            path.setAttribute('fill', 'currentColor');
            svg.appendChild(path);
            return svg;
        },
    };

    let userSettings = { ...DEFAULT_SETTINGS };

    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = CSS_STYLES;
        document.head.appendChild(styleElement);
    }

    function setResolution() {
        api.setPlaybackResolution(userSettings.targetResolution);
    }

    function handlePlayerStateChange(playerState) {
        const playerElement = api.player.playerObject;
        if (!playerElement) return;

        if (playerState === 1 && !playerElement.hasAttribute('YTHD-resolution-set')) {
            playerElement.setAttribute('YTHD-resolution-set', 'true');
            setResolution();
        } else if (playerState === -1 && playerElement.hasAttribute('YTHD-resolution-set')) {
            playerElement.removeAttribute('YTHD-resolution-set');
        }
    }

    function processVideoLoad() {
        setResolution();
        const playerContainer = api.player.playerObject;
        if (playerContainer && !playerContainer.hasAttribute('YTHD-listener-added')) {
            playerContainer.addEventListener('onStateChange', handlePlayerStateChange);
            playerContainer.setAttribute('YTHD-listener-added', 'true');
        }
    }

    function createYTHDHeaderTrigger(titleText) {
        const header = document.createElement('div');
        header.id = 'ythd-header-trigger';
        header.className = 'ytp-panel-header';
        header.style.cursor = 'pointer';

        const title = document.createElement('div');
        title.className = 'ytp-panel-title';
        title.style.display = 'flex';
        title.style.justifyContent = 'space-between';
        title.style.width = '100%';
        title.style.alignItems = 'center';
        title.style.padding = '16px';

        const leftGroup = document.createElement('span');
        leftGroup.style.display = 'flex';
        leftGroup.style.alignItems = 'center';
        leftGroup.style.gap = '8px';
        leftGroup.append(ICONS.createPinIcon(), titleText);

        const rightGroup = document.createElement('span');
        rightGroup.id = 'ythd-header-label';
        rightGroup.textContent = `${api.POSSIBLE_RESOLUTIONS[userSettings.targetResolution].label} >`;

        title.append(leftGroup, rightGroup);
        header.appendChild(title);
        return header;
    }

    function setupQualityMenuNavigation(qualityPanel) {
        if (qualityPanel.querySelector('#ythd-animation-wrapper')) return;

        const nativeHeader = qualityPanel.querySelector('.ytp-panel-header');
        const nativeTitleText = nativeHeader?.querySelector('.ytp-panel-title')?.textContent.trim() || 'Quality';
        if (!nativeHeader) return;

        const ythdHeaderTrigger = createYTHDHeaderTrigger(nativeTitleText);
        nativeHeader.after(ythdHeaderTrigger);

        const animationWrapper = document.createElement('div');
        animationWrapper.id = 'ythd-animation-wrapper';

        const nativePanel = document.createElement('div');
        nativePanel.className = 'ythd-slide-panel';

        const customPanel = document.createElement('div');
        customPanel.className = 'ythd-slide-panel';
        customPanel.style.transform = 'translateX(100%)';

        Array.from(qualityPanel.children).forEach((child) => {
            nativePanel.appendChild(child);
        });

        animationWrapper.appendChild(nativePanel);
        animationWrapper.appendChild(customPanel);
        qualityPanel.appendChild(animationWrapper);

        const performSlideAnimation = (direction) => {
            const isForward = direction === 'forward';
            const currentPanel = isForward ? nativePanel : customPanel;
            const nextPanel = isForward ? customPanel : nativePanel;

            nextPanel.style.transition = 'none';
            nextPanel.style.transform = isForward ? 'translateX(100%)' : 'translateX(-100%)';

            void nextPanel.offsetHeight;

            animationWrapper.style.height = `${nextPanel.scrollHeight}px`;
            nextPanel.style.transition = 'transform 0.25s ease-in-out';
            currentPanel.style.transform = isForward ? 'translateX(-100%)' : 'translateX(100%)';
            nextPanel.style.transform = 'translateX(0)';
        };

        const switchToNativeMenu = () => {
            const restoredTriggerLabel = document.getElementById('ythd-header-label');
            if (restoredTriggerLabel) {
                restoredTriggerLabel.textContent = `${api.POSSIBLE_RESOLUTIONS[userSettings.targetResolution].label} >`;
            }
            performSlideAnimation('back');
        };

        const switchToYTHDMenu = () => {
            customPanel.replaceChildren();

            const backButton = document.createElement('button');
            backButton.className = 'ytp-panel-back-button ytp-button';
            backButton.style.padding = '0';

            const title = document.createElement('div');
            title.className = 'ytp-panel-title';
            title.style.display = 'flex';
            title.style.alignItems = 'center';
            title.style.gap = '8px';
            title.append(ICONS.createPinIcon(), nativeTitleText);

            const header = document.createElement('div');
            header.className = 'ytp-panel-header';
            header.append(backButton, title);

            const menu = document.createElement('div');
            menu.className = 'ytp-panel-menu';

            Object.entries(api.POSSIBLE_RESOLUTIONS).forEach(([key, value]) => {
                const menuItem = document.createElement('div');
                menuItem.className = 'ytp-menuitem';
                menuItem.setAttribute('role', 'menuitemradio');
                menuItem.setAttribute('aria-checked', (userSettings.targetResolution === key).toString());
                menuItem.dataset.resolutionKey = key;

                const labelDiv = document.createElement('div');
                labelDiv.className = 'ytp-menuitem-label';
                labelDiv.textContent = `${value.p}p ${value.label.includes('K') ? `(${value.label})` : ''}`.trim();
                menuItem.append(labelDiv);

                menuItem.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    const newResolution = menuItem.dataset.resolutionKey;
                    if (userSettings.targetResolution === newResolution) return;

                    userSettings.targetResolution = newResolution;
                    await api.saveToStorage(STORAGE_KEY, userSettings);
                    setResolution();
                    switchToNativeMenu();
                });

                menu.appendChild(menuItem);
            });

            customPanel.append(header, menu);

            backButton.addEventListener('click', (event) => {
                event.stopPropagation();
                switchToNativeMenu();
            });

            performSlideAnimation('forward');
        };

        animationWrapper.style.height = `${nativePanel.scrollHeight}px`;

        ythdHeaderTrigger.addEventListener('click', (event) => {
            event.stopPropagation();
            switchToYTHDMenu();
        });
    }

    function startDesktopObserver() {
        const observer = new MutationObserver((mutations) => {
            let nodesAdded = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    nodesAdded = true;
                    break;
                }
            }
            if (!nodesAdded) return;

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.classList.contains('ytp-panel')) {
                        if (node.querySelector('.ytp-menuitem[role="menuitemradio"]') && node.classList.contains('ytp-quality-menu')) {
                            setupQualityMenuNavigation(node);
                        }
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function showMobileQualityOverlay(closeNativeMenuCallback) {
        if (document.getElementById('ythd-mobile-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'ythd-mobile-overlay';

        const menuBox = document.createElement('div');
        menuBox.className = 'ythd-mobile-menu-box';

        const title = document.createElement('div');
        title.className = 'ythd-mobile-title';
        title.textContent = 'Set Quality Preference';
        menuBox.appendChild(title);

        Object.entries(api.POSSIBLE_RESOLUTIONS).forEach(([key, value]) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'ythd-menu-item';
            if (userSettings.targetResolution === key) {
                menuItem.classList.add('active');
            }
            menuItem.textContent = `${value.p}p ${value.label.includes('K') ? `(${value.label})` : ''}`.trim();

            menuItem.onclick = async () => {
                userSettings.targetResolution = key;
                await api.saveToStorage(STORAGE_KEY, userSettings);
                setResolution();
                document.body.removeChild(overlay);
                if (closeNativeMenuCallback) closeNativeMenuCallback();
            };
            menuBox.appendChild(menuItem);
        });

        overlay.onclick = (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        };

        overlay.appendChild(menuBox);
        document.body.appendChild(overlay);
    }

    function injectMobileTrigger(bottomSheetNode) {
        if (bottomSheetNode.querySelector('.ythd-mobile-trigger')) return;

        const templateItem = bottomSheetNode.querySelector('[role=menuitem], ytm-menu-service-item-renderer');
        if (!templateItem) return;

        const triggerItem = templateItem.cloneNode(true);
        triggerItem.classList.add('ythd-mobile-trigger');
        triggerItem.removeAttribute('aria-disabled');

        const icon = triggerItem.querySelector('yt-icon, c3-icon');
        const label = triggerItem.querySelector('.yt-formatted-string, .menu-service-item-text');

        if (icon) icon.replaceChildren(ICONS.createPinIcon());
        if (label) label.textContent = 'Set Quality Preference';

        triggerItem.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();

            const closeNativeMenu = () => document.querySelector('ytw-scrim')?.click();
            showMobileQualityOverlay(closeNativeMenu);
        };

        const parent = templateItem.parentElement;
        parent.insertBefore(triggerItem, parent.firstChild);
    }

    function initializeMobileEventListeners() {
        document.addEventListener(
            'click',
            (event) => {
                const settingsButton = event.target.closest(
                    '.player-settings-icon, [aria-label*="Settings"], .slim-video-metadata-actions button',
                );
                if (settingsButton) {
                    const observer = new MutationObserver((mutations, obs) => {
                        const bottomSheet = document.querySelector('bottom-sheet-container:not(:empty)');
                        if (bottomSheet) {
                            injectMobileTrigger(bottomSheet);
                            obs.disconnect();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            },
            true,
        );
    }

    async function initialize() {
        injectStyles();
        userSettings = await api.loadAndCleanFromStorage(STORAGE_KEY, DEFAULT_SETTINGS);
        await api.saveToStorage(STORAGE_KEY, userSettings);
        api.page.isMobile ? initializeMobileEventListeners() : startDesktopObserver();
        api.eventTarget.addEventListener('yt-helper-api-ready', processVideoLoad);
    }

    initialize();
})();
