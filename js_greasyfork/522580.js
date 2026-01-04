// ==UserScript==
// @name            Chinafake Wiki Redirector
// @description     Redirects from the Chinafake Wiki on Fandom to the forked version.
// @icon            https://static.wikitide.net/chinafakewiki/3/35/WikiLogo.png
//
// @author          GroupNebula563 (of the Chinafake Wiki)
// @namespace       https://chinafake.wiki/
//
// @license         GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       Copyright (c) 2025 GroupNebula563 <webmaster@chinafake.wiki>
//
// @include         http://chinafake.fandom.com/*
// @include         https://chinafake.fandom.com/*
//
// @version         1.0
//
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/522580/Chinafake%20Wiki%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/522580/Chinafake%20Wiki%20Redirector.meta.js
// ==/UserScript==

 //////////////////////////////////////////////////////////////////////////
 // If you don't have a userscript extension, check out this page:       //
 // http://greasyfork.org/en/help/installing-user-scripts                //
 //////////////////////////////////////////////////////////////////////////
 // This program is free software: you can redistribute it and/or modify //
 // it under the terms of the GNU General Public License as published by //
 // the Free Software Foundation, either version 3 of the License, or    //
 // (at your option) any later version.                                  //
 //                                                                      //
 // This program is distributed in the hope that it will be useful,      //
 // but WITHOUT ANY WARRANTY; without even the implied warranty of       //
 // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the         //
 // GNU General Public License for more details.                         //
 //                                                                      //
 // You should have received a copy of the GNU General Public License    //
 // along with this program. If not, see <http://www.gnu.org/licenses/>. //
 //////////////////////////////////////////////////////////////////////////

// We need to ensure we're actually at the Fandom wiki before we go around redirecting people
if (window.location.href.indexOf("https://chinafake.fandom.com/") > -1) {
// Check if we're at the discussion page:
if (window.location.href.indexOf("/f") != -1) {
// Special case in which we are at the discussion page:
//Redirect us to the equivalent place (forums)
window.location.replace("https://chinafake.wiki/wiki/Forum:Index");
} else {
// We're not at the discussion page, carry on
// First, we'll get where we are (that is, the page name, URI-formatted)
var basePath = window.location.href.split('/wiki/')[1];
// Now we use that to redirect the user to the same page on the forked wiki
window.location.replace("https://chinafake.wiki/wiki/" + basePath);
}};
// And we're done!