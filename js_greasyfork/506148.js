// ==UserScript==
// @name         Resurviv FPS uncap
// @namespace    http://tampermonkey.net/
// @version      2024-08-31
// @description  Uncaps FPS for resurviv/namerio
// @author       You
// @match        http://resurviv.biz/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506148/Resurviv%20FPS%20uncap.user.js
// @updateURL https://update.greasyfork.org/scripts/506148/Resurviv%20FPS%20uncap.meta.js
// ==/UserScript==

(function() {
    function toggleUncappedFPS(enabled) {
        window.requestAnimationFrame = function(callback) {
                return setTimeout(callback, 1);
        };
    }
})();