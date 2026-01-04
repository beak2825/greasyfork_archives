 // ==UserScript==
// @name         Freebitco.in Simple Oscars Grind
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  slowly but surely
// @author       jscliffo
// @match        https://freebitco.in/*
// @grant        none
// Tips Appreciated 16gRiZTibMoRgFiYzAcpMd72sKPkFbvAqo
// @downloadURL https://update.greasyfork.org/scripts/410440/Freebitcoin%20Simple%20Oscars%20Grind.user.js
// @updateURL https://update.greasyfork.org/scripts/410440/Freebitcoin%20Simple%20Oscars%20Grind.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Sizes in satoshi
    let basebet = 2
    let betsize = basebet, profit = 0;
    let MAX_WIN = 100;
    let MAX_LOOSE = -500;
    let Odds = 1.6
    let betodds = Odds
    let winplus = betodds - 1
    let bank = 0
    let roundbank = 0
    let flip = true
    window.onload = function() {
        document.getElementsByClassName("double_your_btc_link")[0].onclick = function() {
            setTimeout(function(){if(document.getElementById("manual_bet_on") && confirm("Do you wanna start Auto-Bet Oscar Grind Algorithm?")) oscar_grind();},1000);
        };
    };

    function oscar_grind()
    {
        document.getElementById("double_your_btc_stake").value = (betsize/100000000).toFixed(8);
        $('#double_your_btc_payout_multiplier').val(betodds);
        setTimeout(function() {
            bet();
            setTimeout(function() {
                if(checkIfWon())
                {
                    profit += Math.floor(betsize*(winplus));
                    flip = !flip
                    if(profit<1)
                    {
                        betodds = Odds;
                        if(profit+(Math.floor(betsize*winplus))+basebet > basebet) betsize = Math.floor((basebet-profit)/winplus);
                        else betsize++;
                    }
                    else if(profit>basebet)
                    {
                        betodds = Odds;
                        bank += profit;
                        profit=0;
                        betsize = basebet;
                    }
                    else betsize = basebet;
                }
                else
                {
                    profit -= betsize;

                }
                  roundbank = bank+profit;
                document.getElementsByClassName("bold text_shadow")[0].innerHTML = "Round: "+profit+" | Bet: "+betsize+" | Profit: "+roundbank;
                setTimeout(function() {
                    if(profit >= MAX_WIN || profit <= MAX_LOOSE) return alert("Finish!");
                    oscar_grind();
                },100);
            },500);
        },200);
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
})();
