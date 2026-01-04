// ==UserScript==
// @name        Vector additions
// @namespace   Taichikuji - https://github.com/taichikuji
// @description Automatically refreshes case list for Salesforce Cases every 60 seconds. Also removes tabs within Vector to have a squeaky clean interface.
// @match       https://*.lightning.force.com/lightning/page/home
// @match       https://*.lightning.force.com/lightning/o/Case/*
// @match       https://*.lightning.force.com/visualforce/recsession
// @match       https://nutanix.lightning.force.com/lightning/r/Dashboard/*
// @exclude     https://*.lightning.force.com/lightning/r/LiveAgentSession/*
// @version     1.8.1
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
            console.debug('[USERSCRIPT] Waiting for DOM');
            if (document.readyState === 'interactive') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                    setTimeout(resolve, 5000);
                });
            }
            await wait(3000);
            console.debug('[USERSCRIPT] DOM loaded, proceeding');
            await clickButtons(".slds-button.slds-button_icon.slds-button_icon-x-small.slds-button_icon-container");
            await clickButtons(".refresh");
            const refreshViewEvent = $A?.get('e.force:refreshView');
            if (refreshViewEvent) {
                console.debug('[USERSCRIPT] Refreshing view')
                refreshViewEvent.fire();
            }
        } catch (error) {
            console.error('[USERSCRIPT] Error during autorefresh:', error);
        }
    };

    const clickButtons = async (selector) => {
        const mainButtons = document.querySelectorAll(selector);
        if (mainButtons.length > 0) {
            mainButtons.forEach(async button => {
                button.click();
                await wait(100);
            });
            return;
        }

        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                    const iframeButtons = iframeDoc.querySelectorAll(selector);
                    if (iframeButtons.length > 0) {
                        iframeButtons.forEach(async button => {
                            button.click();
                            await wait(100);
                        });
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
