// ==UserScript==
// @name          Komica: Remove Tag
// @version       1.0.2
// @description   Remove tag on Komica.
// @author        Hayao-Gai
// @namespace	  https://github.com/HayaoGai
// @icon          https://i.imgur.com/ltLDPGc.jpg
// @match         http*://*.komica.org/*/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/386801/Komica%3A%20Remove%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/386801/Komica%3A%20Remove%20Tag.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {

    'use strict'

    main()

    function main () {

        for ( let i = 0; i < 10; i++ ) setTimeout( removeTag, i * 500 )

    }

    function removeTag() {

        document.querySelectorAll(".category").forEach( tag => tag.remove() )

    }

})()
