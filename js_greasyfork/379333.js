// ==UserScript==
// @name         RecoloredDiff
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Microblink
// @include      /^https:\/\/(mls|mb2).microblink.com\/eval\?model.*&model2.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379333/RecoloredDiff.user.js
// @updateURL https://update.greasyfork.org/scripts/379333/RecoloredDiff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function recolor() {
        document.querySelector('#root > div > div.container-fluid > div > div.col-md-9 > div > table:nth-child(2) > tbody').childNodes.forEach(function(entry) {
            Array.prototype.forEach.call(entry.children, child => {
                if ( child.style.backgroundColor.match( /rgba\(0, 255, 0, .*\..*\)/g )) {
                    child.style.backgroundColor = 'rgba(0, 255, 0, 0.5)';
                }
            });
        });
    }

    document.addEventListener("keypress", recolor);

})();