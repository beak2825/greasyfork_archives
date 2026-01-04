// ==UserScript==
// @name        优化网页显示的标题和图片
// @name:en     Optimize the display of the title and images
// @namespace   Violentmonkey Scripts
// @match        *://*/*
// @grant       none
// @version     1.6.8
// @author      hoorn
// @icon        https://s2.loli.net/2024/05/29/m5LcD7ZblIrQHXV.png
// @description 用来自定义浏览器显示的标题和图片
// @description:en Used to customize the title and image displayed in the browser
// @license     MIT
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/490240/%E4%BC%98%E5%8C%96%E7%BD%91%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%9A%84%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/490240/%E4%BC%98%E5%8C%96%E7%BD%91%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%9A%84%E6%A0%87%E9%A2%98%E5%92%8C%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const currentHostname = window.location.hostname;
    const currentHost = window.location.host;
    const userAgent = navigator.userAgent;

    executeScriptForBrowserAndPlatform();

    function detectBrowserAndPlatform() {
        let browser, platform;

        // Detect platform
        if (userAgent.match(/Macintosh|Mac OS X/i)) {
            platform = "Mac";
        } else if (userAgent.match(/Windows NT/i)) {
            platform = "Windows";
        } else {
            platform = "Unknown";
        }

        // Detect browser
        if (userAgent.match(/Edg/i)) {
            browser = "Edge";
        } else if (userAgent.match(/OPR|Opera/i)) {
            browser = "Opera";
        } else if (userAgent.match(/Chrome/i)) {
            browser = "Chrome";
        } else if (userAgent.match(/Firefox/i)) {
            browser = "Firefox";
        } else if (userAgent.match(/Safari/i) && !userAgent.match(/Chrome|Chromium|CriOS/i)) {
            browser = "Safari";
        } else {
            browser = "Unknown";
        }

        return { browser, platform };
    }

    function executeScriptForBrowserAndPlatform() {
        const { browser, platform } = detectBrowserAndPlatform();

        switch (platform) {
            case "Mac":
                switch (browser) {
                    case "Chrome":
                        break;
                    case "Edge":
                        logicForEdge();
                        break;
                    case "Firefox":
                        break;
                    case "Safari":
                        break;
                    case "Opera":
                        break;
                    default:
                }
                break;
            case "Windows":
                switch (browser) {
                    case "Chrome":
                        break;
                    case "Edge":
                        logicForEdge();
                        break;
                    case "Firefox":
                        break;
                    case "Safari":
                        break;
                    case "Opera":
                        break;
                    default:
                }
                break;
        }
    }

    function logicForEdge() {
        checkAndApplyTitleOptimization();
        checkAndApplyContentOptimization();
        addShotcut();
    }

    function hiddenContentImage() {
        GM_setValue(`use_image_style_blocker_${currentHostname}`, true);
        applyImageStyleBlocker();
    }

    function showContentImage() {
        GM_setValue(`use_image_style_blocker_${currentHostname}`, false);
        window.location.reload();
    }

    function openTitleOptimization() {
        GM_setValue(`use_title_optimization_${currentHostname}`, true);
        applyImageStyleBlocker();
    }

    function closeTitleOptimization() {
        GM_setValue(`use_title_optimization_${currentHostname}`, false);
        window.location.reload();
    }

    function addShotcut() {
        document.addEventListener('keydown', function (e) {
            if (e.altKey && e.key === 'S') {
                showContentImage();
            }

            if (e.ctrlKey && e.altKey && e.key === 'H') {
                hiddenContentImage();
                updateMenu();
            }

            if (e.ctrlKey && e.altKey && e.key === 'T') {
                openTitleOptimization();
            }

            if (e.ctrlKey && e.altKey && e.key === 'P') {
                closeTitleOptimization();
                updateMenu();
            }
        });
    }

    function updateMenu() {
        const useImageStyleBlocker = GM_getValue(`use_image_style_blocker_${currentHostname}`, false);
        const useTitleOptimization = GM_getValue(`use_title_optimization_${currentHostname}`, false);
        if (useImageStyleBlocker) {
            GM_registerMenuCommand("禁用图片样式屏蔽器", () => {
                GM_setValue(`use_image_style_blocker_${currentHostname}`, false);
                window.location.reload();
            });
            GM_unregisterMenuCommand("启用图片样式屏蔽器", () => {});
        } else {
            GM_registerMenuCommand("启用图片样式屏蔽器", () => {
                GM_setValue(`use_image_style_blocker_${currentHostname}`, true);
                applyImageStyleBlocker();
                updateMenu();
            });
        }
        if (useTitleOptimization) {
            GM_registerMenuCommand("禁用标题优化", () => {
                GM_setValue(`use_title_optimization_${currentHostname}`, false);
                window.location.reload();
            })
            GM_unregisterMenuCommand("启用标题优化", () => {});
        } else {
            GM_registerMenuCommand("启用标题优化", () => {
                GM_setValue(`use_title_optimization_${currentHostname}`, true);
                applyTitleOptimization();
                updateMenu();
            })
        }
    }

    function checkAndApplyContentOptimization() {
        const useImageStyleBlocker = GM_getValue(`use_image_style_blocker_${currentHostname}`, false);
        updateMenu();
        if (useImageStyleBlocker) {
            applyImageStyleBlocker();
        }
    }

    function checkAndApplyTitleOptimization() {
        const useTitleOptimization = GM_getValue(`use_title_optimization_${currentHostname}`, false);
        updateMenu();
        if (useTitleOptimization) {
            applyTitleOptimization();
        }
    }

    function applyImageStyleBlocker() {
        let style = document.createElement('style');
        style.innerHTML = `img,[style*='height:'][style*='width:'] {display: none !important;visibility: hidden; opacity: 0; z-index: -999; width: 0; height: 0; pointer-events: none; position: absolute; left: -9999px; top: -9999px;}`;
        document.head.appendChild(style);
    }

    function applyTitleOptimization() {
        optmizeTitle();
        optmizeTitleImage();
    }

    function optmizeTitle() {
        var pageTitle = document.querySelector('title');
        pageTitle.textContent = '.';
    }

    function optmizeTitleImage() {
        var imageUrl = 'https://s2.loli.net/2024/05/29/m5LcD7ZblIrQHXV.png';
        if (currentHost.includes('reddit.com')) {
            var existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
            existingIcons.forEach(function (icon) {
                icon.parentNode.removeChild(icon);
            });

            var icons = [
                { href: imageUrl, sizes: "64x64" },
                { href: imageUrl, sizes: "128x128" },
                { href: imageUrl, sizes: "192x192" }
            ];
            icons.forEach(function (icon) {
                var link = document.createElement('link');
                link.setAttribute('rel', 'icon shortcut');
                link.setAttribute('sizes', icon.sizes);
                link.setAttribute('href', icon.href);
                document.head.appendChild(link);
            });
            return;
        }
        var icon = document.querySelector('link[rel="icon"]');
        if (icon) {
            icon.href = imageUrl;
        }
        var alternateIcon = document.querySelector('link[rel="alternate icon"]');
        if (alternateIcon) {
            alternateIcon.href = imageUrl
        }
        var shortIcon = document.querySelector('link[rel="shortcut icon"]');
        if (shortIcon) {
            shortIcon.href = imageUrl;
        }
    }
})();
