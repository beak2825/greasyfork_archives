// ==UserScript==
// @name         Freebitco.in Script Jingale
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  increasing bet, increasing odds
// @author       jscliffo
// @match        https://freebitco.in/*
// @grant        none
// tips appreciated when you win 16gRiZTibMoRgFiYzAcpMd72sKPkFbvAqo
// @downloadURL https://update.greasyfork.org/scripts/410439/Freebitcoin%20Script%20Jingale.user.js
// @updateURL https://update.greasyfork.org/scripts/410439/Freebitcoin%20Script%20Jingale.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Sizes in satoshi
    let basebet = 2
    let betsize = basebet, profit = 0;
    let MAX_WIN = 500;
    let MAX_LOOSE = -500;
    let betodds = 2
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
                        counter = 0;
                        betsize = basebet;
                        betodds = 2
                        flip =!flip

                }
                else
                {
                    profit -= betsize;
                    counter++;

                    if(counter > 5)
                    {
                        betodds = 1.35;
                        betsize = Math.floor(betsize * 4.3);
                    }
                    else if(counter > 3)
                    {
                        betodds = 1.5;
                        betsize = Math.floor(betsize * 3.1);
                    }
                    else if(counter > 2)
                    {
                        betodds = 1.4;
                        betsize = Math.floor(betsize * 3.6);
                    }
                    else if(counter > 1)
                    {
                        betodds = 1.35;
                        betsize = Math.floor(betsize * 4.3);
                    }
                    else if(counter > 0)
                    {
                        betodds = 2;
                        betsize = Math.floor(betsize * 2)
                    }
                    else
                    {
                        betodds = 2
                        betsize=basebet
                    }


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
