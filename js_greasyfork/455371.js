// ==UserScript==
// @name         semprot unhide image
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  unhide image on forum semprot while using adblock
// @author       Rizki Aprita
// @include     /https?:\/\/93\.115\.24\.211\/.*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455371/semprot%20unhide%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/455371/semprot%20unhide%20image.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let bbimgs = document.querySelectorAll('.bbImage')
    bbimgs.forEach((bbimg)=>{
    bbimg.classList.remove("adVertical");
})
    // Your code here...
})();