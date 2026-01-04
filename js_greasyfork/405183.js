// ==UserScript==
// @name         Freebitco.in - FreeRoll (без ввода капчи) - Эмуляция человека собирает все бонусы каждый час
// @description  Please you need to create an account to work in: https://freebitco.in/?r=4409921
// @author       pavel-f
// @match        https://freebitco.in/?r=4409921
// @grant        https://greasyfork.org/ru/users/585324-pavel-f
// @date         20200612
// @version      1.2
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license      MIT


// @namespace https://greasyfork.org/ru/users/585324-pavel-f
// @downloadURL https://update.greasyfork.org/scripts/405183/Freebitcoin%20-%20FreeRoll%20%28%D0%B1%D0%B5%D0%B7%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0%20%D0%BA%D0%B0%D0%BF%D1%87%D0%B8%29%20-%20%D0%AD%D0%BC%D1%83%D0%BB%D1%8F%D1%86%D0%B8%D1%8F%20%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0%20%D1%81%D0%BE%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D1%82%20%D0%B2%D1%81%D0%B5%20%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D1%8B%20%D0%BA%D0%B0%D0%B6%D0%B4%D1%8B%D0%B9%20%D1%87%D0%B0%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/405183/Freebitcoin%20-%20FreeRoll%20%28%D0%B1%D0%B5%D0%B7%20%D0%B2%D0%B2%D0%BE%D0%B4%D0%B0%20%D0%BA%D0%B0%D0%BF%D1%87%D0%B8%29%20-%20%D0%AD%D0%BC%D1%83%D0%BB%D1%8F%D1%86%D0%B8%D1%8F%20%D1%87%D0%B5%D0%BB%D0%BE%D0%B2%D0%B5%D0%BA%D0%B0%20%D1%81%D0%BE%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D1%82%20%D0%B2%D1%81%D0%B5%20%D0%B1%D0%BE%D0%BD%D1%83%D1%81%D1%8B%20%D0%BA%D0%B0%D0%B6%D0%B4%D1%8B%D0%B9%20%D1%87%D0%B0%D1%81.meta.js
// ==/UserScript==

////////////
// CONFIG //
////////////
// >>>>>>>>>>>>>> //
var MULTIPLY = false; //decide if play Multiply games or not ***It's a doubling technique. Play at your risk ***
var MAX_ROLLS_AT_MULTIPLY = 20; //how many rolls in multiply.
var REWARDS = true; //decide if auto buy rewards, or not.
var LOTTERY = false; //decide if auto buy lottery tickets, or not.
// <<<<<<<<<<<<<< //

// System Variables //
// >>>>>>>>>>>>>>>> //
var css_reset='font-weight: reset; color:reset';
var css_bold='font-weight:bold;';
// <<<<<<<<<<<<<<<< //

//var $ = window.jQuery;

