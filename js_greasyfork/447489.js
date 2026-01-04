
// ==UserScript==
// @name         Digworm.IO iPad Fix?
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        *://digworm.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digworm.io
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447489/DigwormIO%20iPad%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/447489/DigwormIO%20iPad%20Fix.meta.js
// ==/UserScript==
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
