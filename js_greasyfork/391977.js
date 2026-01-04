// ==UserScript==
// @name         MegaUp.net Anti-AdBlock Nuke
// @namespace    https://greasyfork.org/en/users/94698-freesolutions
// @version      0.2
// @description  Disables the Anti-AdBlock script on MegaUp.net
// @author       FreeSolutions
// @match        *://*.megaup.net/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/391977/MegaUpnet%20Anti-AdBlock%20Nuke.user.js
// @updateURL https://update.greasyfork.org/scripts/391977/MegaUpnet%20Anti-AdBlock%20Nuke.meta.js
// ==/UserScript==

if ('MutationObserver' in window)
{
    console.log('[Anti-AdBlock Killer] Creating observer');
    var observer = new MutationObserver(function (mutations, observer) {
        for (var i = 0; i < mutations.length; i++)
        {
            var mutation = mutations[i];

            if (mutation.addedNodes) {
                for (var n = 0; n < mutation.addedNodes.length; n++) {
                    var node = mutation.addedNodes[n];

                    if (node.tagName === 'SCRIPT') {
                        if (node.innerHTML.indexOf('adblock') > -1) {
                            console.log('[Anti-AdBlock Killer] Found script node! Killing...');
                            node.innerHTML = '';
                        }
                    }
                }
            }
        }
    });

    console.log('[Anti-AdBlock Killer] Sarting observer');
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    window.onload = function () {
        console.log('[Anti-AdBlock Killer] Window fully loaded - killing observer');
        observer.disconnect();
    };
}