(function() {
    'use strict';

    var points = {};
    var count_min = 15;
    var rand = 0;
    var totJack = getCookie("totJack");
    var t;
    //Buy lottery ticket random
    if( Boolean(LOTTERY)){
        rand=random(800,4000);
        if(parseInt($('#balance').text().split(".")[1])>rand) {
            $('lottery_link hide_menu').click();
            setTimeout(function(){ $('#lottery_tickets_purchase_count').val(rand);},random(4000,7000));
        }else{
            $('#lottery_tickets_purchase_count').val(parseInt($('#balance').text().split(".")[1]));
        }
        console.log("Buy "+ parseInt($('#balance').text().split(".")[1]) + " lottery tickets");
        setTimeout(function(){ $('#purchase_lottery_tickets_button').click()},random(8000,20000));
    }

    // Reward function call the roll function, that call the multiply function.
    var reward = {};
    reward.select = function() {
        reward.points = parseInt($('.user_reward_points').text().replace(',',""));
        reward.bonustime = {};
        if ($("#bonus_container_free_points").length != 0) {
            reward.bonustime.text = $('#bonus_span_free_points').text();
            reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
            reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
            reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
            reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else reward.bonustime.current = 0;

        console.log("Bonus Time: "+reward.bonustime.current+" -- Reward Points: "+reward.points);
        if (reward.bonustime.current !== 0) {
            console.log("Promo RP is active");
            setTimeout(function(){ freeRoll(); }, 300);
        } else {
            t=missingTime();
            if (Boolean(REWARDS) && t[0]<10) {
                $('.rewards_link').not('.hide_menu').click();
                if (reward.points < 12) {
                    console.log("No enough points to buy bonus. Less then 12. Waiting for points in next rolls");
                }
                else if (reward.points < 120) {
                    console.log("waiting for points 60");
                    setTimeout(function(){ RedeemRPProduct('free_points_1')},random(2000,4000));
                }
                else if (reward.points < 600) {
                    console.log("waiting for points 120");
                    setTimeout(function(){ RedeemRPProduct('free_points_10')},random(2000,4000));
                }
                else if (reward.points < 1200) {
                    console.log("waiting for points 600");
                    setTimeout(function(){ RedeemRPProduct('free_points_50')},random(2000,4000));
                }
                else {
                    setTimeout(function(){ RedeemRPProduct('free_points_100')},random(2000,4000));
                }
                if ($('#bonus_span_fp_bonus').length === 0)
                    if (reward.points >= 4600)
                        setTimeout(function(){ RedeemRPProduct('fp_bonus_1000')},random(5000,7000));
                //Back to the main page
                setTimeout(function(){ $('.free_play_link').not('.hide_menu').click(); }, random(8000,10000));
            } else {
                //getting colors
                var c1 = 'red'; var c2 = 'red'
                var _rewards = true;
                var _min = 10;
                if (Boolean(REWARDS) == Boolean(_rewards)) c1 = 'green';
                if (t[0] < _min ) c2 = 'green';
                console.log('Not buying RPBonuses: Setting Variable is: '+'%c'+Boolean(REWARDS)+' '+' %c('+Boolean(_rewards)+') '+'%c and missing minutes are: '+'%c '+t[0]+''+' %c(<'+_min+')', 'color:'+c1, 'color:reset; font-weight:bold', 'font-weight: reset', 'color:'+c2, 'color:reset; font-weight:bold');
            }
            // Call the freeRoll
            setTimeout(function(){ freeRoll(); }, 6100);
        }
    };

    //Save distance from last 8888 on cookie to check when to play Jackpot
    $('#previous_roll').on('DOMSubtreeModified', function(){
        var rolled = $('#previous_roll').html();
        if (rolled > 0 && rolled <= 10000 && rolled != 8888){
            //console.log('new value '+ rolled);
            totJack++;
            setCookie("totJack", totJack, "365");
            setCookie("prevNum", rolled, "365");
            //console.log(document.cookie);
        } else if (rolled == 8888) {
            setCookie("totJack", 0, "365");
            setCookie("prevNum", rolled, "365");
            console.log("8888 Jackpot!");
        }
    });

    // Close the reveals mode
    closePopupInterval($('.close-reveal-modal'));
    closePopupInterval($('.pushpad_deny_button'));
    closePopupInterval($("[id^='hide_rp_promo']"));

    //Show elapsed time every 10 min.
    setInterval(function(){
        var t=missingTime();
        var date = new Date();
        var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: 'false' });
        var [{ value: month },,{ value: day },,{ value: year },,{ value: hour },,{ value: minute }] = dateTimeFormat .formatToParts(date );

        var ca='red'; var cb='red'; var cc='red'; var css='font-weight: bold; color:';
        var c1='purple'; var c2='olive';
        var c3='brown'; var c4='teal';
        console.log(">>>>>>>>>>%c Time: "+hour+":"+minute+""+"%c Status:", css_bold, css_bold+'color:'+c1);
        //Rewards and multiply infos and colors
        if (Boolean(REWARDS)) ca = 'green'; if (Boolean(MULTIPLY)) cb='green'; if (Boolean(LOTTERY)) cc='green';
        var cssa='font-weight: bold; color:'+ca;
        var cssb='font-weight: bold; color:'+cb;
        var cssc='font-weight: bold; color:'+cc;
        console.log(">>>>>>>>>> Buying Rewards: "+"%c"+Boolean(REWARDS)+""+"%c; Playing Multiply: "+"%c"+Boolean(MULTIPLY)+""+"%c; Buying Lottery: "+"%c"+Boolean(LOTTERY), cssa, css_reset,cssb, css_reset, cssc);
        // End rewards and multiply

        //console.log(">>>>>>>>>> Elapsed time from last page reload:"+" %c" + count_min + " minutes.",css_bold+'color:'+c1);
        console.log(">>>>>>>>>> Missing "+"%c"+t[0]+" min "+t[1]+" sec"+"%c for next roll",css_bold+"color:"+c1,css_reset);

        // Free Roll btc Winnings via script
        var tot_btc_winning_rolling = getCookie('tot_btc_winning_rolling');
        console.log(">>>>>>>>>> BTC won with script: "+"%c"+tot_btc_winning_rolling, css_bold+'color:'+c4);
        console.log(">>>>>>>>>> Rolls from last 8888: "+"%c"+totJack, css_bold+'color:'+c2);

        count_min = count_min + 10;
    }, 600000);

    // The reward function call the others functions, cause the order is: buy bonus, free roll, play multiply, reload page, etc.
    setTimeout(reward.select,random(1500,3500));

    // Give info about jackpot
    $('#multiplier_fifth_digit').on('click', function(){
        console.log("Count since last 8888: "+totJack);
    });
}

)();

