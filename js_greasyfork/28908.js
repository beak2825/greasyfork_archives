// ==UserScript==
// @name         Close tab/window on end
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Close tab/windows when video ends (if autoplay is not enabled)
// @author       Alexander Foo <@alexfoo>
// @match        https://*.youtube.com/w*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28908/Close%20tabwindow%20on%20end.user.js
// @updateURL https://update.greasyfork.org/scripts/28908/Close%20tabwindow%20on%20end.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByTagName('video')[0].addEventListener('ended', function() {
        if (document.getElementById('autoplay-checkbox').checked === false) {
            window.close();
        }
    });
})();