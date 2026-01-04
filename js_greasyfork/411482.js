// ==UserScript==
// @name         AutoRoll V2.1
// @description  AUTOROLL SCRIPT [AUG 2020] --Auto Roll --Status Console --Close ADS --Human Simulation --Play Multiply Game --Buy Lottery tickets --Buy 1000% Bonus --Buy RP Bonuses --NEW* AutoRoll with Low Balance paying RP --Slower in the night --Advance randomic times simulating humans --made by dany-veneno in 2018, published in 2020, extra functions added daily.
// @author       dany-veneno && Aldione
// @icon         https://bit.ly/3bY0vU9
// @match        https://freebitco.in/*
// @grant        none
// @create       2018-05-27
// @lastmodified 2020-11-15
// @version      2.9.5
// @namespace    https://greasyfork.org/users/572366
// @license      NTP
// @supportURL   https://bit.ly/3d1kW48
// @home-url     https://bit.ly/2M4BNH7
// @home-url2    https://bit.ly/2zn0b4p
// @homepageURL  https://greasyfork.org/en/scripts/404112
// @copyright    2018-2020, dany-veneno
// @run-at       document-end

// @note         2020-11-15-V.2.9.5 Working again!
// @note         2020-08-03-V.2.9.4 Added 2Captcha Resolver
// @note         2020-08-03-V.2.9.3 "Last Bonus" fix
// @note         2020-06-09-V.2.9.2 Title, jquery cdn
// @note         2020-06-09-V.2.9.1 Bug fix lottery, buying big quantity of tickets
// @note         2020-06-09-V.2.9   Play when capctha is visible, paying RP
// @note         2020-06-02-V.2.8   More config Variables
// @note         2020-06-01-V.2.7.6 FreeRoll not Interval
// @note         2020-06-01-V.2.7.5 Name and desc
// @note         2020-06-01-V.2.7.4 Captcha error
// @note         2020-06-01-V.2.7.3 Bug fix - rollback on random click on button
// @note         2020-06-01-V.2.7.2 Bug fix on rewards function
// @note         2020-06-01-V.2.7.1 Add Bonus Status in the box && name && description
// @note         2020-06-01-V.2.7   Click on Roll Button at random position && cookie for rewardsBonuses!
// @note         2020-06-01-V.2.6   Bug Fixes && FreeRoll interval etc. && Count distance from jackpot corrected (road to multiply)
// @note         2020-05-29-V.2.5.3 Night mode more sleepy && added a 2h delay in daymode
// @note         2020-05-29-V.2.5.2 Body Focus
// @note         2020-05-28-V.2.5.1 Add rate link && StatusBox texts
// @note         2020-05-28-V.2.5   Code Cleaned and optimized, all code in separate functions
// @note         2020-05-28-V.2.2.2 Promo_Mode Flag && Bonus1000 flag
// @note         2020-05-27-V.2.2.1 Script Name
// @note         2020-05-27-V.2.2   ExecutionsNum && Script Name && Description
// @note         2020-05-27-V.2.1   First Execution fast Roll && Staus title && link to config how to
// @note         2020-05-27-V.2.0.1 Minor changes and fixes
// @note         2020-05-27-V.2.0.0 MAJOR: STATUS CONSOLE && ADS remove
// @note         2020-05-26-V.1.9.1 Outputs && default loglevel to 4
// @note         2020-05-26-V.1.9   Timings in Roll && Sleep between buying RP && Colors && fixes
// @note         2020-05-26-V.1.8   Hour format update && reduced lottery tickets number && fixes
// @note         2020-05-25-V.1.7   Added logging  && changed timings && verifying all good && faster on RPActive
// @downloadURL https://update.greasyfork.org/scripts/411482/AutoRoll%20V21.user.js
// @updateURL https://update.greasyfork.org/scripts/411482/AutoRoll%20V21.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////
/////////     CONFIG             ///
//////   EDIT JUST THIS SECTION   //
////////////////////////////////////
// ** BEHAVIOR ** //
var PROMO_MODE = true; //  play faster when some promo (bonus RP or 1000% is active, or not. Override nexts.
var SLOW_MODE = false; //  play always really slow, not ovevrcharghing the rolls. Override nexts.
var NIGHT_MODE = true; // play slower when it's night time

// *** Bonuses
var REWARDS = true; //decide if auto buy rewards bonuses, or not ***When true, it will activate RP promotions***
var BONUS1000 = true; //decide if to buy 1000% bonus or not. It costs 4600 RP.  *** When BONUS1000 = false and REWARDS = true, you'll increase RP. ***
var HOURS_BETWEEN_BUY_BONUS = 2; // How many hours to wait before to buy Bonuses Rewards Promo again
var HOURS_BONUS1000 = 48;

// *** Lottery
var LOTTERY = false; //decide if auto buy lottery tickets, or not. ***When true, It will buy lottery tickets 7% of the times ***
var LOTTERY_MAX_TICKETS = 300; // Max ticket to buy

