// ==UserScript==
// @name           YouTube Shorts Description Mover
// @namespace      https://greasyfork.org/ar/users/1503913-rashad07
// @version        2025.08.11
// @description    Moves YouTube Shorts description to a custom position for better visibility.
// @author         Rashad07
// @match          https://www.youtube.com/shorts/*
// @run-at         document-end
// @icon           https://www.youtube.com/favicon.ico
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/545764/YouTube%20Shorts%20Description%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/545764/YouTube%20Shorts%20Description%20Mover.meta.js
// ==/UserScript==

(function () {
    "use strict";

    function getCurrentThemeIsDark() {
        return document.documentElement.getAttribute("dark") !== null ||
               document.documentElement.classList.contains("dark") ||
               document.documentElement.getAttribute("theme") === "dark" ||
               window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function injectDynamicCSS(isDark) {
        const existing = document.getElementById("clearShortsStyle");
        if (existing) existing.remove();

        const style = document.createElement("style");
        style.id = "clearShortsStyle";
        style.textContent = `
            #metapanel[data-moved] {
                position: absolute !important;
                right: 15px !important;
                bottom: 70px !important;
                z-index: 9999 !important;
                width: 30% !important;
                background: rgba(255, 255, 255, 0) !important;
                font-size: 16px !important;
            }
            #metapanel[data-moved] *,
            #metapanel[data-moved] {
                color: ${isDark ? "#fff" : "#000"} !important;
                fill: ${isDark ? "#fff" : "#000"} !important;
                font-size: 16px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initial style
    injectDynamicCSS(getCurrentThemeIsDark());

    // Detect theme change
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        injectDynamicCSS(e.matches);
    });

    // Recheck periodically
    setInterval(() => {
        injectDynamicCSS(getCurrentThemeIsDark());
    }, 3000);

    function moveMetaPanel() {
        const metapanel = document.getElementById('metapanel');
        const container = document.getElementById('shorts-panel-container');

        if (!metapanel || !container || metapanel.dataset.moved) return;

        container.appendChild(metapanel);
        metapanel.dataset.moved = 'true';

        const styleGuard = setInterval(() => {
            if (!metapanel.isConnected) {
                clearInterval(styleGuard);
                return;
            }
            metapanel.style.cssText = `
                position: absolute !important;
                right: 15px !important;
                bottom: 70px !important;
                z-index: 9999 !important;
                width: 30% !important;
                background: rgba(255, 255, 255, 0) !important;
                font-size: 17px !important;
            `;
        }, 300);

        // Force subscribe button text to black
        setTimeout(() => {
            const subBtn = document.querySelector(
                '#metapanel[data-moved] .ytReelChannelBarViewModelReelSubscribeButton'
            );
            if (subBtn) {
                subBtn.style.setProperty("color", "#000", "important");
                subBtn.style.setProperty("fill", "#000", "important");
                subBtn.querySelectorAll("*").forEach(el => {
                    el.style.setProperty("color", "#000", "important");
                    el.style.setProperty("fill", "#000", "important");
                });
            }
        }, 1000);
    }

    function processShorts() {
        if (!location.pathname.startsWith('/shorts/')) return;
        moveMetaPanel();
        setTimeout(moveMetaPanel, 800);
    }

    let lastURL = location.href;
    const checkSPANav = () => {
        if (location.href !== lastURL) {
            lastURL = location.href;
            processShorts();
        }
        setTimeout(checkSPANav, 200);
    };

    window.addEventListener('yt-navigate-start', processShorts);
    window.addEventListener('yt-navigate-finish', processShorts);
    document.addEventListener('yt-page-data-updated', processShorts);

    checkSPANav();
    new MutationObserver(processShorts).observe(document.body, {
        childList: true,
        subtree: true
    });

})();
