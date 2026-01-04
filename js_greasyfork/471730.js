// ==UserScript==
// @name         Upgrade "𝕏" logo to Wayland
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  to get ahead of the inevitable migration, this replaces the 𝕏 logo with the Wayland logo
// @author       Eli T. Drumm
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_addElement
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/471730/Upgrade%20%22%F0%9D%95%8F%22%20logo%20to%20Wayland.user.js
// @updateURL https://update.greasyfork.org/scripts/471730/Upgrade%20%22%F0%9D%95%8F%22%20logo%20to%20Wayland.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Wayland_Logo.svg/399px-Wayland_Logo.svg.png?20210508213124'

    // Create a new MutationObserver instance
    var observer = new MutationObserver(function(mutations) {
        // For each mutation
        mutations.forEach(function(mutation) {
            // If new nodes are added
            if(mutation.addedNodes) {
                // Find the first h1 tag
                var h1 = document.getElementsByTagName("h1")[0]

                if(h1) {
                    // Get the first child of h1
                    var firstChild = h1.childNodes[0]

                    if(firstChild) {
                        // Get the first child of the first child of h1
                        var firstGrandchild = firstChild.childNodes[0]

                        if(firstGrandchild) {
                            // Remove the first child of the first child of the first h1 tag
                            firstChild.removeChild(firstGrandchild)
                        }


                        GM_addElement(firstChild, 'img', {
                            src: url,
                            height: '60px',
                            style: 'margin-top: 10px; margin-left: 10px;'
                        })

                        // Disconnect the observer when we've found and manipulated the h1
                        observer.disconnect()
                    }
                }
            }
        })
    })

    // Configuration of the observer
    var config = { childList: true, subtree: true }

    // Pass in the target node (in this case, the whole document) and the observer options
    observer.observe(document, config)
})();