// *** Multiply Game ** Wait for version 3.0 to activate it.
var MULTIPLY = false; //decide if play Multiply games or not ***It's a doubling technique. Play at your risk *** ***When true, it's played randomly***
var MAX_ROLLS_AT_MULTIPLY = 1000; //how many rolls in multiply.

// *** CAPTCHA ERROR *** ///
var PLAY_WITHOUT_CAPTCHA = true;
var CAPTCHA_ERROR = true;

// *** MAX and MIN times for ROLLS, in MINUTES, Absolute Value
var MINUTES_TO_ROLL_MAX = 0;
var MINUTES_TO_ROLL_MIN = 0;

// ** Logging
var LOGGING = 5; //0 is no messages, 5 is debug


var apiKey = "YOUR_API_2CAPTCHA";
var googleKey = "DATA_SITEKEY"; //Only Step 1,2 and 3 //https://2captcha.com/2captcha-api#solving_recaptchav2_new 
var pageUrl = "freebitco.in";
/////////     END CONFIG         ///
/////////////////////////////////////////////////////////////////////////////////////////////////

// System Variables //
var css_reset='font-weight: reset; color:reset';
var css_bold='font-weight:bold;';
var script_output = "";
var script_output_msg_1 = "";
var script_output_msg_2 = "";
var script_output_msg_css = "";
var points=0;
var ads_closed=0;               //number of ads closed, increasing
var rolling_mode="Day";         //night, day, promo, etc
var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false });
var script_version = GM_info.script.version;
var isBonusActive = false;
var rand = 0;
var r = 0;
var d = new Date();
var it = 'false';
var yourUl = document.getElementById("g-recaptcha-response");

//  COOKIES Variables and Retrieve //
var totJack = getCookie("totJack");
var tot_exec = getCookie("executions");
var last_multiply = getCookie("last_multiply")
var tot_btc_winning_rolling = getCookie('tot_btc_winning_rolling');
var tot_lottery_winning_rolling = getCookie('tot_lottery_winning_rolling');
var tot_rp_winning_rolling = getCookie('tot_rp_winning_rolling');
var executions = getCookie('executions');
var last_bonus = Date.parse(getCookie("last_bonus"));
var last_bonus_RP = Date.parse(getCookie("last_bonus_RP"));
if (! (tot_btc_winning_rolling > 0)) tot_btc_winning_rolling = 0;
if (! (tot_lottery_winning_rolling > 0)) tot_lottery_winning_rolling = 0;
if (! (tot_rp_winning_rolling > 0)) tot_rp_winning_rolling = 0;
if (! (executions > 0)) executions = 0;
if (! (last_bonus > 0)) last_bonus = 0;
if (! (last_bonus_RP > 0)) last_bonus_RP = 0;

// END COOKIES //

