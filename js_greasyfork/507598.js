// ==UserScript==
// @name         Kemono.Party - Fix Discord external links
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  Fix external links on Kemono's Discord mirrors
// @author       eientei
// @match        https://*.kemono.su/discord/server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.su
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507598/KemonoParty%20-%20Fix%20Discord%20external%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/507598/KemonoParty%20-%20Fix%20Discord%20external%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function rewriteLinks(links) {
        links.forEach(link => {
            if (link.href.includes('/data/https://')) {
                link.href = link.href.replace(/.*\/data\//, '');
            }
        });
    }
    rewriteLinks(document.querySelectorAll('.message > div > a[href*="/data/https://"]'));
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const newLinks = node.querySelectorAll?.('.message > div > a[href*="/data/https://"]');
                    if (newLinks?.length) {
                        rewriteLinks(newLinks);
                    }
                }
            });
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();