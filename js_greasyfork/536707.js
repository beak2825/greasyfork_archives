// ==UserScript==
// @name NewToki(Manatoki) Ad Blocker
// @namespace http://tampermonkey.net/
// @version 0.4
// @description Block ads on NewToki(Manatoki) sites
// @author Zerglrisk
// @include *://*.manatoki*/*
// @include *://*.newtoki*/*
// @include *://manatoki*/*
// @include *://newtoki*/*
// @include *://funbe*.com/*
// @grant none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536707/NewToki%28Manatoki%29%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/536707/NewToki%28Manatoki%29%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function removeAds() {
        // manatoki or newtoki
        if (window.location.href.indexOf('manatoki') > -1 || window.location.href.indexOf('newtoki') > -1) {
            const adLinks = document.querySelectorAll('a[href*="bbs/linkbn.php"]');
            const count = adLinks.length;
            adLinks.forEach(link => {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });
            console.log('newtoki(manatoki) ' + count + ' ads removed');
        }
        
        // funbe
        if (window.location.href.indexOf('funbe') > -1) {
            document.querySelector('div.mobile-banner:not(.section)')?.remove(); // top banner
            document.querySelectorAll('[id^=banner]')?.forEach((e) => e.remove()); // inside banner
            
            // ad-provider.js 스크립트를 포함하는 상위 div 삭제
            const adProviderScripts = document.querySelectorAll('script[src*="ad-provider.js"]');
            adProviderScripts.forEach(script => {
                const parentDiv = script.closest('div');
                if (parentDiv) {
                    parentDiv.remove();
                    console.log('ad-provider.js container div removed');
                }
            });
            
            console.log('funbe ads removed');
        }
    }
    
    console.log('Start NewToki(Manatoki) Ad Blocker');
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAds);
    } else {
        removeAds();
    }
    
    const observer = new MutationObserver(removeAds);
    
    function startObserver() {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            setTimeout(startObserver, 10);
        }
    }
    
    startObserver();
    // setInterval(removeAds, 1000);
    
})();