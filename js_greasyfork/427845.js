// ==UserScript==
// @name         Enrich idee und spiel wishlist
// @namespace    MarBode
// @version      1.0
// @description  With this script you can see inside the wishlist the retailers for a product and so it is easier to create a shopping cart.
// @author       MarBode
// @homepageURL  https://gist.github.com/MarBode/8d849df67cf897b1ccc0578d48170844
// @supportURL   https://gist.github.com/MarBode/8d849df67cf897b1ccc0578d48170844#new_comment_field
// @match        https://www.ideeundspiel.com/wishlist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427845/Enrich%20idee%20und%20spiel%20wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/427845/Enrich%20idee%20und%20spiel%20wishlist.meta.js
// ==/UserScript==

(function() {

    'use strict';
    var wichItems = document.getElementsByClassName("wish-item");

    var retailerSet = new Map();

    var selectItem = document.createElement("DIV");
    selectItem.className = 'wish-item';

    var selectRow = document.createElement("DIV");
    selectRow.className = 'row';

    var selectNameDiv = document.createElement("DIV");
    selectNameDiv.className = 'col-md-4 col-xl-4';
    var selectSpan = document.createElement("strong");
    selectSpan.textContent = 'Händler:';


    var selectSelectDiv = document.createElement("DIV");
    selectSelectDiv.className = 'col-md-8 col-xl-8';
    var selectElement = document.createElement("input");
    selectElement.style.width = "100%";
    selectElement.id = 'retailerSelect';
    selectElement.onchange = function(){

        var retailerName = document.getElementById("retailerSelect").value;
        if (!retailerName || retailerName.length === 0) {
           retailerName = "All";
        } else {
           retailerName = retailerSet.get(retailerName);
        }

        var allCustomElements = document.getElementsByClassName("customRetailerPrice");
        var selectedCustomElements = document.getElementsByClassName(retailerName);

        Array.from(allCustomElements).forEach(element => {
            element.style.display = "none";
        });

        Array.from(selectedCustomElements).forEach(element => {
            element.style.display = "flex";
        });
    };

    selectNameDiv.appendChild(selectSpan);
    selectRow.appendChild(selectNameDiv);
    selectSelectDiv.appendChild(selectElement);
    selectRow.appendChild(selectSelectDiv);
    selectItem.appendChild(selectRow);

    Array.from(wichItems).forEach(item => {
    //var item = wichItems[0]
        var itemId = item.id.replace("product-", "")

        var productColumns = item.getElementsByTagName("div")[0].getElementsByTagName("div");
        productColumns[0].className = 'col-md-2 col-xl-2';
        productColumns[0].nextElementSibling.className = 'col-md-2 col-xl-3';
        productColumns[0].nextElementSibling.nextElementSibling.className = 'col-md-2 col-xl-2';

        var newColumn = document.createElement("DIV");
        newColumn.className = 'col-md-6 col-xl-5';
        item.getElementsByTagName("div")[0].appendChild(newColumn);

        const Url='https://www.ideeundspiel.com/frontend-ui/tenants/ius/detail/offers?id='+itemId;
        $.get(Url, function(data, status){

            var page = $(data);
            var priceRows = 0;

            Array.from(page).forEach(partOfPage => {

                if(partOfPage instanceof HTMLElement) {
                    var offer = partOfPage.getElementsByClassName("offer")[0];

                    var retailer = offer.getElementsByClassName("store-address-container")[0].dataset.retailername;
                    var retailerId = offer.getElementsByClassName("store-address-container")[0].dataset.retailerid;
                    var price = offer.getElementsByClassName("item-price")[0].getElementsByTagName("span")[0].textContent;

                    if(!retailerSet.has(retailer)) {

                        var retailerOption = document.createElement("option");
                        retailerOption.value = retailerId;
                        retailerOption.text = retailer;

                        selectElement.appendChild(retailerOption);
                    }
                    retailerSet.set(retailer, retailerId);

                    if (priceRows < 5) {

                        var newRow = document.createElement("DIV");
                        newRow.className = 'row customRetailerPrice All';
                        newRow.style.margin = "5px"
                        //newRow.style.display = "block";

                        var retailerDiv = document.createElement("DIV");
                        retailerDiv.className = 'col-md-9 col-xl-9';
                        var retailerSpan = document.createElement("strong");
                        retailerSpan.textContent = retailer;

                        var priceDiv = document.createElement("DIV");
                        priceDiv.className = 'col-md-3 col-xl-3 text-right';
                        var priceSpan = document.createElement("strong");
                        priceSpan.textContent = price;

                        priceDiv.appendChild(priceSpan);
                        retailerDiv.appendChild(retailerSpan);
                        newRow.appendChild(retailerDiv);
                        newRow.appendChild(priceDiv);

                        newColumn.appendChild(newRow);
                        priceRows++;
                    }

                    var newRowRetailer = document.createElement("DIV");
                    newRowRetailer.className = 'row customRetailerPrice '+retailerId;
                    newRowRetailer.style.margin = "5px"
                    newRowRetailer.style.display = "none";

                    var retailerDivRetailer = document.createElement("DIV");
                    retailerDivRetailer.className = 'col-md-9 col-xl-9';
                    var retailerSpanRetailer = document.createElement("strong");
                    retailerSpanRetailer.textContent = retailer;

                    var priceDivRetailer = document.createElement("DIV");
                    priceDivRetailer.className = 'col-md-3 col-xl-3 text-right';
                    var priceSpanRetailer = document.createElement("strong");
                    priceSpanRetailer.textContent = price;

                    priceDivRetailer.appendChild(priceSpanRetailer);
                    retailerDivRetailer.appendChild(retailerSpanRetailer);
                    newRowRetailer.appendChild(retailerDivRetailer);
                    newRowRetailer.appendChild(priceDivRetailer);

                    newColumn.appendChild(newRowRetailer);
                }
            })
        })

        item.getElementsByTagName("div")[0].appendChild(newColumn);
    });

    var wichList = document.getElementById("wishlist");

    wichList.insertBefore(selectItem, wichList.children[1]);
})();