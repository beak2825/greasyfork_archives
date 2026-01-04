(function() {
    'use strict';
// ==UserScript==
// @name         Volume denormalize
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Use shift + mouse wheel to change the volume of first video found on page
// @author       Andrei Balashov
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464319/Volume%20denormalize.user.js
// @updateURL https://update.greasyfork.org/scripts/464319/Volume%20denormalize.meta.js
// ==/UserScript==

    addEventListener("wheel", (event) => {
        if(!event.shiftKey){
            return
        }
        if(event.deltaY<0){
            document.querySelector('video').volume *= 1.1
        }else{
            document.querySelector('video').volume *= 0.9
        }
    })

})();