// ==UserScript==
// @name        Get around TradingView annoyances
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   DisableConfirmationDialogWhenLeavingAWebPage
// @description Hide TradingView nag modals & Disable Confirmation Dialog When Leaving A Web Page
// @author      kboudy
// @include     https://tradingview.com/*
// @include     https://www.tradingview.com/*
// @version     1.5
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/396475/Get%20around%20TradingView%20annoyances.user.js
// @updateURL https://update.greasyfork.org/scripts/396475/Get%20around%20TradingView%20annoyances.meta.js
// ==/UserScript==

(() => {
    // Hide TradingView modals
    GM_addStyle(`.tv-gopro-dialog { display: none !important; }`);

    // Hide ads
    const checkAd = setInterval(() => {
        const adBox = document.getElementById('tv-toasts');
        if (adBox) {
            adBox.remove();
            // console.log('ad removed.');
        } else {
            // console.log('no ad present.');
        }
    }, 500);

    // Disable Confirmation Dialog When Leaving A Web Page
    EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener)
    {
        if(type=="beforeunload")
        {
            return; //ignore attempts to add a beforeunload event
        }
        this.addEventListenerBase(type, listener); //treat all other events normally
    };
})();
