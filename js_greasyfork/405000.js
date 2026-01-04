// ==UserScript==
// @name         Yahoo Finance Portfolio Highlighter
// @namespace yahoofinancehighlighter
// @version      0.1
// @description  It highlights some statistics in Yahoo Finance Portfolio
// @author       Michele
// @match        https://finance.yahoo.com/portfolio/**
// @grant        GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_addStyle

// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405000/Yahoo%20Finance%20Portfolio%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/405000/Yahoo%20Finance%20Portfolio%20Highlighter.meta.js
// ==/UserScript==

(function() {
//    'use strict';
    GM_config.init(
        {
            'id': 'YFHConfig',
            'title': 'Settings',
            'fields': {
                'pe-ratio-green':
                {
                    'label': 'P/E Ratio - Green',
                    'type': 'number',
                    'default': '30'
                },
                'pe-ratio-red':
                {
                    'label': 'P/E Ratio - Red',
                    'type': 'number',
                    'default': '50'
                },
                'ps-ratio-green':
                {
                    'label': 'P/S Ratio - Green',
                    'type': 'number',
                    'default': '2'
                },
                'ps-ratio-red':
                {
                    'label': 'P/S Ratio - Red',
                    'type': 'number',
                    'default': '5'
                },
                'forward-pe-ratio-green':
                {
                    'label': 'Forward P/E Ratio - Green',
                    'type': 'number',
                    'default': '30'
                },
                'forward-pe-ratio-red':
                {
                    'label': 'Forward P/E Ratio - Red',
                    'type': 'number',
                    'default': '50'
                },
                'eps-green':
                {
                    'label': 'EPS - Green',
                    'type': 'number',
                    'default': '4'
                },
                'eps-red':
                {
                    'label': 'EPS - Red',
                    'type': 'number',
                    'default': '1'
                },
                'epsny-green':
                {
                    'label': 'EPS Next Year - Green',
                    'type': 'number',
                    'default': '4'
                },
                'epsny-red':
                {
                    'label': 'EPS Net Year - Red',
                    'type': 'number',
                    'default': '1'
                },
                'price-compariton-52-green':
                {
                    'label': '%Diff Price Compariton 52 Wk - Green',
                    'type': 'number',
                    'default': '30'
                },
                'price-compariton-52-red':
                {
                    'label': '%Diff Price Compariton 52 Wk - Red',
                    'type': 'number',
                    'default': '80'
                },

            }
        });
    GM_registerMenuCommand('Configure', () => {
        GM_config.open();
    })

    var groups = [
        {"ariaLabel": "Trailing P/E", "field": "pe-ratio", "bestLower": true},
        {"ariaLabel": "Forward P/E", "field": "forward-pe-ratio", "bestLower": true},
        {"ariaLabel": "EPS (TTM)", "field": "eps", "bestLower": false},
        {"ariaLabel": "EPS Est Next Year", "field": "epsny", "bestLower": false},
        {"ariaLabel": "Price/Sales", "field": "ps-ratio", "bestLower": true},
    ];

    function best(a, b, group) {
        return group.bestLower ? a < b : a > b;
    }

    setInterval ( function () {

        $.each(groups, function(i, group) {
            $.each($("[aria-label='" + group.ariaLabel + "']"), function(i, el) {
                var currentValue = parseFloat($(el).text());
                var greenValue = parseFloat(GM_config.get(group.field + '-green'));
                var redValue = parseFloat(GM_config.get(group.field + '-red'));
                if (best(currentValue, greenValue, group)) {
                    $(el).css("color", "green");
                } else if (!best(currentValue, redValue, group)) {
                    $(el).css("color", "red");
                } else {
                    $(el).css("color", "black");
                }
            });
        });

        // Price comparison
        $.each($("[aria-label='Last Price']"), function(i, el) {
            var low52 = $(el).siblings("[aria-label='52-Wk Low']");
            var high52 = $(el).siblings("[aria-label='52-Wk High']");
            var currentValue = parseFloat($(el).text());
            var lowValue = parseFloat(low52.text());
            var highValue = parseFloat(high52.text());
            var greenValue = parseFloat(GM_config.get('price-compariton-52-green'))/100;
            var redValue = parseFloat(GM_config.get('price-compariton-52-red'))/100;
            var ratio = (currentValue - lowValue) / (highValue - lowValue);
            if (ratio < greenValue) {
                $(el).css("color", "green");
            } else if (ratio > redValue) {
                $(el).css("color", "red");
            } else {
                $(el).css("color", "black");
            }
            /*
            var greenValue = parseFloat(GM_config.get('price-compariton-52-green'));
            var redValue = parseFloat(GM_config.get('price-compariton-52-red'));
            if (best(currentValue, greenValue, group)) {
                $(el).css("color", "green");
            } else if (!best(currentValue, redValue, group)) {
                $(el).css("color", "red");
            } else {
                $(el).css("color", "black");
            }
            */
        });


    }, 1000);

})();
