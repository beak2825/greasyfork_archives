// ==UserScript==
// @name         Sigmally Macros
// @version      1
// @description  Macro for sigmally
// @author       Cursed
// @match        *://sigmally.com/*
// @match        *://beta.sigmally.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sigmally.com
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1219775
// @downloadURL https://update.greasyfork.org/scripts/486175/Sigmally%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/486175/Sigmally%20Macros.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ff = null;
    let keydown = false;

    function keypress(key, keycode) {
        const keyDownEvent = new KeyboardEvent("keydown", { key: key, code: keycode });
        const keyUpEvent = new KeyboardEvent("keyup", { key: key, code: keycode });

        window.dispatchEvent(keyDownEvent);
        window.dispatchEvent(keyUpEvent);
    }
    function feed() {
        let x = 15;
        while (x--) {
            keypress("w", "KeyW");
        }
    }

    document.addEventListener("keyup", (e) => {
        const key = e.key.toLowerCase();
        if (key == "w" && keydown) {
            clearInterval(ff);
            keydown = false;
        }
    });

    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();

        if (key == "w" && !keydown) {
            keydown = true;
            ff = setInterval(feed, 50);
        }
    });
})();