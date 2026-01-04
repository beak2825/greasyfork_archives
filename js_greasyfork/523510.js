// ==UserScript==
// @name        wurlz/yurls Bypasser
// @namespace   http://tampermonkey.net/
// @match       https://wurlz.com/**
// @match       https://yurlz.com/**
// @grant       none
// @version     1.0
// @author      -
// @description Bypasses the timer enforced by wurlz/yurlz.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523510/wurlzyurls%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/523510/wurlzyurls%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const scriptContent = script.textContent || '';
            if (/\$\("a\.redirect"\)\.attr\("href","https?:\/\/.*?"\)/.test(scriptContent) &&
                /.attr\("href","https:\/\/.*?"\)/.test(scriptContent)) {
                const urlMatch = scriptContent.match(/https?:\/\/.*?"/);
                if (urlMatch && urlMatch[0]) {
                    const targetUrl = urlMatch[0].substring(0, urlMatch[0].length - 1);
                    console.log(`Identified URL: ${targetUrl}`)
                    window.location.href = targetUrl;
                }
            }
        });
    });
})();