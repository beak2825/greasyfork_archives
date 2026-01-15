// ==UserScript==
// @name        Vector additions
// @namespace   Taichikuji - https://github.com/taichikuji
// @description Automatically refreshes case list for Salesforce Cases every 60 seconds. Also removes tabs within Vector to have a squeaky clean interface.
// @match       https://*.lightning.force.com/lightning/page/home
// @match       https://*.lightning.force.com/lightning/o/Case/*
// @match       https://*.lightning.force.com/visualforce/recsession
// @match       https://*.lightning.force.com/lightning/r/Dashboard/*
// @match       https://*.lightning.force.com/lightning/r/Report/*
// @exclude     https://*.lightning.force.com/lightning/r/LiveAgentSession/*
// @version     2.1
// @grant       none
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456819/Vector%20additions.user.js
// @updateURL https://update.greasyfork.org/scripts/456819/Vector%20additions.meta.js
// ==/UserScript==

(function() {
    const redirect = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('startURL')) {
            const startURL = decodeURIComponent(urlParams.get('startURL'));
            const newUrl = `${window.location.origin}${startURL}`;
            window.location.replace(newUrl);
        } else if (window.location.pathname.includes('/visualforce/recsession')) {
            const newPathname = window.location.pathname.replace('/visualforce/recsession', '/lightning/page/home');
            const newUrl = `${window.location.origin}${newPathname}`;
            window.location.replace(newUrl);
        }
    };

    const autorefresh = async () => {
        try {
            if (document.readyState === 'loading' || document.readyState === 'interactive') {
                console.debug('[USERSCRIPT] Waiting for DOM/Components to load...');
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                    setTimeout(resolve, 5000);
                });
                // Give Salesforce a moment to render components after DOM load
                await wait(2000);
            } else {
                // Script run on already loaded page (interval or manual trigger)
                // Short wait to ensure UI stability, but much faster than 3s
                await wait(250);
            }

            console.debug('[USERSCRIPT] Proceeding with refresh actions');
            console.debug('[USERSCRIPT] Attempting to close modal/popups...');
            await clickButtons(".slds-button.slds-button_icon.slds-button_icon-x-small.slds-button_icon-container");
            console.debug('[USERSCRIPT] Attempting to click .refresh buttons');
            await clickButtons(".refresh");
            console.debug('[USERSCRIPT] Attempting to click .report-action-refreshReport')
            await clickButtons(".report-action-refreshReport");

            const refreshViewEvent = $A?.get('e.force:refreshView');
            if (refreshViewEvent) {
                console.debug('[USERSCRIPT] Refreshing view via Aura event');
                refreshViewEvent.fire();
            } else {
                console.debug('[USERSCRIPT] $A (Aura) not found or refreshView event failed to retrieve.');
            }
            console.debug('[USERSCRIPT] Done! Waiting for next cycle.');
        } catch (error) {
            console.error('[USERSCRIPT] Error during autorefresh:', error);
        }
    };

    const clickButtons = async (selector) => {
        const mainButtons = document.querySelectorAll(selector);
        if (mainButtons.length > 0) {
            for (const button of mainButtons) {
                button.click();
                await wait(50);
            }
            return;
        }

        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                // Accessing contentWindow.document on cross-origin frames throws SecurityError.
                // contentDocument is null for cross-origin frames, which is safer.
                const iframeDoc = iframe.contentDocument;
                if (iframeDoc) {
                    const iframeButtons = iframeDoc.querySelectorAll(selector);
                    if (iframeButtons.length > 0) {
                        for (const button of iframeButtons) {
                            button.click();
                            await wait(50);
                        }
                        return;
                    }
                }
            } catch (error) {
                console.debug('[USERSCRIPT] Error found while accessing iframe:', error);
            }
        }
    };

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const executeAutorefresh = async () => {
        await autorefresh();
        setTimeout(executeAutorefresh, 60000);
    };

    const handleKeydown = async (event) => {
        if (event.shiftKey && event.key === 'R') {
            await autorefresh();
        }
    };

    window.addEventListener('keydown', handleKeydown);

    redirect();
    executeAutorefresh();
})();