(function() {
    'use strict';
    if (LOGGING > 0) console.log("%c<<<<<<<<<< Script Begin >>>>>>>>>>", 'font-weight:bold; color: green');

    // Initialize the Status Panel
    panelInit();

    // Lottery function
    // It will plan to buy few lottery tickets, more less 7% of the times
    lottery();

    // Reward function
    // it will call the roll function, that call the multiply function.

       // Call the freeRoll
    setInterval(function(){
        setTimeout(function(){ rewards();    }, 3000 );
        setTimeout(function(){ showStatus(); }, 1000 );
    }(), 900000);
    setTimeout(function(){ Roll();   }, 8000 );

    setInterval(function(){
    // Close the reveals mode
        closePopupInterval($('.close-reveal-modal'));
        closePopupInterval($('.pushpad_deny_button'));
    }, 30000);

    //Close Ads but not always
    setTimeout(function(){
        closeRandomPopupInterval($('div.close_daily_jackpot_main_container_div'),30);
        closeRandomPopupInterval($('i.fa.fa-times-circle.close_deposit_promo_message'),40);
        closeRandomPopupInterval($('div#lambo_contest_msg a.close'),10); //lambo contest
        closeRandomPopupInterval($('div#earn_btc_msg a.close'),20);
        closeRandomPopupInterval($('div#enable_2fa_msg_alert a.close'),30);
        closeRandomPopupInterval($("[id^='hide_rp_promo']"),50);
    }, 20000)

    //Show elapsed time every 10 min.
    setInterval(function(){
        showStatus();
    }, 900000);

    // Activate DOM Monitors
    // First, check all played numbers, even in multiply, and check if it's 8888. To have a measure when to play *jackpot*.
    $('#previous_roll').on('DOMSubtreeModified', function(){
        var rolled = $('#previous_roll').html();
        if (rolled > 0 && rolled <= 10000 && rolled != 8888){
            //if (LOGGING > 4) console.log("prevNumber rolled: "+rolled);
            totJack++;
            setCookie("totJack", totJack, "365");
            //console.log(document.cookie);
        } else if (rolled == 8888) {
            setCookie("totJack", 0, "365");
            if (LOGGING > 0) console.log("************** 8888 **************");
        }
    });

    // Give info about jackpot
    $('#multiplier_fifth_digit').on('click', function(){
        showStatus();
    });
}

)();
function panelInit () {
    // Create the Div on the page
    script_output_msg_css = "<style> #script_output {background: black; border: 2px groove #09ff00; margin-bottom: 1em;} ";
    script_output_msg_css += "#script_output .false {color: red;} #script_output .true {color: lime;} ";
    script_output_msg_css += "#script_output .script_output {color: white; font-weight:normal; font-size: 0.7em} ";
    script_output_msg_css += "#script_output_title_msg {font-size: 0.7em; color: orange; text-align: right; position:absolute; right:0; top:0} ";
    script_output_msg_css += "#script_output_title_msg span {line-height:1.2em;} ";
    script_output_msg_css += "a {text-decoration:none;} ";
    script_output_msg_css += "</style>";

    script_output = script_output_msg_css + '<div class="center free_play_bonus_box_large" id="script_output">';
    script_output += '<div style="position:relative; width: 100%"><p id="script_output_title" style="color: lime; font-weight:bold">AutoRoll Status v.'+script_version+'</p>';
    script_output += '<div id="script_output_title_msg">';
    script_output += '<span id="script_output_title_msg_executions" style="color:white;">Executions #<span id="script_output_title_executions_num" class="true bold">'+tot_exec+'</span></span><br>';
    script_output += '<span id="script_output_title_msg_ads_closed" style="color:white">Ads Closed: <span id="script_output_title_ads_closed_num" class="true bold">0</span></span><br>';
    script_output += '<span id="script_output_bonus_status" style="color:white">Bonus: <span id="script_output_title_bonus_wait_hours" class="true bold">Wait</span></span><br>';
	script_output += '<span id="script_output_bonus_status_RP" style="color:white">BonusRP: <span id="script_output_title_bonus_wait_hours_RP" class="true bold">Wait</span></span><br>';
    script_output += '<span style="color:white">Mode: <span id="script_output_title_msg_mode" class="true bold">Wait</span></span></br>';
    script_output += '<span id="script_output_title_msg_roll"></span></br>';
    script_output += '</div></div>';
    script_output += '<p class="script_output" id="script_output_msg_1"></p>';
    script_output += '<p class="script_output" id="script_output_msg_2"></p>';
    script_output += '<p class="script_output" id="script_output_msg_3" style="color:grey; font-size:0.6em; font-family: console">Donations are welcome, btc address: 3FwAazZDEuy3ER4NQVp4Yqo6kDxCFntwS8 - <a href="https://bit.ly/3d1kW48" target="_blank">Config HowTo</a> - <a href="https://greasyfork.org/en/scripts/404112-freebitco-in-auto-roll-no-captcha-status-console-advanced-human-behavior-all-bonuses/feedback" target="_blank"> Rate</a> - © daniele-veneno 2018-2020</p> </div> ';
    $('#reward_points_bonuses_main_div').prepend(script_output);
}

