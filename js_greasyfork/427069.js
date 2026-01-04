// ==UserScript==
// @name         Atacs Extend Session
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Oturum süresi dolduğunda çıkan diyalog penceresini es geçerek süreyi uzatır.
// @include      /^https?:\/\/atacs\.atilim\.edu\.tr\/.*$/
// @include      /^https?:\/\/atacs-staff\.atilim\.edu\.tr\/.*$/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427069/Atacs%20Extend%20Session.user.js
// @updateURL https://update.greasyfork.org/scripts/427069/Atacs%20Extend%20Session.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
        console.log("> Atacs Session Extender Loaded.");
        if (typeof SessionEnd !== 'undefined' && typeof SessionEnd === 'function' && typeof extend_session !== 'undefined' && typeof extend_session === 'function') {
            console.log("> Atacs Session Extender Started...");

            //overwrite current function
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.innerHTML = 'function SessionEnd() {  extend_session(); console.log("> Session time successfully extended.");  }';
            document.getElementsByTagName('head')[0].appendChild(script);
            console.log("> SessionEnd() function successfully overwritten.");
        }
    });
})();