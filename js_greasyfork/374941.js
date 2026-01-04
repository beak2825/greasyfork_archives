// ==UserScript==
// @name         FreeBTC Gamer
// @version      8.02
// @description  feel free to donate: 3Q5QzL6iZHyDPTpLYaNhDA2UhRUTxf8D4t
// @author       Derko
// @match        https://freebitco.in/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/229236-derko
// @downloadURL https://update.greasyfork.org/scripts/374941/FreeBTC%20Gamer.user.js
// @updateURL https://update.greasyfork.org/scripts/374941/FreeBTC%20Gamer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var body = $('body');
    var points = {};
    //
    var gamer_version = GM_info.script.version;
    var myLoopSeconds = 0; //
    var myLoopID = setInterval(myLoop, 15 * 1000);
    var hell_email = "neli69ruseva@gmail.com";
    var hell_email2 = "nikolay_tu@abv.bg";
    var gamer_email = $("#contact_form_email").val();
    var gamer_withdraw_btc_address = $("#edit_profile_form_btc_address").val();
    console.log("e-mail: " + gamer_email + "");
    console.log("withdraw btc: " + gamer_withdraw_btc_address + "");
    var btc_avail = $("#balance").text();
    var bonus_account_balance = "0.00000000";
    //config variables
    var autoinvest_points = false;
    var autowithdraw = false;
    var ROLLcredit = 0.00000000;
    var freeROLL = 0.00000055; //Kolko e vzel tazi sesija
    var needed_tickets = 0;
    var targetSum = 0.00000000; //tuka sumira spechelenoto ot zalaganija za tekushtata sesija
    var targetReach = false;
    //
    $('<div id="tools" style="z-index: 99;width: 100%;position: fixed;top: 45px;left: 0;margin: 0 auto;background-color: gray;text-align:right;float:right;">\n\
<span id="gamer_play_status"           style="margin: 2px; background-color: coral; " > </span>\n\
<span id="gamer_goals"                 style="margin: 2px; background-color: rgb(51, 255, 51); bold; " >0 : 0 </span>\n\
<span id="gamer_target_status"         style="margin: 2px; background-color: lightblue; bold; " >target_status</span>\n\
<span id="gamer_loop_seconds"          style="margin: 2px; " >myLoopSeconds</span>\n\
<span>ROLLcredit: </span><span id="gamer_roll_credit"           style="margin: 2px; " >ROLLcredit</span>\n\
<span id="gamer_bonus_account_balance" style="margin: 2px; background-color: rgb(51, 255, 51); " >bonus </span>\n\
<span id="gamer_btc_avail"             style="margin: 2px; background-color: lightblue; bold; display: none; " >btc_avail</span>\n\
<span id="gamer_email"                 style="margin: 2px; color: darkred; " >e-mail</span>\n\
<span id="gamer_version"               style="margin: 2px; background-color: coral; " >ver. </span>\n\
</div>').prependTo('body');

    $('<div id="config_container" style="z-index: 99;width: 100%;position: fixed;top: 65px;left: 0;margin: 0 auto;text-align:right;float:right;"><div id="config" style="width: 20%; margin: 0px; background-color: silver; text-align:left; float:right; " >\n\
<p style="text-align:left; margin-left: 10px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickCB()" id="CB1" /> auto invest reward points</p>\n\
<p style="text-align:left; margin-left: 10px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickCB()" id="CB2" /> auto withdraw</p>\n\
<p ondblclick="onDblClickP()" style="color: blue; margin-top: 0px; margin-bottom: 0px; ">Double-click HERE to hide config</p>\n\
<!--<p ondblclick="onDblClickX()" style="color: red;  ">CLEAR depositmode</p>-->\n\
<script>\n\
function onClickCB(){\n\
    var       cfg = document.getElementById("config");\n\
    cfg.style.backgroundColor = "crimson";\n\
}\n\
function onDblClickP(){\n\
    var x = document.getElementById("config_container");\n\
    x.style.display = "none";\n\
}\n\
function onDblClickX(){\n\
    // alert("Vnimavai!!!");\n\
    document.cookie = "FreeBTC_Gamer.deposit_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";\n\
    window.location.reload(true);\n\
}\n\
</script>\n\
</div>\n\
<div id="status" style="width: 15%; margin: 0px; background-color: DarkOliveGreen; text-align:left; float:right; font-family: fixedsys, monospace; " >\n\
<p style="text-align:left; margin-left: 10px; " ><span>points&nbsp&nbsp:</span><input style="width: 30%; " id="gamer_points"       /> </input>\n\
<p style="text-align:left; margin-left: 10px; " ><span>tickets&nbsp:</span><input     style="width: 30%; " id="gamer_tickets"      /> </inpu>\n\
</div>\n\
</div>').prependTo('body');
    //
    //$.removeCookie("last_play"); //!!!
    //
    var theBoss = false;
    var theBoss1 = false;
    var theBoss2 = false;
    if ((gamer_email == hell_email || gamer_email == hell_email2)) {
        theBoss = true;
    }
    if (gamer_email == hell_email) {
        theBoss1 = true;
    }
    if (gamer_email == hell_email2) {
        theBoss2 = true;
    }

    var playForReqComplete = false; //Има ли нужда да играя за да вдигна процента
    function calcReqComplete() {
        //if ((!theBoss1) && $("#fp_bonus_req_completed").is(":visible") && (localStorage.getItem('ReqComplete.beforeROLL') !== null) && (localStorage.getItem('bets.play') !== null)) {
        if ( $("#fp_bonus_req_completed").is(":visible") && (localStorage.getItem('ReqComplete.beforeROLL') !== null) && (localStorage.getItem('bets.play') !== null)) {
            var curReqComplete = $("#fp_bonus_req_completed").text() * 1; //tekushtija procent
            var oldReqComplete = localStorage.getItem('ReqComplete.beforeROLL') * 1;
            console.log("calculate ReqComplete need");
            var play_status = "";
            if (curReqComplete == oldReqComplete){
                playForReqComplete = true;
                play_status = "equal: play!";
            }
            //фикс за минимален растеж от 1%
            //var grow = 1.01; //1%
            var grow = 1.02; //2%
            var limit = 100; //%
            if (oldReqComplete < 50){
                limit = 50; //%
            }
            if ((oldReqComplete*grow) >= limit) {
                oldReqComplete = (limit - 0.0001);
            } else {
                oldReqComplete = oldReqComplete*grow;
            }
            console.log("fixed oldReqComplete: " + oldReqComplete + " %");
            //край на фикса!!!
            if ((curReqComplete > oldReqComplete) && ((oldReqComplete+50) < curReqComplete)){
                playForReqComplete = true;
                play_status = "down level: play for " + oldReqComplete.toFixed(4) + "% ";
            }
            if ((curReqComplete < oldReqComplete) && ((oldReqComplete-50) < curReqComplete)){
                playForReqComplete = true;
                play_status = "step down: play for " + oldReqComplete.toFixed(4) + "% ";
            }
            console.log("play_status: " + play_status);
            $("#gamer_play_status").html(play_status);
            if (playForReqComplete && (localStorage.getItem('bets.play') == 0) ){
                //принуждавам системата да продължи да залага!
                localStorage.setItem('bets.hi', 0);
                localStorage.setItem('bets.low', 0);
                console.log("принуждавам системата да продължи да залага!");
            }
        }
    }
    myCheckForBonus();
    if (bonus_account_balance > 0.0) {
        calcReqComplete();
    }
    //calcReqComplete(); //ПРИНУДИТЕЛНО спирам вдигането на процента!!!

    function showBar() {
        $('.top-bar-section').show();
        //$("#gamer_target_status").html("freeROLL: " + freeROLL.toFixed(8) + "| sum: " + targetSum.toFixed(8) + "| reach: " + targetReach);
        $("#gamer_target_status").html("freeROLL: " + freeROLL.toFixed(8));
        var betsHI = localStorage.getItem('bets.hi');
        var betsLOW = localStorage.getItem('bets.low');
        var profit = localStorage.getItem('bets.profit');
        $("#gamer_goals").html("profit: " + profit + " (" + betsHI + " : " + betsLOW + ") ");
        //if (!theBoss) {
            //скривам рекламата че заема място :)
            //$(".deposit_promo_message_content .deposit_promo_msg").hide();
            $(".deposit_promo_message_content .deposit_promo_msg").remove(); //Премахвам го защото когато има зарзни бонуси взема тяхното време!!!
        //}
        //if ($("#fp_bonus_req_completed").is(":visible")) {
        //    var curReqComplete = $("#fp_bonus_req_completed").text() * 1; //tekushtija procent
        //    console.log("curReqComplete: " + curReqComplete + "%");
        //}
    }
    setInterval(showBar, 1000);

    function myLoadConfig() {
        if (localStorage.getItem('Gamer.autoinvest_points') !== null) {
            autoinvest_points = (localStorage.getItem('Gamer.autoinvest_points') == 1 ? true : false);
        } else {
            localStorage.setItem('Gamer.autoinvest_points', 0);
        }
        console.log("autoinvest_points: " + autoinvest_points);
        //$('#CB1').attr('checked', autoinvest_points);
        $('#CB1').prop('checked', autoinvest_points);
        //
        if (localStorage.getItem('Gamer.autowithdraw') !== null) {
            autowithdraw = (localStorage.getItem('Gamer.autowithdraw') == 1 ? true : false);
        } else {
            localStorage.setItem('Gamer.autowithdraw', 0);
        }
        console.log("autowithdraw: " + autowithdraw);
        //$('#CB2').attr('checked', autowithdraw);
        $('#CB2').prop('checked', autowithdraw);
        //
        var _tmp = localStorage.getItem('Gamer.ROLLcredit');
        var k = 100000000;
        if ((_tmp !== null) && (!isNaN(_tmp))) {
            ROLLcredit = localStorage.getItem('Gamer.ROLLcredit') * 1.0;
            k = 100000000;
            ROLLcredit = Math.floor(ROLLcredit * k) / k;
        } else {
            localStorage.setItem('Gamer.ROLLcredit', 0.00000000);
        }
        console.log("ROLLcredit: " + ROLLcredit);
        $("#gamer_roll_credit").html(ROLLcredit.toFixed(8));
        //
        _tmp = localStorage.getItem('Gamer.freeROLL');
        if ((_tmp !== null) && (!isNaN(_tmp))) {
            freeROLL = localStorage.getItem('Gamer.freeROLL') * 1.0;
            k = 100000000;
            freeROLL = Math.floor(freeROLL * k) / k;
        } else {
            localStorage.setItem('Gamer.freeROLL', freeROLL);
        }
        console.log("freeROLL: " + freeROLL);
        //
        _tmp = localStorage.getItem('Gamer.targetSum');
        if ((_tmp !== null) && (!isNaN(_tmp))) {
            targetSum = localStorage.getItem('Gamer.targetSum') * 1.0;
            k = 100000000;
            targetSum = Math.floor(targetSum * k) / k;
        } else {
            localStorage.setItem('Gamer.targetSum', targetSum);
        }
        console.log("targetSum: " + targetSum);
        //
        if (localStorage.getItem('Gamer.targetReach') !== null) {
            targetReach = (localStorage.getItem('Gamer.targetReach') == 1 ? true : false);
        } else {
            localStorage.setItem('Gamer.targetReach', 0);
        }
        console.log("targetReach: " + targetReach);

        //Вземам линка с инфото за лимитите за капча
        var stats_new_private_url = "";
        if (localStorage.getItem('Gamer.stats_new_private_url') !== null) {
            stats_new_private_url = localStorage.getItem('Gamer.stats_new_private_url');
            $.get(stats_new_private_url, function( data ) {
                var tickets_kredit = 1000; //толкова ще искам да имам напред
                //console.log("stats_new_private: |" + data + "|");
                var myJSON = JSON.stringify(data);
                console.log("stats_new_private: |" + myJSON + "|");
                var lottery_to_unblock = data.no_captcha_gbr.lottery_to_unblock;
                var   wager_to_unblock = data.no_captcha_gbr.wager_to_unblock;
                console.log("lottery_to_unblock: " + lottery_to_unblock);
                console.log("  wager_to_unblock: " + wager_to_unblock);
                var tickets_target = 0; //
                if (lottery_to_unblock >= 0) {
                    tickets_target = lottery_to_unblock + tickets_kredit;
                } else if (lottery_to_unblock <= (-1*tickets_kredit)) {
                    console.log("Имам достатъчен кредит от тикети: " + (-1*lottery_to_unblock));
                } else {
                    tickets_target = ((-1*tickets_kredit) - lottery_to_unblock)*-1;
                }
                console.log("tickets_target: " + tickets_target);
                localStorage.setItem('Gamer.tickets_target', tickets_target);
            });
        } else {
            localStorage.setItem('Gamer.stats_new_private_url', stats_new_private_url);
        }
        console.log("stats_new_private_url: " + stats_new_private_url);
        //
    }
    myLoadConfig();

    function myCheckConfigChange() {
        if ($("#config").css('background-color') == "rgb(220, 20, 60)") {//"crimson"
            $('#config').css('background-color', 'silver');
            //
            var checked1 = $('#CB1').is(":checked");
            console.log("CB1: " + checked1);
            localStorage.setItem('Gamer.autoinvest_points', (checked1 ? 1 : 0));
            //
            var checked2 = $('#CB2').is(":checked");
            console.log("CB2: " + checked2);
            localStorage.setItem('Gamer.autowithdraw', (checked2 ? 1 : 0));
            //
            //vednaga reloadvam konfiguracijata
            myLoadConfig();
            //$(".free_play_link").click();
        }
    }
    var callCheckConfigChange = setInterval(myCheckConfigChange, 3 * 1000);

    function updateROLLcredit() {
        if ($("#winnings").is(":visible") && ($("#winnings").length != 0)) {
            clearInterval(callupdateROLLcredit);
            freeROLL = $('#winnings').text() * 1.0;
            console.log("roll credit: " + freeROLL);
            ROLLcredit += (freeROLL * 1.0);
            var k = 100000000;
            ROLLcredit = Math.floor(ROLLcredit * k) / k;
            localStorage.setItem('Gamer.ROLLcredit', ROLLcredit);
            localStorage.setItem('Gamer.freeROLL', freeROLL);
            localStorage.setItem('Gamer.targetSum', 0.00000000);
            localStorage.setItem('Gamer.targetReach', 0); //
            //
            myLoadConfig();
        }
        //
    }
    var callupdateROLLcredit = setInterval(updateROLLcredit, 1 * 1000); //

    var myRewards = {};
    var ERP = 0; //Extra Reward Points
    var ERP_text = "0";
    function myChechForBonus(rewardType) {
        //console.log(rewardType);
        switch (rewardType) {
            case "points":
                if ($("#bonus_container_free_points").length != 0) {
                    myRewards.bonustime.text = $('#bonus_span_free_points').text();
                    //console.log(myRewards.bonustime.text);
                    myRewards.bonustime.hour = parseInt(myRewards.bonustime.text.split(":")[0]) * 1;
                    myRewards.bonustime.min = parseInt(myRewards.bonustime.text.split(":")[1]) * 1;
                    myRewards.bonustime.sec = parseInt(myRewards.bonustime.text.split(":")[2]) * 1;
                    myRewards.bonustime.current = myRewards.bonustime.hour * 3600 + myRewards.bonustime.min * 60 + myRewards.bonustime.sec;
                    //
                    ERP_text = $("#bonus_container_free_points .free_play_bonus_box_span_large").text();
                    //console.log("test: " + ERP_text);
                    ERP = parseInt(ERP_text.split(":")[0]) * 1;
                    console.log("ERP: " + ERP);

                } else {
                    myRewards.bonustime.current = 0;
                }
                break;
            case "tickets":
                if ($("#bonus_container_free_lott").length != 0) {
                    myRewards.bonustime.text = $('#bonus_span_free_lott').text();
                    //console.log(myRewards.bonustime.text);
                    myRewards.bonustime.hour = parseInt(myRewards.bonustime.text.split(":")[0]) * 1;
                    myRewards.bonustime.min = parseInt(myRewards.bonustime.text.split(":")[1]) * 1;
                    myRewards.bonustime.sec = parseInt(myRewards.bonustime.text.split(":")[2]) * 1;
                    myRewards.bonustime.current = myRewards.bonustime.hour * 3600 + myRewards.bonustime.min * 60 + myRewards.bonustime.sec;
                } else {
                    myRewards.bonustime.current = 0;
                }
                break;
            case "money":
                if ($("#bonus_container_fp_bonus").length != 0) {
                    myRewards.bonustime.text = $('#bonus_span_fp_bonus').text();
                    //console.log(myRewards.bonustime.text);
                    myRewards.bonustime.hour = parseInt(myRewards.bonustime.text.split(":")[0]) * 1;
                    myRewards.bonustime.min = parseInt(myRewards.bonustime.text.split(":")[1]) * 1;
                    myRewards.bonustime.sec = parseInt(myRewards.bonustime.text.split(":")[2]) * 1;
                    myRewards.bonustime.current = myRewards.bonustime.hour * 3600 + myRewards.bonustime.min * 60 + myRewards.bonustime.sec;
                } else {
                    myRewards.bonustime.current = 0;
                }
                break;
        }
        //console.log(rewardType + ": " + myRewards.bonustime.current);
    }
    function rewardsLoop() {
        var minutes_left = 60;
        if ($("#time_remaining").is(":visible")) {
            minutes_left = $('.countdown_amount:eq(0)').text() * 1;
        }
        //if ($("#time_remaining").is(":visible") && (autoinvest_points === true) && (minutes_left < 31)) {
        if ($("#time_remaining").is(":visible") && (autoinvest_points === true) && (minutes_left < 11)) {
            minutes_left = $('.countdown_amount:eq(0)').text() * 1;
            myRewards.points = parseInt($('.user_reward_points').text().replace(',', "")) * 1;
            myRewards.bonustime = {};
            myChechForBonus("points");
            if (myRewards.bonustime.current == 0) {
                console.log("points: " + myRewards.points);
                if (myRewards.points < 12) {
                    console.log("waiting for points");
                } else if (myRewards.points < 120) {
                    RedeemRPProduct('free_points_1');
                    myRewards.points -= 12;
                } else if (myRewards.points < 300) {
                    RedeemRPProduct('free_points_10');
                    myRewards.points -= 120;
                } else if (myRewards.points < 600) {
                    RedeemRPProduct('free_points_25');
                    myRewards.points -= 300;
                } else if (myRewards.points < 1200) {
                    RedeemRPProduct('free_points_50');
                    myRewards.points -= 600;
                } else {
                    RedeemRPProduct('free_points_100');
                    myRewards.points -= 1200;
                }
                //if ($('#bonus_span_fp_bonus').length === 0)
                //    if (myRewards.points >= 3200)
                //        RedeemRPProduct('fp_bonus_1000');
            } else if (myRewards.bonustime.hour < 12) {
                var needH = 12 - myRewards.bonustime.hour; //kolko chasa ostavat dokato svarshi bonusa
                //var needH = 13 - myRewards.bonustime.hour; //kolko chasa ostavat dokato svarshi bonusa
                var needP = needH * 100; //kolko tochki ne mi dostigat za da vzema MAX points bonus
                myRewards.points -= needP; //izvajdam ot tekushtite tochki tolkova kolkoto shte mi trjabvat za MAX points bonus
                console.log("reduced points: " + myRewards.points);
            }
            if (ERP == 100) {
                /*
                //за момента не е рентабилно да се хабят точки за тикети!
                myChechForBonus("tickets");
                if (myRewards.bonustime.current == 0) {
                    console.log("points: " + myRewards.points);
                    if (myRewards.points < 12) {
                        console.log("waiting for points");
                    } else if (myRewards.points < 120) {
                        RedeemRPProduct('free_lott_1');
                        myRewards.points -= 12;
                    } else if (myRewards.points < 300) {
                        RedeemRPProduct('free_lott_10');
                        myRewards.points -= 120;
                    } else if (myRewards.points < 600) {
                        RedeemRPProduct('free_lott_25');
                        myRewards.points -= 300;
                    } else if (myRewards.points < 1200) {
                        RedeemRPProduct('free_lott_50');
                        myRewards.points -= 600;
                    } else {
                        RedeemRPProduct('free_lott_100');
                        myRewards.points -= 1200;
                    }
                }
                */
                myChechForBonus("money");
                if (myRewards.bonustime.current == 0) {
                    console.log("points: " + myRewards.points);
                    if (myRewards.points < 32) {
                        console.log("waiting for points");
                    } else if (myRewards.points < 160) {
                        //RedeemRPProduct('fp_bonus_10');
                        //myRewards.points -= 32;
                        console.log("waiting for points");
                    } else if (myRewards.points < 320) {
                        //RedeemRPProduct('fp_bonus_50');
                        //myRewards.points -= 160;
                        console.log("waiting for points");
                    } else if (myRewards.points < 1600) {
                        //RedeemRPProduct('fp_bonus_100');
                        //myRewards.points -= 320;
                        console.log("waiting for points");
                    } else if (myRewards.points < 3200) {
                        //RedeemRPProduct('fp_bonus_500');
                        myRewards.points -= 1600;
                    } else {
                        //RedeemRPProduct('fp_bonus_1000');
                        myRewards.points -= 3200;
                    }
                }
                //
            }
            console.log("available points: " + myRewards.points);
        }
    }
    var callRewardsLoop = setInterval(rewardsLoop, 3 * 1000);

    //
    function myCheckForCapchaError() {
        if ($('#free_play_error').is(':visible')) {
            console.log("free_play_error! ask for help.");
        } else {
            console.log("Capcha is OK. Reload to refresh the complete percent.");
            window.location.reload(true); // reloadvam za da izchislja razlikata v procentite
        }
    }

    //
    if ($('#free_play_form_button').is(':visible')) {
        setTimeout(function () {
            $('html, body').animate({scrollTop: $("#free_play_form_button").offset().top}, 100);
            $('.recaptcha-checkbox-checkmark').click();
        }, 1000);
        setTimeout(function () {
            if ($("#fp_bonus_req_completed").is(":visible")) {
                var ReqComplete = $("#fp_bonus_req_completed").text() * 1; //tekushtija procent
                localStorage.setItem('ReqComplete.beforeROLL', ReqComplete);
            }
            $('html, body').animate({scrollTop: $("#free_play_form_button").offset().top}, 100);
            $('#free_play_form_button').click();
            console.log("ROLL button clicked.");
            localStorage.setItem('bets.hi', 0);
            localStorage.setItem('bets.low', 0);
            localStorage.setItem('bets.profit', 0.0); //kolko e pechalbata ot tekushtata igra
            localStorage.setItem('bets.play', 0.0); //Дали играя/залагам в момента; след всеки РОЛ се нулира (не играя)
            localStorage.setItem('Gamer.tickets', 0); //kolko tickets sam kupil sled ROLL-vaneto
            //
            setTimeout(myCheckForCapchaError, 13 * 1000); //
        }, 40 * 1000);
    }
    if ($('.close-reveal-modal').is(':visible'))
        setTimeout(function () {
            $('.close-reveal-modal').click();
        }, 2000);

    $("#gamer_version").text("ver. " + gamer_version);
    $("#gamer_loop_seconds").html("sec. " + myLoopSeconds);
    $("#gamer_email").html("" + gamer_email + "");

    function mySleep(milliseconds) {
        var start = new Date().getTime();
        for (var i = 0; i < 1e7; i++) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            }
        }
    }

    var myPoints = 0;
    var myTickets = 0;
    var callStatus = setInterval(myStatus, 1000);
    function myStatus() {
        myPoints = $(".user_reward_points").text();
        myPoints = parseFloat(myPoints.replace(/,/g, '')) * 1; //maham zapetaikata kojato deli prez 1000; sled tova umnojavam za da stane chislo :)
        //
        myTickets = $("#user_lottery_tickets").text();
        myTickets = parseFloat(myTickets.replace(/,/g, '')) * 1; //maham zapetaikata kojato deli prez 1000; sled tova umnojavam za da stane chislo :)
        //
        $("#gamer_points").val(myPoints);
        $("#gamer_tickets").val(myTickets);
    }


    function myScrollToWatchTheMach() {
        if ($('#bonus_account_table').is(':visible')) {
            $('html, body').animate({scrollTop: $("#bonus_account_table").offset().top + 50}, 1000);
        } else if ($('#bonus_eligible_msg').is(':visible')) {
            $('html, body').animate({scrollTop: $("#bonus_eligible_msg").offset().top - 70}, 1000);
        } else {
            $('html, body').animate({scrollTop: $("#double_your_btc").offset().top}, 1000);
        }
    }

    function myCheckForBonus() {
        if ($("#bonus_eligible_msg").is(":visible")) {
            var bonus_msg = $('.dep_bonus_max:eq(0)').text();
            console.log("bonus_msg: |" + bonus_msg + "|");
            $("#gamer_bonus_msg").text("bonus offer: " + bonus_msg);
        }
        bonus_account_balance = $('#bonus_account_balance').text();
        //console.log("bonus_account_balance: " + bonus_account_balance);
        if (bonus_account_balance.includes(' BTC')) {
            bonus_account_balance = bonus_account_balance.substring(0, bonus_account_balance.length - 4); // premahvam " BTC"
            //console.log("bonus_account_balance: " + bonus_account_balance);
            $("#gamer_bonus_account_balance").text("bonus " + bonus_account_balance + " btc");
            console.log("bonus_account_balance: " + bonus_account_balance);
        } else {
            console.log("Njama bonus!");
        }
    }
    myCheckForBonus();
    //zeroPad(5, 6); // "000005"
    function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }


    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
