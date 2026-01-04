// ==UserScript==
// @name         CatWar Прелесть фикс
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  CatWar delete debuff from "Prelest"
// @author       scroptnik
// @match        https://catwar.net/cw3/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.net
// @grant        none
// @run-at      document-start
// @license scroptnik
// @downloadURL https://update.greasyfork.org/scripts/542644/CatWar%20%D0%9F%D1%80%D0%B5%D0%BB%D0%B5%D1%81%D1%82%D1%8C%20%D1%84%D0%B8%D0%BA%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/542644/CatWar%20%D0%9F%D1%80%D0%B5%D0%BB%D0%B5%D1%81%D1%82%D1%8C%20%D1%84%D0%B8%D0%BA%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
				console.log(node.src);
                if (node.nodeName === 'SCRIPT' && node.src && node.src.includes("cw3.js?")) {

                    const replacementScript = document.createElement('script');
                    replacementScript.src = 'https://cdn.jsdelivr.net/gh/scroptnik/cw3_no_schatz@main/new_cw3.js';

                    node.parentNode.replaceChild(replacementScript, node);
                }
            });
        });
    });


    observer.observe(document.head, {
        childList: true,
        subtree: true
    });
})();