function missingTime () {
    var min = 0; var sec = 0; var str = "";

    str = $('title').text().split(" ")[0];
    if (str.length <= 7 && str.length >= 3) {
        min = str.split(':')[0]; if (min.length > 0) min = min.replace('m',''); else min = 0;
        sec = str.split(':')[1]; if (sec.length > 0) sec = sec.replace('s',''); else sec = 0;
    }
    return [min,sec];
}
function random(min,max){
   return min + (max - min) * Math.random();
}
function closePopupInterval (target) {
    setInterval(function(){
        if (target.is(':visible')) {
            console.log("Close the popup"); //id: "+target.attr('id')+", classes: "+target.attr("class").split(' '));
            setTimeout(function(){
                target.click();
            }, random (3000,6000));
        }
    },15000);
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function freeRoll() {
    var d = new Date();
    var rand=0;
    var r=0;
    var tot_btc_winning_rolling = getCookie('tot_btc_winning_rolling');
    if (! (tot_btc_winning_rolling > 0)) tot_btc_winning_rolling=0;

    if ($('#free_play_form_button').is(':visible') && ! $('#play_without_captchas_button').is(':visible')) {
        r=random(1,100);
        var h = d.getHours();
        if (h <= 0)             rand=random(900000,3600000); //from midnight to 6am
        else {
            if (r <= 10)         rand=random(900000,4400000); // xx%, long wait, more than hour
            else if (r <= 30)   rand=random(600000,1800000); // long but not longest
            else if (r <= 71)   rand=random(300000,1200000); // xx% cases medium
            else                rand=random(4000,90000); // xx% cases fast roll
        }
        //if (! Boolean(REWARDS) ) rand=rand+random(5000,900000); // human behave
        console.log('++++++++++++++++++++++++++++++Will roll in '+rand/1000/60+' minutes; hour:'+h+'; r:'+r);
        setTimeout(function(){ $('.free_play_link').not('.hide_menu').click();},1800);
        setTimeout(function(){
            //Duplicate the visibility chek to avoid error when humans roll and don't refresh.
            if ($('#free_play_form_button').is(':visible') && ! $('#play_without_captchas_button').is(':visible')){
                console.log('++++++++++++++++++++++++++++++ROLL!');
                $('#free_play_form_button').click();
                setTimeout(function(){
                    var win_btc = $('#winnings').text();
                    var win_lottery = $('#fp_lottery_tickets_won').text();
                    var win_rp = $('#fp_reward_points_won').text();
                    if (win_btc > 0) {
                        console.log('Got '+win_btc+' btc, '+win_lottery+' tickets and '+win_rp+' RP!');
                        console.log(">> DEBUG: "+tot_btc_winning_rolling+" -- "+win_btc+" -- "+parseFloat(tot_btc_winning_rolling));
                        tot_btc_winning_rolling = parseFloat(parseFloat(tot_btc_winning_rolling) + parseFloat(win_btc)).toFixed(8);
                        console.log(">> DEBUG: "+tot_btc_winning_rolling);
                        setCookie('tot_btc_winning_rolling', tot_btc_winning_rolling, 365);
                    } else {
                        console.log(''+'%cSome error retrieving Roll Winnings. Winning was: '+win_btc, 'color: red');
                    }
                }, 6999);
            }
            else {
                console.log('Already Rolled..');
                setTimeout(function(){ location.reload(); }, 3000);
            }
        },rand);
        var rand1=rand+random(900000,1800000);
        rand=random(0,1000);
        if (rand < 500) {
            console.log('Reload page after roll in '+rand1/1000/60+' minutes!');
            setTimeout(function(){ location.reload(); }, rand1);
        } else if (rand > 900 && Boolean(MULTIPLY)) {
            console.log('Will multiply in '+rand1/1000/60+' minutes!');
            setTimeout(function(){ multiply(); }, rand1);
        } else console.log('No action after roll. Rand was '+rand);
    } else {
        console.log("No roll");
    }
}

// Multiply, called after the free roll, sometimes.
function multiply() {
    var balance = parseInt($('#balance').text().split(".")[1]);
    var bonustime_current;
    if ($("#bonus_account_table").length != 0) {
        var bonustime_balance = $('#bonus_account_balance').text().split(" ")[0];
        var bonustime_wager_remaining = $('#bonus_account_wager').text().split(" ")[0];
        bonustime_current = 1;
    } else
        bonustime_current = 0;
    var max_lose = 0; var i=0; var j=0;
    $('.double_your_btc_link').not('.hide_menu').click();
    if ( bonustime_current == 1) {
        // Autobet at "double"
        setTimeout(function(){ $('#auto_bet_on').click(); }, random(2000,2200));
        setTimeout(function(){ $('#autobet_base_bet').val('0.00000001');  }, random(3500,7000));
        //13 rolls loosing in a row, 1 every 4096 games. Every script exec game you win ~500 sat, playing ~500 games.
        setTimeout(function(){ $('#autobet_max_bet').val('0.00004096');  }, random(3500,7000));
        setTimeout(function(){ $('#autobet_roll_count').val(MAX_ROLLS_AT_MULTIPLY);  }, random(3500,7000));
        setTimeout(function(){ $('#autobet_bet_hi').prop('checked', true); $('#autobet_bet_alternate').prop('checked', false);  }, random(3500,7000));
        setTimeout(function(){ $('#show_double_your_btc_auto_bet_on_lose').click();  }, random(7500,9000));
        setTimeout(function(){ $('#autobet_lose_increase_bet').prop('checked', true); $('#autobet_lose_return_to_base').prop('checked', false); }, random(9100,11000));
        setTimeout(function(){ $('#autobet_max_bet_stop').prop('checked', true); $('#autobet_max_bet_reset').prop('checked', false); }, random(9100,11000));
        setTimeout(function(){ $('#autobet_lose_increase_bet_percent').val('100');  }, random(9100,11000));
        setTimeout(function(){ $('#autobet_dnr').prop('checked', true); }, random(11000,12000));
        setTimeout(function(){ $('#start_autobet').click(); }, random(17100,30000));
        console.log('bonus balance: '+bonustime_balance+'; wager remaining: '+bonustime_wager_remaining);
    }
    console.log('total balance: '+balance);
    setTimeout(function(){ $('.free_play_link').not('.hide_menu').click(); }, random(900000,1200000));
}


