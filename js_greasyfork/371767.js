// ==UserScript==
// @name         Neopets Premium Bankroll Emulator
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      1.61
// @description  Emulates the functionality of the Premium bankroll feature from the bottom bar.
// @author       RealisticError
// @match        http://www.neopets.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/371767/Neopets%20Premium%20Bankroll%20Emulator.user.js
// @updateURL https://update.greasyfork.org/scripts/371767/Neopets%20Premium%20Bankroll%20Emulator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Page Setup stuff
    GM_addStyle("#GMFinances { background-image: url('https://i.imgur.com/QVom3bn.png?1'); width: 42px; height: 33px; display: inline-block;}");
    GM_addStyle("#GMFinancialClosePopup { background-image: url('https://i.imgur.com/ZVp5fLw.png'); width: 26px; height: 28px; position: absolute;top: -10px; right: -10px;}");
    GM_addStyle("#GMFinancialRefreshPopup { background-image: url('https://i.imgur.com/f2k0GWM.png'); width: 23px; height: 23px; position: absolute;top: -10px; right: 20px;}");
    GM_addStyle(" #GMFinancesPopup { position: fixed; top: 1em; right: 1em; width: 225px; height: 275px; background-color: #e8e5e5; border: solid 3px black; border-radius: 15px;}");
    GM_addStyle(" .interestChecked { width: 16px; height: 20px; background: url(http://images.neopets.com/premium/2012/bar/bkrl-interest.png) no-repeat; position: fixed; top: 90px; right: 125px; background-position: 0px -20px}");
    GM_addStyle(" .interestUnchecked { position: fixed; width: 16px; height: 20px; background: url(http://images.neopets.com/premium/2012/bar/bkrl-interest.png) no-repeat; top: 90px; right: 125px;}");
    GM_addStyle(" #GMFinancialTotalNeopoints { border-top: solid 1px black; font-weight: bold; color: #5e72c0;}");
    $(".user.medText").html("<div id='GMFinances'></div>" + $(".user.medText").html());


    //variables
    var financeButton = $("#GMFinances");
    var TEN_MINUTES = 60 * 10 * 1000;
    var GMFinanceTill = '';
    var GMFinanceBank = '';
    var GMFinanceStockTotalBought = '';
    var GMFinanceStockTotalWorth = '';
    var GMFinancialTotalNeopoints = '';
    var interestHasBeenCollected = GM_getValue('GMFinanceBankInterestCollected', 'interestUnchecked');
