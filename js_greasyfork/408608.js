// ==UserScript==
// @name         Freebitco.in Auto Bonus RP (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      0.7
// @description  Script desenvolvido para ativar o bonus RP automaticamente
// @author       Jadson Tavares
// @match        *://*.freebitco.in/*
// @match        *://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408608/Freebitcoin%20Auto%20Bonus%20RP%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408608/Freebitcoin%20Auto%20Bonus%20RP%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var points = {};
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
            if (reward.points < 12) {
                console.log("waiting for points");
            }
            else if (reward.points < 120) {
                    console.log("waiting for points 60");
                    RedeemRPProduct('free_points_1');
                }
            else if (reward.points < 600) {
                    console.log("waiting for points 120");
                    RedeemRPProduct('free_points_10');
                }
            else if (reward.points < 1200) {
                    console.log("waiting for points 600");
                    RedeemRPProduct('free_points_50');
                }
            else {
                RedeemRPProduct('free_points_100');
            }
        }
    };

    setTimeout(reward.select,1000);
    setTimeout(function(){
        if($('.reward_point_redeem_result:contains(you are not eligible to redeem this bonus)')){
            if (reward.points < 12) {
                console.log("waiting for points");
            }
            else if (reward.points < 120) {
                console.log("waiting for points 60");
                RedeemRPProduct('free_points_1');
            }
            else {
                RedeemRPProduct('free_points_10');
            }
        }
    },5000);
    setInterval(reward.select,60000);


document.getElementById('freebitco-in-auto-bonus-rp').classList.add("faucet-active");
})();