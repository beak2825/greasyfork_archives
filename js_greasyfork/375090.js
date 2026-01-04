// ==UserScript==
// @name         Torn City Map hide tiles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove tile images from torn city map
// @author       You
// @match        https://www.torn.com/city.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375090/Torn%20City%20Map%20hide%20tiles.user.js
// @updateURL https://update.greasyfork.org/scripts/375090/Torn%20City%20Map%20hide%20tiles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let target = document.querySelector('.content');
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                //console.log(mutation.addedNodes.item(i));
                if (mutation.addedNodes.item(i) && mutation.addedNodes.item(i).classList && mutation.addedNodes.item(i).classList.contains('leaflet-tile-pane')) {
                    mutation.addedNodes.item(i).style.display = 'none';
                    break;
                }
            }
        });
    });
    // configuration of the observer:
    //let config = { childList: true, subtree: true };
    let config = { childList: true, subtree: true };
    // pass in the target node, as well as the observer options
    observer.observe(target, config);

})();