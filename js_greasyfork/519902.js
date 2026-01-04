// ==UserScript==
// @name         eToro - dark mode for charts
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Switches the charts to dark mode
// @author       Bartek Igielski
// @match        https://*.etoro.com/*
// @match        https://etoro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=etoro.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519902/eToro%20-%20dark%20mode%20for%20charts.user.js
// @updateURL https://update.greasyfork.org/scripts/519902/eToro%20-%20dark%20mode%20for%20charts.meta.js
// ==/UserScript==

(function() {
    function changeTheme() {
        const interval = setInterval(() => {
            if (!Object.keys(window).find(key => key.startsWith('tradingview_'))) {
                return
            }

            if (!document.querySelector('[data-widget-options]')?.contentWindow?.tradingViewApi?._activeChartWidget()?._inited) {
                return
            }

           clearInterval(interval)

            setTimeout(() => {
                document.querySelector('[data-widget-options]').contentWindow.tradingViewApi.themes().setStdTheme('dark')     
            }, 500)
        }, 100)
    }

    function emitURLChangeEvent() {
        const event = new CustomEvent("urlChange", { detail: { url: window.location.href } })
        window.dispatchEvent(event);
    }

    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function(...args) {
        originalPushState.apply(this, args)
        emitURLChangeEvent()
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args)
        emitURLChangeEvent()
    };

    window.addEventListener("popstate", emitURLChangeEvent)
    window.addEventListener("load", emitURLChangeEvent)
    window.addEventListener("urlChange", changeTheme)
    changeTheme();
})();