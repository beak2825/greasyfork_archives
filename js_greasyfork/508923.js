// ==UserScript==
// @name         Neopets Kitchen Quest Speed Shopping
// @namespace    neopets.com
// @version      1.2
// @description  Adds a button for each requested ingredient in a Kitchen Quest for fast Shop Wizard searches. Stores searched prices (SSW only)
//               and displays the total cost of completing the quest.
// @author       darknstormy
// @match        http*://www.neopets.com/island/kitchen.phtml
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508923/Neopets%20Kitchen%20Quest%20Speed%20Shopping.user.js
// @updateURL https://update.greasyfork.org/scripts/508923/Neopets%20Kitchen%20Quest%20Speed%20Shopping.meta.js
// ==/UserScript==

function openShopWizardPage(itemName) {
    window.open(`https://www.neopets.com/shops/wizard.phtml?string=${itemName.replaceAll(" ","+")}`, '_blank')
}

function searchUsingSuperShopWizard(itemName, priceElement) {
    openSSW()
    $('.ssw-search__2020 #searchstr').val(itemName)
    $('#ssw-button-search .button-search-white__2020').click()

     waitForElement(".ssw-results-grid").then((searchResults) => {
        let lowestPrice = searchResults.find(".ssw-results-grid-price:first").text()
        priceElement.text('Lowest Price: ' + lowestPrice)
        let priceList = GM_getValue("priceList", {})
        priceList[itemName] = Number(lowestPrice.replace(/\D/g, ''))
        GM_setValue("priceList", priceList)
        calculateTotal()
    })
}

function calculateTotal() {
    let priceList = GM_getValue("priceList", {})
    let searchedPrices = $(".ingredient-grid").children('div').toArray().map((elem) => priceList[$(elem).find('p:first').text()]).filter((price) => price);
    if (searchedPrices && searchedPrices.length > 0) {
        let total = searchedPrices.reduce((accumulator, current) => accumulator + current)
        $('#total_cost').text(total)
    }
}

function openSSW() {
   if ($('#ssw__2020').is(':hidden')) {
       $('.navsub-ssw-icon__2020').click()
   }
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if ($(selector).is(":visible")) {
            return resolve($(selector));
        }

        const observer = new MutationObserver(mutations => {
            if ($(selector).is(":visible")) {
                observer.disconnect();
                resolve($(selector));
            }
        })

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
    })
}

$(document).ready(function() {
    waitForElement('.ingredient-grid').then(it => {
        it.parent().append('<div style="display: flex; width: 100%; align-content: center;"><p><b>Total Cost for Searched Ingredients: <span id="total_cost"></span> NP</b></p></div>')

        it.children('div').each(function() {
            $(this).css("border", "4px solid lightgray")
            $(this).css("border-radius", "10px")
            $(this).css("padding", "16px")
            $(this).css("margin-right", "8px")
            let nameElement = $(this).find('p')
            nameElement.css("min-height", "40px")

            let name = nameElement.text()

            $(this).append('<div style="display: flex; flex-flow: row wrap; justify-content: space-between;  align-items: center; width: auto"><button id="sw" class="button-default__2020 button-yellow__2020" style="display: inline; width: 40%; margin: 8px;">SW</button><button id="ssw" class="button-default__2020 button-yellow__2020" style="display: inline; width: 40%; margin: 8px;">SSW</button><p id="ssw-price"/></div>')

            let price = GM_getValue("priceList", {})[name]
            if (price) {
                $(this).find("#ssw-price").text("Previously Searched Price: " + price + " NP")
            }

            let swb = $(this).find('#sw')
            swb.on('click', () => { openShopWizardPage(name) });

            let sswb = $(this).find('#ssw')
            sswb.on('click', () => { searchUsingSuperShopWizard(name, $(this).find("#ssw-price")) });
        })

        calculateTotal()
    })
})