function rewards() {
    var bonustime = {};
	var bonustimeRP = {};
    var t = missingTime();
    var _min = 20;

    points = parseInt($('.user_reward_points').text().replace(',',""));

    if ($("#bonus_container_free_points").length != 0) {
        bonustime.text = $('#bonus_span_free_points').text();
        bonustime.hour = parseInt(bonustime.text.split(":")[0]);
        bonustime.min = parseInt(bonustime.text.split(":")[1]);
        bonustime.sec = parseInt(bonustime.text.split(":")[2]);
        bonustime.current = bonustime.hour * 3600 + bonustime.min * 60 + bonustime.sec;
        isBonusActive = true;
    } else bonustime.current = 0;


    var last_bonus_diff = Math.floor(d - last_bonus);
	var last_bonus_diff_RP = Math.floor(d - last_bonus_RP);
	
    if (LOGGING > 4) console.log("%c[Debug] lastBonus diff: "+last_bonus_diff+" -- last_bonus: "+last_bonus+" -- d: "+d.getTime(), 'color:grey');
	if (LOGGING > 4) console.log("%c[Debug] lastBonus diff_RP: "+last_bonus_diff_RP+" -- last_bonus_RP: "+last_bonus_RP+" -- d: "+d.getTime(), 'color:grey');
    if (LOGGING > 4) console.log("Bonus missing seconds: "+bonustime.current+" -- Reward Points avail: "+points+" -- missingTime: "+t[0]);
	
	if ($("#bonus_container_fp_bonus").length != 0) {
		bonustimeRP.text = $('#bonus_span_fp_bonus').text();
        bonustimeRP.hour = parseInt(bonustimeRP.text.split(":")[0]);
        bonustimeRP.min = parseInt(bonustimeRP.text.split(":")[1]);
        bonustimeRP.sec = parseInt(bonustimeRP.text.split(":")[2]);
        bonustimeRP.current = bonustimeRP.hour * 3600 + bonustimeRP.min * 60 + bonustimeRP.sec;
		$('#script_output_title_bonus_wait_hours_RP').text('Active '+bonustimeRP.hour+'h');
		setCookie("last_bonus_RP", d, 7);
	}
	if (LOGGING > 4) console.log("Bonus missing seconds_RP: "+bonustimeRP.current+" -- Reward Points avail: "+points+" -- missingTime: "+t[0]);
    if (Boolean(isBonusActive)) {
        if (LOGGING > 3) console.log("%cPromo RP is active!", 'color: grey');
        if(Boolean(PROMO_MODE)) $("#script_output_title_msg_mode").text("Promo");
        $('#script_output_title_bonus_wait_hours').text('Active '+bonustime.hour+'h');
        setCookie("last_bonus", d, 7);
		
    } else {
        // Buy Bonus if missing less then 10 minutes before roll and has passed at least 24h from the last one
        var milli_between_bonuses = Math.floor(HOURS_BETWEEN_BUY_BONUS*60*60*1000);
		var milli_between_bonuses1 = Math.floor(HOURS_BONUS1000*60*60*1000);
        if (Boolean(REWARDS) && t[0]<_min && t[0] >= 0 && last_bonus_diff > milli_between_bonuses) {
           $('.rewards_link').not('.hide_menu').click();
            if (points < 12) {
                if (LOGGING > 2) console.log("No enough points to buy bonus. Less then 12. Waiting for points in next rolls");
            } else if (points < 120) {
                if (LOGGING > 1) console.log("buying bonus 1RP");
                setTimeout(function(){ RedeemRPProduct('free_points_1')},random(2000,16000));
            } else if (points < 600) {
                if (LOGGING > 1) console.log("buying bonus 10RP");
                setTimeout(function(){ RedeemRPProduct('free_points_10')},random(2000,16000));
            } else if (points < 1200) {
                if (LOGGING > 1) console.log("buying bonus 50RP");
                setTimeout(function(){ RedeemRPProduct('free_points_50')},random(2000,16000));
            } else {
                if (LOGGING > 1) console.log("buying bonus 100RP");
                setTimeout(function(){ RedeemRPProduct('free_points_100')},random(2000,16000));
            }
			wait(1500);
			
            if ($('#bonus_span_fp_bonus').length === 0)
                if (points >= 4600 && Boolean(BONUS1000) && last_bonus_diff_RP > milli_between_bonuses1 ) {
                    if (LOGGING > 1) console.log("buying bonus 1000% roll");
                    setTimeout(function(){ RedeemRPProduct('fp_bonus_1000')},random(15000,35000));
                }
            //Back to the main page
            setTimeout(function(){ $('.free_play_link').not('.hide_menu').click(); }, random(1000,3000));

            // Update Status Menu
            $("#script_output_title_msg_mode").text("promo");
        } else {
            //getting colors
            var c1 = 'red'; var c2 = 'red'
            var min_before_roll = 20;

            if (t[0] < 0){
                if (LOGGING > 3) console.log('%cError getting missing time.','color:red');
                $('#script_output_title_bonus_wait_hours').text('Wait');
                $('#script_output_title_bonus_wait_hours').removeClass('true').addClass('false');
            } else if ( t[0] >= min_before_roll ) {
                if (LOGGING > 3) console.log('Not buying RPBonuses. Wait '+Math.floor(t[0]-min_before_roll)+'m');
                $('#script_output_title_bonus_wait_hours').text('Wait Roll');
            }
            if ( last_bonus_diff < milli_between_bonuses ) {
                if (LOGGING > 3) console.log('Not buying RPBonuses. Wait 24hours before buy again');
                $('#script_output_title_bonus_wait_hours').text('Wait '+Math.floor((milli_between_bonuses-last_bonus_diff)/1000/60/60)+"h");
            } else c2 = 'green';

            if (Boolean(REWARDS)) { c1 = 'green'; }
            else {
                if (LOGGING > 3) console.log('Not buying RPBonuses. Not Active by config');
                $('#script_output_title_bonus_wait_hours').text('Not Active');
                $('#script_output_title_bonus_wait_hours').removeClass('true').addClass('false');
            }
            if (LOGGING > 3) console.log('Not buying RPBonuses: Setting Variable is: %c'+Boolean(REWARDS)+' %c -- %c and missing minutes are: %c '+t[0]+' %c(<'+min_before_roll+')', 'color:'+c1, 'color:reset; font-weight:bold', 'font-weight: reset', 'color:'+c2, 'color:reset; font-weight:bold');
        }
    }
}

