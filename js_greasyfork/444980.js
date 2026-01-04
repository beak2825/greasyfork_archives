// ==UserScript==
// @name         Make mixed yellow
// @namespace    https://gerbagel.github.io/
// @version      1.0
// @description  make mixed canon/filler episodes on animefillerlist.com yellow.
// @author       Gerbagel
// @match        https://www.animefillerlist.com/shows/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animefillerlist.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444980/Make%20mixed%20yellow.user.js
// @updateURL https://update.greasyfork.org/scripts/444980/Make%20mixed%20yellow.meta.js
// ==/UserScript==

(() => {
    'use strict';

    var thing = document.querySelectorAll(".Type span");
    for (var i = 0; i < thing.length; i++) {
        if (thing[i].textContent === "Mixed Canon/Filler") {
            thing[i].style.background = "#ffed33";
            thing[i].style.color = "#696969";   // nice.
        }
    }
})();