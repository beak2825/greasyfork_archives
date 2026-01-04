// ==UserScript==
// @name Free Bitcoin Script Auto-Roll with captcha solvers
// @namespace
// @description Auto roll
// @author ccont2246
// @license ccont2246
// @include https://freebitco.in/*
// @include https://freebitco.in/?r=15240572
// @run-at document-end
// @grant GM_addStyle
// @grant GM_getResourceURL
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @version 0.0.5
// @icon
// @credit
// @namespace https://greasyfork.org/en/users/810232-cont1-cont2
// @downloadURL https://update.greasyfork.org/scripts/455786/Free%20Bitcoin%20Script%20Auto-Roll%20with%20captcha%20solvers.user.js
// @updateURL https://update.greasyfork.org/scripts/455786/Free%20Bitcoin%20Script%20Auto-Roll%20with%20captcha%20solvers.meta.js
// ==/UserScript==

    var body = $('body');
        body.prepend(
        $('<div/>').attr('style',"position:fixed;bottom:0px;left:0;z-index:999;width:350px;background-color:black;color: #00FF00; text-align: left;")
            .append(
                $('<div/>').attr('id','autofaucet')
                .append($('<p/>').text('Account: '+document.getElementById('contact_form_email').value))
                .append($('<p/>').text('Reward: '+parseInt($('.user_reward_points').text().replace(',',""))))
                .append($('<p/>').text('Balance: '+$('#balance').text()+ ' BTC'))
                .append($('<p/>').text('Lottery: '+parseInt($('#user_lottery_tickets').text().replace(',',""))))
                .append($('<p/>').text('Bonus: '+$('#bonus_eligible_msg .dep_bonus_max').text()))
                //.append($('<p/>').text('Unlock: '+$('#account_unblock_span.option_fp_bonus_span').text()))
                    .append($('<p/>')
                    )
            )
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 2px;  text-align: left; }")
)


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
}, 15000);


    //Close Ads but not always
    setTimeout(function(){
        closeRandomPopupInterval($('div.close_daily_jackpot_main_container_div .fa-times-circle'),90);
        closeRandomPopupInterval($('i.fa.fa-times-circle.close_deposit_promo_message'),90);
        closeRandomPopupInterval($('div#lambo_contest_msg a.close'),10); //lambo contest
        closeRandomPopupInterval($('div#earn_btc_msg a.close'),20);
        closeRandomPopupInterval($('div#enable_2fa_msg_alert a.close'),30);
        closeRandomPopupInterval($("[id^='hide_rp_promo']"),50);
        closeRandomPopupInterval($("#fun_ref_contest_msg a.close"),90);
        closeRandomPopupInterval($("#premium_membership_msg a.close"),90);
    }, 15000);

    setInterval(function(){
        closePopupInterval($('#myModal22 .close-reveal-modal'));
        closePopupInterval($('.pushpad_deny_button'));
    }, 20000 );

    setInterval(function(){
        showStatus();
    }, 1800000);

    setInterval(function(){
        rewards(false);
    }, 300000);
                // close tedious popup now
                closePopupInterval($('.close-reveal-modal'));