function Roll() {
    var h = d.getHours();
console.log(h);
    console.log('What time is it? '+h);
    if(h >= 8 || h <=2){
        console.log('Time to ROLL!');
    if ($('#free_play_form_button').is(':visible') && ! $('#play_without_captchas_button').is(':visible')) {
        r=random(1,100);
        $('body').focus();
        if ( (h <= 6 || h>=22) && Boolean(NIGHT_MODE) ) { //from 22 to 7am
            if (r <= 30) rand=random(2400000,7200000);
            else rand=random(1000000,3600000);
            rolling_mode="Night";
        } else {
            if (r <= 10)        rand=random(9000,7200000); // xx%, long wait, more than hour
            else if (r <= 30)   rand=random(6000,1800000); // long but not longest
            else if (r <= 71)   rand=random(3000,1200000); // xx% cases medium
            else                rand=random(500,60000); // xx% cases fast roll
            rolling_mode="Day";
        }

        if (Boolean(SLOW_MODE)) {
            if (r <= 5)        rand=random(3000,50000);
            else if (r <= 20)   rand=random(30000,1500000);
            else if (r <= 40)   rand=random(60000,2000000);
            else                rand=random(90000,3000000);
            rolling_mode="Slow";
        }

        if (Boolean(isBonusActive) && Boolean(PROMO_MODE) ) { //If promo is active, roll faster
            if (r <= 5)        rand=random(9000,3600000);
            else if (r <= 20)   rand=random(6000,1500000);
            else if (r <= 40)   rand=random(3000,1000000);
            else                rand=random(500,240000);
            rolling_mode="Promo";
        }

        if (tot_btc_winning_rolling == 0) {
            rand=random(1000,2000);
            if (LOGGING > 2) console.log('>>>>> First Execution, fast ROLL');
        }
        $("#script_output_title_msg_mode").text(rolling_mode);
        //rand = rand(1000,2000);


        // Real ROLL Function
        rollAndRetrieve(rand);


    } else if ($('#play_without_captchas_button').is(':visible')  && Boolean(PLAY_WITHOUT_CAPTCHA)){
        //Try to play without captcha, if enough RP
        closePopupInterval($('.close-reveal-modal'));
        closePopupInterval($('.pushpad_deny_button'));
        wait(1200);
        if (LOGGING > 2) console.log ("Using 2Captcha");
        sendCaptcha(apiKey, googleKey, pageUrl);

    } else {
        $('#script_output_title_msg_roll').html('<span class="bold">Waiting</span>');
        if (LOGGING > 2) console.log("Waiting");

    }
    }else{
        console.log('Sorry, to many time online.');
        $('#script_output_title_msg_roll').html('<span class="bold">Waiting to 8 morning</span>');
        rand = random(900000,1800000);
        console.log('Waiting '+rand/1000/60+' minutes for reload page');
        wait(rand);
        setTimeout(function(){ location.reload(); }, 30000);
    }
}

function captchaRoll() {
    $('#play_without_captchas_button').click();
    setTimeout(function(){
        var cost_rp = $('.play_without_captcha_description span').text();
        if (LOGGING > 2) console.log ("%cTry to play without captcha for "+cost_rp+" RP points. You have "+points+" RP.", 'color:purple;');
        if (points > cost_rp ) {
            // ROLL anyway paying
            if (LOGGING > 2) console.log ("Roll with Captcha");
            $('#script_output_title_msg_roll').html('<span class="bold true">Captcha OK</span>');

            r=random(1,100);
            if (r <= 10)        rand=random(9000,7200000); // xx%, long wait, more than hour
            else if (r <= 30)   rand=random(6000,1800000); // long but not longest
            else if (r <= 71)   rand=random(3000,1200000); // xx% cases medium
            else                rand=random(500,60000); // xx% cases fast roll
            rolling_mode="Captcha";
            $("#script_output_title_msg_mode").text(rolling_mode);

            if (tot_btc_winning_rolling == 0) {
                rand=random(1000,2000);
                if (LOGGING > 2) console.log('>>>>> First Execution, fast ROLL');
            }
            rand = random(500,3000);
            rollAndRetrieve(rand);
        } else {
            if (LOGGING > 2) console.log ("%cNot enough RP. No Roll", 'color: red');
            $('#script_output_title_msg_roll').html('<span class="bold false">Miss RP</span>'); // Status on page
        }
    }, random(1000,3000));
}

