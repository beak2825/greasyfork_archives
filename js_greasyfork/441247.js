// ==UserScript==
// @name         Mapgenie Unlock (Client side) VIP Features
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlock VIP on Mapgenie, but only on client side, so it's basically visual VIP not actualy working features
// @author       You
// @match        https://mapgenie.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mapgenie.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441247/Mapgenie%20Unlock%20%28Client%20side%29%20VIP%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/441247/Mapgenie%20Unlock%20%28Client%20side%29%20VIP%20Features.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.user.hasPro = true
    window.user.role = "admin"
})();