// ==UserScript==
// @name         NetHunt Extend
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Adds the US dollar rate functional.
// @author       Max Voitsekhovsky @voitsekhovskymax
// @match        https://nethunt.com/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nethunt.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467405/NetHunt%20Extend.user.js
// @updateURL https://update.greasyfork.org/scripts/467405/NetHunt%20Extend.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */



(function($){
    let rate_USD  = 0;
    let rate_url = "https://nethunt.voitsekhovsky.studio/wp-json/nethunt/v1/rate/usd";
    $.get( rate_url, function( data ) {
        rate_USD = data.rate_USD;
    });

    $(function() {
        $( document ).ready(function() {
            let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var observer = new MutationObserver(function(mutations, observer) {
                // fired when a mutation occurs
                for (var i = 0, len = mutations.length; i < len; i++) {
                    if(mutations[i].target.outerText === 'Ціна/м2 USD') {
                        //getters
                        let area  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Площа")').parent().next().val().replace(/,/g, '.'));
                        let price_m_USD  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Ціна/м2 USD")').parent().next().val().replace(' USD', '').replace(/,/g, '.'));
                        let price_m_UAH = rate_USD * price_m_USD;
                        let total_price_UAH = rate_USD * price_m_USD * area;
                        let total_price_USD =  price_m_USD * area;
                        generateTable(area, price_m_USD, price_m_UAH, total_price_USD, total_price_UAH);
                    }
                    if(mutations[i].target.outerText === 'Ціна/м2 UAH') {
                        let area  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Площа")').parent().next().val().replace(/,/g, '.'));
                        let price_m_UAH  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Ціна/м2 UAH")').parent().next().val().replace(' UAH', '').replace(/,/g, '.'));
                        let price_m_USD =  price_m_UAH / rate_USD;
                        let total_price_UAH = price_m_UAH * area;
                        let total_price_USD =  price_m_USD * area;
                        generateTable(area, price_m_USD, price_m_UAH, total_price_USD, total_price_UAH);
                    }
                    if(mutations[i].target.outerText === 'Загальна ціна USD') {
                        let area  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Площа")').parent().next().val().replace(/,/g, '.'));
                        let total_price_USD  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Загальна ціна USD")').parent().next().val().replace(' USD', '').replace(/,/g, '.'));
                        let price_m_USD =  total_price_USD / area ;
                        let total_price_UAH = total_price_USD * rate_USD;
                        let price_m_UAH =  price_m_USD * rate_USD;
                        generateTable(area, price_m_USD, price_m_UAH, total_price_USD, total_price_UAH);
                    }
                    if(mutations[i].target.outerText === 'Загальна ціна UAH') {
                        let area  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Площа")').parent().next().val().replace(/,/g, '.'));
                        let total_price_UAH  = parseFloat(jQuery('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Загальна ціна UAH")').parent().next().val().replace(' USD', '').replace(/,/g, '.'));
                        let price_m_UAH =  total_price_UAH / area;
                        let price_m_USD =  price_m_UAH / rate_USD;
                        let total_price_USD = price_m_USD * area;
                        generateTable(area, price_m_USD, price_m_UAH, total_price_USD, total_price_UAH);
                    }
                }
            });

            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            observer.observe(document, {
                subtree: true,
                attributes: true
                //...
            });

            function generateTable(area, price_m_USD, price_m_UAH, total_price_USD, total_price_UAH){
                console.log({
                    'area': area,
                    'rate_USD': rate_USD,
                    'price_m_USD': price_m_USD,
                    'price_m_UAH' : price_m_UAH,
                    'total_price_UAH' : total_price_UAH,
                    'total_price_USD' : total_price_USD,
                });
                // setters
                let table_html = '<table style="table-layout: fixed; width: 250px;">';
                let th_style = 'padding: 5px; text-align: left; font-size: 13px; width: 150px;';
                if(!isNaN(price_m_USD)) {
                    table_html += '<tr><th style="'+ th_style +'">Ціна/м2 USD</th><td><input type="number" onClick="this.select();" value="' + price_m_USD.toFixed(2) + '" style="width: 100px;" readonly/></td></tr>';
                }

                if( !isNaN(price_m_UAH)) {
                    table_html += '<tr><th style="'+ th_style +'">Ціна/м2 UAH</th><td><input type="number" onClick="this.select();" value="' + price_m_UAH.toFixed(2) + '" style="width: 100px;" readonly/></td></tr>';
                }

                if(!isNaN(total_price_USD)) {
                    table_html += '<tr><th style="'+ th_style +'">Загальна ціна USD</th><td><input type="number" onClick="this.select();" value="' + total_price_USD.toFixed(2) + '" style="width: 100px;" readonly/></td></tr>';
                }

                if(!isNaN(total_price_UAH)) {
                    table_html += '<tr><th style="'+ th_style +'">Загальна ціна UAH</th><td><input type="number" onClick="this.select();" value="' + total_price_UAH.toFixed(2) + '" style="width: 100px;" readonly/></td></tr>';
                }


                table_html += '<tr><th style="'+ th_style +'">Курс USD</th><td>' + rate_USD + '</td></tr>';

                table_html += '</table>';

                if(!$('#nhe_prices').length) {
                    $('.nh-recordForm .nh-recordPageFormFields-item .nh-menuDefaultControl-label span:contains("Ціна/м2 USD")').parent().parent().parent().parent().prepend('<div id="nhe_prices">'+table_html+'</div>');
                }
                else {
                    $('#nhe_prices').html(table_html);
                }
            }

        });
    });

})(jQuery);





