// ==UserScript==
// @name         MoneyMeikah
// @namespace    https://www.mintos.com
// @version      0.1
// @description  Calculates the profit generated on each loan
// @author       DonNadie
// @match        https://www.mintos.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24587/MoneyMeikah.user.js
// @updateURL https://update.greasyfork.org/scripts/24587/MoneyMeikah.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var MoneyMeikah = function ()
    {
        var MKInternal;

        var init = function ()
        {
            setupMoneyField();

            $('#filter-button').on("click", function () {
                waitForData(showProfit);
            });

            showProfit();
        };

        var setupMoneyField = function ()
        {
            var userMoney = 0, $selector;

            if ($('#mk-money-input').length > 0) {
                return;
            }

            if ($('#add-all-filtered-to-cart').length > 0) {
                $selector = $('#add-all-filtered-to-cart');
            } else {
                $selector = $($('#primary-market-table thead th')[$('#primary-market-table thead th').length - 1]);
            }

            $selector.append('<input type="number" id="mk-money-input">');

            try {
                userMoney = parseFloat($('#header-username').text().trim().match(/\(€ ([0-9.]+)\)/)[1]);
            } catch (e) {
            }

            if (userMoney < 1) {
                userMoney = 20;
            }

            $('#mk-money-input').val(userMoney);
            $('#mk-money-input').on("change", showProfit);

            // pagination also changes if you change the filters, so we reset the event listener
            $('.pager-button-next').on("click", function () {
                waitForData(showProfit);
            });
        };

        var waitForData = function (cb)
        {
            try {
                clearInterval(MKInternal);
            } catch (e) {}

            MKInternal = setInterval(function () {
                console.log($('#filter-button').hasClass("loading") && $('#primary-market-table tbody tr').length );
                if (!$('#filter-button').hasClass("loading") && $('#primary-market-table tbody tr').length > 0) {
                    clearInterval(MKInternal);
                    cb();
                }
            }, 500);
            return;
        };

        var parseDate = function (terminationDays) {
            if (terminationDays == "Late") {
                terminationDays = 0;
            } else if (terminationDays.indexOf("m") !== -1) { // 34 m. 23 d.
                var monthsToDays = parseInt(terminationDays) * 30;

                terminationDays = parseInt(terminationDays.split("m. ")[1]) + monthsToDays;
            } else {
                terminationDays = parseInt(terminationDays);
            }

            return terminationDays;
        };

        var showProfit = function ()
        {
            var money, anualInterest, interest, terminationDays, profit, $profit;

            setupMoneyField();

            money = parseFloat($('#mk-money-input').val());

            $('#primary-market-table tbody tr').each(function () {
                // calculate the real interest %
                anualInterest = parseFloat($('.m-loan-interest', this).text());
                terminationDays = parseDate($('.m-loan-term span', this).text().trim());
                interest = (terminationDays * anualInterest) / 365;

                // calculate the profit
                profit = (((money * interest) / 100)).toFixed(2);

                if ($('.profit', this).length == 0) {
                    $('.actions.m-loan-actions', this).append('<div class="profit"></div>');
                }

                $profit = $('.profit', this);
                $profit.html(profit + " €");
                $profit.attr("title", interest.toFixed(2) + "%)");
            });
        };

        return {
            init: init,
            waitForData: waitForData
        };
    }();

    MoneyMeikah.waitForData(MoneyMeikah.init);
})();