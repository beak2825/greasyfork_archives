// ==UserScript==
// @name remove anti-adblock for cnbeta
// @namespace null
// @version 1.2.4
// @description remove red alert top of cnbeta
// @author Anonymous
// @match *://*.cnbeta.com/*
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/24145/remove%20anti-adblock%20for%20cnbeta.user.js
// @updateURL https://update.greasyfork.org/scripts/24145/remove%20anti-adblock%20for%20cnbeta.meta.js
// ==/UserScript==

(function(){
    'use strict';
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var clearAd = function clearAd(){
        var adNodes=document.querySelectorAll('a[href$="/articles/3.htm"]');
        if(adNodes.length>0){
            var ad=adNodes[0];
            var body=document.getElementsByTagName('body')[0];
            var adContainer=ad.parentNode.parentNode.parentNode;
            var mainContainer=adContainer.parentNode;
            mainContainer.removeChild(adContainer);
            body.style="";
        }
    };
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            clearAd();
        });
    });
    var config = { attributes: true, childList: true, subtree: true, characterData: true };
    observer.observe(document, config);
})();