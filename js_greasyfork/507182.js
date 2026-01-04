// ==UserScript==
// @name Bnbfree.in MULTIPLY BNB (2024) papaloutsas.blogspot.com
// @namespace PapaLoutsas
// @description MULTIPLY BNB
// @author PapaLoutsas
// @include https://bnbfree.in/*
// @run-at document-end
// @grant GM_addStyle
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @version 5.6
// @credit
// @namespace PapaLoutsas
// @downloadURL https://update.greasyfork.org/scripts/507182/Bnbfreein%20MULTIPLY%20BNB%20%282024%29%20papaloutsasblogspotcom.user.js
// @updateURL https://update.greasyfork.org/scripts/507182/Bnbfreein%20MULTIPLY%20BNB%20%282024%29%20papaloutsasblogspotcom.meta.js
// ==/UserScript==
var timer = undefined;
var counter = 0;
var remain = 60*6;
function try_roll()
{
var x = document.querySelector("#free_play_form_button"),
myRP = document.getElementsByClassName("user_reward_points"),
y = document.getElementById("bonus_container_free_lott"),
z = document.getElementById("bonus_container_fp_bonus");
console.log("Detect if we can roll");
document.title="Can we roll?";
 
if(x && x.style["display"] != "none")
{
console.log("Rolling...");
document.title="Rooling...";
x.click();
remain = 606;
counter = 0;
}
}
function count_up()
{
counter = counter + 1;
if(counter >= remain)
{
location.reload();
}
try_roll();
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
var minstake = 0.00000050;  // 基础值
var autorounds = 30;         // 次数
var handbrake = 1.0000000;   // 输掉时暂停游戏
var autoruns = 20;
var maxAttempts = 20;        // 最大尝试次数
var currentAttempts = 0;     // 当前尝试次数
 
function playnow() {
    if (autoruns > autorounds) {
        console.log('已达到限制');
        return;
    }
    document.getElementById('double_your_btc_bet_hi_button').click();
    setTimeout(checkresults, 1000);
    return;
}
 
function checkresults() {
    if (document.getElementById('double_your_btc_bet_hi_button').disabled === true) {
        setTimeout(checkresults, 1000);
        return;
    }
    var stake = document.getElementById('double_your_btc_stake').value * 1;
    var won = document.getElementById('double_your_btc_bet_win').innerHTML;
    if (won.match(/(\d+\.\d+)/) !== null) {
        won = won.match(/(\d+\.\d+)/)[0];
    } else {
        won = false;
    }
    var lost = document.getElementById('double_your_btc_bet_lose').innerHTML;
    if (lost.match(/(\d+\.\d+)/) !== null) {
        lost = lost.match(/(\d+\.\d+)/)[0];
    } else {
        lost = false;
    }
 
    if (won && !lost) {
        stake = minstake;
        console.log('赌注 #' + autoruns + '/' + autorounds + ': 赢  ' + won  + ' 赌注: ' + stake.toFixed(8));
        return;  // 停止尝试转动
    }
    if (lost && !won) {
        stake = lost * 2.1;
        console.log('赌注 #' + autoruns + '/' + autorounds + ': 输了 ' + lost + ' 赌注: ' + stake.toFixed(8));
    }
    if (!won && !lost) {
        console.log('出现了问题');
        return;
    }
    document.getElementById('double_your_btc_stake').value = stake.toFixed(8);
    autoruns++;
    currentAttempts++; // 每次尝试后增加尝试次数
 
    // 如果达到最大尝试次数，但仍未赢得游戏，继续尝试转动
    if (currentAttempts >= maxAttempts && !won) {
        console.log("已达到最大尝试次数，仍未赢得游戏，继续尝试转动。");
        autoruns = 1;  // 重置尝试次数
    }
 
    if (stake >= handbrake) {
        document.getElementById('handbrakealert').play();
        console.log('手刹触发！执行 playnow() 来覆盖');
        return;
    }
 
    setTimeout(playnow, 1000);
    return;
}
 
playnow();