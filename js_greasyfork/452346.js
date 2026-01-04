// ==UserScript==
// @name           Thingiverse AdBlock
// @description    Blocks ads from Thingiverse 
// @description:de Blendet Werbung auf Thingiverse aus
// @author         Tobse
// @license        MIT
// @name:de        Thingiverse AdBlock
// @name:en        Thingiverse AdBlock
// @match          https://www.thingiverse.com/thing*
// @run-at         document-idle
// @version        0.1.2.20221001100000
// @namespace      https://github.com/TobseF
// @downloadURL https://update.greasyfork.org/scripts/452346/Thingiverse%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/452346/Thingiverse%20AdBlock.meta.js
// ==/UserScript==

function blockAds(){
    let found = '';
    let i = 0;
    let query = "//div[contains(@class,\"AdCard\")]"
    do {
        found  = document.evaluate(query, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue
        if(found  != null){
            found.remove()
        }
    } while (found  != null && i < 10);
}

(new MutationObserver(waitForGallery)).observe(document, {childList: true, subtree: true});

function waitForGallery(changes, observer) {
    // Wait until image gallery is visible
    if (document.querySelector('[class^="AdCard"]')) {
        observer.disconnect();
        blockAds();
    }
}