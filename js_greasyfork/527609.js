// ==UserScript==
// @name         NexusMods 自动下载
// @namespace    https://github.com/Jeffrey131313/nexus-auto-download/
// @version      0.4
// @description  如果Mod只有一个文件, 它会自动帮你点缓慢下载, 如果Mod有多个文件, 你选好要下载的文件后, 它会自动帮你点缓慢下载
// @author       Jeffrey131313
// @match        https://www.nexusmods.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527609/NexusMods%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/527609/NexusMods%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentUrl = window.location.href;
    let checkInterval = null;

    function urlChangeCallback() {
        console.log('检测到页面变化，重启下载检测');
        stopChecking();
        startChecking();
    }

    function startChecking() {
        checkInterval = setInterval(mainLogic, 500);
        setTimeout(() => stopChecking(), 20000);
    }

    function stopChecking() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
    }

    function mainLogic() {
        const urlParams = new URLSearchParams(location.search);
        const isFilePage = urlParams.has('file_id');

        if (isFilePage) {
            const slowBtn = document.getElementById('slowDownloadButton');
            if (slowBtn) {
                console.log('点击慢速下载');
                slowBtn.click();
                stopChecking();
                verifyDownloadSuccess();
            }
        } else {
            const fileAlert = document.querySelector('a.selected span.alert');
            if (fileAlert?.textContent?.trim() === '1') {
                console.log('检测到单个文件');
                const manualBtn = document.querySelector(
                    'a[data-tracking*="Manual Download"]'
                );
                if (manualBtn) {
                    console.log('点击手动下载');
                    manualBtn.click();
                    stopChecking();
                }
            }
        }
    }

    function verifyDownloadSuccess() {
        setTimeout(() => {
            if (document.getElementById('fastDownloadButton')) {
                console.log('下载可能失败，按钮仍然存在');
            }
        }, 2000);
    }

    const historyPushState = window.history.pushState;
    const historyReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
        historyPushState.apply(window.history, args);
        urlChangeCallback();
        currentUrl = window.location.href;
    };

    window.history.replaceState = function(...args) {
        historyReplaceState.apply(window.history, args);
        urlChangeCallback();
        currentUrl = window.location.href;
    };

    window.addEventListener('popstate', () => {
        if (window.location.href !== currentUrl) {
            urlChangeCallback();
            currentUrl = window.location.href;
        }
    });

    window.addEventListener('hashchange', () => {
        if (window.location.href !== currentUrl) {
            urlChangeCallback();
            currentUrl = window.location.href;
        }
    });

    setInterval(() => {
        if (window.location.href !== currentUrl) {
            urlChangeCallback();
            currentUrl = window.location.href;
        }
    }, 1000);

    startChecking();
})();