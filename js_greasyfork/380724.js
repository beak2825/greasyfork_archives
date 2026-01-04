// ==UserScript==
// @name         Krunker.io crosshair
// @description  Red dot crosshair for krunker.io
// @version      0.0.1
// @author       nightly-build7
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party)=.+)$/
// @run-at       document-start
// @namespace https://greasyfork.org/users/285394
// @downloadURL https://update.greasyfork.org/scripts/380724/Krunkerio%20crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/380724/Krunkerio%20crosshair.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.addEventListener('load', function() {
        try {
            var d = document.createElement('div');
            d.style.cssText = 'width:8px;height:8px;background-color:#f00;position:absolute;margin:auto;top:0;right:0;bottom:0;left:0;z-index:200;border-radius:4px';
            document.body.appendChild(d);
        } catch (e) { }
    });
})();