function rollAndRetrieve (rand) {
    var h = d.getHours();
    d.setSeconds(d.getSeconds() + rand/1000);
    var [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat .formatToParts(d);

    $('#script_output_title_msg_roll').html('<span class="bold">Roll at <span class="false">'+hour+':'+minute+'</span></span>');
    if (LOGGING > 2) console.log('%c+++Will roll in '+rand/1000/60+' minutes','color:green');
    if (LOGGING > 4) console.log('[Debug][freeRoll] Hour:'+h+'; r:'+r);

    setTimeout(function(){
        //Duplicate the visibility chek to avoid error when humans roll and don't refresh.
        if ( $('#free_play_form_button').is(':visible') ){
            $('body').focus();

            //Update Status on page
            $('#script_output_title_msg_roll').html('<span class="true">++ Rolling NOW!</span>'); // Status on page
            if (LOGGING > 2) console.log('%c+++ROLL!','color:purple; font-weight: bold');
            setTimeout(function(){
                // var event= $.Event('click');
                // event.ClientX = random(20,100).toFixed(0);
                // event.ClientY = random(5,42).toFixed(0);
                // if (LOGGING > 4) console.log('[Debug][freeRoll] Clicking at position: '+event.ClientX+':'+event.ClientY);
                $('#free_play_form_button').click();
            }, 500);
            setTimeout(function(){
                var win_btc = $('#winnings').text();
                var win_lottery = $('#fp_lottery_tickets_won').text();
                var win_rp = $('#fp_reward_points_won').text();
                executions++;
                //Update Status on page
                $('#script_output_title_msg_roll').html('<span class="true">++ Rolled</span>'); // Status on page
                $('#script_output_title_executions_num').text(executions);
                setCookie('executions', executions, 365);
                if (LOGGING > 2) console.log('%cExecution number: '+executions,'font-weight:bold; color:green');
                if (LOGGING > 2) console.log('%cGot '+win_btc+' btc, '+win_lottery+' tickets and '+win_rp+' RP!','font-weight:bold; color:green');
                if (win_btc > 0) {
                    tot_btc_winning_rolling = parseFloat(parseFloat(tot_btc_winning_rolling) + parseFloat(win_btc)).toFixed(8);
                    setCookie('tot_btc_winning_rolling', tot_btc_winning_rolling, 365);
                    if (LOGGING > 2) console.log('%cBTC Won totally with script %c'+tot_btc_winning_rolling,'color: gray', 'font-weight:bold');
                } else {
                    if (LOGGING > 1) console.log(''+'%cSome error retrieving Roll Winnings. Winning btc was: '+win_btc, 'color: red');
                }
                if (win_lottery > 0) {
                    tot_lottery_winning_rolling = parseFloat(parseFloat(tot_lottery_winning_rolling) + parseFloat(win_lottery)).toFixed(0);
                    setCookie('tot_lottery_winning_rolling', tot_lottery_winning_rolling, 365);
                    if (LOGGING > 2) console.log('%cTickets Won with script %c'+tot_lottery_winning_rolling,'color: gray', 'font-weight:bold');
                } else {
                    if (LOGGING > 1) console.log(''+'%cSome error retrieving Roll Winnings. Winning lottery was: '+win_btc, 'color: red');
                }
                if (win_rp > 0) {
                    tot_rp_winning_rolling = parseFloat(parseFloat(tot_rp_winning_rolling) + parseFloat(win_rp)).toFixed(0);
                    setCookie('tot_rp_winning_rolling', tot_rp_winning_rolling, 365);
                    if (LOGGING > 2) console.log('%cRP Won with script %c'+tot_rp_winning_rolling,'color: gray', 'font-weight:bold');
                } else {
                    if (LOGGING > 1) console.log(''+'%cSome error retrieving Roll Winnings. Winning RP was: '+win_btc, 'color: red');
                }

            }, 6999);
        }
        else {
            if (LOGGING > 3) console.log('Already Rolled..');
            //Update Status on page
            $('#script_output_title_msg_roll').html('<span class="false">Already Rolled</span>'); // Status on page
            setTimeout(function(){ location.reload(); }, 30000);
        }
    },rand);

    //Random Action After ROLL
    var rand1=rand+random(90000,1800000);
    rand=random(0,1000);
    if (rand < 500) {
        if (LOGGING > 2) console.log('[Debug][freeRoll] Reload page after roll in '+rand1/1000/60+' minutes!');
        setTimeout(function(){ location.reload(); }, rand1);
    } else if (rand > 900 && Boolean(MULTIPLY) && h>=8) {
        if (LOGGING > 0) console.log('Will multiply in '+rand1/1000/60+' minutes!');
        setTimeout(function(){ multiply(); }, rand1);
    } else {
        if (LOGGING > 2) console.log('No action after roll. Rand was '+rand);
    }
}

function lottery () {
    //Plan buying lottery ticket
    if(Boolean(LOTTERY)){
        var r=random(1,100);
        var d = new Date();
        var h = d.getHours();
        if (r > 90 && h>=7) {
            rand=random(1,LOTTERY_MAX_TICKETS).toFixed(0); //Tickets to buy
            if (LOGGING > 2) console.log("Buy "+ rand + " lottery tickets in some time....");
            if(parseInt($('#balance').text().split(".")[1]) > rand) {
                $('lottery_link hide_menu').click();
                setTimeout(function(){
                    $('#lottery_tickets_purchase_count').val(rand);
                    setTimeout(function(){
                        if ( $('#lottery_tickets_purchase_count').val() < LOTTERY_MAX_TICKETS ) {
                            $('#purchase_lottery_tickets_button').click();
                            if (LOGGING > 2) console.log("Bought "+ rand + " lottery tickets");
                        }
                    }, random(2000,4000));
                }, random(40000,120000));
            }
        }
    }
}

function missingTime () {
    var min = 0; var sec = 0; var str = "";

    str = $('title').text().split(" ")[0];
    if (LOGGING > 4) console.log("%c[Debug] [missingTime] string: "+str, 'color: grey');
    if (str.length <= 7 && str.length >= 3) {
        min = str.split(':')[0]; if (min.length > 0) min = min.replace('m','');
        sec = str.split(':')[1]; if (sec.length > 0) sec = sec.replace('s','');
    }else if(str == "FreeBitco.in"){
		min = 0; sec = 0;

	}else { min = -1; sec = -1; }

    return [min,sec];
}

function random(min,max){
   return min + (max - min) * Math.random();
}

function closePopupInterval (target) {

    if (target.is(':visible')) {
        setTimeout(function(){
            if (LOGGING > 3) console.log("%cClose ADS", 'color: grey');
            target.click();
            ads_closed ++;
            $('#script_output_title_ads_closed_num').text(ads_closed);
        }, random (500,120000));
    } else {
        //if (LOGGING > 4) console.log("%cNot visible: "+target.attr('id')+" "+target.attr('class'), 'color: grey');
    }
}
function closeRandomPopupInterval (target, randomness) {
    var rand = random(1,100);
    if (rand < randomness && target.is(':visible')) {
        setTimeout(function(){
            if (LOGGING > 3) console.log("%cClose Random ADS", 'color: grey');
            target.click();
            ads_closed ++;
            $('#script_output_title_ads_closed_num').text(ads_closed);
        }, random (500,120000));
    } else {
        //if (LOGGING > 4) console.log("%cNot visible: "+target.attr('id')+" "+target.attr('class'), 'color: grey');
    }
}
function showStatus(){
    var t=missingTime();
    var date = new Date();

    var [{ value: month },,{ value: day },,{ value: year },,{ value: hour },,{ value: minute }] = dateTimeFormat .formatToParts(date );

    var ca='red'; var cb='red'; var cc='red'; var css='font-weight: bold; color:';
    var c1='purple'; var c2='olive';
    var c3='brown'; var c4='teal';
    if (LOGGING > 0) console.log(">>>>>>>>>>%c Status:%c ["+hour+":"+minute+"]", css_bold+'color:'+c1, css_bold);
    //Rewards and multiply infos and colors
    if (Boolean(REWARDS)) ca = 'green'; if (Boolean(MULTIPLY)) cb='green'; if (Boolean(LOTTERY)) cc='green';
    var cssa='font-weight: bold; color:'+ca;
    var cssb='font-weight: bold; color:'+cb;
    var cssc='font-weight: bold; color:'+cc;
    if (LOGGING > 0) console.log(">>>>>>>>>> Buying Rewards: "+"%c"+Boolean(REWARDS)+""+"%c; Playing Multiply: "+"%c"+Boolean(MULTIPLY)+""+"%c; Buying Lottery: "+"%c"+Boolean(LOTTERY), cssa, css_reset,cssb, css_reset, cssc);
    if (t[0] > 0 || t[1] > 0) {
        if (LOGGING > 0) console.log(">>>>>>>>>> Missing "+"%c"+t[0]+" min "+t[1]+" sec"+"%c for next roll",css_bold+"color:"+c1,css_reset);
    }
//     // Free Roll total Winnings via cookie
//     var tot_btc_winning_rolling = getCookie('tot_btc_winning_rolling');
//     var tot_lottery_winning_rolling = getCookie('tot_lottery_winning_rolling');
//     var tot_rp_winning_rolling = getCookie('tot_rp_winning_rolling');
//     if (! (tot_btc_winning_rolling > 0)) tot_btc_winning_rolling = 0;
//     if (! (tot_lottery_winning_rolling > 0)) tot_lottery_winning_rolling = 0;
//     if (! (tot_rp_winning_rolling > 0)) tot_rp_winning_rolling = 0;

    if (LOGGING > 0) console.log(">>>>>>>>>> BTC won with script: "+"%c"+tot_btc_winning_rolling, css_bold+'color:'+c4);
    if (LOGGING > 0) console.log(">>>>>>>>>> Tickets won with script: "+"%c"+tot_lottery_winning_rolling, css_bold+'color:'+c4);
    if (LOGGING > 0) console.log(">>>>>>>>>> RP won with script: "+"%c"+tot_rp_winning_rolling, css_bold+'color:'+c4);
    if (LOGGING > 0) console.log(">>>>>>>>>> Rolls from last 8888: "+"%c"+totJack, css_bold+'color:'+c2);

    // Update Status Message OnPage
    script_output_msg_2 =  "<span class='bold'>Config: </span>";
    script_output_msg_2 += "<span class='"+Boolean(REWARDS)+"'>REWARDS </span> <> ";
    script_output_msg_2 += "<span class='"+Boolean(MULTIPLY)+"'>MULTIPLY</span> <> ";
    script_output_msg_2 += "<span class='"+Boolean(LOTTERY)+"'>LOTTERY</span> <> ";
    script_output_msg_2 += "<span class='"+Boolean(BONUS1000)+"'>BONUS1000</span>";
    script_output_msg_2 += "</br>";
    script_output_msg_2 += "<span class='bold'> Auto Roll Script Winnings:  </span> ";
    script_output_msg_2 += "<span class='true'>"+tot_btc_winning_rolling+"</span> btc; ";
    script_output_msg_2 += "<span class='true'>"+tot_lottery_winning_rolling+"</span> tickets; ";
    script_output_msg_2 += "<span class='true'>"+tot_rp_winning_rolling+"</span> RP.";
    $('#script_output_msg_2').html(script_output_msg_2);

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
        if (LOGGING > 2) console.log('bonus balance: '+bonustime_balance+'; wager remaining: '+bonustime_wager_remaining);
    }
    if (LOGGING > 2) console.log('total balance: '+balance);
    setTimeout(function(){ $('.free_play_link').not('.hide_menu').click(); }, random(900000,1200000));
}


