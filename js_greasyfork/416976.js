// ==UserScript==
// @name         powerline.io zoom script
// @version      1.8
// @description  powerline.io zoom script (press z to zoom out); (press z to zoom in);
// @author       Mikhail Karasev
// @Details      Created by oddpixeltv on YouTube
// @match        *://powerline.io/*
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/187968
// @downloadURL https://update.greasyfork.org/scripts/416976/powerlineio%20zoom%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/416976/powerlineio%20zoom%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(unsafeWindow, "debug", {
        get: function() {
            return true;
        },
        set: function(x) {
            console.log("Cannot change value of debug variable.");
        }
    });
})();