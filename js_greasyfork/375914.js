// Ynet Disable Video Autoplay  by eligon
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// ==UserScript==
// @name           Ynet Disable Video Auto Play
// @namespace      
// @description    Disable Ynet Video Auto Play
// @include        /^https?:\/\/(.*\.)?ynet\.co\.il\/.*$/
// @version 
// @downloadURL https://update.greasyfork.org/scripts/375914/Ynet%20Disable%20Video%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/375914/Ynet%20Disable%20Video%20Auto%20Play.meta.js
// ==/UserScript==

e = document.querySelector("iframe.video").src
var regex = /autoplay=1/g;
document.querySelector("iframe.video").src = e.replace(regex, 'autoplay=0')
