// ==UserScript==
// @name         Install VS Code Extensions in Cursor
// @namespace    rasmusbe/vscode-cursor
// @version      2025-03-05
// @license      MIT
// @description  Changes the install button to install in Cursor
// @match        https://marketplace.visualstudio.com/items?itemName=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visualstudio.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528858/Install%20VS%20Code%20Extensions%20in%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/528858/Install%20VS%20Code%20Extensions%20in%20Cursor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observeDOM = (function() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function(obj, callback) {
            if (!obj || obj.nodeType !== 1) {
                return;
            }

            if (MutationObserver) {
                // define a new observer
                const mutationObserver = new MutationObserver(callback);

                // have the observer observe for changes in children
                mutationObserver.observe(obj, {childList: true, subtree: true});
                return mutationObserver;
            } else if (window.addEventListener) { // browser support fallback
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    })();

    const fixLink = () => {
        const installButton = document.querySelector("a.install");
        installButton.href = installButton.href.replace(/^vscode:/, "cursor:")
    }
    fixLink();

    const reactRoot = document.querySelector("[data-reactroot]");
    observeDOM(reactRoot, function(m) {
        fixLink();
    });
})();