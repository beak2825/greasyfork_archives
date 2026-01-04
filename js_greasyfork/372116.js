// ==UserScript==
// @name         Netflix Plans Fetcher
// @description  Get Netflix prices of all countries
// @author       /u/Wilcooo
// @include      https://www.netflix.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @version      1
// @namespace    /u/Wilcooo
// @downloadURL https://update.greasyfork.org/scripts/372116/Netflix%20Plans%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/372116/Netflix%20Plans%20Fetcher.meta.js
// ==/UserScript==

var data = GM_getValue('data',{});


if (location.pathname.startsWith('/signup')) {

    // Getting the prices & current country whenever the Netflix site is opened

    document.addEventListener("DOMContentLoaded", function(event) {

        var geo = netflix.reactContext.models.signupContext.data.geo.requestCountry,
            options = netflix.reactContext.models.signupContext.data.flow.fields.planChoice.options;

        data[geo.id] = {geo:geo, options:options};
        GM_setValue('data',data);

        // Get the exchange rates (used later)
        var exchange_rates = jQuery.getJSON("https://www.floatrates.com/daily/usd.json");


        // Write the result info:

        document.body.innerHTML =
            'Done! You can select another country now.<br><br>' +
            'You can disable this userscript in your userscript manager (f.e. Tampermonkey). You can usually find its icon in the top right.<br><br>' +
            'This is all collected data so far, you can copypasta this table right into EXCEL<br>' +
            'Click <a href="#" onclick="NPFclear()">here</a> to remove everything.<br>'+
            'For more details, type NPFdata in the JS console.<br><br>';


        // Create the table:

        var table = document.createElement('table');
        document.body.appendChild(table);
        table.innerHTML = "<tr><th>Country</th><th>Currency</th><th>Basic</th><th>Standard</th><th>Premium</th><th>Basic (USD)</th><th>Standard (USD)</th><th>Premium (USD)</th></tr>"


        // Add all entries to the table

        Object.keys(data).forEach(function(k) {

            var currency = data[k].options[0].fields.planPriceCurrency.value;
            var prices = data[k].options.map(o => o.fields.planPriceAmount.value || o.fields.planPrice.value.match(/[\d.,]+/)[0] );

            var tr = data[k].tr = document.createElement("tr");
            table.appendChild(tr);
            tr.innerHTML = [data[k].geo.countryName, currency, ...prices].map( x => "<td>" + x + "</td>").join('');


            // Once the exchange rates (requested before) are loaded, calculate & add the converted prices:

            exchange_rates.done(function(exchange_rates) {
                try {
                    var pricesUSD = prices.map( price => (price / exchange_rates[currency.toLowerCase()].rate).toFixed(2) );
                    tr.innerHTML += pricesUSD.map( x => "<td>" + x + "</td>").join('');
                } catch(e){
                    if (currency.toLowerCase() == "usd") {
                        tr.innerHTML += prices.map( x => "<td>" + x + "</td>").join('');
                    } else tr.innerHTML += "<td>Error getting Exchange Rate</td>";
                }
            });
        });

    });

} else location.href = 'https://www.netflix.com/signup/';


// The function that clears all entries

window.NPFclear = function() {
    if (confirm("Ara you sure you want to delete everything???")) {
        GM_setValue('data',{});
        location.href = 'https://www.netflix.com/signup/';
    }
}


// Some styling (CSS) of the table

var style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule(` td { border: 1px solid black; width: 80px; }`);


// Make the data accessible in the JS console
window.NPFdata = data;