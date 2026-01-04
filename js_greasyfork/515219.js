// ==UserScript==
// @name        Evoworld.io Friend Menu Keybinds
// @namespace    http://tampermonkey.net/
// @description  A keybinds for the friend menu, press "F" to open and "C" to close.
// @author       kingbelisariusix
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?domain=evoworld.io
// @grant        none
// @license MIT
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/515219/Evoworldio%20Friend%20Menu%20Keybinds.user.js
// @updateURL https://update.greasyfork.org/scripts/515219/Evoworldio%20Friend%20Menu%20Keybinds.meta.js
// ==/UserScript==

function openFriendMenu() {
    openFriends();
}

function closeFriendMenu() {
    closeFriends();
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'f' || event.key === 'F') {
        openFriendMenu();
    } else if (event.key === 'c' || event.key === 'C') {
        closeFriendMenu();
    }
});
