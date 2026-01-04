// ==UserScript==
// @name         arras.io fov changer by KarstenKirsche
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  custom fov for arras.io!
// @author       You
// @match        https://arras.io/
// @icon         https://www.google.com/s2/favicons?domain=arras.io
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/479363/arrasio%20fov%20changer%20by%20KarstenKirsche.user.js
// @updateURL https://update.greasyfork.org/scripts/479363/arrasio%20fov%20changer%20by%20KarstenKirsche.meta.js
// ==/UserScript==

// with this script, you get a higher fov!
 

let lock = 0;
document.addEventListener('keydown', function(event) {
    if (event.code === "Keyx" && !lock) {
        Array.prototype.shift = new Proxy(Array.prototype.shift, {
            apply(shift, array, args) {
                if (array[0] === 'u') {
                    array[4] = array[4] * 5;
                    lock = 1;
                }
                return shift.apply(array, args);
            }
        });
    }
});



(function() {
 
 
 
    'use strict';
alert("Injected Hacks by KastenKirsche");
 
    
})();