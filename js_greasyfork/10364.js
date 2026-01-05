// ==UserScript==
// @name           Realign MyAnimeList Airing / Not Yet Aired / Publishing
// @description    Easily identify if a series is currently airing, has yet to air, or is currently being published.
// @lastupdated    2015-06-10
// @namespace      VR23rvQ1xT
// @version        1.0.4
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @compatibility  Firefox 13.0.1
// @include        http://myanimelist.net/animelist/*
// @include        http://myanimelist.net/mangalist/*
// @include        https://myanimelist.net/animelist/*
// @include        https://myanimelist.net/mangalist/*
// @downloadURL https://update.greasyfork.org/scripts/10364/Realign%20MyAnimeList%20Airing%20%20Not%20Yet%20Aired%20%20Publishing.user.js
// @updateURL https://update.greasyfork.org/scripts/10364/Realign%20MyAnimeList%20Airing%20%20Not%20Yet%20Aired%20%20Publishing.meta.js
// ==/UserScript==

var allSmallAreas = document.getElementsByTagName('small');
for (var i in allSmallAreas) {
    var thisSmallArea = allSmallAreas[i];
    if (thisSmallArea.innerHTML == "Airing" || thisSmallArea.innerHTML == "Not Yet Aired" ||
      thisSmallArea.innerHTML == "Publishing") {
        // Add a minus sign to the end so it blends in with "Edit - More"
        //thisSmallArea.innerHTML += " -";
        
        // Align text to the right
        //thisSmallArea.setAttribute("style", "float: right; padding-right: 5px");
        
        // Color text red so it stands out more, also align it to the right
        //thisSmallArea.setAttribute("style", "color: red; float: right; padding-right: 5px");
        
        // Highlight text, but don't align it to the right
        //thisSmallArea.setAttribute("style", "color: black; background-color: yellow");

        // Add it before the "Edit - More", so that it doesn't go below when the title is long enough to break the line into two rows
        thisSmallArea.parentNode.firstElementChild.appendChild(thisSmallArea);
        thisSmallArea.setAttribute("style", "float: left; margin: auto 5px");
    }
}