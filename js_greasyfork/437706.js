// ==UserScript==
// @name Freebitco.in Simple Auto-roll Delayed to work with captcha solvers
// @namespace
// @description Auto roll
// @author CryptClick.cc
// @include https://freebitco.in/*
// @run-at document-end
// @grant GM_addStyle
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @version 0.0.2
// @icon
// @credit
// @namespace https://greasyfork.org/users/858653
// @downloadURL https://update.greasyfork.org/scripts/437706/Freebitcoin%20Simple%20Auto-roll%20Delayed%20to%20work%20with%20captcha%20solvers.user.js
// @updateURL https://update.greasyfork.org/scripts/437706/Freebitcoin%20Simple%20Auto-roll%20Delayed%20to%20work%20with%20captcha%20solvers.meta.js
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
if(document.location.href.indexOf("freebitco.in") == -1)
return;
try_roll();
timer = setInterval(count_up, 101000); /* 1 minutes */
}
setTimeout(function(){
auto_roll();
}, 45000);
