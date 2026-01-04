// ==UserScript==
// @name         Tescomonkey
// @author       Than
// @version      0.03
// @description  Makes it easier to shop for groceries on tesco.com
// @match        https://*.tesco.com/groceries/*
// @include      https://*.tesco.com/groceries/*
// @connect      tesco.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/288098
// @downloadURL https://update.greasyfork.org/scripts/392736/Tescomonkey.user.js
// @updateURL https://update.greasyfork.org/scripts/392736/Tescomonkey.meta.js
// ==/UserScript==


(function() {
    'use strict';
    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- General functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    //Check the DOM for changes and run a callback function on each mutation
    function observeDOM(callback){
        var mutationObserver = new MutationObserver(function(mutations) { //https://davidwalsh.name/mutationobserver-api
            mutations.forEach(function(mutation) {
                callback(mutation) // run the user-supplied callback function,
            });
        });
        // Keep an eye on the DOM for changes
        mutationObserver.observe(document.body, { //https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
            attributes: true,
            //  characterData: true,
            childList: true,
            subtree: true,
            //  attributeOldValue: true,
            //  characterDataOldValue: true,
            attributeFilter: ["class"] // We're really only interested in stuff that has a className
        });}
    /**
    https://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
 * Get the closest matching element up the DOM tree.
 * @private
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against
 * @return {Boolean|Element}  Returns null if not match found
 */
    var getClosest = function ( elem, selector ) {

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
        }

        // Get closest match
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }
        return null;
    };
    function convertKtoM(price){ // converts kg to g, for example
        return (price / 10).toFixed(2);
    }
    function percentColour(percent){ // 100% = red, 0% = green
        var color = 'rgb(' + (percent *2.56) +',' + ((100 - percent) *2.96) +',0)'
        return color;
    }
    /*--------------------------------------------------------------------------------------------------------------------
    ------------------------------------------- Init functions --------------------------------------------------
    --------------------------------------------------------------------------------------------------------------------*/
    observeDOM(doDomStuff); // Observe the DOM for changes & peform actions accordingly
    function doDomStuff(mutation){
        //  console.log(mutation.target); // a flow of "mutations" comes through this function as the page changes state.
        if (mutation.target.className.includes("main__content")){
            enhanceMainContent(mutation.target);
        }
        if (mutation.target.className.includes("dfp-wrapper")){ // this usually means the page has fylly loaded after a refresh
            enhanceMainContent(document);
        }
        if (mutation.target.className.includes("product-lists-wrapper")){
            enhanceMainContent(mutation.target);
        }
        if (mutation.target.className.includes("product-list grid")){
            enhanceMainContent(mutation.target);
        }
        if (mutation.target.className.includes("filter-option--link")){ // sometimes happens after the page has loaded
            enhanceMainContent(document);
        }
    }
    function enhanceMainContent(mutation){ // main content being the list of products
        console.log(mutation);
        showAllPricesPerGram(); // first of all, show all weight-based prices per gram
        setClubcardPriceAsNormalPrice(); // Then change all "clubcard price" figures to be the ACTUAL price. God Tesco.
        try{
            colourBasedOnValue("100g"); // then compare all the prices with one another and use colour to show the best value
            colourBasedOnValue("100ml");
            colourBasedOnValue("each");
            colourBasedOnValue("100sht");
        }
        catch(err){
            console.log(err);
        }
        pricePerWeightForOffers(); // finally, if there are any special offers, get another price per weight if you go for the offer.
        //
        //The rest of this function is defining the functions called above
        //
        function setClubcardPriceAsNormalPrice(){
            var weightElements = mutation.querySelectorAll(".weight"); // get all "weight" elements - "/100g" etc
            for (var i=0,j = weightElements.length;i<j;i++){
                var itemBox = weightElements[i].closest(".product-tile");
                var offerSpan = itemBox.querySelector(".offer-text");
                if (!offerSpan){continue;}
                if (!offerSpan.textContent.includes("Clubcard Price")){continue}
                console.log(itemBox);
                var clubcardPrice = offerSpan.textContent;
                clubcardPrice = getClubcardPrice(clubcardPrice);
                var currentPriceElement = itemBox.querySelector(".value");
                var currentPrice = parseFloat(currentPriceElement.textContent);
                var currentPricePerGramElement = itemBox.querySelector(".price-per-quantity-weight").querySelector("span");
                if (!currentPricePerGramElement){continue}
                var currentPricePerGram = parseFloat(currentPricePerGramElement.textContent.replace("£",""));
                var totalWeight = (currentPrice / currentPricePerGram);
                var newPricePerGram = (clubcardPrice / totalWeight).toFixed(2);
                console.log(newPricePerGram);
                currentPricePerGramElement.textContent = "£" + newPricePerGram
                currentPriceElement.textContent = clubcardPrice;
                currentPriceElement.style.color = "red";
                currentPricePerGramElement.style.color = "red";
            }
            function getClubcardPrice(price){
                if (price.includes("£")){
                    price = price.split("£")[1];
                    price = price.split(" Clubcard")[0];
                    price = parseFloat(price).toFixed(2);
                }
                else if (price.includes("p")){
                    price = price.split("p")[0];
                    price = "." + price;
                }
                return price;
            }
        }
        function showAllPricesPerGram(){ // if anything is labeled price per kilo, change it to price per gram
            var weightElements = mutation.querySelectorAll(".weight"); // get all "weight" elements - "/100g" etc
            if (weightElements.length < 1){return} // if there are none, don't bother continuing
            for (var i=0,j = weightElements.length;i<j;i++){ //for each
                if (weightElements[i].textContent != "/kg"){continue} // We're not yet doing this for Litres/ML (not sure if that is as much of an issue on tesco.com)
                var priceElement = weightElements[i].previousElementSibling // grab the price
                var price = priceElement.textContent.slice(1);
                priceElement.textContent = "£" + convertKtoM(price); // and convert the price to per gram instead of KG
                weightElements[i].textContent = "/100g"; // and change the measurement also
            }
        }
        function colourBasedOnValue(meaurementType){ // colour the "buy" button depending on which products are best value
            var weightElements = mutation.querySelectorAll(".weight"); // again, we'll loop through all the weight elements
            if (weightElements.length < 1){return}
            var priceArray = []; // we'll use the loop to populate this with all the prices for use later
            for (var i=0,j = weightElements.length;i<j;i++){
                if (!weightElements[i].textContent.includes(meaurementType)){continue} // price needs to be of the same unit & amount for a fair comparison
                var priceElement = weightElements[i].previousElementSibling; // grab the price
                var price = priceElement.textContent.slice(1);
                if (isNaN(parseFloat(price))){continue} // edge cases - sometimes tesco displays the price per kg/g as "NaN" lol. Skip this loop.
                priceArray.push(parseFloat(price)) // send the price to our array
            }
            //  console.log(priceArray);
            if (priceArray.length < 1){return} // oh weird, there are no prices. quit.
            var maxPrice = Math.max(...priceArray); // get the highest price in the array
            var minPrice = Math.min(...priceArray); // and the lowest
            var range = maxPrice - minPrice; // the range will define what 100% would be
            colourThePage(); // go ahead and run this function
            function calculatePercentage(inputPrice){ // This function is hard to describe in words... study it & you'll figure it out in your own head!
                var n = inputPrice - minPrice; // the range goes from 0 to whatever total number. So we subtract min price to emulate the distace from 0. Understand...?
                var percent = (n * 100 / range) // 22 times 100 divided by the range gives the percentage.
                return Math.floor(percent); // return as a rounded number
            }
            function colourThePage(){
                for (var i=0,j = weightElements.length;i<j;i++){ // all righty, grab alllll those elements one more time
                    if (!weightElements[i].textContent.includes(meaurementType)){continue} // price needs to be per 100 for a fair comparison
                    var priceElement = weightElements[i].previousElementSibling; // grab the price
                    var price = priceElement.textContent.slice(1);
                    if (isNaN(parseFloat(price))){continue} // edge cases - sometimes tesco displays the price per kg/g as "NaN" lol. Skip this loop.
                    var percentCost = calculatePercentage(parseFloat(price)); // what percent of the total range of prices does this price represent?
                    var productElement = getClosest(priceElement,".product-list--list-item"); // get the outer container of this item
                    var buyButton = productElement.querySelector("button[type=submit][class~=add-control]"); // then get the buy button
                    buyButton.style.backgroundColor = percentColour(percentCost); // colour it according to the percentage (green for cheap, red for expensive in comparison)
                    //     console.log(buyButton);
                    //  productElement.style.backgroundColor = percentColour(percentCost);
                }
            }
        }
        function pricePerWeightForOffers(){ // now calculate the price per weight if a product is part of a "3 for £10" offer
            var productItems = mutation.querySelectorAll(".product-list--list-item"); // grab all items
            if (productItems.length < 1){return} // if there are none, why bother?
            //  console.log(productItems);
            for (var i=0,j = productItems.length;i<j;i++){ //. for each item
                //  console.log(productItems[i].querySelector(".offer-text") === null)
                if (productItems[i].querySelector(".offer-text") === null){continue} // if there's no offer text, don't bother continuing
                //   console.log(productItems[i].querySelector(".offer-text"));
                var offerElement = productItems[i].querySelector(".offer-text"); // ok, what's the offer then?
                var offerText = offerElement.textContent; // grab the text
                if (!offerText.match(/^Any\s(\d+)\sfor\s£([\d\.]+)/)){continue} // if it's not in the format "3 for £10" or similar, skip this loop
                var offerMatch = offerText.match(/^Any\s(\d+)\sfor\s£([\d\.]+)/); // ok then, parse out the groups from the regex
                try { // this bit is prone to errors
                    var productTitleElement = productItems[i].querySelector("a[data-auto=product-tile--title]"); // get the name of the product
                    var unit = "g"; // default to grams
                    // This next bit of regex figures out the amount of product - 750g, 2 Litres, 3 pack, etc
                    // Slowly gathering all possible units in use across tesco      G                    KG                     Ml                     Litres                         nX             g/ml                  "3 pack"               100sht
                    var productAmount = productTitleElement.textContent.match(/\s([\d]+)\s?G(?:$|\s)|\s([\d\.]+)\s?Kg(?:$|\s)|\s([\d\.]+)\s?Ml(?:$|\s)|\s([\d\.]+)\s?(?:Litres?|L)(?:$|\s)|([\d]+)\s?X\s?([\d]+)(?:g|ml)|\s([\d+])\sPack(?:$|\s)|([\d]+)\s?100sht(?:$|\s)/i);
                    if (productAmount[1]){productAmount = productAmount[1]} // Original is in G, since the first regex match exists
                    else if (productAmount[2]){productAmount = productAmount[2] * 1000} // original is in KG since the second regex match exists - convert to G
                    else if (productAmount[3]){productAmount = productAmount[3];unit = "ml"} // mililitres
                    else if (productAmount[4]){productAmount = productAmount[4] * 1000;unit = "ml"} // Litres
                    else if (productAmount[5]){productAmount = productAmount[5] * productAmount[6]} // multi-packs of items in grams
                    else if (productAmount[7]){productAmount = productAmount[7];unit = "each"} // "3 pack" is usually "each". maybe...
                    var offerPricePerWeight = (offerMatch[2] / (productAmount * offerMatch[1])) * 100; // all right, for most of these we can get the price per weight at the offer price by doing this
                    var finalOffer;
                    if (unit === "each"){finalOffer = `£${(offerPricePerWeight / 100).toFixed(2)}/${unit}`} // but if it's a 3 pack or whatever, we do it with this
                    else {finalOffer = `£${offerPricePerWeight.toFixed(2)}/100${unit}`} // but for most, this works
                    var newPricePerGramElement = document.createElement("div"); // let's create a new element to put our new price per weight/unit into
                    newPricePerGramElement.textContent = finalOffer; // set the text
                    newPricePerGramElement.style.color = "#de1020"; // set the colour to be the same as the offer colourr
                    var referencePosition = productItems[i].querySelector(".price-per-quantity-weight > span") // this is what we use to judge the position of the new element
                    newPricePerGramElement.style.position = "absolute"; // a bit hacky this, but it seems to work
                    newPricePerGramElement.style.left = `${referencePosition.offsetLeft}px`; // put the new price at this many pixels from the left
                    newPricePerGramElement.style.top = `${referencePosition.offsetTop + 13}px`; // and this many pixels from the top of the page
                    var currentPrice = productItems[i].querySelector(".price-details--wrapper"); // we'll add our new element under this
                    currentPrice.appendChild(newPricePerGramElement); // adding the element
                }
                catch(err){ // for any errors
                    console.log(err,productItems[i]); // tell me what's wrong
                    var productElement = getClosest(productItems[i],".product-list--list-item");
                    //  productElement.style.backgroundColor = "red"; // and highlight the item on the page so I see I need to bugfix
                    continue; // skip to the next item
                }
            }
        }
    }

    enhanceMainContent(document); // Also, run all of the above when the document loads initially, not just during mutations
    // Your code here...
})();