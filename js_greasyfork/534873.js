// ==UserScript==
// @name         Proxy git vortex
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Elifian
// @description  for vortex employees
// @match        https://git.hitomihiumi.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534873/Proxy%20git%20vortex.user.js
// @updateURL https://update.greasyfork.org/scripts/534873/Proxy%20git%20vortex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceLinks() {
        const links = document.querySelectorAll('a[href*="git.lategame.net"]');
        links.forEach(function(element) {
            element.href = element.href.replace("git.lategame.net", "git.hitomihiumi.xyz");
        });
    }

    const observer = new MutationObserver(replaceLinks);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', replaceLinks);
})();