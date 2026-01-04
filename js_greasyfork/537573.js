// ==UserScript==
// @name         Adblock Detector Bypasser
// @name:vi         Bỏ Qua Phát Hiện Adblock
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Bypasses various adblock detectors and paywalls.
// @description:vi  Bỏ qua phát hiện adblock và paywalls khác nhau.
// @author       Yuusei
// @match        *://*/*
// @license      GPL-3.0-only
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        window.onurlchange
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537573/Adblock%20Detector%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/537573/Adblock%20Detector%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- UserScript Configuration ---
    const SCRIPT_NAME = "Adblock Detector Bypasser";
    const ENABLED_STORAGE_KEY = "adblockerBypassEnabled";

    // --- Original Code ---

    // Debug mode toggle
    const DEBUG_MODE = false;

    function log(message, ...args) {
        if (DEBUG_MODE) {
            console.log(`[${SCRIPT_NAME}] ${message}`, ...args);
        }
    }


    // Function to block adblockDetectors
    function blockAdblockDetectors() {
        const excludedElements = ['BODY', 'HTML'];
        const excludedPrefixes = ['ShortsLockupView', "ytSearchbox"];

        const blockElements = [
            "#vndjywodduqjrmenpowdbkcevrszhtxzzowjcnuvaqmzgwdmtyzsdmrc", ".adblock_title", ".adblock_subtitle",
            ".popSc", ".popBc", ".ab-detector-wrap", "#abDetectorModal", "#adDetectorElm", ".ad", ".dialog-overlay",
            ".dialog-overlay-blur", ".dialog.dialog-open.dialog-variant-default", ".link.link--external",
            ".link.link--internal", ".bb089aa6", "#arlinablock", ".modal.fade.in", ".modal-backdrop.fade.in",
            ".modal-backdrop", ".fc-ab-root", "body > div.fc-ab-root", ".fbs-auth__container.fbs-auth__adblock",
            ".overlay-34_Kj", ".wrapper-3AzfF", "#qa-modal-body",
            ".fixed.left-0.right-0.bottom-0.paywall-overlay.checkout-paywall-overlay", "#paywall-ui-responsive-modal",
            '[data-qa="wall-background"]', "#wall-bottom-drawer", ".fEy1Z2XT",
            ".zephr-article-modal-backdrop.zephr-backdrop", ".zephr-modal-content",
            ".zephr-editorial-newsletter-backdrop.zephr-backdrop",
            ".nytc---modal-window---windowContainer.nytc---modal-window---isShown.nytc---shared---blackBG",
            ".tp-modal", ".tp-backdrop.tp-active", "modality-custom-element", "[name='metering-modal']",
            ".c-nudge__container.c-gate__container", ".c-nudge__container.c-regGate__container", ".css-n7r8pg",
            ".css-1bd8bfl", ".overlay__59af11e2", ".tp_modal", ".tp-backdrop.tp-active",
            "div[class^='sp_message_container']", "div[class^='sp_veil']", ".css-1mv333l", ".css-19q4c8e",
            ".css-gx5sib", ".myAccountAuth", ".css-1aa2f1p", "#lire-ui-886237", "#fortress-container-root",
            "#yzwall", "#variant_top_bar", "#tie-popup-adblock", ".tie-popup", "#modal-whitelist", "#modal-overlay",
            "#nindo-popup-portal", "#nindo-drawer-portal", ".bt-sw-container", ".bt-sw-modal", ".lbzrkre",
            "#adblock_tooltip", ".adblock-killme-overlay", ".bfddebf37-wrapper", ".bfddebf37-blackout",
            ".protection", ".q-sticky-footer.q-footer-body.q-red-bild-design", ".inactivity", ".angery-message",
            ".items-stretch.md\\:items-center.fill-mode-both.fixed.bottom-0.left-0.right-0.top-0.bg-backdrop\\/70.backdrop-blur-sm.animate-in.fade-in.ease-outExpo.duration-200",
            ".py-md.px-md.grow.flex.flex-col.justify-center.md\\:pt-lg.md\\:pb-lg",
            ".shadow-md.overflow-y-auto.scrollbar-thin.scrollbar-thumb-idle", ".bx-slab", 'div[id^="bx-shroud-"]',
            'div[id^="bx-close-outside-"]',
            ".mx-4.flex.h-fit.flex-col.items-center.justify-center.self-center.rounded-lg.bg-foreground.p-4.sm\\:inset-x-12.sm\\:bottom-12.sm\\:top-auto.sm\\:flex-row.sm\\:self-end.sm\\:p-10.md\\:absolute.md\\:inset-x-4.md\\:mx-auto.pointer-events-auto",
            ".fixed.inset-x-0.bottom-0.z-20.flex.h-full.bg-white\\/80", "#mj-adblock-widget-2", "#template-container",
            ".o-message__container", "#tp-yt-iron-overlay-backdrop", ".tp-yt-iron-overlay-backdrop", "#bdn-paywall-view",
            ".wa-limit-modal", ".bck-adblock.is--active", ".adblock__container", ".adblock",
            ".Overlay__container___2TqtL Overlay__containerActive___2te0I", "#portal-root",
            ".unblocker-container", ".unblocker-wrapper", ".unblocker", "#cpidQokFQn",
            ".swal2-container.swal2-center.swal2-backdrop-show",
            ".eejqlhsrwxhwgizceicunpzytknyhvlkrdguafbrbvlkamnytyrtsdmrc",
        ];

        let elementsBlocked = false;

        blockElements.forEach(selector => {
            try {
                document.querySelectorAll(selector).forEach(el => {
                    if (!excludedElements.includes(el.tagName.toUpperCase())) {
                        el.style.setProperty("display", "none", "important");
                        log(`Blocked element with selector: ${selector}`);
                        elementsBlocked = true;

                        const suffix = el.id ? el.id.slice(-5) : "";
                        if (suffix) {
                            const sameIdElements = document.querySelectorAll(`[id$="${suffix}"]`);
                            sameIdElements.forEach(sameIdEl => {
                                if (sameIdEl.id.length > 30 && sameIdEl.id.endsWith(suffix) && sameIdEl !== el) {
                                    log(`Hiding additional ID with suffix: ${suffix} from ID: ${sameIdEl.id}`);
                                    sameIdEl.style.setProperty("display", "none", "important");
                                    elementsBlocked = true;
                                }
                            });
                        }
                    }
                });
            } catch (error) {
                log(`Error hiding element with selector: ${selector}`, error);
            }
        });

        const randomPattern = /^[a-zA-Z0-9]{30,}$/;
        document.querySelectorAll('*').forEach(el => {
            try {
                if (excludedElements.includes(el.tagName.toUpperCase())) return;

                const matchesPrefix = excludedPrefixes.some(prefix =>
                    el.tagName.startsWith(prefix) ||
                    (el.id && el.id.startsWith(prefix)) ||
                    Array.from(el.classList).some(className => className.startsWith(prefix))
                );
                if (matchesPrefix) return;

                if (el.id && randomPattern.test(el.id) && el.id.length > 30) {
                    const suffix = el.id.slice(-5);
                    el.style.setProperty("display", "none", "important");
                    log(`Blocked element with random ID: ${el.id}`);
                    elementsBlocked = true;

                    const sameIdElements = document.querySelectorAll(`[id$="${suffix}"]`);
                    sameIdElements.forEach(sameIdEl => {
                        if (sameIdEl.id.length > 30 && sameIdEl.id.endsWith(suffix) && sameIdEl !== el) {
                            log(`Hiding additional ID with suffix: ${suffix} from ID: ${sameIdEl.id}`);
                            sameIdEl.style.setProperty("display", "none", "important");
                            elementsBlocked = true;
                        }
                    });
                }

                Array.from(el.classList).forEach(cls => {
                    if (randomPattern.test(cls) && cls.length > 30) {
                        el.style.setProperty("display", "none", "important");
                        log(`Blocked element with random class: ${cls}`);
                        elementsBlocked = true;
                    }
                });

                if (el.src && el.src.includes("chp-ads-block-detector")) {
                    el.style.setProperty("display", "none", "important");
                    log(`Blocked element with src: ${el.src}`);
                    elementsBlocked = true;
                }
                if (el.href && el.href.includes("chp-ads-block-detector")) {
                    el.style.setProperty("display", "none", "important");
                    log(`Blocked element with href: ${el.href}`);
                    elementsBlocked = true;
                }

            } catch (error) {
                log("Error blocking dynamic element", error);
            }
        });

        log("Adblock detector element scan complete.");
        return elementsBlocked;
    }


    const forceEnableScrolling = () => {
        const allElements = document.querySelectorAll('body *');
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.overflow === 'hidden' || computedStyle.overflowY === 'hidden') {
                element.style.setProperty('overflow', 'auto', 'important');
                element.style.setProperty('overflowY', 'auto', 'important');
            }
        });
        document.documentElement.style.setProperty('overflow', 'auto', 'important');
        document.documentElement.style.setProperty('overflowY', 'auto', 'important');
        document.body.style.setProperty('overflow', 'auto', 'important');
        document.body.style.setProperty('overflowY', 'auto', 'important');
        log("Forced scrolling on all elements.");
    };

    let scrollObserver = null;
    function enableScrollingOnPage() {
        const scrollClasses = [
            "mol-fe-ab-dialog", "body--no-scroll", "nytc---modal-window---noScroll",
            "tp-modal-open", "with-gate", "overflow-hidden", "css-mcm29f", "scroll-lock",
            "modal-open", "is-modal-open", "fixed-modal", "zephr-modal-open",
            "bt-sw-overflow", "bx-client-overlay", "bx-client-overlay-ios", "swal2-shown"
        ];
        const otherScrollPopupFilters = [
            { value: "span[data-reactroot]", type: "popup" },
            { value: "body[data-paywall-overlay-status='show']", type: "scroll" },
            { value: ".overlay", type: "popup" }
        ];

        const MAX_TRIES = 5;
        let tries = 0;

        const attemptEnableScroll = () => {
            let canScroll = false;
            const htmlElement = document.documentElement;
            const bodyElement = document.body;

            [htmlElement, bodyElement].forEach(element => {
                if (element) {
                    if (element.style.overflow === "hidden") {
                        element.style.setProperty("overflow", "auto", "important");
                        canScroll = true;
                    }
                    if (element.style.overflowY === "hidden") {
                        element.style.setProperty("overflowY", "auto", "important");
                        canScroll = true;
                    }
                    element.style.removeProperty('overflow');
                    element.style.removeProperty('overflow-y');
                }
            });

            scrollClasses.forEach(filter => {
                const elements = document.getElementsByClassName(filter);
                while (elements.length > 0 && elements[0]) {
                    elements[0].classList.remove(filter);
                    canScroll = true;
                }
            });

            otherScrollPopupFilters.forEach(filter => {
                const element = document.querySelector(filter.value);
                if (element) {
                    if (filter.type === "scroll") {
                        element.style.setProperty("overflow", "auto", "important");
                    } else if (filter.type === "popup") {
                        element.style.setProperty("display", "none", "important");
                    }
                    canScroll = true;
                }
            });

            if (canScroll) {
                log("Scrolling has been re-enabled.");
            } else if (tries < MAX_TRIES) {
                tries++;
                setTimeout(attemptEnableScroll, 500);
            }
        };

        if (document.body) {
            if (scrollObserver) scrollObserver.disconnect(); // Disconnect previous if any
            scrollObserver = new MutationObserver(attemptEnableScroll);
            scrollObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
            attemptEnableScroll();
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                if (document.body) {
                    if (scrollObserver) scrollObserver.disconnect();
                    scrollObserver = new MutationObserver(attemptEnableScroll);
                    scrollObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
                }
                attemptEnableScroll();
            });
        }
    }

    function classOfStubbornSiteAdblockDetectors() {
        const tieBody = document.getElementById("tie-body");
        if (tieBody?.classList.contains("tie-popup-is-opend")) {
            tieBody.classList.remove("tie-popup-is-opend");
            log("Class 'tie-popup-is-opend' removed from #tie-body");
        }
        if (document.body?.classList.contains("bfddebf37-blur")) {
            document.body.classList.remove("bfddebf37-blur");
            log("Class 'bfddebf37-blur' removed from <body>");
        }
    }

    function hideYtElements() {
        let changed = false;
        const dismissButton = document.querySelector('.ytd-enforcement-message-view-model #dismiss-button, .ytp-ad-skip-button-modern, button[aria-label*="Skip Ad"]');
        if (dismissButton && typeof dismissButton.click === 'function') {
            dismissButton.click();
            log("YouTube dismiss/skip button clicked.");
            changed = true;
        }

        const elementsToHide = ['tp-yt-paper-dialog', 'ytd-enforcement-message-view-model', 'tp-yt-iron-overlay-backdrop'];
        elementsToHide.forEach(tagNameOrClass => {
            const selector = tagNameOrClass.startsWith('.') || tagNameOrClass.startsWith('#') ? tagNameOrClass : tagNameOrClass;
            document.querySelectorAll(selector).forEach(element => {
                if (element.style.display !== 'none') {
                    element.style.setProperty('display', 'none', 'important');
                    log(`<${tagNameOrClass}> has been hidden on YouTube.`);
                    changed = true;
                }
            });
        });

        const player = document.getElementById('movie_player');
        if (player?.classList.contains('ytp-pause-overlay')) {
            player.classList.remove('ytp-pause-overlay');
            const video = player.querySelector('video');
            if (video?.paused) {
                video.play().catch(e => log("Error trying to play video:", e));
                log("Removed ytp-pause-overlay and attempted to play video.");
                changed = true;
            }
        }
        return changed;
    }


    let runOnceExecutedForCurrentPage = false;
    function runOnce() {
        if (runOnceExecutedForCurrentPage) return;
        log("Running one-time setup logic for current page.");

        if (window.location.hostname.includes("dailymotion.com") && window.location.pathname.startsWith('/video/')) {
            log('Dailymotion video page detected.');
            var videoId = window.location.pathname.split('/')[2];
            if (!videoId) {
                log('Could not extract Dailymotion video ID.');
                return;
            }
            log('Extracted Dailymotion video ID:', videoId);

            let modal;

            function createModal() {
                if (document.getElementById('adb-cpe-dailymotion-modal')) return;

                modal = document.createElement('div');
                modal.id = 'adb-cpe-dailymotion-modal';
                modal.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background-color: rgba(0, 0, 0, 0.8); display: flex;
                    justify-content: center; align-items: center; z-index: 2147483647;`;

                var closeButton = document.createElement('button');
                closeButton.innerText = 'Close AdB by CPE Player';
                closeButton.style.cssText = `
                    position: absolute; top: 20px; right: 20px; padding: 10px;
                    background-color: #4CAF50; border: none; cursor: pointer; z-index: 2147483647; color: white;`;
                closeButton.onclick = function() {
                    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
                    createOpenPlayerButton();
                };

                var iframe = document.createElement('iframe');
                iframe.src = `https://www.dailymotion.com/embed/video/${videoId}?autoplay=1`;
                iframe.width = '80%';
                iframe.height = '80%';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = "autoplay; fullscreen";

                modal.appendChild(iframe);
                modal.appendChild(closeButton);
                document.body.appendChild(modal);
                log('Dailymotion modal created.');
            }

            function createOpenPlayerButton() {
                if (document.getElementById('adb-cpe-dailymotion-open-btn')) return;

                var openPlayerButton = document.createElement('button');
                openPlayerButton.id = 'adb-cpe-dailymotion-open-btn';
                openPlayerButton.innerText = 'Open AdB by CPE Player';
                openPlayerButton.style.cssText = `
                    position: fixed; bottom: 15px; right: 20px; padding: 10px;
                    background-color: #4CAF50; border: none; cursor: pointer; z-index: 2147483646; color: white;`;
                openPlayerButton.onclick = function() {
                    if (openPlayerButton.parentNode) openPlayerButton.parentNode.removeChild(openPlayerButton);
                    const nameDiv = document.getElementById('adb-cpe-dailymotion-name');
                    if (nameDiv && nameDiv.parentNode) nameDiv.parentNode.removeChild(nameDiv);
                    createModal();
                };

                var extensionName = document.createElement('div');
                extensionName.id = 'adb-cpe-dailymotion-name';
                extensionName.innerText = `Powered by ${SCRIPT_NAME}`;
                extensionName.style.cssText = `
                    position: fixed; bottom: 50px; right: 20px;
                    color: #4CAF50; font-size: 12px; z-index: 2147483646;`;

                document.body.appendChild(openPlayerButton);
                document.body.appendChild(extensionName);
                log('Dailymotion open player button created.');
            }

            var playerWrapper = document.getElementById('player-wrapper');
            if (playerWrapper) {
                playerWrapper.remove();
                log('Removed Dailymotion player-wrapper.');
            }
            createModal();
        }
        runOnceExecutedForCurrentPage = true;
    }

    function updateStylesInStyleTag() {
        const styleTag = document.querySelector('style[data-id="std"]');
        if (styleTag && styleTag.sheet) {
            try {
                const styleSheet = styleTag.sheet;
                for (let i = 0; i < styleSheet.cssRules.length; i++) {
                    const rule = styleSheet.cssRules[i];
                    if (rule.style) {
                        if (rule.style.filter && rule.style.filter !== 'none') {
                            rule.style.setProperty('filter', 'none', 'important');
                            log(`Updated filter for rule:`, rule.cssText);
                        }
                        if (
                            rule.selectorText?.includes('body') &&
                            rule.style.overflow === 'hidden' &&
                            rule.style.position === 'fixed' &&
                            rule.style.height === '100%' &&
                            rule.style.width === '100%' &&
                            rule.style.maxHeight === '100vh'
                        ) {
                            rule.style.setProperty('overflow', 'auto', 'important');
                            log(`Updated overflow for body rule:`, rule.cssText);
                        }
                    }
                }
            } catch (e) {
                log("Error accessing stylesheet rules (likely cross-origin):", e.message);
            }
        }
    }


    // --- Main Execution Logic ---
    let mainObserver = null;
    let intervalId = null;

    function runChecks() {
        log("Running checks...");
        const isYouTube = window.location.hostname.includes("www.youtube.com");
        let blockedSomething;

        if (isYouTube) {
            blockedSomething = hideYtElements();
        } else {
            blockedSomething = blockAdblockDetectors();
            classOfStubbornSiteAdblockDetectors();
            enableScrollingOnPage();
        }

        if (blockedSomething) {
            log("Blocked/modified something in this check cycle.");
        }
    }

    async function checkAdblockerStatusAndRun() {
        const isEnabled = await GM_getValue(ENABLED_STORAGE_KEY, true);
        if (!isEnabled) {
            log("Bypasser is disabled via menu command.");
            if (mainObserver) { mainObserver.disconnect(); mainObserver = null; }
            if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            return;
        }
        log("Bypasser is enabled. Running checks.");

        runChecks(); // Initial run

        if (!mainObserver && document.body) {
            mainObserver = new MutationObserver(() => {
                log("DOM changed (body observer), re-running checks.");
                runChecks();
            });
            mainObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] }); // Watch attributes relevant to hiding
            log("Main observer attached to document.body.");
        } else if (!document.body && !mainObserver) { // Fallback if body not ready
             window.addEventListener('DOMContentLoaded', () => {
                if (document.body && !mainObserver) {
                    mainObserver = new MutationObserver(() => {
                        log("DOM changed (body observer post-DOMContentLoaded), re-running checks.");
                        runChecks();
                    });
                    mainObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
                    log("Main observer attached to document.body (post-DOMContentLoaded).");
                }
            });
        }


        if (intervalId) clearInterval(intervalId);

        let intervalTime = 3000;
        intervalId = setInterval(() => {
            log("Interval check running.");
            runChecks();
        }, intervalTime);

        setTimeout(async () => {
            const stillEnabled = await GM_getValue(ENABLED_STORAGE_KEY, true);
            if (stillEnabled && intervalId) { // Check if intervalId is still ours
                clearInterval(intervalId);
                intervalTime = 7000;
                intervalId = setInterval(() => {
                    log("Slower interval check running.");
                    runChecks();
                }, intervalTime);
                log("Switched to slower interval.");
            }
        }, 60000);
    }

    async function initPageSpecific() {
        runOnceExecutedForCurrentPage = false;
        const isEnabled = await GM_getValue(ENABLED_STORAGE_KEY, true);
        if (isEnabled) {
            runOnce();
        }
    }

    async function toggleAdblockerStatus() {
        const currentValue = await GM_getValue(ENABLED_STORAGE_KEY, true);
        const newValue = !currentValue;
        await GM_setValue(ENABLED_STORAGE_KEY, newValue);
        alert(`${SCRIPT_NAME} is now ${newValue ? 'ENABLED' : 'DISABLED'}. Reload page or navigate for changes to fully apply if issues persist.`);
        log(`Toggled to: ${newValue}`);

        if (newValue) {
            initPageSpecific(); // Re-run one-time stuff if needed
            checkAdblockerStatusAndRun(); // Start observers and checks
        } else {
            if (mainObserver) { mainObserver.disconnect(); mainObserver = null; }
            if (scrollObserver) { scrollObserver.disconnect(); scrollObserver = null; }
            if (intervalId) { clearInterval(intervalId); intervalId = null; }
            
            log("Disabled: Observers disconnected and intervals cleared.");
            // Note: Elements already hidden by the script might remain hidden until page reload.
            // Adding logic to revert all changes is complex and often not necessary for this type of script.
        }
    }

    GM_registerMenuCommand(`Toggle ${SCRIPT_NAME}`, toggleAdblockerStatus);


    // Initializations
    initPageSpecific();
    checkAdblockerStatusAndRun();

    // Handle SPA navigation
    let lastUrl = location.href;

    if (typeof window.onurlchange !== 'undefined') {
        window.addEventListener('urlchange', (info) => {
            const newUrl = info.url || location.href;
            log(`urlchange event detected. New URL: ${newUrl}`);
            if (newUrl !== lastUrl) {
                lastUrl = newUrl;
                initPageSpecific();
                checkAdblockerStatusAndRun(); // Re-run checks and re-setup observers if needed
            }
        });
      }
})();