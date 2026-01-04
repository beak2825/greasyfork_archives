// ==UserScript==
// @name         SiaMining Dollar Balance
// @namespace    http://eskodhi.xyz/
// @version      0.2
// @description  Displays SiaMining balances in dollar values using given price values.
// @author       eskodhi
// @match        *://*.siamining.com/addresses/*
// @match        *://siamining.com/addresses/*
// @grant        none
// @require    https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37218/SiaMining%20Dollar%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/37218/SiaMining%20Dollar%20Balance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function initFields(fields) {
        // creates a new "dollar" and "both" instance of the field and hides it.
        $(fields).each(function() {
            duplicateField(this, 'dollar');
            duplicateField(this, 'both');
            suffixFirstClass(this, 'sc');
        });
    }
    function suffixFirstClass(el, suffix) {
        let classes = $(el).attr('class').split(' ');
        classes[0] = classes[0] + '-' + suffix;
        $(el).attr('class', classes.join(' '));
    }

    function duplicateField(field, append) {
        let a = $(field).clone();
        suffixFirstClass(a, append);
        a.hide();
        a.insertAfter(field);
    }
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        // the default value for minimumFractionDigits depends on the currency
        // and is usually already 2
    });
    var ab=document.querySelector('.d-address_balance');
    var ar=document.querySelector('.d-address_rewards');
    var fields = $('[class*=d-address_int]').filter('[class*=rewards]').toArray().concat([ab, ar]);
    initFields(fields);

    var $both = $('[class*=-both]'),
        $sc = $('[class*=-sc]'),
        $dollar = $('[class*=-dollar]');

    var d = {
        units: ['both', 'dollar', 'sc'],
        current_unit: 'both',
        hide_dollar: function() {
            $dollar.hide();
        },
        hide_both: function() {
            $both.hide();
        },
        hide_default: function() {
            $sc.hide();
        },
        show_dollar: function() {
            d.hide_both();
            d.hide_default();
            $dollar.show();
        },
        show_both: function() {
            d.hide_dollar();
            d.hide_default();
            $both.show();
        },
        show_sc: function() {
            d.hide_dollar();
            d.hide_both();
            $sc.show();
        },
        get_price: function() {
            var mup=document.querySelector('.d-market_usd_price');
            var sia_price = (mup.innerText.match(/\d+\.\d+/g) / 1000);
            return sia_price;
        },
        sc2fiat: function(sc) {
            var sia_price = d.get_price();
            return sc * sia_price;
        },
        parse_value: function(data, unit) {
            var value = data.replace(/[^0-9\.]/g, '');
            return value;
        },
        get_unpaid: function(unit) {
            unit = unit ? unit : 'sc';
            var unpaid_b=ab.innerText.match(/\d+\.\d+/)[0];
            if (unit == 'dollar' || unit == '$') {
                unpaid_b = d.sc2fiat(unpaid_b);
            }
            return unpaid_b;
        },
        get_paid: function(unit) {
            unit = unit ? unit : 'sc';
            var paid_b = parseFloat(ar.innerText.replace(/[^0-9\.]+/g, ''));
            if (unit == 'dollar' || unit == '$') {
                paid_b = paid_b * d.get_price();
            }
            return paid_b;
        },
        update_both: function() {
            d.show_both();
            $both.each(function() {
                var c = $(this).attr('class').replace('-both', '-sc').split(' ').join('.');
                var $sc_el = $('.'+c);
                var value = d.sc2fiat(d.parse_value($sc_el.text()));
                $(this).text($sc_el.text() + " (" + formatter.format(value) + ")");
            });
        },
        update_dollar: function() {
            d.show_dollar();
            $dollar.each(function() {
                var c = $(this).attr('class').replace('-dollar', '-sc').split(' ').join('.');
                var $sc_el = $('.'+c);
                var value = d.sc2fiat(d.parse_value($sc_el.text()));
                $(this).text(formatter.format(value));
            });
        },
        update_sc: function() {
            d.show_sc();
        },
        update_balance: function() {
            d['update_'+d.current_unit]();
        },
        setUnit: function(toggleUnit) {
            return function() {
                d.current_unit = toggleUnit;
                d.update_balance();
            };
        },
        bind_handlers: function() {
            $both.click(d.setUnit('sc'));
            $sc.click(d.setUnit('dollar'));
            $dollar.click(d.setUnit('both'));
        }
    };
    d.bind_handlers();
    d.update_balance();
    var observer = new MutationObserver(function(mutations) {
        d.update_balance();
    });
    var config = { childList: true };
    observer.observe(ab, config);
})();