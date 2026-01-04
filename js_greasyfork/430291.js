this.$ = this.jQuery = jQuery.noConflict(true);
// ==UserScript==
// @name         Bazar minimalne ceny
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Zapamiętuje w local storage najniższe ceny gier z listy życzeń i pokazuje je obok aktualnie najniższej ceny. Jeśli aktualna cena jest mniejsza od dotychczas zapisanej, wtedy tytuł oznaczany jest na zielono, jeśli cena jest równa naniższej - na niebiesko.
// @author       nochalon
// @match        https://bazar.lowcygier.pl/
// @match        https://bazar.lowcygier.pl/?*
// @icon         https://bazar.lowcygier.pl/favicon.ico
// @require      https://greasyfork.org/scripts/34527-gmcommonapi-js/code/GMCommonAPIjs.js?version=751210
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-timeago/1.5.4/jquery.timeago.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-timeago/1.5.4/locales/jquery.timeago.pl.js
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/430291/Bazar%20minimalne%20ceny.user.js
// @updateURL https://update.greasyfork.org/scripts/430291/Bazar%20minimalne%20ceny.meta.js
// ==/UserScript==
//TODO
// - historia cen na podstawie wielu punktów zamiast jednego - np 10 ostatnich zmian ceny większych niż 10%

(function() {
    'use strict';
  
    const offersCustomSortingSettingsEntry = "_SETTINGS_offersNewLowestFirst";
    const showIntegrationIconsSettingsEntry = "_SETTINGS_showIntegrationIcons";

    GMC.registerMenuCommand('Usuń całą historię', () => {
        if (confirm(
            `Aktualnie zapisanych jest ${localStorage.length} tytułów. Czy chcesz je wszystkie usunąć?`)) {
            localStorage.clear();
        }
    });
    GMC.registerMenuCommand('Usuń historię tytułu', () => {
       var title = prompt(
           "Podaj tytuł gry której historię chcesz usunąć");
        if (title != null) {
            if (!removeFromLocalStorage(title)) {
                alert("Nie znaleziono tytułu o nazwie: " + title);
            }
        }
    });
  
    var showHideIntegrationToggleTitle = 'Integracja z gg.deals i allkeyshop';
    GMC.registerMenuCommand(showHideIntegrationToggleTitle, () => {
        var showIntegrationIconsVal = (localStorage.getItem(showIntegrationIconsSettingsEntry) || 'true') == 'true';
        var showHideIntegrationTogglePrompt = showIntegrationIconsVal ? 'Czy chcesz wyłączyć ikony integracji gg.deals i allkeyshop?' : 'Czy chcesz włączyć ikony integracji gg.deals i allkeyshop?';
        if (confirm(showHideIntegrationTogglePrompt)) {
            localStorage.setItem(showIntegrationIconsSettingsEntry, !showIntegrationIconsVal);
            unsafeWindow.getData();
        }
    });

    GMC.addStyle( `
	  .new-lowest-price {
		  	color: #00FF00 !important;
		  	animation: blinkingText 3s infinite;
	  }
	  @keyframes blinkingText{
     	  0%		{ color: #00FF00;}
      	50%	    { color: #009000;}
      	100%	{ color: #00FF00;}
    }
    .currently-low-price {
		color: #0000E0 !important;
    }
    .tooltip, .tooltip-inner {
        padding: 10px;
    }
    p.prev-price p {
        font-size: 18px;
    }
    p.prev-price, p.prev-price p {
        margin: 0 0 1px;
    }
    .price-comparators {
    }
    .price-comparator-icon {
        width: 24px;
        height: 24px;
    }
    .game-list {
        padding-top: 5px;
        padding-bottom: 5px;
    }
    ` );

    const newLowestPriceStyle = "new-lowest-price";
    const currentlyLowPriceStyle = "currently-low-price";
    const offersListSelector = "div.list-view";
    const offersListElemSelector = offersListSelector + " > div";
    const offersListInnerElemSelector = offersListElemSelector + " > div.row.game-list.wishlist-item";
    const offersCustomSortingName = "offers-custom-sorting";
    const offersCustomSortingStyle = "";//"float: left; width: 100%;";
    const offersCustomSortingSelector = "form#search-offer-form > div.row.second";
    const offersNumberSelector = offersCustomSortingSelector+ " > div:nth-child(2)";

    document.querySelector(offersNumberSelector).style = "margin-left: 0px";
    var searchRow = document.querySelector(offersCustomSortingSelector);
    var offersCustomSortingVal = (localStorage.getItem(offersCustomSortingSettingsEntry) || 'false') == 'true';

    var offersCustomSortingElem = document.createElement('div');
    offersCustomSortingElem.style = offersCustomSortingStyle;
    offersCustomSortingElem.innerHTML = `<input type="checkbox" id="${offersCustomSortingName}"><label for="${offersCustomSortingName}">Sortowanie wg. atrakcyjności ceny</label>`;
    searchRow.appendChild(offersCustomSortingElem);
    var offersCustomSortingCheckbox = document.querySelector("input#" + offersCustomSortingName);
    offersCustomSortingCheckbox.checked = offersCustomSortingVal;
    offersCustomSortingCheckbox.addEventListener("change", (e) => {
        localStorage.setItem(offersCustomSortingSettingsEntry, e.target.checked);
        //this is a callback function used for all vanilla inputs
        unsafeWindow.getData();
    });

    var ths = document.querySelectorAll(offersListInnerElemSelector);
    console.log("Local storage contains " + localStorage.length + " items");
    var lowerPriceItems = [];
    var showIntegrationIconsVal = (localStorage.getItem(showIntegrationIconsSettingsEntry) || 'true') == 'true';
    for (var i = 0; i < ths.length; i++) {
        var middleRow = ths[i].querySelector("div.item > div:nth-child(2)");
        var titleElem = ths[i].querySelector(".media-heading > a");
        var title = titleElem.innerHTML;
        var priceElem = ths[i].querySelector(".pc > p.prc");
        var price = priceElem.innerHTML;
        var priceFloat = parseFloat(price.replace(',', '.'));
        var inStorage = JSON.parse(localStorage.getItem(title));

        if (inStorage === null) {
            console.log(`Adding new entry for ${title} with price ${priceFloat}`);
            saveToLocalStorage(title, priceFloat);
            continue;
        } else if (inStorage.price > priceFloat) {
            console.log(`Replacing price for ${title} ${inStorage.price} with ${priceFloat}`);
            saveToLocalStorage(title, priceFloat);
        }

        var priceParent = priceElem.parentNode;
        var prevPriceWrapper = document.createElement("p");
        prevPriceWrapper.classList.add("prev-price");
        priceParent.appendChild(prevPriceWrapper);
        if (showIntegrationIconsVal) {
            appendIntegrations(title, middleRow);
        }

        var diff = inStorage.price - priceFloat;
        if (diff > 0) {
            titleElem.classList.add(newLowestPriceStyle);
            priceElem.classList.add(newLowestPriceStyle);
            appendStoredPrice(inStorage.price, priceFloat, prevPriceWrapper);
            lowerPriceItems.push({'title': title, 'diff': diff});
        } else if (-diff <= 0.05 * inStorage.price) {
            titleElem.classList.add(currentlyLowPriceStyle);
            priceElem.classList.add(currentlyLowPriceStyle);
            if (diff != 0.0) {
                appendStoredPrice(inStorage.price, priceFloat, prevPriceWrapper);
            }
            appendTime(inStorage.timestamp, prevPriceWrapper);
        } else {
            appendStoredPrice(inStorage.price, priceFloat, prevPriceWrapper);
            appendTime(inStorage.timestamp, prevPriceWrapper);
        }

        ths[i].parentNode.setAttribute('data-sort', diff/inStorage.price);
    }
    //TODO make toggleable or remove
    if (false && lowerPriceItems.length > 0) {
        appendLowerPricesBanner(document.querySelector(".banner-top"), lowerPriceItems);
    }

    if (offersCustomSortingVal) {
        var result = jQuery(offersListElemSelector).sort(function (a, b) {
            var contentA = parseFloat($(a).data('sort')) || 0;
            var contentB = parseFloat($(b).data('sort')) || 0;
            return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
        });

        jQuery(offersListElemSelector).remove();
        jQuery(offersListSelector).prepend(result);
    }
})();

