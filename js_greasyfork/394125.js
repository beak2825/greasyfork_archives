// ==UserScript==
// @name         Stack bullets with Predator!!!
// @namespace    http://tampermonkey.net/
// @version      1.5.9
// @description  Press Alt + A to stack bullets in 2.5 seconds! (You need max reload) Use 0/0/6/7/7/7/6
// @author       Ce Zhang
// @match        http://*diep.io/*
// @match        https://*diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394125/Stack%20bullets%20with%20Predator%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/394125/Stack%20bullets%20with%20Predator%21%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.addEventListener("keydown", function(zEvent) {
    if (zEvent.altKey && zEvent.code === "KeyA") {
        function fire(t, w) {
            setTimeout(function() {
                input.keyDown(32);
            }, t * 1000);
            setTimeout(function() {
                input.keyUp(32);
            }, t * 1000 + w);
        }
        fire(0, 100);
        fire(0.75, 200);
        fire(1.5, 750);
        setTimeout(function() {
            input.keyDown(69);
        }, 2000);
    }
});
})();