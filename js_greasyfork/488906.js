// ==UserScript==
// @name         Offsets the Wandrer overlay in bikerouter.de
// @version      0.1
// @namespace    guebosch
// @license      MIT
// @description  Offsets the Wandrer overlay in bikerouter.de by a few pixels to improve visibility of tracks and other small ways.
// @author       userstyles.world/user/mjaschen, guebosch
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bikerouter.de
// @grant        none
// @match *://bikerouter.de/*
// @downloadURL https://update.greasyfork.org/scripts/488906/Offsets%20the%20Wandrer%20overlay%20in%20bikerouterde.user.js
// @updateURL https://update.greasyfork.org/scripts/488906/Offsets%20the%20Wandrer%20overlay%20in%20bikerouterde.meta.js
// ==/UserScript==

GM_addStyle(`
    .mapboxgl-map {
        opacity: 0.7;
        left: 5px;
        top: 5px;
    }
`);