var resultado;




function requestCode(urlCode) {

    $.ajaxPrefilter( function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
            //options.url = "http://cors.corsproxy.io/url=" + options.url;
        }
    });

    return $.get(
        urlCode,
        function (response) {
            console.log("> ", response.request);
        $("#viewer").html(response);
});
}

var pasa = 'hola';

async function showRequest(urlCode, apiKey){

    console.log(urlCode);
    console.log(apiKey);
    do{
    let result = await requestCode(urlCode);
        resultado = result.request;
        console.log('Codigo Captcha: ');
        console.log(resultado);
    }while(resultado == 'ERROR_NO_SLOT_AVAILABLE');

    do{
    let idCaptcha = await requestId(resultado, apiKey);
        pasa = idCaptcha.request;
    }while(pasa.length < 30);
    finalRoll(pasa);
}

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function requestId(id, apiKey) {

    $.ajaxPrefilter( function (optionss) {
        if (optionss.crossDomain && jQuery.support.cors) {
            var http1 = (window.location.protocol === 'http:' ? 'http:' : 'https:');
            optionss.url = http1 + '//cors-anywhere.herokuapp.com/' + optionss.url;
            //options.url = "http://cors.corsproxy.io/url=" + options.url;
            console.log('URL: ');
            console.log(optionss.url);
        }
    });
wait(15000);
    return $.get(
        "https://2captcha.com/res.php?key=" + apiKey + "&action=get&id=" + id + "&json=1",
        function (response) {
            console.log("> ", response.request);
        $("#viewer").html(response);

});
}

