// ==UserScript==
// @name        Trade Offer Comparisons
// @namespace   https://politicsandwar.com/nation/id=98616
// @match       https://politicsandwar.com/index.php?id=90*
// @match       https://politicsandwar.com/index.php?id=26*
// @grant       none
// @version     0.3
// @author      Talus
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://greasyfork.org/scripts/427396-resource-value-saver/code/Resource%20Value%20Saver.user.js
// @license     GPL-3.0-or-later
// @description Display price comparisons on offers page.
// @downloadURL https://update.greasyfork.org/scripts/465697/Trade%20Offer%20Comparisons.user.js
// @updateURL https://update.greasyfork.org/scripts/465697/Trade%20Offer%20Comparisons.meta.js
// ==/UserScript==

$(document).ready(function() {
    var $ = window.jQuery;
    updateOffers();
});

function updateOffers() {

  var resourceValues = JSON.parse(localStorage.getItem('resourceValues'));
  if (resourceValues == null) {
      alert('Visit the trades page to update resource values used for loss calculations.');
      return;
  }
  const divElements = document.querySelectorAll("#Offers > div");

  var hasFlipped = false;
  divElements.forEach((divElement) => {
    const imgElement = divElement.querySelector("div.Quantity > img");
    const src = imgElement.getAttribute("src");
    const filename = src.split("/").pop();
    const resourceName = filename.split(".")[0];

    const priceElement = divElement.querySelector("div.Price");
    const priceText = priceElement.textContent;
    const price = priceText.match(/[\d,]+/)[0].replaceAll(',', '');

    const priceDelta = price - resourceValues[resourceName];
    const pricePercent = Math.round(1000 * priceDelta / resourceValues[resourceName]) / 10;

    const priceDeltaElement = document.createElement("div");
    priceDeltaElement.innerHTML = `${priceDelta < 0 ? '-' : '+'}$${Math.abs(priceDelta).toLocaleString()} (${pricePercent < 0 ? '-' : '+'}${Math.abs(pricePercent)}%)`;
    const existingInnerDiv = priceElement.querySelector("div");
    priceElement.insertBefore(priceDeltaElement, existingInnerDiv);

    if (priceDelta >= 0 && !hasFlipped) {
      const averagePriceBar = document.createElement("span");
      averagePriceBar.innerHTML = `<hr style="border-color:green"><p>Average Price: $${Number(resourceValues[resourceName]).toLocaleString()}/Ton</p><hr style="border-color:green">`;
      divElement.before(averagePriceBar);
      hasFlipped = true;
    }
  });
}