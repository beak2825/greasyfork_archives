// ==UserScript==
// @name         YouTube Windowed Fullscreen
// @name:zh-CN   YouTube 窗口化全屏
// @namespace    https://greasyfork.org/zh-CN/users/529682-%E5%85%BB%E7%8C%AB%E7%9A%84%E9%B1%BC
// @version      1.0
// @description  Modify YouTube's theater mode to windowed fullscreen, and toggle it by pressing ` (backtick) key.
// @description:zh-CN  修改 YouTube 影院模式为窗口化全屏，并可通过按 `（反引号）键开关。
// @author       养猫的鱼
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/30100020/img/logos/favicon_32x32.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541287/YouTube%20Windowed%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/541287/YouTube%20Windowed%20Fullscreen.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let flexyObserver = null;
    let theaterObserver = null;

    // Check if current URL is a video watch page
    function isWatchPage() {
        return location.pathname === "/watch";
    }

    // Watches for <ytd-watch-flexy> to load, then initTheaterObserver(flexy)
    function initFlexyObserver() {
        if (!isWatchPage()) return;
        const flexy = document.querySelector("ytd-watch-flexy");
        if (flexy) {
            initTheaterObserver(flexy);
            return;
        }
        if (flexyObserver) {
            flexyObserver.disconnect();
            flexyObserver = null;
        }
        // Observe DOM for addition of <ytd-watch-flexy>
        flexyObserver = new MutationObserver((mutations, obs) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.tagName?.toLowerCase() === "ytd-watch-flexy") {
                        obs.disconnect();
                        initTheaterObserver(node);
                        return;
                    }
                }
            }
        });
        flexyObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Watches for theater mode toggles, then updateVideoLayout()
    function initTheaterObserver(flexy) {
        if (!isWatchPage()) return;
        updateVideoLayout();
        if (theaterObserver) {
            theaterObserver.disconnect();
            theaterObserver = null;
        }
        // Observe changes to "theater" attribute (when toggles theater mode)
        theaterObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === "attributes" && m.attributeName === "theater") {
                    updateVideoLayout();
                }
            }
        });
        theaterObserver.observe(flexy, { attributes: true, attributeFilter: ["theater"] });
    }

    // Update video window layout based on view mode
    function updateVideoLayout() {
        if (!isWatchPage()) return;
        const masthead = document.getElementById("masthead");
        const pageManager = document.getElementById("page-manager");
        const fullBleedContainer = document.getElementById("full-bleed-container");
        const flexy = document.querySelector("ytd-watch-flexy");
        if (!masthead || !pageManager || !fullBleedContainer || !flexy) return;
        // Stretch video container to viewport height
        fullBleedContainer.style.setProperty("min-height", window.innerHeight + "px");
        if (flexy.hasAttribute("theater")) {
            // Update theater mode layout
            masthead.style.setProperty("display", "none");
            pageManager.style.setProperty("margin-top", "0px");
            fullBleedContainer.style.setProperty("position", "relative");
        } else {
            // Update normal mode layout
            masthead.style.setProperty("display", "block");
            pageManager.style.removeProperty("margin-top");
            fullBleedContainer.style.setProperty("position", "absolute");
        }
    }

    // Handle YouTube's internal SPA navigation
    window.addEventListener("yt-navigate-finish", initFlexyObserver);
    // Update layout when the window resizes
    window.addEventListener("resize", updateVideoLayout);
    // Toggle theater mode with backtick (`) key
    document.addEventListener("keydown", function(e) {
        if (e.key === "`" && !e.repeat && !e.ctrlKey && !e.altKey && !e.metaKey) {
            if (!isWatchPage()) return;
            const theaterButton = document.querySelector('.ytp-size-button');
            if (theaterButton) theaterButton.click();
        }
    });
    // Run initially on page load
    initFlexyObserver();
})();
