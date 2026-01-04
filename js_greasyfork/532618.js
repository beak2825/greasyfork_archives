// ==UserScript==
// @name         TouchGal 自动跳转
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  跳过5s等待
// @match        https://www.touchgal.us/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532618/TouchGal%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/532618/TouchGal%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    
    function autoRedirect() {
        const currentUrl = location.href;

        
        if (currentUrl === lastUrl) return;
        lastUrl = currentUrl;

        
        if (currentUrl.includes('/redirect?url=')) {
            
            const targetUrl = getUrlParameter('url');

            if (targetUrl) {
                window.location.href = decodeURIComponent(targetUrl);
            }
        }
    }

  
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    autoRedirect();
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function() {
        originalPushState.apply(history, arguments);
        setTimeout(autoRedirect, 100);
    };

    history.replaceState = function() {
        originalReplaceState.apply(history, arguments);
        setTimeout(autoRedirect, 100);
    };

    window.addEventListener('popstate', function() {
        setTimeout(autoRedirect, 100);
    });

    window.addEventListener('hashchange', function() {
        setTimeout(autoRedirect, 100);
    });
})();