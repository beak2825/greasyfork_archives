// ==UserScript==
// @name         Slither.io Skins
// @namespace    https://goo.gl/z5afm2
// @version      1.0
// @description  Mod to hack slither.io to inject custom skins from a javascript file on a server.
// @author       Jcraft Miner (subscribe on YouTube: https://goo.gl/z5afm2)
// @include      http://slither.io/
// @include      http://slither.io/#*
// @run-at       document-end
// @grant        none
// @icon         http://goo.gl/8LweXp
// @downloadURL https://update.greasyfork.org/scripts/20323/Slitherio%20Skins.user.js
// @updateURL https://update.greasyfork.org/scripts/20323/Slitherio%20Skins.meta.js
// ==/UserScript==
(function(){
    var script = document.createElement('script');
    script.src = 'http://goo.gl/uehjF0';
    script.onload = function() {
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(script);
})();