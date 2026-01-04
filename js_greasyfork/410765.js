// ==UserScript==
// @name         TORN: Profits
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show net profit on the company page
// @author       Untouchable [1360035]
// @match        https://www.torn.com/companies.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410765/TORN%3A%20Profits.user.js
// @updateURL https://update.greasyfork.org/scripts/410765/TORN%3A%20Profits.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let api_key = localStorage.getItem('uapikey');
    if(api_key == "" || api_key == undefined){
        api_key = prompt("Please enter your api key");
        localStorage.setItem('uapikey',api_key);
    }

    let wages = 0, ad_budget = 0, daily_profit = 0, net_profit = 0;

    $.get( "https://api.torn.com/company/?selections=employees&key=" + api_key, () => {})
    .always((data) => {
        Object.keys(data.company_employees).forEach((index) => {
          wages += data.company_employees[index].wage;
        });

        $.get( "https://api.torn.com/company/?selections=&key=" + api_key, () => {})
            .always((data) => {
            console.log(data);
            daily_profit = data.company.daily_income;
            $.get( "https://api.torn.com/company/?selections=detailed&key=" + api_key, () => {})
                .always((data) => {
                ad_budget = data.company_detailed.advertising_budget;
                net_profit = daily_profit - wages - ad_budget;
                $('span.t-green')[0].innerText = netProfit(net_profit);
            });
        });
    });

    
})();

function addCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function netProfit(np){
  if(np < 0){
     $('span.t-green')[0].classList.add('t-red');
    return "- $" + addCommas(np * -1);
  } else {
    return "+ $" + addCommas(np);
  }
}
