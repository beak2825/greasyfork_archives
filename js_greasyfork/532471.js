// ==UserScript==
// @name         supjav與其它網站優化
// @namespace    http://tampermonkey.net/
// @version      2.6.3
// @description  Supjav, Jable, Tktube, Javtiful 優化 (日文導向+伺服器選擇+FC2修正+空搜尋跳轉) + 影片預設靜音 (智慧型偵測播放) + 修正supjav播放器崩潰問題
// @author       Your Name & AI Assistant
// @match        https://supjav.com/*
// @match        https://tktube.com/*
// @match        https://jable.tv/*
// @match        https://javtiful.com/*
// @match        https://*.javtiful.com/*
// @match        https://javideo.net/*
// @match        https://*.supremejav.com/*
// @match        https://streamtape.com/*
// @match        https://turbovidhls.com/*
// @match        https://fc2stream.tv/*
// @match        https://walterprettytheir.com/*
// @match        https://*.voe.sx/*
// @match        https://*.voe-network.net/*
// @match        https://mpsh.ru/*
// @match        https://dood.wf/*
// @match        https://vidoza.net/*
// @exclude      https://jable.tv/*?lang=jp*
// @exclude      https://jp.javtiful.com/*
// @icon         https://pic.imgdd.cc/item/67fc1215218de299caa920fe.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532471/supjav%E8%88%87%E5%85%B6%E5%AE%83%E7%B6%B2%E7%AB%99%E5%84%AA%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532471/supjav%E8%88%87%E5%85%B6%E5%AE%83%E7%B6%B2%E7%AB%99%E5%84%AA%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isTopWindow = (window.self === window.top);
    const currentHost = window.location.hostname;
    const currentHref = window.location.href;

    // ==============================================
    // 0. 緊急修正: Supjav 播放器崩潰補丁 (Fix Broken Website Code)
    // ==============================================
    // 說明: supjav.php 內部有一個 setInterval 每100ms讀取一次 id="loader"。
    // 如果該元素被擋廣告插件刪除，會導致無限報錯 (Cannot read properties of null)。
    // 此補丁會檢測並自動補回一個隱藏的 dummy loader 讓它閉嘴。
    if (currentHref.includes('supjav.php') || currentHost.includes('supremejav.com')) {
        function injectDummyLoader() {
            try {
                // 如果找不到 loader，就造一個假的
                if (!document.getElementById('loader')) {
                    const dummy = document.createElement('span'); // 原站是用 span
                    dummy.id = 'loader';
                    dummy.style.display = 'none'; // 隱藏起來
                    dummy.innerHTML = 'script_fix'; // 隨便塞點字防止讀取空值
                    document.body.appendChild(dummy);
                    // console.log('[優化腳本] 已修復遺失的 #loader 元素，防止網頁崩潰');
                }
            } catch (e) { }
        }

        // 在 DOM 載入時執行
        document.addEventListener('DOMContentLoaded', injectDummyLoader);
        // 保險起見，定時檢查一下 (防止被其他腳本再次刪除)
        setInterval(injectDummyLoader, 1000);
    }

    // ==============================================
    // 1. 智慧型靜音 2.1 (Smart Mute - Fix Infinite Loop)
    // ==============================================
    const MUTE_CONFIG_KEY = 'enableAutoMute';
    const isMuteEnabled = GM_getValue(MUTE_CONFIG_KEY, true);

    function setupSmartMute() {
        if (!isMuteEnabled) return;

        function monitorVideo(video) {
            if (video.dataset.scriptMonitored) return;
            video.dataset.scriptMonitored = "true";

            let isEnforcing = false;
            let enforceTimer = null;
            let isLocking = false;

            const forceMute = () => {
                if (video.muted && video.volume === 0) return;
                isLocking = true;
                try { video.muted = true; video.volume = 0; } catch (e) {}
                setTimeout(() => { isLocking = false; }, 50);
            };

            const startEnforcement = () => {
                forceMute();
                isEnforcing = true;
                if (enforceTimer) clearTimeout(enforceTimer);
                enforceTimer = setTimeout(() => { isEnforcing = false; }, 4000);
            };

            forceMute();
            video.addEventListener('loadedmetadata', forceMute);
            video.addEventListener('playing', startEnforcement);
            video.addEventListener('volumechange', () => {
                if (isLocking) return;
                if (isEnforcing && (!video.muted || video.volume > 0)) {
                    forceMute();
                }
            });
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'VIDEO') monitorVideo(node);
                    else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(monitorVideo);
                    }
                });
            });
        });
        observer.observe(document.documentElement, { childList: true, subtree: true });
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('video').forEach(monitorVideo);
        });
    }

    setupSmartMute();

    // ==============================================
    // 2. 主控邏輯 (僅主視窗)
    // ==============================================
    if (isTopWindow) {
        GM_registerMenuCommand(`🔇 影片預設靜音: ${isMuteEnabled ? '✅ 開啟' : '❌ 關閉'}`, () => {
            GM_setValue(MUTE_CONFIG_KEY, !isMuteEnabled);
            location.reload();
        });

        let supjavServerClickExecuted = false;

        function checkAndRedirect() {
            const currentUrl = window.location.href;
            let performRedirect = false;
            let newUrl = currentUrl;

            // Javtiful
            if (currentHost.endsWith("javtiful.com")) {
                const target = "jp.javtiful.com";
                if (currentHost !== target) {
                    newUrl = `https://${target}${window.location.pathname}${window.location.search}${window.location.hash}`;
                    performRedirect = true;
                }
            }
            // Supjav / Tktube / Jable
            else if (currentUrl.includes('https://supjav.com') && !currentUrl.includes('/ja/')) {
                let t = currentUrl.replace(/\/zh\//, '/ja/');
                if (!t.includes('/ja/')) t = t.replace(/^https:\/\/supjav\.com/, 'https://supjav.com/ja');
                if (t !== currentUrl) { newUrl = t; performRedirect = true; }
            }
            else if (currentUrl.includes('https://jable.tv') && !currentUrl.includes('?lang=jp')) {
                let t = currentUrl.replace(/\?lang=(en|zh)/, '?lang=jp');
                if (!t.includes('?lang=jp')) t += (t.includes('?') ? '&' : '?') + 'lang=jp';
                if (t !== currentUrl) { newUrl = t; performRedirect = true; }
            }
            else if (currentUrl.includes('https://tktube.com') && !currentUrl.includes('/ja/')) {
                let t = currentUrl.replace(/\/tktube\.com(\/\w{2})?\//, '/tktube.com/ja/');
                if (t !== currentUrl) { newUrl = t; performRedirect = true; }
            }

            if (performRedirect && window.location.href !== newUrl) {
                window.location.href = newUrl;
                return true;
            }
            return false;
        }

        function checkSupjavHelpers() {
            if (window.location.href.match(/^https:\/\/supjav\.com\/ja\/\?s=$/)) {
                window.location.href = 'https://supjav.com/ja/';
                return true;
            }
            const fc2Regex = /([?&])s=FC2-(\d{6,7})(&|$)/;
            if (window.location.href.includes('supjav.com') && fc2Regex.test(window.location.href)) {
                window.location.href = window.location.href.replace(fc2Regex, '$1s=$2$3');
                return true;
            }
            return false;
        }

        function waitForElement(selector, callback) {
            const el = document.querySelector(selector);
            if (el) return callback(el);
            const obs = new MutationObserver((_, o) => {
                const e = document.querySelector(selector);
                if (e) { o.disconnect(); callback(e); }
            });
            obs.observe(document.body, { childList: true, subtree: true });
            setTimeout(() => obs.disconnect(), 10000);
        }

        function setupServerSelection() {
            // Supjav
            if (currentHost.includes('supjav.com')) {
                const CONFIG_KEY = 'preferredSupjavServer';
                const DEFAULT_SERVER = 'FST';

                GM_registerMenuCommand(`⚙️ 設定 Supjav 預設伺服器`, () => {
                   const v = prompt("輸入 Supjav 伺服器 (TV, FST, ST, VOE):", GM_getValue(CONFIG_KEY, DEFAULT_SERVER));
                   if(v) { GM_setValue(CONFIG_KEY, v.trim().toUpperCase()); location.reload(); }
                });

                const pref = GM_getValue(CONFIG_KEY, DEFAULT_SERVER);

                const clickSupjav = () => {
                    if (supjavServerClickExecuted) return;
                    document.querySelectorAll('a.btn-server').forEach(btn => {
                        if (btn.textContent.trim() === pref) {
                            supjavServerClickExecuted = true;
                            btn.click();
                            setTimeout(() => { if(document.body.contains(btn)) btn.click(); }, 300);
                        }
                    });
                };
                waitForElement('a.btn-server', () => setTimeout(clickSupjav, 300));
            }

            // Javideo
            if (currentHost.includes('javideo.net')) {
                const CONFIG_KEY = 'preferredJavideoServer';
                const DEFAULT_SERVER = 'SW';

                GM_registerMenuCommand(`⚙️ 設定 Javideo 預設伺服器`, () => {
                   const v = prompt("輸入 Javideo 伺服器 (SW, DSTR, STAPE...):", GM_getValue(CONFIG_KEY, DEFAULT_SERVER));
                   if(v) { GM_setValue(CONFIG_KEY, v.trim().toUpperCase()); location.reload(); }
                });

                const pref = GM_getValue(CONFIG_KEY, DEFAULT_SERVER);

                const interval = setInterval(() => {
                    const active = document.querySelector('button[data-id].active');
                    if (active) {
                        clearInterval(interval);
                        if (!active.textContent.trim().startsWith(pref)) {
                            document.querySelectorAll('button[data-id]').forEach(btn => {
                                if (btn.textContent.trim().startsWith(pref)) btn.click();
                            });
                        }
                    }
                }, 500);
                setTimeout(() => clearInterval(interval), 10000);
            }
        }

        try {
            if (!checkAndRedirect()) {
                if (!checkSupjavHelpers()) {
                    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setupServerSelection);
                    else setupServerSelection();
                }
            }
        } catch (e) { console.error(e); }
    }
})();