// ==UserScript==
// @name         No iviv.hu diaspora for zoey - this is enough internet for me today.
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  Redirects iviv.hu diaspora to google.com, because I'd rather not, right now- despite having made it a habit.
// @author       Novimatrem
// @match        https://iviv.hu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iviv.hu
// @grant        none
// @match *://*iviv.hu/*
// @downloadURL https://update.greasyfork.org/scripts/468381/No%20ivivhu%20diaspora%20for%20zoey%20-%20this%20is%20enough%20internet%20for%20me%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/468381/No%20ivivhu%20diaspora%20for%20zoey%20-%20this%20is%20enough%20internet%20for%20me%20today.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location = "https://www.google.com"
})();

