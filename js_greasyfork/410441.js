// ==UserScript==
// @name         Freebitco.in Paroli strategy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Paroli with Auto freeroll
// @author       jscliffo
// @match        https://freebitco.in/*
// @grant        none
//Tips appreciated 16gRiZTibMoRgFiYzAcpMd72sKPkFbvAqo
// @downloadURL https://update.greasyfork.org/scripts/410441/Freebitcoin%20Paroli%20strategy.user.js
// @updateURL https://update.greasyfork.org/scripts/410441/Freebitcoin%20Paroli%20strategy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Sizes in satoshi
    let basebet = 10
    let betsize = basebet, profit = 0;
    let MAX_WIN = 500;
    let MAX_LOOSE = -5000;
    let betodds = 1.1
    let winplus = betodds - 1
    let bank = 0
    let roundbank = 0
    let counter = 0
    let flip = true
    window.onload = function() {
        AutoRoll();
        document.getElementsByClassName("double_your_btc_link")[0].onclick = function()
        {
            setTimeout(function(){if(document.getElementById("manual_bet_on") && confirm("Do you wanna start Auto-Bet Jingale Algorithm?")) jin_gale();},1000);
        };
    };

    function jin_gale()
    {
        document.getElementById("double_your_btc_stake").value = (betsize/100000000).toFixed(8);
        $('#double_your_btc_payout_multiplier').val(betodds);
        setTimeout(function() {
            bet();
            setTimeout(function() {
                if(checkIfWon())
                {

                    profit += Math.floor(betsize*(betodds-1));
                    flip =!flip
                    counter++;

                    if(counter > 3)
                    {
                        betsize = basebet;
                        counter=0;
                    }
                    else
                    {
                        betsize= betsize*2;
                    }

                }
                else
                {
                    profit -= betsize;
                    betsize = betsize*10


                }
                roundbank = bank+profit;
                document.getElementsByClassName("bold text_shadow")[0].innerHTML = "Losses: "+counter+" | Bet: "+betsize+" | Profit: "+roundbank;
                setTimeout(function() {
                    if(profit >= MAX_WIN || profit <= MAX_LOOSE) return alert("Finish!");
                    jin_gale();
                },50);
            },225);
        },250);
    }
    function AutoRoll()
    {
        var timeindicatorfreeplay = parseInt($('#time_remaining').text());
        console.log(timeindicatorfreeplay);
        if(timeindicatorfreeplay > 0)
        {
        }
        else
        {
            $('#free_play_form_button').click();
            console.log("Status: Button ROLL clicked.");
            setTimeout(function()
                       {
                $('.close-reveal-modal')[0].click();
                console.log("Status: Button CLOSE POPUP clicked.");
            }, random(12000,18000));
        }
    }
    function bet()
    {
        if (flip === true)
        {
        document.getElementById("double_your_btc_bet_hi_button").click();
        }
        else
        {
        document.getElementById("double_your_btc_bet_lo_button").click();
        }
    }
    function checkIfWon()
    {
        return (document.getElementById("double_your_btc_bet_win").style.display != "none");
    }
})();
