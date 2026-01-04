// ==UserScript==
// @name         禁用懒加载
// @version      1.2
// @description  移除页面的所有懒加载（lazy load，按需加载），尝试加载完全部内容。Attempts to disable lazy loading scripts. 
// @match        *://*/*
// @author         yzcjd
// @author2       Lama AI 辅助
// @exclude      *://*.cloudflare.com/*
// @exclude      *://*.recaptcha.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1171320
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/522013/%E7%A6%81%E7%94%A8%E6%87%92%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/522013/%E7%A6%81%E7%94%A8%E6%87%92%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //This is a VERY incomplete list, and many lazy loading implementations will not be caught by this.
    const lazyLoadScriptPatterns = [
        'lazysizes',
        'lazyload',
        'lozad',
        'intersectionobserver' // This is a common API, but some websites might use it without lazy-loading
    ];


    function disableLazyLoading() {
        lazyLoadScriptPatterns.forEach(pattern => {
            let scripts = document.querySelectorAll(`script[src*="${pattern}"], script[src*="${pattern}.min}"]`);
            scripts.forEach(script => {
                script.remove();
                console.log(`Removed script: ${script.src}`);
            });
        });

        //Attempt to remove inline lazy loading functions (very unreliable)
        let scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const scriptContent = script.textContent;
            if(scriptContent.includes('lazyload') || scriptContent.includes('IntersectionObserver')){
                console.log('Potentially lazyload script detected.  Removing (this may break the site!): ', scriptContent);
                script.remove();
            }
        });
    }

    disableLazyLoading();


})();