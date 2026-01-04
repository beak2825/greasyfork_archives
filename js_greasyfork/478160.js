// ==UserScript==
// @name         ScratchBLOX
// @namespace    http://ba4x.pro
// @version      0.1
// @description  A userscript that somewhat turns scratch into ROBLOX.
// @author       dumorando
// @match        https://scratch.mit.edu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scratch.mit.edu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478160/ScratchBLOX.user.js
// @updateURL https://update.greasyfork.org/scripts/478160/ScratchBLOX.meta.js
// ==/UserScript==

// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!
// !! USE THIS IN COMBINATION WITH SCRATCH ADDONS TO LOOK BETTER !!

(function() {
    'use strict';

    function doeverything() {
        var logo = document.querySelector('#navigation .logo a');
        if (logo) {
            logo.style.backgroundImage = 'url("https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Roblox_logo_2015.png/800px-Roblox_logo_2015.png")';
        }
        var navbar = document.querySelector("#navigation");
        if (navbar) {
            navbar.style.background = "linear-gradient(#1951A4, #173866)";
        }
    }

    doeverything();
    // Create a new favicon link element
    var newFavicon = document.createElement('link');
    newFavicon.type = 'image/x-icon';
    newFavicon.rel = 'icon';
    newFavicon.href = 'https://bost.ba4x.pro/storage/6537b881f133b_favicon.ico';
    var existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
        document.head.removeChild(existingFavicon);
    }
    document.head.appendChild(newFavicon);
    document.title = "ROBLOX";
})();