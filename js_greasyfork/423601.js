// ==UserScript==
// @name         WHMCS Price Converter
// @namespace    Digimol
// @version      0.1
// @description  Converts Prices from one to another
// @author       Dave Mol
// @match        https://shop.idfnv.com/beheer/configproducts.php*
// @match        https://shop.wdmsh.com/beheer/configproducts.php*
// @match        https://sales.microglollc.com/beheer/configproducts.php*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/423601/WHMCS%20Price%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/423601/WHMCS%20Price%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currency = {};

    function calculate(from, to, value, $target) {
        fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
            .then(res => res.json())
            .then(res => {
            const rate = res.rates[to];
            $target.val(Math.round((value * rate).toFixed(2)));
        })
    }

    function getCurrencyID(cur) {
        let id = '';
        $.each(currency, (k, v)=> {
            if(v === cur) {
                id = k;
            }
        });
        return id;
    }

    function getCurrent() {
        let currencies = {};
        $('#pricingtbl').find('input').each((k,v)=> {
            if (v.name) {
                let info = v.name.split('currency[')[1];
                let ID = currency[info.split(']')[0]];
                let typeInfo = info.split('][')[1];
                if(typeInfo && v.value > 0) {
                    let type = typeInfo.split(']')[0];
                    currencies[ID] = currencies[ID] || {};
                    currencies[ID][type] = v.value
                }
            }
        });
        return currencies;
    }

    function createButtons() {
        $('#pricingtbl').find('td').each((k,v)=> {
            if (~$(v).text().indexOf('Enable')) {
                let cur = $(v).next().find('input').attr('currency');
                let $row = $('<tr>');
                let $cell = $('<td>').attr('colspan', '10').appendTo($row);
                $.each(currency, function(i2,v2) {
                    if(v2 !== cur) {
                        let $btn = $('<button>').text('Convert from '+v2).attr('currency', v2).click((e)=> {
                            e.preventDefault();
                            let current = getCurrent();
                            $.each(current[cur], (i3,v3) => {
                                calculate(v2, cur, $('input[name="currency['+getCurrencyID(v2)+']['+i3+']').val(), $('input[name="currency['+getCurrencyID(cur)+']['+i3+']'));
                            });
                        }).appendTo($cell);
                    }
                });
                $(v).parent('tr').after($row);
            }
        });
    }

    function getCurrencies() {
        $('#pricingtbl').find('input').each((k,v)=> {
            if (v.name) {
                let info = v.name.split('currency[')[1];
                let ID = info.split(']')[0];
                currency[ID] = v.id.split('_')[1];
            }
        });
    }

    let e = setInterval(()=> {
        if($('#pricingtbl').find('input').length) {
            clearInterval(e);
            getCurrencies();
            createButtons();
        }
    },10);
})();