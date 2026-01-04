// ==UserScript==
// @name         OptionStrat Bullish
// @namespace    https://greasyfork.org/en/users/1059737
// @version      0.2
// @description  Export tickers for OptionStrat Bullish Flow.
// @author       muyexi
// @license      MIT
// @match        https://optionstrat.com/flow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=optionstrat.com
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/496022/OptionStrat%20Bullish.user.js
// @updateURL https://update.greasyfork.org/scripts/496022/OptionStrat%20Bullish.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var targets = document.getElementsByClassName('FlowOverviewBar_row__J46TF FlowOverviewBar_row--bullish__QUpXX');

    var text = "";
    for(var i = 0; i < targets.length; i++) {
        let ticker = targets[i].getElementsByClassName("FlowOverviewBar_row__symbol__XwG74")[0].innerText;

        if (!ticker.startsWith('/')) {
            text += ticker + "\n";
        }
    }

    let element = document.createElement('a');
    element.href = "data:application/octet-stream,"+encodeURIComponent(text);
    element.download = 'OptionStrat Bullish.txt';
    element.click();
})();