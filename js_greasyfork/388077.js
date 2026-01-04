// ==UserScript==
// @name         FapForFun/Runka/SulleZZer/XXStep Anti-AdBlock Killer
// @namespace    https://greasyfork.org/en/users/94698-freesolutions
// @version      0.1
// @description  Disables the Anti-AdBlock script across all Runka-based domains
// @author       FreeSolutions
// @match        *://*.fapfor.fun/*
// @match        *://*.runka.online/*
// @match        *://*.sullezzer.com/*
// @match        *://*.xxstep.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/388077/FapForFunRunkaSulleZZerXXStep%20Anti-AdBlock%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/388077/FapForFunRunkaSulleZZerXXStep%20Anti-AdBlock%20Killer.meta.js
// ==/UserScript==

window.canRunAds = true;

if ('MutationObserver' in window) {
    console.log('[Anti-AdBlock Killer] Creating observer');
    var Observer = new MutationObserver(function (Mutations) {
        var self = this;

        Mutations.forEach(function (Mutation) {
            if (Mutation.addedNodes) {
                Mutation.addedNodes.forEach(function (Node) {
                    if (Node.tagName === 'SCRIPT') {
                        if (Node.innerHTML.indexOf('adBlockEnabled') > -1) {
                            console.log('[Anti-AdBlock Killer] Found node! Killing...');
                            Node.innerHTML = Node.innerHTML.replace('adBlockEnabled = true;','adBlockEnabled = false;').replace('con.innerHTML = ','//');
                            self.disconnect();
                        }
                    }
                });
            }
        });
    });

    console.log('[Anti-AdBlock Killer] Starting observer');
    Observer.observe(document.head, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    });

    window.onload = function () {
        console.log('[Anti-AdBlock Killer] Window fully loaded - killing observer');
        Observer.disconnect();
    };
}