// ==UserScript==
// @name         Auto Closed Captioning for Youtube
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically ensure closed captioning is on for every Youtube video
// @author       Mark Townsend
// @match        http://*.youtube.com*
// @match        http://*.youtube.com/watch*
// @match        http://youtube.com/watch*
// @match        https://*.youtube.com/watch*
// @match        https://youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459861/Auto%20Closed%20Captioning%20for%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/459861/Auto%20Closed%20Captioning%20for%20Youtube.meta.js
// ==/UserScript==



window.addEventListener('load', () => {
    var pollCC = setInterval(checkYTCC, 1000);

    function checkYTCC() {
       if (document.querySelector('[aria-keyshortcuts="c"]').getAttribute('aria-pressed') !== 'true') {
           document.querySelector('[aria-keyshortcuts="c"]').click();
       }
    }
});

