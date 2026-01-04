// ==UserScript==
// @name        Bricklink - Add Brickset instructions link
// @namespace   Violentmonkey Scripts
// @match       https://www.bricklink.com/v2/catalog/catalogitem.page
// @grant       none
// @version     1.0
// @author      legendeveryone
// @description 7/12/2023, 11:51:54 AM
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470680/Bricklink%20-%20Add%20Brickset%20instructions%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/470680/Bricklink%20-%20Add%20Brickset%20instructions%20link.meta.js
// ==/UserScript==

(function () {

  let urlElement = document.querySelector("div.innercontent table tbody tr td").lastChild.textContent.replace(": ","");
  let link = "https://brickset.com/sets/" + urlElement;
  var node = document.getElementById("_idPriceGuideLink");
  let copy = node.cloneNode(true);

  copy.firstChild.setAttribute("id", "bricksetLink");
  copy.firstChild.setAttribute("href", link);
  copy.firstChild.setAttribute("rel", "noopener noreferrer");
  copy.firstChild.setAttribute("target", "_blank");
  copy.firstChild.innerText = "Instructions on BrickSet";

  node.parentElement.appendChild(copy);

})();