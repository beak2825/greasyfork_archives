// ==UserScript==
// @name         IC Pervfrog
// @namespace    http://tampermonkey.net/
// @version      2024-03-22
// @description  Replaces the IC image generator failure image with a toad
// @author       Rokker
// @match        https://www.bing.com/images/create*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489575/IC%20Pervfrog.user.js
// @updateURL https://update.greasyfork.org/scripts/489575/IC%20Pervfrog.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(()=>{
        let result = document.querySelector('#girer .gil_err_img:not(.toad):not(.block_icon)');
        if(result){
            result.src = 'https://images.nightcafe.studio/jobs/ioL9owaE1dWR7tmV1cTH/ioL9owaE1dWR7tmV1cTH-aPH_9.jpg'
            result.classList.add('toad');
        }
    }, 50);
})();