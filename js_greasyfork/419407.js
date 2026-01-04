// ==UserScript==
// @name         PokeBot Avenger
// @namespace    https://jaby.baby
// @version      1.0
// @description  Poke everyone who pokes you.
// @author       Jabybaby
// @match        https://www.facebook.com/pokes*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419407/PokeBot%20Avenger.user.js
// @updateURL https://update.greasyfork.org/scripts/419407/PokeBot%20Avenger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{[...document.getElementsByTagName("div")].filter(el => el.ariaLabel=="Visszabökés").forEach(el => el.click())},1000)
})();