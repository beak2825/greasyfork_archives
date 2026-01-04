// ==UserScript==
// @version      1.0
// @match        https://freebitco.in/*
// @name         Freebitco.in AUTOROLL (without captcha) + FREE BITCOIN BONUS 2023
// @description  You need to create an account to work in: https://freebitco.in/?r=10063242
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/1121283
// @downloadURL https://update.greasyfork.org/scripts/470377/Freebitcoin%20AUTOROLL%20%28without%20captcha%29%20%2B%20FREE%20BITCOIN%20BONUS%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/470377/Freebitcoin%20AUTOROLL%20%28without%20captcha%29%20%2B%20FREE%20BITCOIN%20BONUS%202023.meta.js
// ==/UserScript==

(function() {
    'use strict';
var body = $('body');
var points = {};
var count_min = 1;
var reward = {};
    reward.select = function() {
        reward.points = parseInt($('.user_reward_points').text().replace(',',""));
        reward.bonustime = {};
        if ($("#bonus_container_free_points").length != 0) {
            reward.bonustime.text = $('#bonus_span_free_points').text();
            reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
            reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
            reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
            reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else
            reward.bonustime.current = 0;
        console.log(reward.bonustime.current);
        if (reward.bonustime.current !== 0) {
            console.log(reward.bonustime.current);
        } else {
            if (reward.points < 70) {
                console.log("waiting for points");
            }
            else if (reward.points < 139) {
                    console.log("waiting for points 60");
                    RedeemRPProduct('fp_bonus_50');
                }
            else if (reward.points < 701) {
                    console.log("waiting for points 120");
                    RedeemRPProduct('fp_bonus_100');
                }
            else if (reward.points < 1404) {
                    console.log("waiting for points 600");
                    RedeemRPProduct('fp_bonus_500');
                }
            else {
                RedeemRPProduct('fp_bonus_1000');
            }
            if ($('#bonus_span_fp_bonus').length === 0)
                if (reward.points >= 9900)
                    RedeemRPProduct('fp_bonus_1000');
        }
    };
    body.prepend(
        $('<div/>').attr('style',"position:fixed;top:45px;left:0;z-index:999;width:350px;background-color:black;color: white; text-align: left;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<p/>').attr('style','text-decoration:underline;').text("Freebitco.in Auto Roll 2023 "))
                    .append($('<p/>').text("If you like, consider making a donation to:"))
                    .append($('<p/>').text("1K9TyDST68Svx68B1xkfXHP5S8cDRxkFkT"))
                    .append($('<p/>').text("(Click to copy)"))
                    .append($('<p/>')
                    )
            ).click(function(){
            var $temp = $('<input>').val("1K9TyDST68Svx68B1xkfXHP5S8cDRxkFkT");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 2px;  text-align: left; }")
)
    setTimeout(reward.select,1000);
    setInterval(reward.select,60000);
$(document).ready(function(){
    console.log("Status: Page loaded.");
    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    }, random(2000,4000));
    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);
    setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, random(12000,18000));
    setInterval(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(3605000,3615000));
});
function random(min,max){
   return min + (max - min) * Math.random();
}
})();