console.log(GM_getValue('GMFinanceBankInterestCollected'));
    var parseNumbers = function() {

        GMFinancialTotalNeopoints = (parseInt(GMFinanceBank.slice(0, -3).replace(/,/g, '')) + parseInt(GMFinanceTill.slice(0, -3).replace(/,/g, ''))
                                     + parseInt(GMFinanceStockTotalWorth.replace(/,/g, '')));

        var NPOnHand = parseInt($('#npanchor')[0].innerText.replace(/,/g, ''));

        GMFinancialTotalNeopoints = isNaN(GMFinancialTotalNeopoints) ? NPOnHand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " NP" : (GMFinancialTotalNeopoints + NPOnHand).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " NP";

        return GMFinancialTotalNeopoints;
    }

    var getValuesForPopup = function() {

        //Get values via ajax
        //Shop Till
        if(typeof GM_getValue('GMFinanceTill') === 'undefined' || new Date().valueOf() - GM_getValue('GMFinanceLastRefresh') > TEN_MINUTES){
            $.ajax({
                type : "GET",
                url : "http://www.neopets.com/market.phtml?type=till",
                success : function(responsetexttill) {
                    if(jQuery(responsetexttill).find("#content .content")[0].innerText.indexOf("You don't have your own shop yet!") !== -1) {

                        GM_setValue('GMFinanceTill', '0 NP');

                    } else {
                        GM_setValue('GMFinanceTill', jQuery(responsetexttill).find("#content p b").text());

                    }
                    $('#GMFinanceTillValue').text(GM_getValue('GMFinanceTill'));
                    GM_setValue('GMFinanceLastRefresh', new Date().valueOf())
                    GMFinanceTill = GM_getValue('GMFinanceTill');

                    $('#GMFinancialTotalNeopointsValue').html(parseNumbers());
                }})
        } else {

            GMFinanceTill = GM_getValue('GMFinanceTill');
        }

        //Bank Balance
        if(typeof GM_getValue('GMFinanceBank') === 'undefined' || new Date().valueOf() - GM_getValue('GMFinanceLastRefresh') > TEN_MINUTES){
            $.ajax({
                type : "GET",
                url : "http://www.neopets.com/bank.phtml",
                success : function(responsetextbank) {

                    if(jQuery(responsetextbank).find("#content form table b")[1].innerText.indexOf("Your Neopian Address:") !== -1) {

                        GM_setValue('GMFinanceBank', '0 NP');

                    } else {

                        GM_setValue('GMFinanceBank', jQuery(responsetextbank).find("#content form table b")[1].innerText);
                        GM_setValue('GMFinanceBankInterestCollected', ((jQuery(responsetextbank).find("input[value*='Collect Interest']")[1]) == null)? 'interestChecked' : 'interestUnchecked');
                    }
                    $('#GMFinanceBankValue').text(GM_getValue('GMFinanceBank'));
                    interestHasBeenCollected = GM_getValue('GMFinanceBankInterestCollected');
                    GM_setValue('GMFinanceLastRefresh', new Date().valueOf())
                    GMFinanceBank = GM_getValue('GMFinanceBank');
                    $('#GMFinancialTotalNeopointsValue').html(parseNumbers());
                }})
        } else {

            GMFinanceBank = GM_getValue('GMFinanceBank');
        }

        //Stock Market bought value | current value
        if(typeof GM_getValue('GMFinanceStockTotalBought') === 'undefined' || typeof GM_getValue('GMFinanceStockTotalWorth') === 'undefined' || new Date().valueOf() - GM_getValue('GMFinanceLastRefresh') > TEN_MINUTES){
            $.ajax({
                type : "GET",
                url : "http://www.neopets.com/stockmarket.phtml?type=portfolio",
                success : function(responsetextStocks) {

                    if(jQuery(responsetextStocks).find("#postForm  tr[bgcolor ='#BBBBBB'").length < 1) {
                        GM_setValue('GMFinanceStockTotalBought', '0');
                        GM_setValue('GMFinanceStockTotalWorth', '0');
                    } else {
                        GM_setValue('GMFinanceStockTotalBought', jQuery(responsetextStocks).find("#postForm  tr[bgcolor ='#BBBBBB'").children()[2].innerText);
                        GM_setValue('GMFinanceStockTotalWorth', jQuery(responsetextStocks).find("#postForm  tr[bgcolor ='#BBBBBB'").children()[3].innerText);
                    }
                    $('#GMFinanceStockValue').text(GM_getValue('GMFinanceStockTotalBought') + '|' + GM_getValue('GMFinanceStockTotalWorth'));

                    GM_setValue('GMFinanceLastRefresh', new Date().valueOf())

                    GMFinanceStockTotalBought = GM_getValue('GMFinanceStockTotalBought');
                    GMFinanceStockTotalWorth = GM_getValue('GMFinanceStockTotalWorth');
                    $('#GMFinancialTotalNeopointsValue').html(parseNumbers());
                }})
        } else {

            GMFinanceStockTotalBought = GM_getValue('GMFinanceStockTotalBought');
            GMFinanceStockTotalWorth = GM_getValue('GMFinanceStockTotalWorth');
        }


        //parse total if no ajax has been called.
        parseNumbers()

    }



    var openPopupMenu = function() {

        getValuesForPopup();


        if($("#GMFinancesPopup").length) {
            $("#GMFinancesPopup").remove();
        }
        else {

            $("body").append(`<div id='GMFinancesPopup'><div id='GMFinancialRefreshPopup'></div><div id='GMFinancialClosePopup'></div><br/ >
<Table align='center'><tr >
<td style="text-align:center"><a href='http://www.neopets.com/bank.phtml'><img src='https://i.imgur.com/2Q5lET2.png' />
<span class='` + interestHasBeenCollected + `'></span>
<br />Bank Balance</a><br /><div id='GMFinanceBankValue'>`+ GMFinanceBank + `</div> </td>
<td style="text-align:center"><a href='http://www.neopets.com/market.phtml?type=till'><img src='https://i.imgur.com/1pKTbPd.png' /><br />Shop Till</a><br /><div id='GMFinanceTillValue'>` + GMFinanceTill + `</div></td>
</tr>
<tr>
<td colspan='2' style="text-align:center"><a href='http://www.neopets.com/stockmarket.phtml?type=portfolio'><img src='https://i.imgur.com/ITA7oGJ.png' /><br />Stock Market Total</a> <br />
<div id='GMFinanceStockValue'>` + GMFinanceStockTotalBought + ' | ' + GMFinanceStockTotalWorth + ` </div></td>
</tr>
<tr>
<td colspan='2' style='margin-top: 15px; text-align:center'><div id='GMFinancialTotalNeopoints'> Total Neopoints </div><div id='GMFinancialTotalNeopointsValue'>` + GMFinancialTotalNeopoints + `</div> </td>
</tr>
</table>
</div>`)

            //Allow x button to close the popup.
            $('#GMFinancialClosePopup').click(openPopupMenu);
            $('#GMFinancialRefreshPopup').click(deleteValuesForRefresh);

        }
    }

    var deleteValuesForRefresh = function() {

        GM_deleteValue('GMFinanceBank');
        GM_deleteValue('GMFinanceTill');
        GM_deleteValue('GMFinanceStockTotalBought');
        GM_deleteValue('GMFinanceStockTotalWorth');

        openPopupMenu()
        openPopupMenu()
    }

    //Retrieve the popup values and ensure everything is set to save time on first install of script.
    if(typeof GM_getValue('GMFinanceFirstRun') === 'undefined') {

        GM_setValue('GMFinanceLastRefresh', new Date('1990').valueOf());
        getValuesForPopup();
        GM_setValue('GMFinanceFirstRun', 'false');

    }

    //Code to execute
    financeButton.click(openPopupMenu);
})();