var resultadoID;

var final = 'h';

function requestID(id, apiKey){
    console.log('hola');
    console.log(id);

    for(var i=0; i<400; i++){
		var ansUrl = "https://2captcha.com/res.php?key=" + apiKey + "&action=get&id=" + id + "&json=1";
        if(final.length < 24 && it == 'false'){
            fetch(ansUrl).then(response => response.json()).then(data =>(final = data.request, console.log(final), console.log(final.length), console.log('por fin'), finalRoll(final)))
            if(final.length > 20) {
                i == 401;
            }
        };

    }

console.log('medir palabra final');
}




function finalRoll(rollingTy){
    if(rollingTy.length > 25 && it == 'false'){
        it = 'true';
        console.log('Done!');
        document.getElementById("g-recaptcha-response").innerHTML=rollingTy;
		rolling_mode="Captcha solved";
		$("#script_output_title_msg_mode").text(rolling_mode);
		rand = random(500,1000);
		rollAndRetrieve(rand);
		$('#script_output_title_msg_roll').html('<span class="bold">end</span>');
    }else{
		console.log('Not Finish');
    };
}


function sendCaptcha(apiKey, googleKey, pageUrl){
	$('#script_output_title_msg_roll').html('<span class="bold">Solving Captcha</span>');
			var requestUrl = "https://2captcha.com/in.php?key=" + apiKey + "&method=userrecaptcha&googlekey=" + googleKey + "&pageurl=" + pageUrl;

            switch ('HTTPS') {
				case 'HTTP':
				requestUrl = requestUrl + "HTTP";
				break;

				case 'HTTPS':
				requestUrl = requestUrl + '&json=1';
				break;

				case 'SOCKS4':
				requestUrl = requestUrl + "SOCKS4";
				break;

				case 'SOCKS5':
				requestUrl = requestUrl + "SOCKS5";
				break;
			}

    showRequest(requestUrl, apiKey);

}

