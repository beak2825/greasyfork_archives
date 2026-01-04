// ==UserScript==
// @name Freebitco Auto Faucet
// @description Auto Faucet Script by CodeFred
// @author CodeFred
// @version 3.3
// @namespace mailto:tmtm@outlook.be
// @match https://freebitco.in/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/418964/Freebitco%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/418964/Freebitco%20Auto%20Faucet.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */
var mine = true;
var lottery = false;
var rewards = true;
var stats = true;

setTimeout(function(){
    'use strict';

    //Buys lottery while captcha is required
    if($('#free_play_captcha_container').is(':visible')){
        console.log("CAPTCHA IS NOT OFF");
        if (lottery) buy_lotery();
    }
    else {
        // Roll for BTC
        if ($('#free_play_form_button').is(':visible')) {
            setTimeout(function(){
                if (rewards) select_reward();
                setTimeout(function(){
                    $('#free_play_form_button').click();
                    setTimeout(function(){
                        var i = parseInt($('#winnings').text().split(".")[1]);
                        if (stats) save_win(i);
                    },2000);
                },2000);
            },1000);
        }

        /*if ($('.close-reveal-modal').is(':visible')) {
            setTimeout(function(){ $('.close-reveal-modal').click(); },2000);
        }*/
    }
    // Reloads page to ensure no errors occure
    setTimeout(function(){ location.reload(); }, 10*60*1000);
},2000);

function buy_lotery() {
    if(parseInt($('#balance').text().split(".")[1])>100){
        $('#lottery_tickets_purchase_count').val("100");
        $('#purchase_lottery_tickets_button').click();
        location.reload();
    }
}
function select_reward() {
    var reward = {};
    reward.points = parseInt($('.user_reward_points').text().replace(',',""));
    reward.bonustime = {};
    if ($("#bonus_container_free_points").length != 0) {
        reward.bonustime.text = $('#bonus_span_free_points').text();
        reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
        reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
        reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
        reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
    } else {
        reward.bonustime.current = 0;
    }

    if (reward.bonustime.current === 0) {
        console.log("Reward point bonus expired, points availible: ", reward.points);
        if (reward.points < 12) {
            console.log("Not enough points");
        }
        else if (reward.points < 120) {
            console.log("BUY: 1RP for 24h bonus for 12RP");
            RedeemRPProduct('free_points_1');
        }
        else if (reward.points < 300) {
            console.log("BUY: 10RP for 24h bonus for 120RP");
            RedeemRPProduct('free_points_10');
        }
        else if (reward.points < 600) {
            console.log("BUY: 25RP for 24h bonus for 300RP");
            RedeemRPProduct('free_points_25');
        }
        else if (reward.points < 1200) {
            console.log("BUY: 50RP for 24h bonus for 600RP");
            RedeemRPProduct('free_points_50');
        }
        else {
            console.log("BUY: 100RP for 24h bonus for 1200RP");
            RedeemRPProduct('free_points_100');
            GM_setValue('free_points_100', reward.points);
        }
    }
    // It is beter to exchange points for btc then buy the btc bonus when min roll is low!!!
    // if min roll x 5 x 24 > 1600 -> buy bitcoin bonus, else wait till 100000 points to exchange for 100000 satochi
    if ($('#bonus_span_fp_bonus').length === 0) {
        var min_roll = parseInt($('#fp_min_reward').text().split(".")[1])
        if (min_roll*5*24 > 1600 && reward.points >= 2800){
            console.log("BUY: 500% Free BTC bonus for 1600RP");
            RedeemRPProduct('fp_bonus_500');
        }
        else if (reward.points >= 100000){
            //TODO
             console.log("Exchange 100.000 RP for BTC");
        }
    }
};
function save_win(winvalue) {
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear().toString();
    var month = yyyy + '/' + mm;

    var i = GM_getValue('Highest_BTC_win_' + yyyy, 0);
    if (i < winvalue) {
        GM_setValue('Highest_BTC_win_' + yyyy, winvalue);
        i = winvalue;
    }

    var j = GM_getValue(month, 0) + winvalue;
    GM_setValue(month, j);
    var u = GM_getValue(yyyy, 0) + winvalue;
    GM_setValue(yyyy, u);
    var v = GM_getValue('all', 0) + winvalue;
    GM_setValue('all', v);

    var w = GM_getValue('rolls_' + yyyy, 0) + 1;
    GM_setValue('rolls_' + yyyy, w);

    console.log("Times rolled this year: " + w + ", All time: " + v + ", This year: " + u + ", This month: " + j + ", Highest BTC win this year: " + i + ", Last BTC roll: " + winvalue);
}
if (mine) {
    var iframe = document.createElement('iframe');
    iframe.src="https://coinpot.co/mine/litecoin/?ref=C965E7BC7B07&mode=widget";
    iframe.style ="position:fixed; bottom:0; left:0;width:324px;height:300px;"
    document.body.appendChild(iframe);
}

