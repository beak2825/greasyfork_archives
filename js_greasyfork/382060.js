// ==UserScript==
// @name         Freebitco.in autoclaim + %1000 + Refresh page
// @version      0.1.9 Beta
// @namespace    http://www.greasyfork.org/c/Zirky
// @description  Autoclaim Freebitco.in whit Rewand and ClaimBonus
// @author       Zirky
// @match        https://freebitco.in/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/382060/Freebitcoin%20autoclaim%20%2B%20%251000%20%2B%20Refresh%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/382060/Freebitcoin%20autoclaim%20%2B%20%251000%20%2B%20Refresh%20page.meta.js
// ==/UserScript==


(function() {
    'use strict';
var body = $('body');



var points = {};



if ($('#free_play_form_button').is(':visible'))

setTimeout(function(){ $('#free_play_form_button').click();},2000);

if ($('.close-reveal-modal').is(':visible'))

setTimeout(function(){ $('.close-reveal-modal').click(); },2000);



var reward = {};

reward.select = function() {

reward.points = parseInt($('.user_reward_points').text().replace(',',""));
reward.bonustime = {};
    if ($("#bonus_container_free_points").length != 0) {
        reward.bonustime.text = $('#bonus_span_free_points').text();
        reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
        reward.bomustime.min = parseInt(reward.bonustime.text.split(":")[1]);
        reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
        reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else
            reward.bonustime.current = 0;

    console.log(reward.bonustime.current);
    if (reward.bonustime.current !== 0) {
        console.log(reward.bonustime.current);
    } else {
        if (reward.points < 12) {
            console.log("waiting for 12 points");
        }
        else if (reward.points < 120) {
            console.log("waiting for 60 points");
            RedeemRPProduct('free_points_1');
        }
        else if (reward.points < 600) {
            console.log("waiting for 120 points");
            RedeemRPProduct('free_points_10');
        }
        else if (reward.points < 1200) {
            console.log("waiting for 600 points");
            RedeemRPProduct('free_points_50');
        }
        else {
            console.log("100 Free points per roll active");
            RedeemRPProduct('free_points_100');
        }
        if ($('#bonus_span_fp_bonus').length === 0)
            if (reward.points >= 4201)
                RedeemRPProduct('fp_bonus_1000');
    }
};
body.prepend(
     $('<div/>').attr('style',"position:fixed;top:45px;left:0;z.index:999;width:350px;background-color:DarkGreen;color:white; text-align: left;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<p/>').attr('style','text-decoration:underline;').text("Freebitco.in auto roll 1000% by MOGIHOST"))
                    .append($('<p/>').text("Se você gostaou, faça uma doação para"))
                    .append($('<p/>').text("1LDa7LYRdVyPrZEWew5WaVBca1hm8Udi5u"))
                    .append($('<p/>').text("(Clic para copiar)"))
                    .append($('<p/>')
                )
        )

).prepend($('<style/>')
          .text("#autofaucet p { margin: 0; margin-left: 2px; text-align: left; }")
          );
setTimeout(reward.select,1000);
setInterval(reward.select,60000);

    var timeout = setTimeout("location.reload(true);",3630000);
      function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout("location.reload(true);",3630000);
  }
})();