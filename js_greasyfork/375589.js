// Ynet Disable Auto Refresh by eligon
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
// @name           Ynet Disable Auto Refresh
// @namespace      
// @description    Disable Ynet auto refresh 
// @include        /^https?:\/\/(.*\.)?ynet\.co\.il\/.*$/
// @version 0.0.1.20181216141437
// @downloadURL https://update.greasyfork.org/scripts/375589/Ynet%20Disable%20Auto%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/375589/Ynet%20Disable%20Auto%20Refresh.meta.js
// ==/UserScript==

unsafeWindow._pageRefresher = {};
