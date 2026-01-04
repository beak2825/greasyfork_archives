// ==UserScript==
// @name        OpenBerryFeeder
// @author      QtheConqueror
// @namespace   Automation
// @description Press \ to open the Berry Feeder with Pokémon & eggs from the current page
// @version     1.2
// @include     http://gpx.plus/users/*
// @include     https://gpx.plus/users/*
// @grant       none
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/454441/OpenBerryFeeder.user.js
// @updateURL https://update.greasyfork.org/scripts/454441/OpenBerryFeeder.meta.js
// ==/UserScript==

// ==UserScript==
// @name        OpenBerryFeeder
// @author      QtheConqueror
// @namespace   Automation
// @description Press \ to open the Berry Feeder with Pokémon & eggs from the current page
// @version     1.2
// @include     http://gpx.plus/users/*
// @include     https://gpx.plus/users/*
// @grant       none
// @license     GPL-3.0-or-later
// ==/UserScript==

document.addEventListener('keyup', function(e) {
    if (e.type == 'keyup') {
        var char = e.key
        if (char == '\\' || char == '|') {
            window.eval('var fnames = []; var links = document.querySelectorAll("a.pIcons:not(.transparent)"); links.forEach(link => {fnames.push(link.dataset["fname"]);}); berryFeeder(fnames, "users", "the Users List", false);');
        }
    }
});