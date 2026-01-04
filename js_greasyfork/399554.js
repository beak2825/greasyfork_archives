// ==UserScript==
// @name         AutoTradeAtron
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Only show the deals!
// @author       You
// @match        https://www.autotrader.co.uk/car-search?*
// @grant        none
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/399554/AutoTradeAtron.user.js
// @updateURL https://update.greasyfork.org/scripts/399554/AutoTradeAtron.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function observeDOM(callback){
        var mutationObserver = new MutationObserver(function(mutations) { //https://davidwalsh.name/mutationobserver-api
            mutations.forEach(function(mutation) {
                callback(mutation)
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
        });
    }
    function run(){
        console.log("This is running...");
        var arrayOfIdsToDelete = [];
        //find all articles
        var articles = document.getElementsByClassName('search-listing');
        for (let i = 0; i < articles.length; i++) {
            var parentElement = articles[i].parentElement;
            var priceDetails = articles[i].getElementsByClassName('price-column');
            var priceRatingDiv = priceDetails[0].getElementsByTagName('div')[1];
            if (priceRatingDiv != undefined){
                if (priceRatingDiv.classList.contains('js-tooltip')){
                    var priceRating = priceRatingDiv.getElementsByTagName('title').item(0).innerHTML;
                    var listOfPricesToView = ['low price', 'good price', 'great price'];
                    if (listOfPricesToView.includes(priceRating.toLowerCase())){
                        console.log("Found a match");
                        console.log(priceRating);
                    }
                    else{
                        arrayOfIdsToDelete.push(parentElement.id);
                    }
                }
                else{
                    arrayOfIdsToDelete.push(parentElement.id);
                }
            }
            else{
                arrayOfIdsToDelete.push(parentElement.id);
            };
        }
        for (let i = 0; i < arrayOfIdsToDelete.length; i++) {
        document.getElementById(arrayOfIdsToDelete[i]).remove();
    }
}

    observeDOM(doDomStuff);
    function doDomStuff(mutation){
        console.log("Notice mutation");
        run();
    }

    $(document).ready(function(){
        run();
    });
})();