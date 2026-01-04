// ==UserScript==
// @name         Disable predict movement
// @namespace    https://diep.io
// @version      1.0
// @description  Disables Diep.io's laggy predict movement feature.
// @author       Binary
// @match        https://diep.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/411477/Disable%20predict%20movement.user.js
// @updateURL https://update.greasyfork.org/scripts/411477/Disable%20predict%20movement.meta.js
// ==/UserScript==

(function() {
    var interval = setInterval(function(){
        if(unsafeWindow.input){
            unsafeWindow.input.set_convar('net_predict_movement', false);
            clearInterval(interval);
        }
    }, 100);
})();