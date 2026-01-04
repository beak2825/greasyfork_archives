// ==UserScript==
// @name         Mandarake JPY to EUR
// @namespace    http://order.mandarake.co.jp/
// @version      0.6
// @description  Converts Mandarake pricing to EUR
// @author       EIREXE
// @match        https://order.mandarake.co.jp/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35887/Mandarake%20JPY%20to%20EUR.user.js
// @updateURL https://update.greasyfork.org/scripts/35887/Mandarake%20JPY%20to%20EUR.meta.js
// ==/UserScript==

// Stackoverflow format unicorn
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
        : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

function price_to_html(price_jpy, exchange_rate) {
    var price_converted = (price_jpy/exchange_rate);
    var price_converted_format = price_converted.toLocaleString(undefined, {maximumFractionDigits: 2});
    return "<strong>{price_euro} €</strong> ({price_jpy} ¥)".formatUnicorn({"price_euro": price_converted_format, "price_jpy": price_jpy.toLocaleString()})
}

(function() {
    'use strict';
    var JPY_data = "https://api.exchangeratesapi.io/latest?base=EUR&symbols=JPY";

    $.getJSON(JPY_data).done(function(data){
        console.log(data);
        var exchange_rate = data.rates.JPY;
        $('p:contains(" yen")').filter(function() {

            if ($(this).text().trim().startsWith("Also available")) {
                var text = $(this).text();
                var child = $(this).children("a")
                console.log(child)
                text = text.split("Also available between ")[1]
                var between_1 = text.split(" and")[0]
                var between_2 = text.split("and ")[1]
                between_2 = between_2.split(" yen.")[0]
                between_1 = parseFloat(between_1.replace(/,/g, ""))
                between_2 = parseFloat(between_2.replace(/,/g, ""))

                child.text("")
                child.append("Also available between {between_1} and {between_2}".formatUnicorn({"between_1": price_to_html(between_1, exchange_rate), "between_2": price_to_html(between_2, exchange_rate)}))
            } else {
                var price_jpy_str = $(this).text().split(" ")[0];
                var price_jpy = parseFloat(price_jpy_str.replace(/,/g, ""));
                var price_converted = (price_jpy*exchange_rate);
                var price_converted_format = price_converted.toLocaleString(undefined, {maximumFractionDigits: 2});
                $(this).text("")
                $(this).append(price_to_html(price_jpy, exchange_rate))
            }

            return;
        });
    });
})();