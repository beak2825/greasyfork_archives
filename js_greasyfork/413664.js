// ==UserScript==
// @name         freebitcoin NoCaptcha + RPbonus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413664/freebitcoin%20NoCaptcha%20%2B%20RPbonus.user.js
// @updateURL https://update.greasyfork.org/scripts/413664/freebitcoin%20NoCaptcha%20%2B%20RPbonus.meta.js
// ==/UserScript==

(function() {
    'use strict';

function start(){
    closepopups();
    if ($('#free_play_form_button').is(':visible')){
        var timewait = Math.random() * 1200000;
        console.log(timewait/1000);
        setTimeout(function () {
            closepopups();
            $('#free_play_form_button').click();
            console.log("rolled");
            setTimeout(function(){
                    buyRPrewards();
            }, Math.random() * 10000 + 1000);
        }, timewait);
    }
    else{
        console.log("Roll timer active")
        setTimeout(function() {
            checktimer();
        }, 60000);
    }
}

function checktimer(){
    if ($('#free_play_form_button').is(':visible')){
        var timewait = Math.random() * 1200000;
        console.log(timewait/1000);
        setTimeout(function () {
            closepopups();
            $('#free_play_form_button').click();
            console.log("rolled");
            setTimeout(function(){
                    buyRPrewards();
            }, Math.random() * 10000 + 1000);
        }, timewait);
    }
    else{
        console.log("Roll timer active")
        setTimeout(function() {
            checktimer();
        }, 60000);
    }
}

function closepopups(){
     if ($('#myModal22').is(':visible')){
        $('.close-reveal-modal').click();
     }
     if ($('#push_notification_modal').is(':visible')){
        $('.pushpad_deny_button').click();
     }
}

function buyRPrewards(){
    var rewardpoints = parseInt($('.user_reward_points').text().replace(',',""));
    if ($("#bonus_container_free_points").length == 0) {
        if (reward.points < 120 && reward.points >= 12 ) {
            RedeemRPProduct('free_points_1');
        }
        else if (reward.points < 300) {
            RedeemRPProduct('free_points_10');
        }
        else if (reward.points < 600) {
            RedeemRPProduct('free_points_25');
        }
        else if (reward.points < 1200) {
            RedeemRPProduct('free_points_50');
        }
        else if (reward.points >= 1200) {
            RedeemRPProduct('free_points_100');
        }
    }
    if ($('#bonus_span_fp_bonus').length === 0){
        setTimeout(function() {
            if (reward.points >= 4400){
                RedeemRPProduct('fp_bonus_1000');
            }
        }, Math.random() * 10000 + 1000);
    }
}


start();


})();