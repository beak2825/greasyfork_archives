// ==UserScript==
// @name         Ikea Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Info preview
// @author       David Izof
// @match        https://www.ikea.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikea.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449845/Ikea%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/449845/Ikea%20Script.meta.js
// ==/UserScript==

//words that determine the page category
const pageCategoryParams = {
    productPage : ["p", "products"],
    shoppingCartPage : ["shoppingbag", "shoppingcart", "order"],
    searchPage : ["search", "products"],
}

//characters/words that won't be filtered when differentiating the homepage
const allowedParams = ["p"];

//functions that are executed on relevant page for given category
const categoryFunctions = {
    homepage: function() {
        console.log("homepage");
    },
    productPage : function() {
        const productContainer = document.querySelector(".pip-product__buy-module-container");
        const productName = productContainer.querySelector(".pip-header-section__title--big");

        const productPrice = productContainer.querySelector(".pip-price__integer");
        const priceDecimal = productContainer.querySelector(".pip-price__decimals");

        console.log(productName?.innerHTML);
        console.log(parseFloat((productPrice?.innerText + priceDecimal?.innerText).replace(",",".")));
    },
    shoppingCartPage : function() {
        const productName = document.getElementsByClassName("productList_productlist__2obpO");
        const productsNumber = productName[0].childElementCount;

        let fullPrice = 0;
        let itemsNumber = 0;
        productName[0].children.forEach((child) => {
            const priceString = child.querySelectorAll('[class=price_total__CxWY-]')[0].innerHTML;
            const selectValue = parseInt(child.querySelectorAll('[data-testid=select]')[0].value);
            fullPrice += Number(priceString.replace(/[^0-9.-]+/g,""))/100;
            itemsNumber += selectValue;
        });

        console.log(itemsNumber);
        console.log(fullPrice/itemsNumber);

    },
    searchPage: function(search) {
        const searchParam = new URLSearchParams(search);
        const searchQuery = searchParam.get("k") || searchParam.get("q");
        console.log(searchQuery);

        const addButtons = document.querySelectorAll('.button__add-to-cart');
        addButtons.forEach((button) => {button.onclick = function(event) {
            console.log('added to cart:', event?.path[3]?.dataset?.productName);
        }});

    },
    unknown : function() {
        console.log("unknown");
    }

}

//page constructor function
function customUrl(path, paramsAllowed=allowedParams, categoryParams=pageCategoryParams) {
    this.params = path.pathname.split("/")
    this.search = path.search
    this.allowed = paramsAllowed
    this.filteredParams = function () {
        return this.params.filter((param) =>
                                  (this.allowed.includes(param) || param.length > 2));
    }
    this.pageCategory = function () {
        let pageCategory = "unknown";
        if(this.filteredParams().length <= 0) pageCategory = "homepage";
        else{
            Object.entries(categoryParams).forEach( ([key, values]) => {
                values.forEach((value) => {
                    if(this.filteredParams().includes(value)){
                        pageCategory = key.toString();
                        return;
                    }
                });
            });
        }
        return pageCategory;
    }
    this.pageCategoryFunction = function () {
        return categoryFunctions[this.pageCategory()](this.search);
    }
}

window.onload = () => {
    const ikea = new customUrl(window.location);
    ikea?.pageCategoryFunction();
}