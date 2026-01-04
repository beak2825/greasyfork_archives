// ==UserScript==
// @name         Freebitco.in Auto Bonus BTC (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      0.1
// @description  Script desenvolvido para ativar o bonus BTC automaticamente
// @author       Jadson Tavares
// @match        *://*.freebitco.in/*
// @match        *://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415416/Freebitcoin%20Auto%20Bonus%20BTC%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415416/Freebitcoin%20Auto%20Bonus%20BTC%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var points = {};
var reward = {};
    reward.select = function() {
        reward.points = parseInt($('.user_reward_points').text().replace(',',""));
        reward.bonustime = {};
        if ($("#bonus_container_fp_bonus").length != 0) {
            reward.bonustime.text = $('#bonus_span_fp_bonus').text();
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
            if (reward.points < 32) {
                console.log("waiting for points");
            }
            else if (reward.points < 160) {
                console.log("waiting for points 60");
                RedeemRPProduct('fp_bonus_10');
            }
            else if (reward.points < 320) {
                console.log("waiting for points 60");
                RedeemRPProduct('fp_bonus_50');
            }
            else if (reward.points < 1600) {
                console.log("waiting for points 120");
                RedeemRPProduct('fp_bonus_100');
            }
            else if (reward.points < 3200) {
                console.log("waiting for points 1600");
                RedeemRPProduct('fp_bonus_500');
            }
            else {
                RedeemRPProduct('fp_bonus_1000');
            }
            setTimeout(function(){
                if($('.reward_point_redeem_result:contains(you are not eligible to redeem this bonus)')){
                    if (reward.points < 32) {
                        console.log("waiting for points");
                    }
                    else if (reward.points < 160) {
                        console.log("waiting for points 128");
                        RedeemRPProduct('fp_bonus_10');
                    }
                    else if (reward.points < 320) {
                        console.log("waiting for points 160");
                        RedeemRPProduct('fp_bonus_50');
                    }
                    else {
                        RedeemRPProduct('fp_bonus_100');
                    }
                }
            },5000);
        }
    };

    setTimeout(reward.select,1000);
    setInterval(reward.select,60000);


document.getElementById('freebitco-in-auto-bonus-btc').classList.add("faucet-active");
})();