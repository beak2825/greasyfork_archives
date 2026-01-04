// ==UserScript==
// @name         Scroll 2 Bottom Server
// @version      0.1
// @description  Instantly scrolls to the bottom server on your page if you press; ` or ESC or BACKSPACE.
// @author       4TSOS
// @match        *www.roblox.com/games/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @namespace https://greasyfork.org/users/784494
// @downloadURL https://update.greasyfork.org/scripts/446623/Scroll%202%20Bottom%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/446623/Scroll%202%20Bottom%20Server.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const serverContainer = document.querySelector("#rbx-running-games");
    document.body.addEventListener('keydown', function(event) {
        if (event.keyCode == 8 || 27 || 192) {
            document.querySelector("#rbx-game-server-item-container").lastElementChild.scrollIntoView();
        };
    });
})();