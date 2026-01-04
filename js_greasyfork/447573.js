// ==UserScript==
// @name         Kirka.io Adblocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks all ads
// @run-at       document-end
// @author       You
// @match        https://kirka.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kirka.io
// @grant        none
// @use          ES6
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447573/Kirkaio%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/447573/Kirkaio%20Adblocker.meta.js
// ==/UserScript==

(function() {
    const adLeft = document.getElementById('ad-left');
    const adBottom = document.getElementById('ad-bottom');
    const addBlocker = setInterval(()=>{
        if(adBottom) { adBottom.remove() };
        if(adLeft) { adLeft.remove() };
        if(!adLeft && !adBottom) { console.log('Ads blocked'); clearInterval(addBlocker); }
    },500)
})();