function appendLowerPricesBanner(bannerTop, items) {
    var alert = document.createElement("p");
    bannerTop.insertBefore(alert, bannerTop.firstChild);
    //TODO move to style section
    alert.classList = "lowerPrices";
    alert.style = "font-weight: bold; font-size: 1.3em; background: -webkit-linear-gradient(135deg, rgb(192, 192, 192) 0%, rgb(214, 214, 214) 25%, rgb(230, 230, 230) 100%); background-color: rgb(230,230,230); background: linear-gradient(135deg, rgb(192, 192, 192) 0%, rgb(214, 214, 214) 25%, rgb(230, 230, 230) 100%); border: 2px solid lightgrey; padding: 6px;";
    alert.innerHTML = "<p>Pojawiły się nowe najniższe ceny dla:</p><ul>";
    for (let i = 0; i < items.length; i++) {
        alert.innerHTML += "<li>" + items[i].title + " (" + (parseFloat(-items[i].diff).toFixed(2)) + "zł)</li>";
    }
    alert.innerHTML += "</ul>";
}

function appendTime(timeVal, elem) {
    var time = document.createElement("time");
    var timeString = new Date(timeVal);
    time.innerHTML = timeString.toLocaleString();
    time.dateTime = timeString.toISOString();
    time.classList = "timeago";
    elem.appendChild(time);
    jQuery(time).timeago();
}

