// ==UserScript==
// @name         BTCB
// @namespace    https://greasyfork.org/uk/scripts/426608-btcb
// @version      1.1
// @description  Simple Clever
// @author       OleksandrTitov
// @match        http://example.com
// @match        https://www.google.com/recaptcha/api2*
// @include      /^https?://www\.google\.com/recaptcha/api2/anchor.*$/
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://freebitco.in/*
// @grant        window.close
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/426608/BTCB.user.js
// @updateURL https://update.greasyfork.org/scripts/426608/BTCB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    Multiple IPs example:
    var IPS = ["127.0.0.", "127.0.0.", "127.0.0."];
    Single IP example:
    var IPS = ["127.0.0."]
    */
    var IPS = [""];
    var VPN_RETRIES = 2; // How many times should it retry before closing?
    var VPN_WAIT_SECONDS = 15; // How many seconds should it wait between each retry?
    var DISCORD_WEBHOOK = "https://discordapp.com/api/webhooks/696860156247539753/EuzFtaa0u3HNe_VSddinah4eVPzzBAyiJIiifqMxrZL0s6ejp6vXaqrkUxrvzTqxC7v4";

    var Free_Points = "disabled", // Options enabled/disabled Toggles free points on and off
    Points_100 =  1, // use 0 to disable each points level
    Points_50 =   1,
    Points_25 =   1,
    Points_10 =   1,
    BTC_Bonus =   "disabled", // Optins enabled/disabled Toggles BTC bonus on and off
    BTC_1000 =    1, // use 0 to disable each BTC level
    BTC_500 =     1,
    BTC_100 =     1,
    Captcha =     "disabled";  /* options enabled/disabled If "disabled" the script will use RP and click the play_without_captcha button. "enabled" causes the script to loop until the captcha is solved which can take a long time. */

    var reward = {};
       reward.select = function() {
        reward.points = parseInt(unsafeWindow.$('.user_reward_points').text().replace(',',""));
        reward.bonustime = {};
        if (unsafeWindow.$("#bonus_container_free_points").length != 0) {
            reward.bonustime.text = unsafeWindow.$('#bonus_span_free_points').text();
            reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
            reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
            reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
            reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else {
            reward.bonustime.current = 0;
        }
        console.log(reward.bonustime.current);
        if (reward.bonustime.current !== 0) {
            console.log(reward.bonustime.current);
        } else if (Free_Points === "enabled"){
            if (reward.points < 120) {
                console.log("waiting for 120 points");
            }
            else {
                if (Points_100 !== 0){
                unsafeWindow.RedeemRPProduct('free_points_100');}
                if (Points_50 !== 0){
                unsafeWindow.RedeemRPProduct('free_points_50');}
                if (Points_25 !== 0){
                unsafeWindow.RedeemRPProduct('free_points_25');}
                if (Points_10 !== 0){
                unsafeWindow.RedeemRPProduct('free_points_10');}
            }
        }

        if (unsafeWindow.$("#bonus_container_fp_bonus").length != 0) {
            reward.bonustime.text = unsafeWindow.$('#bonus_span_fp_bonus').text();
            reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
            reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
            reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
            reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else {
            reward.bonustime.current = 0;
        }
        console.log(reward.bonustime.current);
        if (reward.bonustime.current !== 0) {
            console.log(reward.bonustime.current);
        } else if (BTC_Bonus === "enabled"){
            if (reward.points < 3200) {
                console.log("waiting for 320 points");
            }
            else {
                if (BTC_1000 !== 0){
                unsafeWindow.RedeemRPProduct('fp_bonus_1000');}
                if (BTC_500 !== 0){
                unsafeWindow.RedeemRPProduct('fp_bonus_500');}
                if (BTC_100 !== 0 ){
                unsafeWindow.RedeemRPProduct('fp_bonus_100');}
            }
        }

        unsafeWindow.$('.close-reveal-modal')[0].click();
        };
    function rand(min, max){
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function sendToDiscord(close_it){
        console.log("sending to Discord");
        GM.getValue("profileName", "NoProfileName").then(profileName => {
            console.log("got profile name " + profileName);
            GM.xmlHttpRequest({
                method: "POST",
                url: DISCORD_WEBHOOK + "?wait=false",
                headers: {"Content-Type": "application/json"},
                data: JSON.stringify({"content": "Ship " + profileName + " has sunk"}),
            });
            if(close_it){
                setTimeout(function(){
                    var win = window.open('', '_self', '');
                    window.close();
                }, 2000);
            }
        });
    }

    function vpnCheck() {
        

        var vpnCount = VPN_RETRIES;
        var vpnInterval = setInterval(function(){
            if(vpnCount === 0){
                //sendToDiscord(true);
            }

            GM.xmlHttpRequest({
              method: "GET",
              url: "https://ipecho.net/plain",
              onload: function(response) {
                var ip = response.responseText;
                var ok = false;

                for(var i=0; i<IPS.length; ++i){
                    if (ip.startsWith(IPS[i])){
                        ok = true;
                        break;
                    }
                }
                if (ok){
                    window.location = "https://freebitco.in";
                    clearInterval(vpnInterval);
                    vpnCount = VPN_RETRIES;
                    console.log("VPN is active");
                } else vpnCount--;
              }
            });
        }, VPN_WAIT_SECONDS * 1000);
    }

   (function() {
    'use strict';
    setTimeout(function(){
        console.log("step1");
        $("#rc-anchor-container").click();
 }, 3000);
 })();

    function recaptchaClicker() {
        var z = setInterval(function() {
            var ele = unsafeWindow.$(".recaptcha-checkbox-border");
            if (ele.length > 0) return;

            setTimeout(function() { ele.click(); }, rand(1000, 3000));
            clearInterval(z);
        }, 1000);
    }

    function freebitco() {
       

        var blocked_recaptcha = 100;
        var rollInterval = setInterval(function(){
            if(unsafeWindow.grecaptcha == undefined) return;
            if (unsafeWindow.$('#free_play_form_button').is(':visible') == false) return;
            if (blocked_recaptcha == 0){
                alert("100 tryes");
                blocked_recaptcha = 100;
            }
            var resp = unsafeWindow.grecaptcha.getResponse();
            if(resp.length > 0){
                setTimeout(function() {unsafeWindow.$("#free_play_form_button").click();}, rand(1000, 3000));
                blocked_recaptcha = 100;
                clearInterval(rollInterval);
                return;
            }else{
                blocked_recaptcha--;
            }
        }, 1000);
        var rewardInterval = setInterval(function(){
            if(unsafeWindow.RedeemRPProduct == undefined) return;
            reward.select();
        }, 5000);
        var closeModalInterval = setInterval(function(){
            var ele = unsafeWindow.$('.close-reveal-modal');
            if(ele.length > 0) {
                ele.click();
            }
        }, 1000);

        var vpnCount = VPN_RETRIES;

        var checkVpnInterval = setInterval(function(){
            if(vpnCount === 0){
                //sendToDiscord(true);
            }

            GM.xmlHttpRequest({
              method: "GET",
              url: "https://ipecho.net/plain",
              onload: function(response) {
                var ip = response.responseText;
                var ok = false;
                for(var i=0; i<IPS.length; ++i){
                    if (ip.startsWith(IPS[i])){
                        ok = true;
                        break;
                    }
                }
                if (ok){
                    vpnCount = VPN_RETRIES;
                } else vpnCount--;
              }
            });
        }, VPN_WAIT_SECONDS * 1000);
    }

    var loc = location.toString();
    if(loc.indexOf("example.com") !== -1) vpnCheck();
    else if(loc.indexOf("google.com/recaptcha/api2") !== -1) recaptchaClicker();
    else if(loc.indexOf("freebitco.in") !== -1) freebitco();

})();