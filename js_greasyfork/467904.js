// ==UserScript==
// @name         Delete Node
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes the broken icon
// @author       You
// @match        https://vanced-youtube.neocities.org/2013/test
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neocities.org
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/467904/Delete%20Node.user.js
// @updateURL https://update.greasyfork.org/scripts/467904/Delete%20Node.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elSpan = document.querySelector('#gbgs5.gbts');
    if (elSpan) {
        //console.info('found element', elSpan);
        elSpan.remove();
    }
})();