// ==UserScript==
// @name         supjav與其它網站優化
// @namespace    http://tampermonkey.net/
// @version      2.6.1
// @description  Supjav, Jable, Tktube, Javtiful 優化 (日文導向+伺服器選擇+FC2修正+空搜尋跳轉) + 影片預設靜音 (智慧型偵測播放)
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

    // ==============================================
    // 1. 智慧型靜音 2.0 (Smart Mute 2.0)
    // ==============================================
    const MUTE_CONFIG_KEY = 'enableAutoMute';
    const isMuteEnabled = GM_getValue(MUTE_CONFIG_KEY, true);

    function setupSmartMute() {
        if (!isMuteEnabled) return;

        function monitorVideo(video) {
            // 避免重複綁定
            if (video.dataset.scriptMonitored) return;
            video.dataset.scriptMonitored = "true";

            // 狀態標記
            let isEnforcing = false;
            let enforceTimer = null;

            // 執行靜音動作
            const forceMute = () => {
                if (!video.muted || video.volume > 0) {
                    video.muted = true;
                    video.volume = 0;
                }
            };

            // 啟動鎖定機制
            const startEnforcement = () => {
                // 1. 立即執行一次
                forceMute();
                isEnforcing = true;

                // 2. 設定 4 秒倒數 (從真正播放開始算)
                if (enforceTimer) clearTimeout(enforceTimer);
                enforceTimer = setTimeout(() => {
                    isEnforcing = false;
                    console.log(`腳本: 靜音鎖定解除，控制權交還用戶 (${currentHost})`);
                }, 4000); // 4秒緩衝
            };

            // --- 事件監聽 ---

            // 1. 剛發現影片時，先無條件關一次
            forceMute();

            // 2. 當影片「元數據載入完成」時
            video.addEventListener('loadedmetadata', forceMute);

            // 3. 當影片「真正開始播放」時 (解決 ST 載入慢的問題)
            // 不管轉圈圈多久，只要畫面一動 (playing)，就啟動 4 秒鎖定
            video.addEventListener('playing', () => {
                startEnforcement();
            });

            // 4. 監聽音量變化
            // 只有在鎖定期間 (isEnforcing = true) 才干涉
            video.addEventListener('volumechange', () => {
                if (isEnforcing) {
                    forceMute();
                }
            });
        }

        // 監控 DOM 變化 (針對動態加載的影片)
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

        // 初始掃描
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('video').forEach(monitorVideo);
        });
    }

    // 啟動靜音模組
    setupSmartMute();


    // ==============================================
    // 2. 主控邏輯 (僅主視窗)
    // ==============================================
    if (isTopWindow) {
        // --- 選單 ---
        GM_registerMenuCommand(`🔇 影片預設靜音: ${isMuteEnabled ? '✅ 開啟' : '❌ 關閉'}`, () => {
            GM_setValue(MUTE_CONFIG_KEY, !isMuteEnabled);
            location.reload();
        });

        let supjavServerClickExecuted = false;

        // --- 網址檢查與重定向 ---
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

        // --- Supjav 輔助 ---
        function checkSupjavHelpers() {
            // 空搜尋
            if (window.location.href.match(/^https:\/\/supjav\.com\/ja\/\?s=$/)) {
                window.location.href = 'https://supjav.com/ja/';
                return true;
            }
            // FC2 參數
            const fc2Regex = /([?&])s=FC2-(\d{6,7})(&|$)/;
            if (window.location.href.includes('supjav.com') && fc2Regex.test(window.location.href)) {
                window.location.href = window.location.href.replace(fc2Regex, '$1s=$2$3');
                return true;
            }
            return false;
        }

        // --- 伺服器自動點擊 ---
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
                console.log(`Javideo 偏好: ${pref}`);
                
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

        // 執行主流程
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