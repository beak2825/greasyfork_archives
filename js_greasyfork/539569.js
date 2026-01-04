// ==UserScript==
// @name         ZeroAd Engine
// @namespace    http://tampermonkey.net/
// @version      2025.06.15.1
// @description  Bypass ads and skip interruptions in HTML5 games. Instantly auto-completes Poki SDK ads, AdInPlay ads, and CrazyGames reward overlays (mobile promo, login prompts, TikTok promotions, etc.).Also blocks iframes, video ads, and promo containers that delay gameplay.Tested on Ninja.io, Taming.io, CrazyGames, and other embedded game portals.
// @author       ChatGPT
// @match        *://*/*
// @license      MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539569/ZeroAd%20Engine.user.js
// @updateURL https://update.greasyfork.org/scripts/539569/ZeroAd%20Engine.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /////////////////////////////////////////////
    // [1] Robust Direct Function Patch for PokiSDK (retry until ready)
    /////////////////////////////////////////////

    function patchPokiSDK() {
        if (typeof window.PokiSDK !== 'object') return false;

        const sdk = window.PokiSDK;

        if (sdk.__patched) return true;
        sdk.__patched = true;

        const instantResolve = () => Promise.resolve({ adViewed: true });

        if (typeof sdk.rewardedBreak === 'function') {
            sdk.rewardedBreak = function (cb) {
                console.log('[AdBypasser] 🎁 PokiSDK.rewardedBreak instantly rewarded');
                if (typeof cb === 'function') cb();
                return instantResolve();
            };
        }

        if (typeof sdk.displayAd === 'function') {
            sdk.displayAd = function () {
                console.log('[AdBypasser] 🚫 PokiSDK.displayAd blocked');
                return Promise.resolve();
            };
        }

        if (typeof sdk.commercialBreak === 'function') {
            sdk.commercialBreak = function () {
                console.log('[AdBypasser] ⏭ PokiSDK.commercialBreak skipped');
                return Promise.resolve();
            };
        }

        console.log('[AdBypasser] 🧠 PokiSDK functions patched');
        return true;
    }

    /////////////////////////////////////////////
    // [2] Patch AdInPlay SDK
    /////////////////////////////////////////////

    function patchAdInPlay() {
        if (typeof window.adinplay === 'object' && !window.adinplay.__patched) {
            window.adinplay.__patched = true;
            console.log('[AdBypasser] 🔒 AdInPlay SDK neutralized');
            window.adinplay = new Proxy(window.adinplay, {
                get(target, prop) {
                    if (['play', 'preroll', 'midroll', 'postroll', 'banner'].includes(prop)) {
                        return () => console.log(`[AdBypasser] ⛔ AdInPlay.${prop}() blocked`);
                    }
                    return target[prop];
                }
            });
        }
    }

    /////////////////////////////////////////////
    // [3] Safer DOM Ad Nuker Selectors
    /////////////////////////////////////////////

    const adSelectors = [
        '#preroll',
        '#adsbox',
        'iframe[src*="ads"]',
        'iframe[title="Advertisement"]',
        'video[title="Advertisement"]',
        '[id^="ad_"]',
        '[id$="_ad"]',
        '[id="ad"]',
        '[class="ad"]',
        '[class^="ad-"]',
        '[class$="-ad"]',
        '[class~="ad-banner"]',
        '[class~="adbox"]',
        '[class~="adunit"]',
        '[class*="pokiSdk"]',
        'div[id^="google_ads"]',
        'div[id^="div-gpt"]',
        'div[class*="banner-ad"]',
        'div[class*="ad-wrapper"]',
        'script[src*="ads"]',
        '.pokiSdkContainer',
        '.pokiSdkVideoContainer',
        '.pokiSDKAdContainer',
        '.pokiSdkSpinnerContainer',
        '.pokiSdkPauseButtonContainer',
        '.pokiSdkStartAdButton'
    ];

    const removedSelectors = new Set();

    function removeAdElements() {
        adSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                elements.forEach(el => el.remove());
                if (!removedSelectors.has(selector)) {
                    console.log(`[AdBypasser] 💣 Removed: ${selector}`);
                    removedSelectors.add(selector);
                }
            }
        });
    }

    function safeRemoveAdElements() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(removeAdElements, { timeout: 100 });
        } else {
            setTimeout(removeAdElements, 0);
        }
    }

    /////////////////////////////////////////////
    // [4] Handle CrazyGames Mobile Promo Skip
    /////////////////////////////////////////////

    function handleCrazyGamesPromo() {
        const btn = document.getElementById('mainContinuePlayingButton');
        if (btn) {
            console.log('[AdBypasser] 🎯 CrazyGames promo detected — auto-clicking Continue button');
            btn.click();

            // Remove the whole promo container (closest parent div with class starting MuiGrid-root)
            let promoDiv = btn.closest('div.MuiGrid-root');
            if (promoDiv) {
                promoDiv.remove();
                console.log('[AdBypasser] 💥 CrazyGames promo container removed');
            }
        }
    }

    /////////////////////////////////////////////
    // [5] MutationObserver to keep cleaning
    /////////////////////////////////////////////

    function startMutationWatch() {
        const observer = new MutationObserver(() => {
            patchAdInPlay();
            safeRemoveAdElements();
            handleCrazyGamesPromo();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        console.log('[AdBypasser] 👁️ MutationObserver activated');
    }

    /////////////////////////////////////////////
    // [6] Iframe Ad Detector & Remover
    /////////////////////////////////////////////

    const iframeObserver = new MutationObserver(() => {
        document.querySelectorAll('iframe').forEach(iframe => {
            try {
                const src = iframe.src || iframe.getAttribute('src');
                if (src && /ads|doubleclick|preroll|videoads/i.test(src)) {
                    iframe.remove();
                    console.log('[AdBypasser] 🪓 Removed suspicious iframe:', src);
                }
            } catch (e) { }
        });
    });

    iframeObserver.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    /////////////////////////////////////////////
    // [7] Initialization with retry patch for PokiSDK
    /////////////////////////////////////////////

    window.addEventListener('DOMContentLoaded', () => {
        let attempts = 0;
        const maxAttempts = 15; // retry 15 times every 1s = 15s max
        const interval = setInterval(() => {
            if (patchPokiSDK() || attempts++ >= maxAttempts) {
                clearInterval(interval);
                if (attempts >= maxAttempts) {
                    console.warn('[AdBypasser] PokiSDK patch timeout, not found');
                }
            }
        }, 1000);

        patchAdInPlay();
        safeRemoveAdElements();
        handleCrazyGamesPromo();
        startMutationWatch();
    });

    // Also run interval for initial period
    const runtime = setInterval(() => {
        patchPokiSDK();
        patchAdInPlay();
        safeRemoveAdElements();
        handleCrazyGamesPromo();
    }, 1000);

    setTimeout(() => {
        clearInterval(runtime);
        console.log('[AdBypasser] 🛑 Interval cleared after startup');
    }, 30000);

})();