function appendStoredPrice(old, newp, elem) {
    var diff = old - newp;
    var priceElem = document.createElement("p");
    var val = (-diff/newp * 100.0).toFixed(1);
    priceElem.title = val > 0 ? `taniej o ${val}%` : `drożej o ${-val}%`;
    priceElem.setAttribute('data-toggle', 'tooltip');
    priceElem.innerHTML = "" + parseFloat(old).toFixed(2) + "zł";
    elem.appendChild(priceElem);
}

function appendIntegrations(title, elem) {
    var newPriceElem = document.createElement("p");
    newPriceElem.classList.add("price-comparators");
    elem.appendChild(newPriceElem);
    var ggDeals = createGGDealsButton(title);
    var allKeyStop = createAllKeyShopButton(title);
    newPriceElem.appendChild(ggDeals);
    newPriceElem.appendChild(allKeyStop);
}

function saveToLocalStorage(title, price) {
    var newItem = {'price': price, 'timestamp': Date.now()};
    localStorage.setItem(title, JSON.stringify(newItem));
}

function removeFromLocalStorage(key) {
    var keyLowerCase = key.toLowerCase();
    for (var a in localStorage) {
        if (a.toLowerCase() === keyLowerCase) {
            localStorage.removeItem(a);
            return true;
        }
    }
    return false;
}

function createGGDealsButton(title) {
    return createLinkWithImageAndCaption("https://gg.deals/favicon.ico",
                                         `https://gg.deals/games/?title=${title}`,
                                         `Porównaj ceny ${title} a GG.deals`);
}

function createAllKeyShopButton(title) {
    return createLinkWithImageAndCaption("https://www.allkeyshop.com/favicon.ico",
                                         `https://www.allkeyshop.com/blog/catalogue/category-pc-games-all/search-${title}/sort-price-asc/`,
                                         `Porównaj ceny ${title} na AllKeyShop`);
}

function createLinkWithImageAndCaption(img, href, caption) {
    var elem = document.createElement("a");
    var imgElem = document.createElement("img");
    elem.appendChild(imgElem);
    elem.href = href;
    elem.target = "_blank";
    elem.title = caption;
    imgElem.src = img;
    imgElem.classList.add("price-comparator-icon");
    return elem;
}