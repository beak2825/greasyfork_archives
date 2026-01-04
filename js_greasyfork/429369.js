// ==UserScript==
// @name         Pomocnik Bazarowicza
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  Pomaga zarządzać swoimi ofertami sprzedaży na bazar.lowcygier.pl / Helps managing offers at bazar.lowcygier.pl
// @author       nochalon
// @match        https://bazar.lowcygier.pl/offer/my*
// @icon         https://bazar.lowcygier.pl/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429369/Pomocnik%20Bazarowicza.user.js
// @updateURL https://update.greasyfork.org/scripts/429369/Pomocnik%20Bazarowicza.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const offersCustomSortingSettingsEntry = "_SETTINGS_offersCustomSorting";
    const offersCustomSortingName = "offers-custom-sorting";
    const offersCustomSortingStyle = "float: left; width: 100%;";
    const offersCustomSortingSelector = "div.col-md-4.search-row";
    const priceSelector = ".fa.fa-usd.icon-sm";

    var searchRow = document.querySelector(offersCustomSortingSelector);
    var offersCustomSortingVal = localStorage.getItem(offersCustomSortingSettingsEntry) || "false";

    var offersCustomSortingElem = document.createElement('div');
    offersCustomSortingElem.style = offersCustomSortingStyle;
    offersCustomSortingElem.innerHTML =
        `<input type="checkbox" id="${offersCustomSortingName}"><label for="${offersCustomSortingName}">Sortowanie wg. atrakcyjności ceny</label>`;
    searchRow.appendChild(offersCustomSortingElem);
    var offersCustomSortingCheckbox = document.querySelector("input[id=offers-custom-sorting]");
    offersCustomSortingCheckbox.checked = offersCustomSortingVal === 'true';
    offersCustomSortingCheckbox.addEventListener("change", (e) => {
        localStorage.setItem(offersCustomSortingSettingsEntry, e.target.checked);
        document.getElementById("w0").submit();
    });

    const re = /\d+\.\d+ zł/g;
    var ths = document.querySelectorAll(priceSelector);
    for (var i = 0; i < ths.length; i++) {
        var originalText = ths[i].getAttribute("title");
        if (originalText === null || originalText == "") {
            originalText = ths[i].getAttribute("data-original-title");
        }
        var content = originalText.match(re);
        var lowestPrice = document.createElement("div");

        var priceElem = ths[i].parentNode.parentNode.parentNode.querySelectorAll(".prc-offert")[0];
        var myPrice = document.createElement("div");
        var myPriceVal = parseFloat(priceElem.innerHTML.replace(',', '.'));
        var lowestPriceVal = parseFloat(content) || 0;
        var difference = myPriceVal - lowestPriceVal;

        var color = 255 * (difference / myPriceVal);

        var factor = 0.9;
        if (difference >= myPriceVal * 0.5) {
            myPrice.style.color= "rgb(" + color + "," + (255 - factor * color) + "," + (255 - factor * color) + ")";
        } else {
            myPrice.style.color= "rgb(" + (factor * color) + "," + (255 - color) + "," + (factor * color) + ")";
        }
        var percentage = (100 * (difference / myPriceVal)).toFixed(1);

        lowestPrice.innerHTML = content;
        lowestPrice.title = `taniej o ${percentage}%`;
        lowestPrice.setAttribute('data-toggle', 'tooltip');
        lowestPrice.classList.add("trader");

        myPrice.innerHTML = priceElem.innerHTML;
        priceElem.innerHTML = "";
        priceElem.appendChild(myPrice);
        priceElem.appendChild(lowestPrice);
        priceElem.parentNode.parentNode.parentNode.setAttribute('data-sort', percentage);
    }

    if (offersCustomSortingVal === 'true') {
        var result = jQuery('div.list-view > div').sort(function (a, b) {
            var contentA = parseFloat($(a).data('sort')) || 0;
            var contentB = parseFloat($(b).data('sort')) || 0;
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        });

        jQuery('div.list-view > div').remove();
        jQuery('div.list-view').prepend(result);
    }
})();

