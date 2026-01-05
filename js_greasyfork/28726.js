/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *

// ==UserScript==
// @name            Play url on movian
// @namespace       playonps3
// @description     Plays a supplied URL, or one that is right clicked in browsers that support contextMenu
// @version         1.2
// @author          paul
// @license         GPL3
// @include         *
// @exclude         file:///*
// @downloadURL https://update.greasyfork.org/scripts/28726/Play%20url%20on%20movian.user.js
// @updateURL https://update.greasyfork.org/scripts/28726/Play%20url%20on%20movian.meta.js
// ==/UserScript==

/*
  References:
  - https://hacks.mozilla.org/2011/11/html5-context-menus-in-firefox-screencast-and-code/
  - http://thewebrocks.com/demos/context-menu/
*/

var playurl = 'https://pi.boner.ml/movian/'
var menu = document.body.appendChild(document.createElement("menu"));
var html = document.documentElement;
if (html.hasAttribute("contextmenu")) {
    // We don't want to override web page context menu if any
    var contextmenu = $("#" + html.getAttribute("contextmenu"));
    contextmenu.appendChild(menu); // Append to web page context menu
} else {
    html.setAttribute("contextmenu", "userscript-share-context-menu");
}



menu.outerHTML = '<menu id="userscript-share-context-menu" type="context"><menuitem label="Open with Movian"></menuitem></menu>';

document.onkeyup = function(e){




    if (e.key.toUpperCase() === "M" && e.ctrlKey && e.altKey && e.shiftKey)
        open_with_shortcut(e);

    return false;

};


// If browser supports contextmenu
if ("contextMenu" in html && "HTMLMenuItemElement" in window) {
    // Executed on clicking a menuitem
    document.getElementById("userscript-share-context-menu").addEventListener("click", open, false);
    html.addEventListener("contextmenu", initMenu, false); // Executed on right clicking
}


if (document.location.href.indexOf("youtube.com") !== -1){

	log("youtube functionality loading.");

	//get all the watch later buttons
	var buttons = document.getElementsByClassName("addto-watch-later-button");

	for (i = 0; i < buttons.length; i++){

		buttons[i].onclick = function(button) {

			var url = "https://www.youtube.com/watch?v=" + button.target.getAttribute("data-video-ids");
			string_open(url);

			//don't process other onclick events
			return true;

		}


	}


	log("youtube functionality loaded.");

}




function initMenu(e) {
    var node = e.target;
    var title = document.title;

    var menu = document.getElementById("userscript-share-context-menu");
    menu.label = "Play this page with movian"; // Set menu label

    var canonical = document.querySelectorAll('[rel="canonical"]');
    // Use canonical where available
    var url = canonical ? canonical.href : location.href;

    // If right click on a link
    while (node && node.nodeName != "A") node = node.parentNode;
    if (node && node.hasAttribute("href")) {
        menu.label = "Open This Link in Movian"; // Menu label when right click on a link
        url = node.href;
        title = e.target.getAttribute("alt") || node.textContent;
    }

    // Set menu title and url attributes
    menu.title = title;
    menu.setAttribute("url", url);
}



function open(e) {
	var raw_url = e.target.parentNode.getAttribute("url");
	if (raw_url === undefined) raw_url = document.location;
    var url = encodeURIComponent(raw_url);

    if (confirm("You want to open " + raw_url + " in Movian?")){
	    var oReq = new XMLHttpRequest();
	    oReq.open("get", plaurl + "?url=" + url);
	    oReq.send();
    }

}



function string_open(e) {
	var raw_url = e;
	if (raw_url === undefined) raw_url = document.location;
    var url = encodeURIComponent(raw_url);

    if (confirm("You want to open " + raw_url + " in Movian?")){
	    var oReq = new XMLHttpRequest();
	    oReq.open("get", playurl + "?url=" + url);
	    oReq.send();
    }

}




function open_with_shortcut(e) {

    /* //disabled until the clipboard api works
    //get clipboard contents
    clipboard = window.clipboardData.getData('Text');
    if (clipboard == null)
        clipboard = "";

	var raw_url = prompt("url", clipboard);

    */


    var raw_url = prompt("What URL do you want to play?", document.URL);

	if (raw_url === undefined || raw_url === null) raw_url = document.location;
    var url = encodeURIComponent(raw_url);

    if (raw_url != null && raw_url !== "" && confirm("You want to open " + raw_url + " in Movian?")){
	    var oReq = new XMLHttpRequest();
	    oReq.open("get", playurl + "?url=" + url);
	    oReq.send();
    }

}


function log(res){

	console.log(res);

}

function $(aSelector, aNode) {
    return (aNode || document).querySelector(aSelector);
}

