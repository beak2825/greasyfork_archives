// ==UserScript==
// @name         Activate Lattice
// @namespace    http://cleverse.com/
// @version      0.1
// @description  activate cleverse lattice
// @author       You
// @match        https://cleverse.latticehq.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458476/Activate%20Lattice.user.js
// @updateURL https://update.greasyfork.org/scripts/458476/Activate%20Lattice.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let haveRemoved = false
    function removeBG() {
        var doc = document.getElementsByClassName('css-i3w69h')[0]
        if (doc) {
            doc.remove()
            haveRemoved = true
        }

        if (!doc && !haveRemoved) {
            let eles = document.getElementsByTagName('div')
            for (let ele of eles) {
                if(getComputedStyle(ele).backgroundColor === 'rgba(20, 20, 52, 0.8)') {
                    b = ele
                    ele.remove()
                }
            }
        }
    }
    setInterval(removeBG, 1000)
    window.addEventListener('locationchange', removeBG);

})();