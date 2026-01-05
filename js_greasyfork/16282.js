// ==UserScript==
// @name        Steam Game Guides Navigation Tweak
// @description Converts onclick javascript into a big nasty <a> element. Not HTML4 valid, but browsers understand it fine.
// @license     GPLv3
// @namespace   StupidWeasel/SteamCommunity/SteamGameGuidesNavigationTweak
// @include     /^https?://steamcommunity\.com/app/.*/guides/.*$/
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16282/Steam%20Game%20Guides%20Navigation%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/16282/Steam%20Game%20Guides%20Navigation%20Tweak.meta.js
// ==/UserScript==

/*
    Steam Game Guides Navigation Tweak - A GreaseMonkey script for easier gameguide navigation
    Copyright (C) 2016 Alex "StupidWeasel" Bolton

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var guides = document.getElementsByClassName('workshopItemCollectionContainer');
for(var i=0;i<guides.length;i++){
    var thisGuide = guides[i].childNodes[1];
    var oldMarkup = thisGuide.innerHTML;
    if (thisGuide.getAttribute("onclick")){ // If the markup changes or if the script has already run, we dont want to break things.
      var thisonclick = thisGuide.getAttribute("onclick")
      thisGuide.innerHTML = '<a href="' + thisonclick.slice(19,thisonclick.length-1) + '" />' + oldMarkup + '</a>';
      thisGuide.removeAttribute("onclick")
    }
}