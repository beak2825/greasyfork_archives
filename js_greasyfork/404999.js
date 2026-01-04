// ==UserScript==
// @name         Yahoo Finance Statistics Highlighter
// @namespace yahoofinancehighlighter
// @version      0.3
// @description  It highlights some statistics in Yahoo Finance
// @author       Michele
// @match        https://finance.yahoo.com/quote/**
// @grant        GM_registerMenuCommand
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_addStyle

// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404999/Yahoo%20Finance%20Statistics%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/404999/Yahoo%20Finance%20Statistics%20Highlighter.meta.js
// ==/UserScript==

(function() {
//    'use strict';
    GM_config.init(
        {
            'id': 'YFHConfig',
            'title': 'Settings',
            'fields': {
                'roe-green':
                {
                    'label': 'ROE - Green',
                    'type': 'number',
                    'default': '40'
                },
                'roe-red':
                {
                    'label': 'ROE - Red',
                    'type': 'number',
                    'default': '30'
                },
                'current-ratio-green':
                {
                    'label': 'Current Ratio - Green',
                    'type': 'number',
                    'default': '1'
                },
                'current-ratio-red':
                {
                    'label': 'Current Ratio - Red',
                    'type': 'number',
                    'default': '0.8'
                },
                'short-ratio-green':
                {
                    'label': 'Short Ratio - Green',
                    'type': 'number',
                    'default': '3'
                },
                'short-ratio-red':
                {
                    'label': 'Current Ratio - Red',
                    'type': 'number',
                    'default': '9'
                },
                'payout-ratio-green':
                {
                    'label': 'Payout Ratio - Green',
                    'type': 'number',
                    'default': '80'
                },
                'payout-ratio-red':
                {
                    'label': 'Payout Ratio - Red',
                    'type': 'number',
                    'default': '99'
                },
                'revenue-growth-green':
                {
                    'label': 'Revenue Growth - Green',
                    'type': 'number',
                    'default': '10'
                },
                'revenue-growth-red':
                {
                    'label': 'Revenue Growth - Red',
                    'type': 'number',
                    'default': '0'
                },
                'earnings-growth-green':
                {
                    'label': 'Earning Growth - Green',
                    'type': 'number',
                    'default': '10'
                },
                'earnings-growth-red':
                {
                    'label': 'Earning Growth - Red',
                    'type': 'number',
                    'default': '0'
                },
                'operating-margin-green':
                {
                    'label': 'Operating Margin - Green',
                    'type': 'number',
                    'default': '20'
                },
                'operating-margin-red':
                {
                    'label': 'Earning Growth - Red',
                    'type': 'number',
                    'default': '10'
                },
                'roa-green':
                {
                    'label': 'Operating Margin - Green',
                    'type': 'number',
                    'default': '5'
                },
                'roa-red':
                {
                    'label': 'Earning Growth - Red',
                    'type': 'number',
                    'default': '4'
                },
                'de-green':
                {
                    'label': 'Debt/Equity - Green',
                    'type': 'number',
                    'default': '0.6'
                },
                'de-red':
                {
                    'label': 'Debt/Equity - Red',
                    'type': 'number',
                    'default': '1'
                },
            }
        });
    GM_registerMenuCommand('Configure', () => {
        GM_config.open();
    })

    var groups = [
        {"ariaLabel": "Return on Equity", "field": "roe", "bestLower": false},
        {"ariaLabel": "Return on Assets", "field": "roa", "bestLower": false},
        {"ariaLabel": "Current Ratio", "field": "current-ratio", "bestLower": false},
        {"ariaLabel": "Short Ratio", "field": "short-ratio", "bestLower": true, "labelFunction":"startsWith"},
        {"ariaLabel": "Payout Ratio", "field": "payout-ratio", "bestLower": true},
        {"ariaLabel": "Quarterly Revenue Growth", "field": "revenue-growth", "bestLower": false},
        {"ariaLabel": "Quarterly Earnings Growth", "field": "earnings-growth", "bestLower": false},
        {"ariaLabel": "Operating Margin", "field": "operating-margin", "bestLower": false},
        {"ariaLabel": "Total Debt/Equity", "field": "de", "bestLower": true},
    ];

    function best(a, b, group) {
        return group.bestLower ? a < b : a > b;
    }

    function compare(a, b, labelFunction) {
        return labelFunction === undefined ? a == b : a[labelFunction](b);
    }

    setInterval ( function () {
        $.each(groups, function(i, group) {
            $.each($("span:contains('" + group.ariaLabel + "')"), function(i, el) {
                if (compare($(el).text(), group.ariaLabel, group.labelFunction)) {
                    var valueEl = $($(el).parent().siblings()[0]);
                    var currentValue = parseFloat(valueEl.text());
                    var greenValue = parseFloat(GM_config.get(group.field + '-green'));
                    var redValue = parseFloat(GM_config.get(group.field + '-red'));
                    var color = "";
                    if (best(currentValue, greenValue, group)) {
                        color = "green";
                    } else if (!best(currentValue, redValue, group)) {
                        color = "red";
                    } else {
                        color = "orange";
                    }
                    $(el).css("color", color);
                    $(el).css("font-weight", "bold");
                    $(valueEl).css("color", color);
                    $(valueEl).css("font-weight", "bold");
                }
            });

        });
    }, 1000);

})();
