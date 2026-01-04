// ==UserScript==
// @name         Mintos Sell Secondary
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mintos sell secondary | Mintos sell secondary
// @author       Alberizo
// @match        https://www.mintos.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396757/Mintos%20Sell%20Secondary.user.js
// @updateURL https://update.greasyfork.org/scripts/396757/Mintos%20Sell%20Secondary.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var max_days_to_finish = 1;

    if(typeof $ != 'undefined'){
        var loans_to_sell = [];
        var loans_to_sell_index = 0;

        function add_to_sell(index){
            if(index < loans_to_sell.length){
                var loan_id = loans_to_sell[index].id;
                var amount_value = loans_to_sell[index].basketAmount;

                $.ajax({
                    url: 'https://www.mintos.com/en/investment/add-to-basket/',
                    type: 'post',
                    dataType: 'json',
                    data: {id: loan_id,
                           token: $('a#empty-investments-cart-button').data('token'),
                           amount: Math.round((amount_value) * 100) / 100
                          }
                }).done(function(data){
                    if(loans_to_sell_index < loans_to_sell.length){
                        loans_to_sell_index++;
                        add_to_sell(loans_to_sell_index);
                    }
                });
            }else{
                window.location.href = 'https://www.mintos.com/en/review-investment-sales-en/';
            }
        }

        function check_loans_next_to_finish(){
            if($('#investor-basket:first').length && !$('button#investment-confirm-button:first').length){
                $.ajax({
                    url: 'https://www.mintos.com/en/my-investments/list',
                    method: 'POST',
                    data: {
                        currency: 978,
                        sort_field: 'term',
                        sort_order: 'ASC',
                        max_results: 300,
                        page: 1
                    },
                    dataType: 'json',
                    xhrFields: {
                        withCredentials: true
                    }
                }).done(function(data){
                    var investments = data.data.result.investments;
                    var count_loans_to_sell = 0;

                    investments.forEach(function(investment){
                        var term = investment.loan.remainingTermDays;

                        var days = term.match(/^([0-9]+) d\./);
                        if(days){
                            days = days[1];

                            if(days <= max_days_to_finish && !investment.inSecondaryMarket){
                                loans_to_sell.push(investment);
                                count_loans_to_sell++;
                            }
                        }
                    });

                    var $main_nav = $('ul#main-nav:first');
                    if($main_nav){
                        if(count_loans_to_sell > 0){
                            $main_nav.append('<li class="main-nav-item" style="background:#3f85f4"><a id="sell_secondary_button" class="main-nav-link" style="background:#3f85f4;cursor:pointer">Sell '+ count_loans_to_sell +' loans</a></li>');
                            $('#sell_secondary_button:first').click(function(e){
                                $(this).append(' ⌛');
                                e.preventDefault();
                                if(loans_to_sell.length > 0){
                                    add_to_sell(0)
                                }
                            });
                        }else{
                            $main_nav.append('<li class="main-nav-item" style="background:#3f85f4"><label class="main-nav-link" style="background:#3f85f4">No loans to sell</label></li>');
                        }
                    }
                });
            }
        }

        check_loans_next_to_finish();
    }
})();