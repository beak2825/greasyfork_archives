// ==UserScript==
// @name     [AO3] Tag Search Navigation at the top
// @description  Copies the page navigation from tag search to the top of the search results.
// @version  1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match 	 https://archiveofourown.org/tags/search?*

// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/482403/%5BAO3%5D%20Tag%20Search%20Navigation%20at%20the%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/482403/%5BAO3%5D%20Tag%20Search%20Navigation%20at%20the%20top.meta.js
// ==/UserScript==

const node = document.getElementsByClassName("pagination")[0].cloneNode(true)
document.querySelector('[title="Tag search results help"]').parentNode.appendChild(node)