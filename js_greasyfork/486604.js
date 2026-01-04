// ==UserScript==
// @name         Irongete Helper
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Product filter for irongete haven market page
// @author       Black Beard
// @match        https://irongete.com/haven/trade*
// @match        https://irongete.com/haven/trade/*
// @match        http://brodgar.io/trade/*
// @match        http://brodgar.io/trade*
// @match        https://brodgar.io/trade/*
// @match        https://brodgar.io/trade*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=irongete.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486604/Irongete%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486604/Irongete%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    String.prototype.not = function(a) { return this.localeCompare(a)!==0 }

    // should be dynamic
    const headers = {
        'product': 3,
        'price': 4
    }

    const getHeaderNode = (itm, name) => {
        switch (name) {
            case 'product':
                return itm.childNodes[3].lastChild.textContent;
            case 'price':
                return itm.childNodes[4].lastChild.previousSibling.textContent;
        }
    }

    function updateFilters(val) {
        const filters = [];
        let innerval;
        if (val.includes(":")) {
            const vals = val.split(";");
            vals.forEach(item => {
                if (item.trim().length > 0) {
                    let inner = item.split(":");
                    if (inner.length > 1) {
                        const fltr = {
                            name: inner[0].trim()
                        }
                        fltr.column = headers[fltr.name];
                        innerval = inner[1].trim();
                        let fval = ""
                        if (innerval.startsWith("^")) {
                            fltr.act = "startsWith";
                            fval = innerval.substring(1);
                        }else if (innerval.endsWith("$")) {
                            fltr.act = "endsWith";
                            fval = innerval.substring(0, innerval.length-1);
                        }else if (innerval.startsWith("!")) {
                            fltr.act = "not";
                            fval = innerval.substring(1);
                        }else{
                            fltr.act = "includes";
                            fval = innerval;
                        }
                        fltr.val = fval;
                        filters.push(fltr);
                    }
                }
            })
        }
        return filters;
    }

    function updateTable(allProducts, filters) {
        let cnt;
        allProducts.forEach((item,i) => {
            if (filters.every(fltr => getHeaderNode(item, fltr.name).trim().toLowerCase()[fltr.act](fltr.val))) {
                item.style.display = '';
            }else{
                item.style.display ='none';
            }
        })
    }

    const oldSearch = document.querySelector("#table-search");
    const products = document.querySelector("#products");
    const allProducts = products.childNodes[1].childNodes;

    const myFilter = document.createElement("input");
    myFilter.type = 'text';
    myFilter.id = "myFilter";
    myFilter.classList.add("form-control");
    myFilter.classList.add("mb-1");

    oldSearch.parentNode.insertBefore(myFilter, oldSearch);
    const search = document.querySelector("#myFilter");

    search.onkeydown = function(evt) {
        // evt.preventDefault();
        // console.log("fltr", evt);
        const filters = updateFilters(evt.currentTarget.value);
        // console.log("filters are", filters);
        updateTable(allProducts, filters);
    }
})();