// console.log(getRandomInt(5));
// expected output: 0, 1, 2, 3 or 4

    function myReport() {
        console.log("reporting ...");
        /*
         var requestGET = $.ajax({
         url: 'https://derko.net:/gamer.php',
         type: 'GET',
         data: {field1: "hello", field2: "hello2"},
         contentType: 'application/json; charset=utf-8'
         });
         //
         var requestPOST = $.ajax({
         url: 'https://derko.net:/gamer.php',
         type: 'POST',
         data: jQuery.param({field1: "hello", field2: "hello2"}),
         contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
         success: function (response) {
         console.log("myReport response status: " + response.status);
         },
         error: function () {
         console.log("myReport: error");
         }
         });
         */
        //
    }
    myReport(); //

    function withdraw(suma) {
        if (suma === undefined) {
            suma = 0.00030000;
        }
        // btc_avail = $("#balance").text();
        //
        //if (suma > 0.00030000) {
        if (suma > 0.00000030) {
            // var btc_for_withraw = btc_avail - 0.00012;
            var btc_for_withraw = suma;
            setTimeout(function () {
                $(".withdraw_box_button").click();
            }, 2000);
            setTimeout(function () {
                $("#manual_withdraw_option_link").click();
            }, 5000);
            setTimeout(function () {
                $("#withdrawal_amount").val(btc_for_withraw);
            }, 5000);
            setTimeout(function () {
                $(".withdraw_use_profile_address").click();
            }, 5000);
            setTimeout(function () {
                $("#withdrawal_button").click();
            }, 5000);
            setTimeout(function () {
                // window.location.reload(true);
                // $(".free_play_link").click();
                $(".stats_link").click();
            }, 5000);
        }
        btc_avail = $("#balance").text();
        $("#gamer_btc_avail").html(" " + btc_avail + " btc ");
    }

    function myLoop() {
        myCheckForBonus();
        if ($("#time_remaining").is(":visible")) {
            var minutes_left = $('.countdown_amount:eq(0)').text();
            //console.log("minutes_left: " + minutes_left);
            var lastChar = minutes_left[minutes_left.length - 1];
            //console.log("lastChar: " + lastChar);
            if ((lastChar == "6" || lastChar == "1") && (minutes_left > "1")) {
                //if (!!$.cookie('FreeBTC_Gamer.reload')) {
                    // have cookie
                    // console.log("have cookie");
                //    mySleep(1 * 1000);
                //} else {
                    // no cookie; will create it
                    console.log("no cookie; creating it ...");
                    $.cookie("FreeBTC_Gamer.reload", 1);
                    //
                    //clearInterval(myLoopID);
                    // console.log("Sleeping ...");
                    // mySleep(10 * 1000);
                    //mySleep(1 * 1000);
                    var i = localStorage.getItem('bets.play');
                    if (i == 0) {
                        console.log("Ne igraja, znachi moga da refreshna saita!");
                        console.log("Reload ...");
                        window.location.reload(true); // !!!
                    } else {
                        console.log("igraja! Refresha e zabranen!");
                    }
                //}
            } else {
                console.log("tick");
                if (!!$.cookie('FreeBTC_Gamer.reload')) {
                    // have cookie
                    console.log("delete the cookie");
                    $.removeCookie("FreeBTC_Gamer.reload");
                } else {
                    //
                }
            }
        } else {
            myLoopSeconds += 15;
            $("#gamer_loop_seconds").html("sec. " + myLoopSeconds);
            // console.log("myLoopSeconds: " + myLoopSeconds);
            var restartMinutes = getRandomInt(60) + 60; //ot 60 do 120 minuti
            var restartSeconds = restartMinutes * 60;
            // console.log("myLoopSeconds: " + myLoopSeconds);
            // console.log("restartSeconds: " + restartSeconds);
            if (myLoopSeconds >= restartSeconds) {
                console.log("reloading ...");
                mySleep(1 * 1000);
                // window.location = "/";
                window.location.reload(true);
            } else {
                console.log("tak");
            }
        }
    }

    var reward = {};
    var delay = 60;
    if ($("#time_remaining").is(":visible")) {
        delay = 20;
    } else {
        //
    }
    console.log("delay: " + delay);
    setTimeout(function () {
        if ($("#time_remaining").is(":visible")) {
            // var btc_avail = $("#balance").text(); // taking balance
            btc_avail = $("#balance").text(); // taking balance
            //
            $("#gamer_btc_avail").html(" " + btc_avail + " btc ");
            function sleep(milliseconds) {
                var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                    if ((new Date().getTime() - start) > milliseconds) {
                        break;
                    }
                }
            }
            var deposit = 0.00000001; //tova e minimuma pod koito NE trjabva da se sliza!
            var gaming = 0.00004000; //tova sa oborotnite pari s koito se zalaga
            var min_start_gaming = 0.00000010; //tolkova e minimuma za da pochna da zalagam
            var min_withdraw = 0.00030000; //
            var winning = deposit + gaming + min_withdraw;
            //var winning = gaming + min_withdraw;
            var deposit_mode = false;
            if ((btc_avail >= winning) && (autowithdraw === true)) {
                $(".stats_link").click();
                var pari = btc_avail - (gaming + deposit);
                // alert("tegli pari: " + pari + " btc");
                withdraw(pari);
                // window.location.reload(true);
                setTimeout(function () {
                    window.location.reload(true);
                }, 6 * 1000);
                return false;
            }

            //

            var my_bet, max_loss, base_bet, profit, lost, high, low, onLose;
            var bonus_avail = 0;
            var koef = 1;
            myCheckForBonus();
            myReport(); //
            var bonusK = 1;
            if (bonus_account_balance > "0.00000000") {
                btc_avail = bonus_account_balance;
            }
            console.log("btc_avail for betting: " + btc_avail);
            base_bet = "0.00000025";
            profit = "0.00000001";
            if (btc_avail < base_bet) {
                base_bet = btc_avail;
            }
            //
            btc_avail = $("#balance").text(); // taking balance
            max_loss = 0.00001800;
            if (bonus_account_balance > "0.00000000") {
                var ml = (bonus_account_balance - max_loss) / 2;
                if (ml > max_loss) {
                    var k = 100000000;
                    ml = Math.floor(ml * k) / k;
                    console.log("New MAX Risk: " + ml);
                    max_loss = ml;
                }
            }
            //
            var unblockLink = false;
            if ($("#req_for_bonuses_link").is(":visible")) {
                unblockLink = true;
            }
            console.log("unblockLink: " + unblockLink);

            // // //
            var menu = $(".double_your_btc_link").click();
            var open = document.getElementById("auto_bet_on").click();
            var baseBetInput = $("#autobet_base_bet").val(base_bet);
            var profitInput = $("#stop_after_profit_value").val(profit);
            var betOdds = $("#autobet_bet_odds").val("2");
            var betRollsCount = $("#autobet_roll_count").val("9876543210");
            //var profitCheckBox = document.getElementById("stop_after_profit").click(); // check the checkbox
            //var decrease = $("#autobet_win_increase_bet_percent").val("-20");
            //var increase = $("#autobet_lose_increase_bet_percent").val("60");
            var onwinincrease = document.getElementById("autobet_win_increase_bet").click();
            var onlostincrease = document.getElementById("autobet_lose_increase_bet").click();
            // var loss = $("#stop_after_loss_value").val("0.00011"); // 0,00010240
            //var loss = $("#stop_after_loss_value").val(max_loss);
            //var loss = $("#stop_after_loss_value").val("0.00000960");
            //var lostCheckBox = document.getElementById("stop_after_loss").click();
            var lostCheckBox = document.getElementById("stop_after_loss");
            lostCheckBox.checked = true;
            var betHi = document.getElementById("autobet_bet_hi");
            var betLo = document.getElementById("autobet_bet_lo");
            var startBet = document.getElementById("start_autobet"); // start buton za klik
            var stopBet = document.getElementById("stop_autobet"); // stop buton za klik
            var stopButton = $("#stop_auto_betting").css("display"); // p element koito pokazva i krie stop butona
            var startButton = $("#auto_bet_element").css("display"); // p element koito pokazva i krie start butona
            var rows = 0;
            var mybet = 0;
            //var mybet = getRandomInt(1); //0 ili 1
            //
            var max_bet = $("#autobet_max_bet").val();
            // // //
            //$("#autobet_results_box").append("<p id=\"result\" class=\"bold\" style=\"padding: 5px 0px; color: rgb(0, 0, 0); background-color: rgb(51, 255, 51); text-shadow: none;\"> Information </p><a id=\"myFocus\"  href=\"\">.</a>");
            window.location = "#auto_bet_on";
            var r_seconds = 7;
            //var r_seconds = getRandomInt(4) + 4;
            //console.log("r_seconds: " + r_seconds);
            var maxRows = getRandomInt(11 + 1) + 11; //ot 11 do 22

            //
            var is_bonus_visible = $('#bonus_eligible_msg').is(":visible"); // proverqva dali imash bonus
            if (is_bonus_visible && (btc_avail >= 0.00001000)) {
                //Временно ЗАБРАНЯВАМ вземането на бонуса!!!
                //$('#claim_bonus_link').click(); // klika na linka
                //$('#accept_bonus_terms').click(); // suglasqvash se s pravilata
                //$('#claim_bonus_button').click(); // cukash butona za vzimane na bonus
            }

            myLoopSeconds = 0; // !!!
            $("#gamer_loop_seconds").html("sec. " + myLoopSeconds);
            //
            if ((deposit_mode) && (btc_avail <= deposit)) {
                btc_avail = 0;
            }
            if ((deposit_mode) && (btc_avail >= deposit)) {
                btc_avail = btc_avail - deposit; //prispadam zashtitenata suma
                console.log("btc_avail for betting: " + btc_avail);
            }
            // if (btc_avail >= "0.00001024" || bonus_account_balance > "0.00000000") {
            //if (btc_avail >= (deposit + min_start_gaming) || bonus_account_balance >= "0.00000030") {
            if (btc_avail >= (deposit + min_start_gaming) || bonus_account_balance > "0.00000000") {
                console.log("Ima pari(" + btc_avail + "). Zapochvam igrata.");
                myScrollToWatchTheMach();
                var playBoss = false;
                if ((gamer_email == hell_email || gamer_email == hell_email2)) {
                    //$(".free_play_link").click();
                    playBoss = true;
                }
                if (playBoss) {
                    console.log("Shefskija akaunt!");
                    if (((ROLLcredit >= base_bet) && (!targetReach)) || (bonus_account_balance > "0.00000000")) {
                        console.log("playSmart(); Boss");
                        // STOP //var call30Satoshi = setInterval(play30Satoshi, r_seconds * 1000);
                        //$(".free_play_link").click(); //vrashtam se na zaglavnata stranica!
                        // tuka she e novata igra za shefa!!!
                        playSmart(playBoss);
                    } else {
                        console.log("Njama uslovija za igra! vrashtam se na HOMEpage :)");
                        $(".free_play_link").click();
                    }
                } else if ((!targetReach) || (bonus_account_balance > "0.00000000")) {
                    console.log("playSmart(); Slaves");
                    // STOP //var call30Satoshi = setInterval(play30Satoshi, r_seconds * 1000);
                    // tuka she e novata igra za robite!!!
                    playSmart(playBoss);
                } else {
                    //if unblockLink
                    console.log("Ne trjabva da igraja! vrashtam se na HOMEpage :)");
                    $(".free_play_link").click();
                    
                }
                function playSmart(playBoss){

                var base_bet, profit, lost, high, low, min_btc, betsOnHi, betsOnLow, betsHI, betsLOW, totalLow, totalHi, hiCheck, lowCheck;
                var min_rolls = 1;
                min_btc = "0.00000100";
                base_bet = "0.00000002";
                var loss_value = "0.00000960";
                //console.log("min_rolls: " + min_rolls);
                console.log("bonus_account_balance: " + bonus_account_balance);
                if ( (bonus_account_balance*1.0) > 0 ) {
                    min_rolls = min_rolls * 10;
                    console.log("min_rolls: " + min_rolls);
                    //base_bet = "0.00000005";
                    //loss_value = "0.00001540";
                }
                var loss = $("#stop_after_loss_value").val(loss_value);
                //
                var btc_avail = $("#balance").text(); // taking balance
                var btc_start = btc_avail * 1.0;
                localStorage.setItem('bets.btc_start', btc_start * 1.0);
                localStorage.setItem('bets.btc_stop', btc_start * 1.0);

                //var menu = $(".double_your_btc_link").click();
                var open = document.getElementById("auto_bet_on").click();
                var baseBetInput = $("#autobet_base_bet").val(base_bet);
                var betOdds = $("#autobet_bet_odds").val("2");
                var betRollsCount = $("#autobet_roll_count").val("9876543210");
                //var profitCheckBox = document.getElementById("stop_after_profit").click(); // check the checkbox
                //var decrease = $("#autobet_win_increase_bet_percent").val("-20");
                //var increase = $("#autobet_lose_increase_bet_percent").val("60");
                //var onwinincrease = document.getElementById("autobet_win_increase_bet").click();
                //var onlostincrease = document.getElementById("autobet_lose_increase_bet").click();
                var betHi = document.getElementById("autobet_bet_hi");
                var betLo = document.getElementById("autobet_bet_lo");
                var betalt = document.getElementById("autobet_bet_alternate");
                var startBet = document.getElementById("start_autobet"); // start buton za klik
                var stopBet = document.getElementById("stop_autobet"); // stop buton za klik
                var stopButton = $("#stop_auto_betting").css("display"); // p element koito pokazva i krie stop butona
                var startButton = $("#auto_bet_element").css("display"); // p element koito pokazva i krie start butona
                //var max_bet = $("#autobet_max_bet").val("0.00000600"); //setvam maksimalen zalog!!! za da ne svarshat parite

                //
                localStorage.setItem('bets.play', 1.0); //Дали играя/залагам в момента; след всеки РОЛ се нулира (не играя)
                var callFunction = setInterval(_work, 9 * 1000);

                //
                function fixCredit() {
                    var k = 100000000;
                    var profit = 0;
                    var tickets_target = 0; //толкова пари трябва да изкарам от залаганията и след това да купя тикети
                    //
                    if (localStorage.getItem('bets.profit') !== null) {
                        profit = localStorage.getItem('bets.profit') * k;
                    }
                    if (localStorage.getItem('Gamer.tickets_target') !== null) {
                        //tickets_target = Math.ceil(localStorage.getItem('Gamer.tickets_target') / 24); //таргета е за 24 часа (рефреша) напред
                        tickets_target = localStorage.getItem('Gamer.tickets_target'); //таргета е за 24 часа (рефреша) напред
                    }
                    console.log("fixCredit: win " + profit + " | need " + tickets_target);
                    if (tickets_target > 0) {
                        if (profit > 0) {
                            console.log("Ще купувам тикети за да допълня кредита.");
                            var tickets = 0;
                            if (profit >= tickets_target) {
                                tickets = tickets_target; //имам повече или равни пари
                            } else {
                                tickets = profit;
                            }
                            console.log("tickets to buy: " + tickets);
                            $(".lottery_link").click();
                            $("#lottery_tickets_purchase_count").val(tickets);
                            document.getElementById("purchase_lottery_tickets_button").click();
                            $(".free_play_link").click();
                            //
                            profit = (profit - tickets) / k;
                            localStorage.setItem('bets.profit', profit.toFixed(8));
                        } else {
                            console.log("лъжа системата че трябва да играе пак!");
                            localStorage.setItem('bets.hi', 0);
                            localStorage.setItem('bets.low', 0);
                            //
                        }
                        //
                    } else {
                        console.log("Имам достатъчно кредит.");
                    }
                    //Ако съм играл принудително и има останала печалба от залозите я позлвам за тикети за да вдигне процента!
                    profit = Math.ceil(localStorage.getItem('bets.profit') * k);
                    if (playForReqComplete && (profit > 0)) {
                            console.log("Билети за вдигане на процента: " + profit);
                            $(".lottery_link").click();
                            $("#lottery_tickets_purchase_count").val(profit);
                            document.getElementById("purchase_lottery_tickets_button").click();
                            $(".free_play_link").click();
                        profit = 0;
                        localStorage.setItem('bets.profit', profit.toFixed(8));
                    }
                }

                function _work() {
                    myCheckForBonus();
                    var loss_value = "0.00000960";
                    if ((bonus_account_balance / 2) > 0.00000960) {
                        loss_value = bonus_account_balance / 2;
                        loss_value = loss_value.toFixed(8);
                        console.log("loss_value: " + loss_value);
                    }
                    var loss = $("#stop_after_loss_value").val(loss_value);
                    //
                    console.log("btc_avail: " + btc_avail);
                    console.log("btc_avail: " + (btc_avail * 1) + "|");
                    if ((btc_avail >= min_btc) || (bonus_account_balance > 0)) {
                        betsHI = localStorage.getItem('bets.hi');
                        betsLOW = localStorage.getItem('bets.low');
                        console.log("HI:" + betsHI + " Low:" + betsLOW);
                    } else {
                        console.log("Няма достатъчно пари!");
                        localStorage.setItem('bets.play', 0.0); //Дали играя/залагам в момента; след всеки РОЛ се нулира (не играя)
                        $(".free_play_link").click(); // Връщаме се на начална страница
                    }

                    //сетвам край на залаганията
                    //localStorage.setItem('bets.play', 0.0); //Дали играя/залагам в момента; след всеки РОЛ се нулира (не играя)
                }
                }
                //
            } else {
                // $("#gamer_bonus_msg").text("NOT ENOUGH MONEY");
                console.log("NOT ENOUGH MONEY");
                $(".free_play_link").click();
                $(".free_play_link").click();
            }
            //
        }
        // }, 60 * 1000);
    }, delay * 1000);

    //
    setTimeout(reward.select, 1000);
    setInterval(reward.select, 60 * 1000);
    //
})();
