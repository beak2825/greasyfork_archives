// ==UserScript==
// @name        Steam Profile Character Conversion
// @description Converts U+02D0 to U+003A on load.
// @license     GPLv3
// @namespace   StupidWeasel/SteamCommunityProfile/SteamProfileCharacterConversion
// @include     /^https?://steamcommunity\.com/id/.*/edit/
// @version     1.00
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20446/Steam%20Profile%20Character%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/20446/Steam%20Profile%20Character%20Conversion.meta.js
// ==/UserScript==

/*
    Steam Profile Character Conversion - A GreaseMonkey script for the Steam Community
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
var textAreas=document.getElementsByTagName('textarea');
    for(var i=0;i<textAreas.length;i++){
        textAreas[i].value = textAreas[i].value.replace(/ː/g,":");
    }