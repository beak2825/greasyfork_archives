// ==UserScript==
// @name        Normal Game Boards
// @namespace   GameFAQsV13
// @description Remove ugly sidebar and stretch game board back to full size.
// @include     /http://www\.gamefaqs\.com/boards/[0-9][0-9]*/
// @version     1.0
// @grant       none
// @author      Frost_shock_FTW
// @downloadURL https://update.greasyfork.org/scripts/3526/Normal%20Game%20Boards.user.js
// @updateURL https://update.greasyfork.org/scripts/3526/Normal%20Game%20Boards.meta.js
// ==/UserScript==

var gameinfo_list = document.getElementsByClassName( 'pod_gameinfo' );

if( gameinfo_list.length > 0 ) {
    // This is a game board with a bunch of crap on the right
    gameinfo = gameinfo_list[0];
    gameinfo_aside = gameinfo.parentNode;
    
    gameinfo_aside.hidden = true;
    gameinfo_aside.previousSibling.className = 'span12';
}