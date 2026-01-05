// ==UserScript==
// @name         Zelda Dungeon − Table of contents at the bottom
// @version      1.0
// @description  Add an additional table of contents at the bottom of walkthrough pages
// @author       Léo Lam
// @match        *://www.zeldadungeon.net/*-walkthrough*
// @grant        none
// @namespace https://greasyfork.org/users/12891
// @downloadURL https://update.greasyfork.org/scripts/10728/Zelda%20Dungeon%20%E2%88%92%20Table%20of%20contents%20at%20the%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/10728/Zelda%20Dungeon%20%E2%88%92%20Table%20of%20contents%20at%20the%20bottom.meta.js
// ==/UserScript==

$(document).ready(function cloneTableOfContents () {
    var content = '.entry-content';
    var topTableOfContents = '.entry-content ul:first';
    var bottomTableOfContents = '.entry-content ul:last';

    // Remove any existing table of contents that is at the bottom
    $(bottomTableOfContents).remove();

    // Put a copy of the table of contents at the bottom
    $('<br><hr/>').appendTo(content);
    $(topTableOfContents).clone().appendTo(content);
});