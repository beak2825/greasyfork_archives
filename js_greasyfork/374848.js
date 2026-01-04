// ==UserScript==
// @name         Freebitco Auto Faucet
// @version      2.3
// @description  feel free to donate: 3Kyrw9ZLmtkXhvZsSdqtZzLvYiKNHoSHYQ
// @author       ghost
// @match        https://freebitco.in/*
// @grant        none
// @namespace https://greasyfork.org/users/224594
// @downloadURL https://update.greasyfork.org/scripts/374848/Freebitco%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/374848/Freebitco%20Auto%20Faucet.meta.js
// ==/UserScript==

    (function () {
        'use strict';

        var body = $('body');

        var points = {};

        if ($('#free_play_form_button').is(':visible')) {
            setTimeout(function () {
                $('.recaptcha-checkbox-checkmark').click();
            }, 1000);
            setTimeout(function () {
                $('#free_play_form_button').click();
            }, 30000);
        }
        if ($('.close-reveal-modal').is(':visible'))
            setTimeout(function () {
                $('.close-reveal-modal').click();
            }, 2000);

        var reward = {};
        reward.select = function () {
            reward.points = parseInt($('.user_reward_points').text().replace(',', ""));
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
                } else if (reward.points < 120) {
                    console.log("waiting for points 60");
                    RedeemRPProduct('free_points_1');
                } else if (reward.points < 600) {
                    console.log("waiting for points 120");
                    RedeemRPProduct('free_points_10');
                } else if (reward.points < 1200) {
                    console.log("waiting for points 600");
                    RedeemRPProduct('free_points_50');
                } else {
                    RedeemRPProduct('free_points_100');
                }
                if ($('#bonus_span_fp_bonus').length === 0)
                    if (reward.points >= 3200)
                        RedeemRPProduct('fp_bonus_1000');
            }
        };
        setTimeout(function () {
            if ($("#time_remaining").is(":visible")) {
                var btc_avail = $("#balance").text(); // taking balance
                function sleep(milliseconds) {
                    var start = new Date().getTime();
                    for (var i = 0; i < 1e7; i++) {
                        if ((new Date().getTime() - start) > milliseconds) {
                            break;
                        }
                    }
                }


                var base_bet, profit, lost, high, low, onLose;
                if (btc_avail >= "0.0001") {
                    base_bet = "0.00000010";
                    profit = "0.00000020";
                } else { // set base bet
                    base_bet = "0.00000001";
                    profit = "0.00000002";
                }
                var menu = $(".double_your_btc_link").click();
                var open = document.getElementById("auto_bet_on").click();

                var baseBetInput = $("#autobet_base_bet").val(base_bet);
                var profitInput = $("#stop_after_profit_value").val(profit); // set profit
                var increase = $("#autobet_lose_increase_bet_percent").val("100");
                var loss = $("#stop_after_loss_value").val("0.00011"); // 0,00010240
                var profitCheckBox = document.getElementById("stop_after_profit").click(); // check the checkbox
                var lostCheckBox = document.getElementById("stop_after_loss").click();
                var onlostincrease = document.getElementById("autobet_lose_increase_bet").click();
                var betHi = document.getElementById("autobet_bet_hi");
                var betLo = document.getElementById("autobet_bet_lo");
                var startBet = document.getElementById("start_autobet"); // start buton za klik
                var stopBet = document.getElementById("stop_autobet"); // stop buton za klik
                var stopButton = $("#stop_auto_betting").css("display"); // p element koito pokazva i krie stop butona
                var startButton = $("#auto_bet_element").css("display"); // p element koito pokazva i krie start butona
                var rows = 0;
                var mybet = 0;
                console.log(btc_avail);
                var max_bet = $("#autobet_max_bet").val();
////alert(max_bet);
                $("#autobet_results_box").append("<p id=\"result\" class=\"bold\" style=\"padding: 5px 0px; color: rgb(0, 0, 0); background-color: rgb(51, 255, 51); text-shadow: none;\"> Information </div>");

                window.location = "#auto_bet_on";
                var callFunction = setInterval(work, 9 * 1000);
                function work() {
                    var checkrow = document.getElementById("rolls_played_count").innerHTML;
////sleep(1000);
                    var maxRows = 50;

                    var error = $("#double_your_btc_error").css("display");

                    if (error == "block") {
                        console.log("Finish.");
                        console.log("No Money.");
                        clearInterval(callFunction);
                        $(".free_play_link").click();
                    }
                    if (stopButton == "none" && checkrow == "0") {
                        if (mybet == 0) {
                            betLo.click();
                        } else {
                            betHi.click();
                        }
////console.log("pochva da vurti");
                        sleep(1000);
                        startBet.click();
                        rows = rows;
                    }
                    if (stopButton == "none" && checkrow != "0") {
                        var row = parseInt(document.getElementById("rolls_played_count").innerHTML);
                        rows += row;
                        console.log(rows);
                        if (mybet == 0) {
                            mybet = 1;
                            betHi.click();
                        } else {
                            mybet = 0;
                            betLo.click();
                        }
                        var btc_current = $("#balance").text();
                        var resBtc = Number(btc_current - btc_avail);

                        $("#result").html("Rows: " + rows + " || Profit: " + resBtc.toFixed(8));

                        console.log(btc_current);


                        var maxBetSession = $("#autobet_highest_bet").text();
                        if (maxBetSession >= 0.00005120) {
                            rows = maxRows + 1;
                        }

                        if (rows >= 50) {
                            console.log("Finish.");
////sleep(5000);
////location.reload(true);
                            clearInterval(callFunction);
                            $(".free_play_link").click();
                            setTimeout(function () {
                                var Balance = $("#balance").text();
                                if (Balance > 0.00502) {
                                    setTimeout(function () {
                                        $(".withdraw_box_button").click();
                                    }, 2000);
                                    setTimeout(function () {
                                        $("#manual_withdraw_option_link").click();
                                    }, 5000);
                                    setTimeout(function () {
                                        $(".withdraw_all_link").click();
                                    }, 5000);
                                    setTimeout(function () {
                                        $(".withdraw_use_profile_address").click();
                                    }, 5000);
                                    setTimeout(function () {
                                        $("#withdrawal_button").click();
                                    }, 5000);
                                    setTimeout(function () {
                                        $(".free_play_link").click();
                                    }, 5000);
                                }
                            }, 10 * 1000);
                        } else {
                            sleep(1000);
                            startBet.click();
                        }
                    }
                }
            }
        }, 60 * 1000);

        setTimeout(reward.select, 1000);
        setInterval(reward.select, 60000);

    })();