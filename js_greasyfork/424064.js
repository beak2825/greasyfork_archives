// ==UserScript==
// @name        TradingView Charts - close Go Pro Ads
// @namespace   Violentmonkey Scripts
// @match       https://www.tradingview.com/chart/*
// @grant       none
// @version     1.0
// @author      https://greasyfork.org/en/users/752104-alexleekt
// @description 3/27/2021, 11:03:36 AM
// @downloadURL https://update.greasyfork.org/scripts/424064/TradingView%20Charts%20-%20close%20Go%20Pro%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/424064/TradingView%20Charts%20-%20close%20Go%20Pro%20Ads.meta.js
// ==/UserScript==

// https://stackoverflow.com/questions/10415400/jquery-detecting-div-of-certain-class-has-been-added-to-dom
function onElementInserted(containerSelector, elementSelector, callback) {
    var onMutationsObserved = function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                var elements = $(mutation.addedNodes).find(elementSelector);
                for (var i = 0, len = elements.length; i < len; i++) {
                    callback(elements[i]);
                }
            }
        });
    };
    var target = $(containerSelector)[0];
    var config = { childList: true, subtree: true };
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(onMutationsObserved);    
    observer.observe(target, config);

}

function setupAutoClickCloseButtonInside(selector) {
  onElementInserted('body', selector, function(element) {
    console.log("close " + selector);
    $(selector + ' > button').click()
  });
}

// https://stackoverflow.com/questions/3204632/jquery-get-a-element-class-based-on-a-prefix
setupAutoClickCloseButtonInside('[data-dialog-name="gopro"]');
setupAutoClickCloseButtonInside('article[class*=" trial-notification-"]'); 
