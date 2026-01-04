// ==UserScript==
// @name        Freebit Autoroll
// @namespace   
// @description Auto roll
// @author      SilverWolf
// @include     https://freebitco.in/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_getResourceURL
// @grant		GM_xmlhttpRequest
// @grant       unsafeWindow
// @version     0.0.1
// @icon        https://freebitco.in/favicon.ico
// @credit      
// @downloadURL https://update.greasyfork.org/scripts/34897/Freebit%20Autoroll.user.js
// @updateURL https://update.greasyfork.org/scripts/34897/Freebit%20Autoroll.meta.js
// ==/UserScript==
var timer = undefined;
var counter = 0;
var remain = 60*6;

function try_roll()
{
    var x = document.querySelector("#free_play_form_button"),
        myRP = document.getElementsByClassName("user_reward_points"),
        y = document.getElementById("bonus_container_free_points"),
        z = document.getElementById("bonus_container_fp_bonus");
    console.log("Detect if we can roll");
    document.title="Can we roll?";
    if(y == null){
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=1200)
        setTimeout(function(){
            RedeemRPProduct('free_points_100');
        }, 3000);
        else
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=600)
        setTimeout(function(){
            RedeemRPProduct('free_points_50');
        }, 3000);
        else
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=120)
        setTimeout(function(){
            RedeemRPProduct('free_points_10');
        }, 3000);
        else
        if(parseInt(myRP[0].innerText.replace(/,/g, '')) >=12)
        setTimeout(function(){
            RedeemRPProduct('free_points_1');
        }, 3000);
    }
    if(z==null && parseInt(myRP[0].innerText.replace(/,/g, '')) >= 4400){
        setTimeout(function(){
            RedeemRPProduct('fp_bonus_1000');
        }, 3000);
    }
    if(x && x.style["display"] != "none")
    {
        console.log("Rolling...");
        document.title="Rooling...";
        x.click();
        remain = 60*6;
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
    if(document.location.href.indexOf("freebitco.in") == -1)
        return;
    try_roll();
    timer = setInterval(count_up, 10*1000); /* 1 minutes */
}
setTimeout(function(){
        auto_roll();
    }, 3000);