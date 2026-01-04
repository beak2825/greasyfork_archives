// ==UserScript==
// @name         STRAGE noFullscreen
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove exitFullScreen event!
// @author       You
// @match        */strage*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420348/STRAGE%20noFullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/420348/STRAGE%20noFullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready (function (){
        function inizio(){};
        $(document).unbind ('webkitfullscreenchange mozfullscreenchange fullscreenchange');
    });
})();