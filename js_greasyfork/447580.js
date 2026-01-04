// ==UserScript==
// @name         Open games from Steam website
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  it's pretty obvious
// @author       instantpot
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @match        https://help.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
/*jshint esversion:6:*/
// @downloadURL https://update.greasyfork.org/scripts/447580/Open%20games%20from%20Steam%20website.user.js
// @updateURL https://update.greasyfork.org/scripts/447580/Open%20games%20from%20Steam%20website.meta.js
// ==/UserScript==

(function() {
    'use strict';
let newlink = document.createElement('a');
newlink.setAttribute('class', 'menuitem supernav');
newlink.setAttribute('href', 'https://steamcommunity.com/id/ahypothermia/games/');
newlink.setAttribute('data-tooltip-type', 'selector');
newlink.setAttribute('data-tooltip-content', '.submenu_store');
newlink.innerHTML = ' GAMES ';
document.querySelectorAll('[class=supernav_container]')[0].appendChild(newlink);

if(document.location.href.includes('/games/')) {
document.querySelectorAll('[class="gameListRow"]').forEach(function(node) {
    let link = node.querySelector('a').href.replace("https://steamcommunity.com/app/", "steam://rungameid/");
    let newbutton = document.createElement('a');
    newbutton.setAttribute('class', 'pullup_item');
    newbutton.innerHTML = '  Open';
    newbutton.setAttribute("style", "white-space: pre-wrap;");
    newbutton.setAttribute('href', link);
    node.querySelector('[class="bottom_controls"]').appendChild(newbutton);
});
}
})();