// ==UserScript==
// @name         Ad remover
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  Join my discord server https://discord.gg/yu4AVeW3yu!
// @author       Woltk
// @license      
// @match        https://scenexe2.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scenexe2.io
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/492010/Ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/492010/Ad%20remover.meta.js
// ==/UserScript==
javascript:(function(){
    var selectors = [
        '#ad-container', '.ad-header', '.ad-sidebar', '.ad-content',
        '.ad-footer', 'ins.adsbygoogle', 'iframe'
    ];
    for(let i in selectors) {
        let nodesList = document.querySelectorAll(selectors[i]);
        for(let i = 0; i < nodesList.length; i++) {
            let el = nodesList[i];
            if(el && el.parentNode)
                el.parentNode.removeChild(el);
        }
    }
})();