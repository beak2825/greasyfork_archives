// ==UserScript==
// @name         SPDCV2
// @namespace    http://tampermonkey.net/
// @description  Correct bug on SPDC V2
// @version      0.1.0
// @author       Vincent
// @license      GPL 2 or later
// @match        http://spdc.dgfip.finances.gouv.fr/spdc/recherche-parcelle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442400/SPDCV2.user.js
// @updateURL https://update.greasyfork.org/scripts/442400/SPDCV2.meta.js
// ==/UserScript==
//
// -----------------------------------------------------------------------------
//
// Changelog:
//
// 0.1.0  Première version
//
// -----------------------------------------------------------------------------
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
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
// -----------------------------------------------------------------------------

(function() {
  var btn;

  var alist = document.getElementsByTagName('a')

  for (let i = 0; i < alist.length; i++) {
    if (alist[i].href == "http://spdc.dgfip.finances.gouv.fr/spdc/recherche-parcelle#info_titulaires") {
      btn=alist[i];
    }
  }

  var txt2=btn.attributes.onmouseup.textContent.replaceAll("D'", "D\\'")
  btn.attributes.onmouseup.textContent = txt2
})();
