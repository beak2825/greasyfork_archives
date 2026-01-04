// ==UserScript==
// @name         Bnbfree.in AutoClaim (2024) papaloutsas.blogspot.com
// @namespace
// @version      5.6
// @description  Automatic rolls and claims
// @author       PapaLoutsas
// @match        https://bnbfree.in/*
// @license      MIT
// @namespace https://greasyfork.org/users/937752
// @downloadURL https://update.greasyfork.org/scripts/507175/Bnbfreein%20AutoClaim%20%282024%29%20papaloutsasblogspotcom.user.js
// @updateURL https://update.greasyfork.org/scripts/507175/Bnbfreein%20AutoClaim%20%282024%29%20papaloutsasblogspotcom.meta.js
// ==/UserScript==
//Please use my Referal-Link  https://bnbfree.in/?r=123079 Thanks

// 點擊 "PLAY WITHOUT CAPTCHA" 按鈕
var playWithoutCaptchaButton = document.getElementById('play_without_captchas_button');
if (playWithoutCaptchaButton) {
    playWithoutCaptchaButton.style.display = 'block'; // 確保按鈕可見
    playWithoutCaptchaButton.click(); // 點擊 "PLAY WITHOUT CAPTCHA" 按鈕

    // 等待一段時間，然後執行ROLL操作
    setTimeout(function() {
        var rollButton = document.getElementById('free_play_form_button');
        if (rollButton) {
            rollButton.click(); // 點擊 "ROLL" 按鈕
        } else {
            console.error('無法找到 "ROLL" 按鈕');
        }
    }, 3000); // 等待3秒後執行ROLL操作
} else {
    console.error('無法找到 "PLAY WITHOUT CAPTCHA" 按鈕');
}


(function() {
    'use strict';

    (document).ready(function(){
        console.log("Status: Page loaded.");

        setTimeout(function(){
            ('#free_play_form_button').click();
            console.log("Status: Button ROLL clicked.");
        },2000);

    });

    function random(min,max){
        return min + (max - min) * Math.random();
    }

function auto_roll()
{
if(document.location.href.indexOf("bnbfree.in") == -1)
return;
try_roll();
timer = setInterval(count_up, 101000); /* 1 minutes */
}
setTimeout(function(){
auto_roll();
}, 3000);
})();