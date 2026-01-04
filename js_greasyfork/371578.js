// ==UserScript==
// @name        Tagesanzeiger Paywall Remover 2019
// @namespace   http://www.tagesanzeiger.ch
// @version     0.6
// @description The userscript removes the "paywall" after site load.
// @match       *://*.tagesanzeiger.ch/*
// @copyright   2019 @fabacam based on Script from honsa and Vinz666
// @downloadURL https://update.greasyfork.org/scripts/371578/Tagesanzeiger%20Paywall%20Remover%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/371578/Tagesanzeiger%20Paywall%20Remover%202019.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // check if on article page
    window.addEventListener('load', function() {
        // some css
        if (document.getElementsByClassName("o-tamedia-wrapper")) {
            setTimeout(function(){
                document.getElementsByClassName("o-tamedia-wrapper")[0].parentNode.style.display = 'none';
                document.getElementsByTagName('body')[0].classList.remove("h-disable-scroll");
                document.getElementsByTagName('body')[0].style.cssText = 'overflow: auto !important';
                document.getElementsByTagName('body')[0].style.userSelect = 'auto';
                // remove Ads
                document.getElementsByClassName('teads-inread').style.display = 'none';
                document.getElementsByClassName('ivbsAdOptions').style.display = 'none';
                // remove iFrames
                var iframeAds = document.getElementsByTagName('iframe');
                for (var i=0; i<iframeAds.length; i++){
                     iframeAds[i].style.display = "none";
                }
            }, 1750);
        }
    }, false);
})();