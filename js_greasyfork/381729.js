// ==UserScript==
// @name     Ape's escape artist
// @name:   Ape
// @description  All this script does is allowing you to access the context menu and selecting text/images + dragging them. Works in Firefox 68
// @version  1.1
// @grant    none
// @match https://web.500px.com/*
// @match https://www.instagram.com/*
// @match https://www.twitch.tv/*
// @namespace https://greasyfork.org/users/290672
// @downloadURL https://update.greasyfork.org/scripts/381729/Ape%27s%20escape%20artist.user.js
// @updateURL https://update.greasyfork.org/scripts/381729/Ape%27s%20escape%20artist.meta.js
// ==/UserScript==

window.onload = function() {
  	document.body.ondragstart = function() {
       return true;
    }
    document.body.onselectstart = function() {
       return true;
    }
}

document.addEventListener('contextmenu', function(event){event.stopPropagation();}, true);