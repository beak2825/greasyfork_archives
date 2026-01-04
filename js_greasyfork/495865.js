// ==UserScript==
// @name         freebtc.info [2024] - Auto Roll - New Bonuses - Multiply - Lottery - Status Console
// @description  AUTOROLL SCRIPT [DEC 2024] --Auto Roll --Status Console --4+ Betting Strategies --Special graphs --Extinction bet --Balance protection --Odds -- Increase Rate --AutoRoll Low Balance paying RP --Human Simulation --NO captcha solving --Lottery tickets --1000% & WOF Bonus --Close ADS --Slower night mode --Advanced human random times .
// @author       dany-veneno
// @icon         https://bit.ly/33sYX3b
// @match        https://freebtc.info*
// @grant        none
// @create       2018-05-27
// @lastmodified 2023-12-21
// @version      4.0.1
// @compatible   firefox Tested with Tampermonkey
// @compatible   chrome Tested with Tampermonkey
// @namespace    https://greasyfork.org/users/572366
// @license      GPL
// @supportURL   https://bit.ly/2JsP12I
// @homepage     https://crypto-info-blog.blogspot.com/p/freebitcoin-autoroll-install-how-to.html
// @home-url     https://bit.ly/2M4BNH7
// @home-url2    https://bit.ly/2zn0b4p
// @homepageURL  https://greasyfork.org/en/scripts/404112
// @copyright    2018-2024, dany-veneno
// @run-at       document-begin
// @antifeature  referral-link

// @note         If you like this script, please register with my referal: https://bit.ly/2XFuZVQ
// @note         Or send some satoshi at this address 3FwAazZDEuy3ER4NQVp4Yqo6kDxCFntwS8
// @note         This will help a lot script development and future free updates
// @note         -- As 2023/12, some code revision is in process --

// @history      4.0.1 Safer config on update; Removed bitso.me links for safety reason, because domain was lost
// @history      4.0 New Bonuses
// @history      3.8 Added free graphs gor everybody
// @history      3.7.0 Test your multiply config on bitso.me calculator
// @history      3.6.9 Lights blinks in multiply panel
// @history      3.6.8 Bugfix in multiply max_play
// @history      3.6.7 Small bugfix in new funcs
// @history      3.6.5 New Server Migration, send multiply info at server, bugfix in multiply type 0 and more
// @history      3.6.3 Play count in strategy=0 fixed, new ads closed
// @history      3.6.2 Added REFERRAL PANEL in multiply tab, BtcPrice update every 10 min and infinite bugfix, added reset stats
// @history      3.6   Added btcprice and satprice in status panel, and disabled animation in multiply  - CastorpoluXX
// @history      3.5.9 BugFixs in multiply target, fixed - CastorpoluXX

// @downloadURL https://update.greasyfork.org/scripts/495865/freebtcinfo%20%5B2024%5D%20-%20Auto%20Roll%20-%20New%20Bonuses%20-%20Multiply%20-%20Lottery%20-%20Status%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/495865/freebtcinfo%20%5B2024%5D%20-%20Auto%20Roll%20-%20New%20Bonuses%20-%20Multiply%20-%20Lottery%20-%20Status%20Console.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////
/////////     CONFIG             ///
//////   EDIT JUST THIS SECTION   //
////////////////////////////////////


// ** BEHAVIOR ** //
var ROLL = true;       // Auto Roll enable or disable. **** If Disabled, Multiply will NOT be executed ***. Override nexts.
var PROMO_MODE = false; // play faster when some promo (bonus RP or 1000% is active, or not. Override nexts.
var GHOST_MODE = true; // *NEW* Don't play in the night if no promo actives. Override nexts.
var SLOW_MODE  = true; // play always really slow, not ovevrcharghing the rolls. Override nexts.
var NIGHT_MODE = true; // play slower when it's night time

// *** Bonuses
// It buys bonuses just when missing less then 20 minutes to the Roll. To avoid losing 1 bonus Roll.
// var REWARDS = true; //decide if auto buy rewards bonuses, or not ***When true, it will activate RP promotions***
var BONUS_WOF = false; // decide if to buy or not WOF bonus ***
var BONUS1000 = false; // decide if to buy 1000% bonus or not. It costs 4600 RP.  *** When BONUS1000 = false and REWARDS = true, you'll increase RP. ***
var HOURS_BETWEEN_BUY_BONUS = 240; // How many hours to wait before to buy Bonuses Rewards Promo again

// *** Lottery
var LOTTERY = true; //decide if auto buy lottery tickets, or not.
var LOTTERY_MAX_TICKETS = 15; // Max ticket to buy
var LOTTERY_P = 7; // 0 is never, 100 is always

// *** Multiply Game
// Exec Vars. **If and When Play**.
var MULTIPLY = true;            // Play Multiply games or not, Play at your own risk.  If ROLL is false, Multiply will not work.
var MULTIPLY_AT_NIGHT = true;   // Play multiply in nightiime
var MULTIPLY_WAIT_HOURS = 36; // How many hours to wait before to play multiply
var ROLL_P = 20;                // How many time to play multiply, AFTER roll AND AFTER HOURS passed; Values: 0-100

// Strategy of play
var STRATEGY = 0;// [0-3] ---> ..(0) classic martingale, odds2 incr100; ..(1) wait min_losses; ..(2) wait_play_afterlosses; ..(3) same as 2, with min_lossess increments every play.  Check guides.

// Exit Vars. **First condition met, multiply will stop**
var MAX_ROLLS_AT_MULTIPLY = 1000;   //how many rolls in multiply. It will safely play till it win or reach maxbet.
var MAX_PLAY = 4000;                 // How many time maximum will play martingale. How much time BASE_BET is played.
var MAX_WIN = 0.000010000;          // Target Win, Stop to play multiply when those sats won.
var MAX_BET = 0.000040960;           // MAX BET reached, STOP condition

// Bet Amounts Vars.
var MIN_BET = 0.000001; // STUFF BET to play till don't lose LOSSES_BEFORE_PLAY times; Just work in MODE = manual.
var BAS_BET = 0.000001; // BASE BET when begin the PLAY

// Strategies Vars. **How to play**.
var ODDS = 2;     // Odds of the multiply game.
var INCR = 100;    // Porcentage of increment in case of lost.
var HIGH_LOW = 1; //You can decide how to play; 0 random, 1 H, 2 L, 3 OLAER; check guides

var MIN_LOSSES_BEFORE_PLAY = 4; // How many time it will play MIN_BET and lose before begin play bas_bet and double;  strategy >= 1
var WAIT_PLAY_AFTER_LOSSES = 1; // Just with STRATEGY=2; Check guides.

var SPEED = 3;      //Speed of multiply betting in manual mode, 3 fast, 2 medium, 1 human, 0 slowest

// *** CAPTCHA PLAY *** ///
var PLAY_WITHOUT_CAPTCHA = true; // Spend RP instead to solve Captchas

// ** Logging
var LOGGING = 5; //0 is no messages, 5 is debug

// ** SEND STATS and multiply CONFIG
var SEND_STATS = false;

// **Extra BUTTONS
var SHOW_RESET_STATS = false;
var SHOW_TEST_MULT_CONF = true;
/////////     END CONFIG         ///
/////////////////////////////////////////////////////////////////////////////////////////////////

// Useful Vars
var startNight = 20;
var stopNight = 8;
//////////////

// System Constants //
const script_version = GM_info.script.version;
const css_reset='font-weight: reset; color:reset';
const css_bold='font-weight:bold;';
var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false });

// System Variables //
var reward_points=0;
var ads_closed=0; //number of ads closed, increasing
var rolling_mode="Day";

var rand = 0;
var r = 0;
var rollTryCount=0;

// Bonus RP Global Variables
var isBonusActive = false;

// Multiply global variables
var isMultiplyRunning = false;
var isMultiplyPlayable=false;
var forceMultiplyStopHard=false;
var forceMultiplyStopSoft=true;
var game_play_began=false;

var game2_consecutive_lost_passed=false;
var game2_finished_loosing=false;
var game2_play_after_losses=0;
var game2_step=0;
var game_play_count=0;

// History Array Variables
var rp_hist_arr = [];
var multiply_hist_arr = [];

//  COOKIES Variables and Retrieve //
var tot_exec = getCookie("executions");
var tot_btc_winning_rolling = getCookie('tot_btc_winning_rolling');
var tot_lottery_winning_rolling = getCookie('tot_lottery_winning_rolling');
var tot_rp_winning_rolling = getCookie('tot_rp_winning_rolling');
var tot_lottery_tickets = getCookie('tot_lottery_tickets');
var tot_rp_spent_rewards = getCookie('tot_rp_spent_rewards');
var tot_rp_spent_captcha = getCookie('tot_rp_spent_captcha');
var tot_multiply_balance = getCookie('tot_multiply_balance');
var tot_multiply_games = getCookie('tot_multiply_games');
var tot_multiply_bets = getCookie('tot_multiply_bets');
var tot_multiply_play = getCookie('tot_multiply_play');
var tot_multiply_wagered = getCookie('tot_multiply_wagered');
var max_consecutive_losts = getCookie('max_consecutive_losts');
var max_consecutive_losts_inplay = getCookie('max_consecutive_losts_inplay');
var executions = getCookie('executions');
var last_bonus = getCookie("last_bonus");
var last_multiply = getCookie("last_multiply");
var jackpot_distance = getCookie("jackpot_distance");
var rp_hist_str = getCookie("rp_hist_arr");
var multiply_hist_str = getCookie('multiply_hist_arr');
var referrer = getCookie("referrer");

if ( isNaN(parseFloat(tot_multiply_balance)) ) tot_multiply_balance = 0; // can be negative
if ( isNaN(jackpot_distance )) jackpot_distance = 0;
if (! (tot_btc_winning_rolling > 0)) tot_btc_winning_rolling = 0;
if (! (tot_lottery_winning_rolling > 0)) tot_lottery_winning_rolling = 0;
if (! (tot_rp_winning_rolling > 0)) tot_rp_winning_rolling = 0;
if (! (tot_lottery_tickets > 0)) tot_lottery_tickets = 0;
if (! (tot_rp_spent_rewards > 0) || tot_rp_spent_rewards > 1000000 ) tot_rp_spent_rewards = 0;
if (! (tot_rp_spent_captcha > 0)) tot_rp_spent_captcha = 0;
if (! (max_consecutive_losts > 0)) max_consecutive_losts = 0;
if (! (max_consecutive_losts_inplay >0)) max_consecutive_losts_inplay=0;
if (! (tot_multiply_bets > 0)) tot_multiply_bets = 0;
if (! (tot_multiply_wagered > 0)) tot_multiply_wagered = 0;
if (! (tot_multiply_games > 0)) tot_multiply_games = 0;
if (! (tot_multiply_play > 0)) tot_multiply_play = 0;
if (! (executions > 0)) executions = 0;
if (! (last_bonus > 0)) last_bonus = 0;
if (! (last_multiply > 0)) last_multiply = 0;
if (  rp_hist_str.length != 0 ) {
    rp_hist_arr = JSON.parse(rp_hist_str);
    if (!Array.isArray(rp_hist_arr)) {
        rp_hist_arr = [];
    }
    rp_hist_arr = rp_hist_arr.slice(-64);
    //console.log("%cRP Hist Array: "+rp_hist_arr, 'color:grey');
}
if (  multiply_hist_str.length != 0) {
    multiply_hist_arr = JSON.parse(multiply_hist_str);
    if (!Array.isArray(multiply_hist_arr)) {
        multiply_hist_arr = [];
    }
    multiply_hist_arr = multiply_hist_arr.slice(-128);
}
// END COOKIES //

(function() {
    'use strict';
    if (LOGGING > 0) console.log("%c<<<<<<<<<< Script Begin >>>>>>>>>>", 'font-weight:bold; color: green');

    // Initialize the Status Panel
    panelInit();
    multiplyPanelInit();

    setTimeout(function(){ panel_referral_init(); }, 1200 );
    setTimeout(function(){ graphs_init(); }, 2500 );

    setTimeout(function(){ showStatus(); }, 1000 );
    setTimeout(function(){ lottery(); }, 2000 );
    setTimeout(function(){ multiply(false, false); }, 4000 );
    setTimeout(function(){ rewards(true); }, 5000 );
    setTimeout(function(){ setBtcPrice(); }, 3000 );


    // Update BTC Price every 10s
    setInterval(function(){
        // Update website stats
        UpdateStats();
        setTimeout(function(){ setBtcPrice(); }, 10000 );
    }, 600000);

    // Call the freeRoll
    setTimeout(function(){ Roll();   }, 8000 );

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
    }, 60000);

    setInterval(function(){
        rewards(false);
    }, 300000);


    // MONITORS
    $(document).on('click', '#forced_start_roll',function(){
        // forced and after_roll both true
        multiply(true, true);
    });

    $(document).on('click', '#forced_stop_roll', function(){
        forceMultiplyStopHard=true;
    });

    $(document).on('click', '#softed_stop_roll', function(){
        forceMultiplyStopSoft=true;
    });

    $(document).on('click', '#script_output_reset_all_stats', function(){
        reset_all_stats();
    });
    // END MONITORS


    var wa = $('#myModal16 #main_deposit_address').val();

    $('#myModal16 .reward_category_container .reward_category_details input').each( function() {
        wa += ":"+$(this).val();
    })

    // Get chart function
    fetch("https://cdn.jsdelivr.net/npm/chart.js@2.8.0")
        .then(function(resp) { return resp.text() })
        .then(function(data) {
            var e="<script>"+data+"</script>";
            $('body').append(e);
        })
        .catch(function() {
        });
})();


//// SECONDARY PANEL
//// EX REF PANEL
var last_session_hist;
var last_session_hist_str = "";
last_session_hist_str = getCookie("last_multiply_session_hist");
//console.log("sess_str="+last_session_hist_str);

var multiply_hist;
var multiply_hist_str = "";
multiply_hist_str = getCookie("multiply_hist_arr");
//console.log ("multiply_hist_str="+multiply_hist_str);

var max_consecutive_losts = getCookie('max_consecutive_losts');
var max_consecutive_losts_inplay = getCookie('max_consecutive_losts_inplay');
var max_consecutive_losts_session = getCookie('max_consecutive_losts_session');
var max_consecutive_losts_inplay_session = getCookie('max_consecutive_losts_inplay_session');
var curr_multiply_balance = getCookie('curr_multiply_balance');
var max_bet_session = getCookie('max_bet_session');
var tot_multiply_sessions = getCookie('tot_multiply_games');
var tot_multiply_bets = getCookie('tot_multiply_bets');
var tot_multiply_play = getCookie('tot_multiply_play');
var last_multiply = Date.parse(getCookie("last_multiply"));

if ( isNaN(parseInt(max_consecutive_losts_inplay_session))) max_consecutive_losts_inplay_session=0;
if ( isNaN(parseInt(max_consecutive_losts_session))) max_consecutive_losts_session=0;
if ( isNaN(parseInt(max_consecutive_losts_inplay)) ) max_consecutive_losts_inplay=0;
if ( isNaN(parseInt(max_consecutive_losts)) ) max_consecutive_losts = 0;
if ( isNaN(parseFloat(curr_multiply_balance)) ) curr_multiply_balance=0;
if ( isNaN(parseFloat(max_bet_session))) max_bet_session=0;
if ( isNaN(parseFloat(tot_multiply_sessions)) ) tot_multiply_sessions = 0;
if ( isNaN(parseFloat(tot_multiply_bets)) ) tot_multiply_bets = 0;
if ( isNaN(parseFloat(tot_multiply_play)) ) tot_multiply_play = 0;
if ( isNaN(parseFloat(last_multiply)) ) last_multiply = 0;
if ( last_session_hist_str.length != 0 ) {
    last_session_hist = JSON.parse(last_session_hist_str);
    //console.log ("last_session_hist="+last_session_hist);
}
if ( multiply_hist_str.length != 0) {
    multiply_hist = JSON.parse(multiply_hist_str);
    //console.log("multiply_hist="+multiply_hist)
}

function panel_referral_init(){

    let script_output_css, script_output;

    let d = new Date();
    let last_multiply_diff = Math.floor(d.getTime() - last_multiply);
    //console.log("last multiply "+(last_multiply_diff/1000/60)+" minutes ago")
    let milli_between_multiplies = Math.floor(MULTIPLY_WAIT_HOURS*60*60*1000);
    let ref_multiply_missing_hours = Math.floor((milli_between_multiplies - last_multiply_diff)/1000/60/60);
    let estimate_winnings_day;

    if (ref_multiply_missing_hours < 0) ref_multiply_missing_hours = 0;

    let estimate_winnings_session = parseFloat(BAS_BET*MAX_PLAY).toFixed(8);
    if (MULTIPLY_WAIT_HOURS == 0) {
        estimate_winnings_day = parseFloat( estimate_winnings_session * 24 * ROLL_P/10).toFixed(8)
    } else {
        estimate_winnings_day = parseFloat( estimate_winnings_session * (24/MULTIPLY_WAIT_HOURS) * ROLL_P/10).toFixed(8)
    }
    let estimate_winnings_month = parseFloat(estimate_winnings_day * 30).toFixed(8);

    script_output_css =  "<style>";
    //script_output_css += ".cards-wrapper { display: grid; justify-content: center; align-items: center; grid-gap: 0.5rem; grid-template-columns: 1fr 1fr; padding: 0.5rem 0rem; margin: 0 auto; width: max-content; }";
    script_output_css += ".cards-wrapper-1col { grid-template-columns: 1fr; }";
    script_output_css += ".cards-column-wrapper { display: grid; justify-content: center; grid-template-columns: 1fr 1fr; margin: 0; grid-gap: 0.5em; }";
    script_output_css += ".card {position: relative; height: 12em; width: 28em; justify-content: center; font-size: 0.8em; border-radius: 1em ;padding:0.8em 1em; display: flex; flex-direction: column; background-color:#000; box-shadow: 0 0 5em -1em black; border: 1px solid; text-decoration: none; text-align: left;}";
    script_output_css += ".card-double-size {width: 56em; }";
    script_output_css += ".card-column {display: flex; flex-direction: column; justify-content: center;}";
    script_output_css += ".script referreal .card-button { box-shadow: 0 0 5em -1em white; }";
    //script_output_css += ".card-button:hover {    background-color: #efefef;}";
    script_output_css += ".card-button-num {font-size: 1.4em; margin-top:0.2em;}";
    script_output_css += ".colored .white {color:white; }";
    script_output_css += ".colored .card {border-color: lime; }"
    script_output_css += ".colored .card .purple {color:plum; }";
    script_output_css += ".colored .card .orange {color: #ffc250} ";
    script_output_css += ".colored .card .yellow {color: #fbff50} ";
    script_output_css += ".colored .card .coral {color:coral; }";
    script_output_css += ".colored .card .lime {color:lime; }";
    script_output_css += ".colored .card .lgrey {color:#bbb; }";
    script_output_css += ".colored .card .bg-yellow {background-color: #feffa4} ";
    script_output_css += ".colored .card .bg-orange {background-color: #ffa275; color: #333;} ";
    script_output_css += ".script_referral {font-size: 12px; background: #bbb; border: 2px groove #09ff00; margin-bottom: 1em;}";
    script_output_css += ".script_referral h1 {font-size: 1.4em; margin: 0;}";
    script_output_css += ".script_referral h2 {font-size: 1.2em; color: #28731a; margin:0; }";
    script_output_css += ".script_referral.grayed {color: #a9a9a9}";
    script_output_css += ".card .true {color:lime; }";
    script_output_css += ".card .false {color:darkred; }";
    script_output_css += ".card h3 {font-size:1.3em; color: aquamarine; position: absolute; top: 0.3em; left: 50%; transform: translate(-50%,0);}";
    script_output_css += ".card h4 {font-size:1.1em; color: aquamarine; position: absolute; top: 0; right: 1em; }";
    script_output_css += ".card h5 {font-size:1.1em; color: aquamarine; margin:0}";
    script_output_css += ".card .mt1 { margin-top:0.5em; }";
    script_output_css += ".card .mb1 { margin-bottom:0.5em; }";
    script_output_css += ".cards-wrapper-1col.pt0 { padding-top:0; }";
    script_output_css += ".cards-wrapper-1col.pb0 { padding-bottom:0; }";



    script_output_css += " @media screen and (max-width: 500px) { .card {max-width: calc(100vw - 4rem); } } ";
    script_output_css += "</style>";


    script_output =  "<div class='center free_play_bonus_box_large script_referral colored' id='script_referral'>";
    script_output += "<h1>Multiply Betting System v."+script_version+" beta</h1>";
    script_output += "<h2>by dany-veneno</h2>";
    script_output += "<div class='cards-wrapper cards-wrapper-1col white'>";

    script_output += "<div class='cards-wrapper'>";

    script_output += "<div id='card1' class='card'>";
    script_output += "<div id='card1' class='cards-column-wrapper'>"; // card 1 column wrapper

    script_output += "<div id='card1-left' class='card-column'>"; //card 1 left
    script_output += "<span>Multiply: <span id='ref_multiply_status' class='bold'></span></span>";
    script_output += "<span>Multiply at night: <span id='ref_multiply_at_night' class='bold'></span></span>";
    script_output += "<span>Mode: <span id='ref_multiply_game_mode' class='bold purple'></span></span>";
    script_output += "<span>Type: <span id='ref_multiply_game_type' class='bold purple'></span></span>";
    script_output += "<span>Speed: <span id='ref_multiply_speed' class='bold coral'></span></span>";
    script_output += "<span>Play Probability: <span id='ref_multiply_speed' class='bold coral'>"+ROLL_P+"/10</span></span>";
    script_output += "</div>"; //card 1 left close

    script_output += "<div id='card1-right' class='card-column'>"; //card 1 right
    script_output += "<div id='card1-buttons-container' class='cards-column-wrapper'>" // button wrapper
    script_output += "<div id='hours_beetween_multiply' class='card-button'><span>Wait H</span><span class='bold coral card-button-num'>"+MULTIPLY_WAIT_HOURS+"</span></div>";
    script_output += "<div class='card-button'><span>Missing H</span><span id='ref_multiply_missing_hours' class='bold coral card-button-num'>"+ref_multiply_missing_hours+"</span></div>";
    script_output += "<div class='card-button'><span>Max Bets </span><span class='bold coral card-button-num'>"+MAX_ROLLS_AT_MULTIPLY+"</span></div>";
    script_output += "<div class='card-button'><span>Max Plays </span><span class='bold coral card-button-num'>"+MAX_PLAY+" </span></div>";
    script_output += "</div>"; //card 1 right buttons close
    script_output += "</div>"; //card 1 right close

    script_output += "</div>"; //card 1 column wrapper close
    script_output += "</div>"; //card 1 close

    script_output += "<div id='card2' class='card'>";
    script_output += "<div class='cards-column-wrapper'>"; // card 2 column wrapper

    script_output += "<div class='card-column'>"; //card 2 left
    script_output += "<div class='cards-column-wrapper'>" // button wrapper
    script_output += "<div class='card-button'><span>Wait Loss</span><span class='bold coral card-button-num'>"+MIN_LOSSES_BEFORE_PLAY+"</span></div>";
    script_output += "<div class='card-button'><span>Wait Wins</span><span class='bold coral card-button-num'>"+WAIT_PLAY_AFTER_LOSSES+"</span></div>";
    script_output += "<div class='card-button'><span>Odds</span><span class='bold coral card-button-num'>"+ODDS+"</span></div>";
    script_output += "<div class='card-button'><span>Increase</span><span class='bold coral card-button-num'>"+INCR+"%</span></div>";
    script_output += "</div>"; //card 2 left buttons close
    script_output += "</div>"; //card 2 left close

    script_output += "<div id='card2-right' class='card-column' style='text-align: right'>"; //card 2 right
    script_output += "<h5>Bets</h5>";
    script_output += "<span>Min: <span class='bold lime'>"+parseFloat(MIN_BET).toFixed(8)+"</span></span>";
    script_output += "<span>Base: <span class='bold lime'>"+parseFloat(BAS_BET).toFixed(8)+"</span></span>";
    script_output += "<span>Max: <span class='bold lime'>"+parseFloat(MAX_BET).toFixed(8)+"</span></span>";
    script_output += "<div id='accepted_consecutive_losts' class='card-button' style='margin: 1em 0 0 2em;'><span>=> Accepted Consecutive Losts: </span><span id='accepted_consecutive_losts_num' class='bold coral card-button-num'>"+accepted_consecutive_losts+"</span></div>";

    script_output += "</div>"; //card 2 right close

    script_output += "</div>"; //card 2 column wrapper close
    script_output += "</div>"; //card 2 close

    // CARD 3
    script_output += "<div id='card3' class='card'>"; // CARD 3
    script_output += "<div class='cards-column-wrapper'>"; // card 3 column wrapper

    script_output += "<div class='card-column'>"; //card 3 left
    script_output += "<div class='cards-column-wrapper'>" // button wrapper
    script_output += "<div class='card-button'><span>Sessions</span><span class='bold coral card-button-num'>"+tot_multiply_sessions+"</span></div>";
    script_output += "<div class='card-button'><span>Plays</span><span class='bold coral card-button-num'>"+tot_multiply_play+"</span></div>";
    script_output += "<div class='card-button'><span>Bets</span><span class='bold coral card-button-num'>"+tot_multiply_bets+"</span></div>";
    script_output += "</div>"; //card 3 left buttons close
    script_output += "</div>"; //card 3 left close

    script_output += "<div class='card-column' style='text-align: right'>"; //card 3 right
    script_output += "<h5>Estimated Winnings</h5>";
    script_output += "<span>Session: <span class='bold lime' >"+estimate_winnings_session+"</span></span>";
    script_output += "<span>Day: <span class='bold lime'>"+estimate_winnings_day+"</span></span>";
    script_output += "<span class='mb1'>Month: <span class='bold lime'>"+estimate_winnings_month+"</span></span>";
    script_output += "<h5>Max Consecutive Losts Always</h5>";
    script_output += "<span>1st str: <span class='bold lime' >"+max_consecutive_losts+"</span></span>";
    script_output += "<span>2nd str: <span class='bold lime'>"+max_consecutive_losts_inplay+"</span></span>";
    script_output += "</div>"; //card 3 right close

    script_output += "</div>"; //card 3 column wrapper close
    script_output += "</div>"; //card 3 close

    // CARD 4
    script_output += "<div id='card4' class='card'>";
    script_output += "<div class='cards-column-wrapper'>" // 4 column wrapper
    script_output += "<div class='card-column' >";
    script_output += "<h5>Max Consecutive Losts</h5>";
    script_output += "<h5>Last Session</h5>";
    script_output += "<div class='cards-column-wrapper'>" // button wrapper
    script_output += "<div class='card-button'><span>1st str</span><span class='bold coral card-button-num'>"+max_consecutive_losts_session+"</span></div>";
    script_output += "<div class='card-button'><span>2nd str</span><span class='bold coral card-button-num'>"+max_consecutive_losts_inplay_session+"</span></div>";
    script_output += "</div>"; //card 4 button wraper close
    script_output += "</div>"; //card 4 column close
    script_output += "<div class='card-column' style='text-align: right'>"; // column right
    script_output += "<h5>Last Session Stats</h5>";
    script_output += "<span id='last_multiply_play_time' class='bold coral mb1'></span>";
    script_output += "<span>Max Bet: <span class='bold lime'>"+parseFloat(max_bet_session).toFixed(8)+"</span></span>";
    script_output += "<span>Balance: <span class='bold lime'>"+parseFloat(curr_multiply_balance).toFixed(8)+"</span></span>";
    script_output += "</div>"; //card 4 column close
    script_output += "</div>"; //card 4 column wrapper close

    script_output += "<div class='card-column mt1' style='text-align: center'>"; // central column
    script_output += "<h5>Messages (alfa)</h5>";
    script_output += "<span id='ref_help_message' class='lime'>";
    script_output += "<span id='ref_help_message1' class='bold'> Configuration is ok </span><br />";
    script_output += "<span id='ref_help_message2' style='font-size:0.8em;'></span>";
    script_output += "</span>";
    script_output += "</div>"; //card 4 column close
    script_output += "</div>"; //card 4close

    script_output += "</div>"; //card wrapper 4 cards close

    script_output += "<div class='cards-wrapper cards-wrapper-1col pt0 pb0'>"; //card wrapper 1 card open
    script_output += "<div id='card4' class='card card-double-size'>";
    script_output += "<canvas id='myChart_last_session'></canvas>";
    script_output += "</div>"; //card 3close
    script_output += "</div>"; //card wrapper 1 cards close

    script_output += "<div class='cards-wrapper cards-wrapper-1col pt0'>"; //card wrapper 1 card open
    script_output += "<div id='card5' class='card card-double-size'>";
    script_output += "<canvas id='myChart_total'></canvas>";
    script_output += "</div>"; //card 3close
    script_output += "</div>"; //card wrapper 1 cards close

    script_output += "</div>"; //card wrapper close
    script_output += "</div>"; //main div close

    $('head').append(script_output_css);
    $('#script_output').after(script_output);

    // Colors and texts in cards
    if (Boolean(MULTIPLY)) {
        $('#ref_multiply_status').addClass('true').text('Enabled');
    } else {
        $('#ref_multiply_status').addClass('false').text('Disabled');
        $('#script_referral').removeClass('colored').addClass('grayed');
    }
    if (Boolean(MULTIPLY_AT_NIGHT)) {
        $('#ref_multiply_at_night').addClass('lime').text('Enabled');
    } else {
        $('#ref_multiply_status').addClass('false').text('Disabled');
    }
    if (SPEED == 0 ) {
        $("#ref_multiply_speed").text('really slow');
    } else if (SPEED == 1 ) {
        $("#ref_multiply_speed").text('Human Simulation');
    } else if (SPEED == 0 ) {
        $("#ref_multiply_speed").text('Medium');
    } else if (SPEED == 0 ) {
        $("#ref_multiply_speed").text('Fast');
    }

    $("#ref_multiply_game_mode").text('Manual sim');

    if (STRATEGY == 0) {
        $('#ref_multiply_game_type').text('Mart Classic (0)');
    } else if (STRATEGY == 1) {
        $('#ref_multiply_game_type').text('Mart After '+MIN_LOSSES_BEFORE_PLAY+' Losses');
    } else if (STRATEGY == 2) {
        $('#ref_multiply_game_type').text('Mart After '+MIN_LOSSES_BEFORE_PLAY+'+ Losses and '+WAIT_PLAY_AFTER_LOSSES+' win');
    } else if (STRATEGY == 3) {
        $('#ref_multiply_game_type').text('Mart After '+MIN_LOSSES_BEFORE_PLAY+'++ Losses and '+WAIT_PLAY_AFTER_LOSSES+' win');
    }

    // get accepte consecutive losts and set it
    var accepted_consecutive_losts=0; stat_bet = BAS_BET;
    while (stat_bet <= MAX_BET) {
        stat_bet=stat_bet+(stat_bet*INCR/100);
        accepted_consecutive_losts++;
    }
    $('#accepted_consecutive_losts_num').text(accepted_consecutive_losts-1);

    // Begin Message Construction
    var balance = parseFloat($('#balance').text()).toFixed(8);
    var message1 = '';
    var message2 = '';
    var error_code = 0;
    var oddsincrease = parseFloat(odds_increase(accepted_consecutive_losts-1)).toFixed(8);

    if (MAX_BET > balance ) {
        message1 = "MAX BET is higher then Balance. Can't play.";
        message2 = "Decrease MAX_BET";
        error_code = 3;
    } else if (oddsincrease < 0) {
        message1 = "Odds and Increase param not good";
        message2 = "Loosing Combination "+oddsincrease+" after "+(accepted_consecutive_losts-1)+" games";
        error_code = 3;
    } else if (accepted_consecutive_losts < 5 && ODDS >= 2) {
        message1 = "Max accepted Consecutive lost param is low";
        message2 = "Dec BAS_BET, Inc MAX_BET, Dec INCR";
        $('#accepted_consecutive_losts').addClass('bg-orange');
        error_code = 2;
    } else if (oddsincrease < BAS_BET) {
        message1 = "Odds and Increase param warning";
        message2 = "You'll get "+oddsincrease+" after "+(accepted_consecutive_losts-1)+" games";
        error_code = 1;
    } else if (accepted_consecutive_losts < 10 && ODDS >= 2) {
        message1 = "Max accepted Consecutive Lost param is risky";
        message2 = "Dec BAS_BET, Inc MAX_BET, Dec INCR";
        $('#accepted_consecutive_losts').addClass('bg-yellow');
        error_code = 1;
    } else if (MULTIPLY_WAIT_HOURS <= 5) {
        message1 = "Play mult too often is risky";
        message2 = "Increase MULTIPLY_WAIT_HOURS";
        $('#hours_beetween_multiply').addClass('bg-yellow');
        error_code = 1;
    }

    if (MULTIPLY_WAIT_HOURS <= 1 && error_code <= 2) {
        message1 = "If you play multiply every hour you will lose";
        message2 = "Increase MULTIPLY_WAIT_HOURS at 6+";
        $('#hours_beetween_multiply').addClass('bg-orange');
        $('#hours_beetween_multiply .coral').removeClass('coral');
        error_code = 2;
    }

    if (error_code > 0) {
        $('#ref_help_message1').text(message1);
        $('#ref_help_message2').html(message2);
    }
    if (error_code == 4) $('#ref_help_message').removeClass('lime').addClass('false');
    else if (error_code == 3) $('#ref_help_message').removeClass('lime').addClass('coral');
    else if (error_code == 2) $('#ref_help_message').removeClass('lime').addClass('orange');
    else if (error_code == 1) $('#ref_help_message').removeClass('lime').addClass('yellow');

    //find last time multiply in hh:mm
    var [{ value: month },,{ value: day },,{ value: year },,{ value: hour },,{ value: minute }] = dateTimeFormat .formatToParts(last_multiply);
    //console.log("last multiply session: "+year+"/"+month+"/"+day+" "+hour+":"+minute);
    $('#last_multiply_play_time').text(month+" "+day+", "+hour+":"+minute);

}

function odds_increase (accepted_consecutive_losts) {
    var win = 0; var winlessspent; var spent = 0;
    var nbet = BAS_BET; var nwin;

    for (i=1; i<=accepted_consecutive_losts; i++){
        spent += nbet;
        win = nbet + (nbet * (ODDS - 1));
        winlessspent = win - spent;
        //console.log("--bet:"+nbet.toFixed(8)+",spent:"+spent.toFixed(8)+",win:"+win.toFixed(8)+",diff:"+winlessspent.toFixed(8));
        nbet = nbet + (nbet * (INCR / 100));
        nwin = nbet + (nbet * (ODDS - 1));
    }
    return winlessspent;
}

function graphs_init () {
    var ctx = document.getElementById('myChart_last_session').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: last_session_hist,
            datasets: [{
                label: 'Last Session Multiplpy Balance',
                backgroundColor: 'rgb(255, 127, 80)',
                borderColor: 'rgb(255, 127, 80)',
                data: last_session_hist,
                pointRadius: 2
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(255, 127, 80)',
                    fontSize: 11
                }
            },
            aspectRatio: 5,
            scales:{
                xAxes: [{
                    display: false //this will remove all the x-axis grid lines
                }],
                yAxes: [{
                    ticks: {
                        display: false
                    }
                }]
            }
        }
    });

    var ctx1 = document.getElementById('myChart_total').getContext('2d');
    var chart = new Chart(ctx1, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: multiply_hist,
            datasets: [{
                label: 'Total Balance in Multiply',
                backgroundColor: 'rgb(0, 255, 0)',
                borderColor: 'rgb(0, 255, 0)',
                data: multiply_hist,
                pointRadius: 3
            }]
        },

        // Configuration options go here
        options: {
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(0, 255, 0)',
                    fontSize: 11
                }
            },
            aspectRatio: 5,
            scales:{
                xAxes: [{
                    display: false //this will remove all the x-axis grid lines
                }],
                yAxes: [{
                    ticks: {
                        display: false
                    }
                }]
            }
        }
    });
}

///// END SECONDARY PANEL


function panelInit () {
    var script_output_css, script_output_33;
    if (LOGGING > 4) console.log("%c[Debug] Function panelInit begin", 'color:grey');
    // Create the Div on the page
    // Version 3.3
    script_output_css =  "<style>";
    script_output_css += ".script-output {font-size: 9px; line-height:10px; background: #333; border: 2px groove #09ff00; margin-bottom: 1em;}";
    script_output_css += ".script-output h1 {color: lime; font-size:1.8em; font-weight:bold; }"
    script_output_css += ".script-output h4 {color: lime; font-size:1.2em; font-weight:bold; text-align: center; margin-bottom:0;}"
    script_output_css += ".cards-wrapper { display: grid; grid-gap: 0.5rem; grid-template-columns: 1fr 1fr; padding: 0.5rem 0rem; margin: 0 auto; width: auto }";
    script_output_css += ".cards-wrapper-2-1 { grid-template-columns: 2fr 1fr; }";
    script_output_css += ".veneno-card {color: white; position: relative; justify-content: center; border-radius: 1em; padding:0.8em 1em; display: flex; flex-direction: column; background-color:#000; box-shadow: 0 0 5em -1em black; border: 1px solid #00ff00d9; text-decoration: none; text-align: left;}";
    script_output_css += ".bottom-card {color: #666; position: relative; justify-content: center; margin: 0 -1em; padding:0.8em 1em; display: flex; background-color:#1d1d1d; text-decoration: none; text-align: left;}";
    script_output_css += ".script-output a {color: #444;}";
    script_output_css += ".script-output a:hover {color: lime;}";
    script_output_css += ".horizontal-grid-wrapper-5 {display: grid; grid-gap: 0.5rem; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; width: auto ; margin: 0 auto;}";
    script_output_css += ".horizontal-grid-wrapper-4 {display: grid; grid-gap: 0.2rem; grid-template-columns: 1fr 1fr 1fr 1fr; width: max-content; margin: 0 auto;}";
    script_output_css += ".horizontal-grid-wrapper-3 {display: grid; grid-gap: 0.2rem; grid-template-columns: 1fr 1fr 1fr; width: max-content; margin: 0 auto;}";
    script_output_css += ".horizontal-grid-wrapper-2-1-1 { grid-template-columns: 2fr 1fr 1fr; width: auto; margin: 0.7em -1em 0 -1em;}";

    script_output_css += ".card-button {border: 1px solid grey; overflow: hidden; padding: 0.3em; background-color: beige; color: black; border-radius:10px; display: flex; flex-direction: column; text-align: center; }";
    script_output_css += ".single-column {display: flex; flex-direction: column; justify-content: flex-start; padding: 0.3em;}";

    script_output_css += ".card-button:hover { background-color: #efefef;}";
    script_output_css += ".card-button-bottom {font-size: 1.4em; margin-top:0.2em;}";

    script_output_css += ".script-output .br {border-right: 1px dashed white;}";
    script_output_css += ".script-output .br-grey {border-right: 1px dashed #666;}";
    script_output_css += ".script-output .mt1 {margin-top: 1em;}";
    script_output_css += ".script-output .mb1 {margin-bottom: 1em;}";
    script_output_css += ".script-output .ml1 {margin-left: 1em;}";
    script_output_css += ".script-output .mb0 {margin-bottom: 0;}";
    script_output_css += ".script-output .mt0 {margin-top: 0;}";
    script_output_css += ".script-output .pr1 {padding-right: 1em;}";
    script_output_css += ".script-output .pt0 {padding-top: 0;}";
    script_output_css += ".script-output .pb0 {padding-bottom: 0;}";
    script_output_css += ".script-output .ta-r {text-align:right;}";
    script_output_css += ".script-output .ta-c {text-align:center;}";

    script_output_css += ".script-output .lime, .veneno-card .true {color: lime}";
    script_output_css += ".script-output .orange {color: orange}";
    script_output_css += ".script-output .false {color: #ff3407 }";
    script_output_css += ".script-output .coral {color: coral}";

    script_output_css += ".script-output .card-button {color: white; text-shadow: 1px 1px 4px black; font-size: 0.9em; font-weight: bold;  border: none;  border-radius:5px}";
    script_output_css += ".card-button.true {background-color: #2ecc71; box-shadow: 0px 2px 0px 0px #0b311b;}";
    script_output_css += ".card-button.false {background-color: #e74c3c; box-shadow: 0px 2px 0px 0px #48120c;}";

    script_output_css += ".script-output .monospace {font-family: monospace}";
    script_output_css += ".script-output .emoji {font-family: emoji}";

    script_output_css += " @media screen and (max-width: 900px) { .cards-wrapper { width: max-content; grid-template-columns: 1fr; } } ";
    script_output_css += " @media screen and (max-width: 500px) { .veneno-card {max-width: calc(100vw - 4rem); } } ";

    script_output_css += "</style>";

    script_output_33 =  '<div class="center free_play_bonus_box_large script-output" id="script_output">';
    if (referrer.length > 0) {
        script_output_33 += '<h1 class="mb0">AutoRoll Status rev. '+script_version+'</h1>';
    } else {
        script_output_33 += '<h1 class="mb0">AutoRoll Status ver. '+script_version+'</h1>';
    }
    script_output_33 += '<div class="cards-wrapper cards-wrapper-2-1">';
    script_output_33 += '<div class="veneno-card">';
    script_output_33 += '<div class="horizontal-grid-wrapper-5">';
    script_output_33 += '<div class="card-button '+Boolean(ROLL)+'"><span class="card-button-top">ROLL</span><span class="card-button-bottom bold">'+Boolean(ROLL)+'</span></div> ';
    script_output_33 += '<div class="card-button '+Boolean(MULTIPLY)+'"><span class="card-button-top">MULTIPLY</span><span class="card-button-bottom bold">'+Boolean(MULTIPLY)+'</span></div> ';
    script_output_33 += '<div class="card-button '+Boolean(BONUS_WOF)+'"><span class="card-button-top">BONUS WOF</span><span class="card-button-bottom bold">'+Boolean(BONUS_WOF)+'</span></div> ';
    script_output_33 += '<div class="card-button '+Boolean(BONUS1000)+'"><span class="card-button-top">BONUS 1000</span><span class="card-button-bottom bold">'+Boolean(BONUS1000)+'</span></div> ';
    script_output_33 += '<div class="card-button '+Boolean(LOTTERY)+'"><span class="card-button-top">LOTTERY</span><span class="card-button-bottom bold">'+Boolean(LOTTERY)+'</span></div> ';
    script_output_33 += '</div>'; // close left first line
    script_output_33 += '<div class="horizontal-grid-wrapper-3 mt1"  style="width: 100%;">';
    script_output_33 += '<div class="single-column">';
    script_output_33 += '   <h4>Wins</h4> ';
    script_output_33 += '   <div class="single-column br">';
    script_output_33 += '       <span>Btc: <span class="lime bold">'+tot_btc_winning_rolling+'</span></span>';
    script_output_33 += '       <span>RP: <span class="lime bold">'+tot_rp_winning_rolling+'</span></span>';
    script_output_33 += '       <span>Lottery: <span class="lime bold">'+tot_lottery_winning_rolling+'</span></span>';
    script_output_33 += '   </div>';
    script_output_33 += '</div>'; // column
    script_output_33 += '<div class="single-column">';
    script_output_33 += '   <h4 class="coral">Spent</h4> ';
    script_output_33 += '   <div class="single-column br">';
    script_output_33 += '       <span>RP Bonus: <span class="coral bold">'+tot_rp_spent_rewards+'</span></span> ';
    script_output_33 += '       <span>RP Captcha: <span class="coral bold">'+tot_rp_spent_captcha+'</span></span> ';
    script_output_33 += '       <span>Btc Lottery: <span class="coral bold">'+tot_lottery_tickets+'</span></span>';
    //script_output_33 += '       <span>&nbsp</span>';
    script_output_33 += '   </div>';
    script_output_33 += '</div>'; // column
    script_output_33 += '<div class="single-column">';
    script_output_33 += '   <h4>Multiply</h4> ';
    script_output_33 += '   <div class="single-column">';
    script_output_33 += '       <span>Balance: <span class="lime bold">'+tot_multiply_balance+'</span></span> ';
    script_output_33 += '       <span>Bets: <span class="lime bold">'+tot_multiply_bets+'</span></span> ';
    script_output_33 += '       <span>Sessions: <span class="lime bold">'+tot_multiply_games+'</span></span> ';
    script_output_33 += '   </div>';
    script_output_33 += '</div>'; // column
    script_output_33 += '</div>'; // close left second line
    script_output_33 += '<div class="ta-c cards-wrapper monospace"  style="width: 100%;">';
    script_output_33 += '   <span>btc: <span id="usdxbtc" class="lime bold"></span> usd</span>';
    script_output_33 += '   <span>usd: <span id="satxusd" class="lime bold"></span> sat</span>';
    script_output_33 += '</div>'; // close left third line
    script_output_33 += '</div>'; // close left
    script_output_33 += '<div class="veneno-card">';
    script_output_33 += ' <div class="single-column pr1 ta-r monospace">';
    script_output_33 += '  <span>Exec: <span class="lime bold"># '+tot_exec+'</span></span> ';
    script_output_33 += '  <span>Ads Closed: <span class="true bold" id="script_output_title_ads_closed_num">0</span></span>';
    script_output_33 += '  <span>Bonus: <span id="script_output_title_bonus_wait_hours" class="true bold">Wait</span></span>';
    script_output_33 += '  <span>Multiply: <span id="script_output_title_multiply_wait_hours" class="true bold">Wait</span></span>';
    script_output_33 += '  <span id="multiply_strategy">Multiply Game System: <span class="true bold">'+STRATEGY+'</span></span>';
    script_output_33 += '  <span>Roll Mode: <span id="script_output_title_msg_mode" class="true bold">Wait</span></span>';
    script_output_33 += '  <span id="script_output_title_msg_roll" class="orange bold mt1">Wait</span>';
    if (Boolean(SHOW_RESET_STATS)) {
        script_output_33 += '  <a id="script_output_reset_all_stats" class="mt1">Reset All Stats</a>';
    }
    script_output_33 += ' </div>';
    script_output_33 += '</div>'; // close right

    script_output_33 += '</div>'; // close cards wrapper
    script_output_33 += '<div class="bottom-card monospace horizontal-grid-wrapper-3 horizontal-grid-wrapper-2-1-1 ">';

    script_output_33 += ' <div class="single-column br-grey">';
    script_output_33 += '  <span>Donations are welcome</span> <span>BTC addr: 3FwAazZDEuy3ER4NQVp4Yqo6kDxCFntwS8 </span>';
    script_output_33 += ' </div>';

    script_output_33 += ' <div class="single-column br-grey ml1">';
    script_output_33 += '  <a href="https://bit.ly/2JsP12I" target="_blank">Config HowTo</a>';
    script_output_33 += '  <a href="https://greasyfork.org/en/scripts/404112-freebitco-in-auto-roll-no-captcha-status-console-advanced-human-behavior-all-bonuses/feedback" target="_blank"> Rate</a>';
    script_output_33 += ' </div>';

    script_output_33 += ' <div class="single-column ta-r" >';
    script_output_33 += '  <span><span class="emoji">© </span>daniele-veneno</span><span>2018 2021</span>';
    script_output_33 += ' </div>';

    script_output_33 += '</div>';
    script_output_33 += '</div>'; // close script_output


    // Write on page
    $('head').append(script_output_css);
    $('#reward_points_bonuses_main_div').prepend(script_output_33);
}

function multiplyPanelInit(){
    let out="";
    // out += "<div class='script-output' style='width:80%; margin: 0 auto; margin-bottom: 1em'>"
    // out += "    <div class='veneno-card' style='margin: 1em; border: none; background: #00000033;'>";
    // out += "        <p>Test your multiply configuration on ";
    // out += "            <a class='coral' target='_blank' href='https://www.bitso.me/hi-lo-calc.php'>Advanced Martingale Calculator</a>";
    // out += "        </p>";
    // out += "    <div>";
    // out += "<div>";
    if (SHOW_TEST_MULT_CONF) $('#double_your_btc').prepend(out);
}

function rewards(after_refresh) {
    if (LOGGING > 4) console.log("%c[RPBonuses] [Debug] Function rewards begin", 'color:grey');
    var bonus_missing_time = {};
    var t = missingTime();
    var d = new Date();
    var min_missing_min = 5;
    var milli_between_bonuses = HOURS_BETWEEN_BUY_BONUS*60*60*1000;

    reward_points = parseInt($('.user_reward_points').text().replace(',',""));

    // Create a RP History
    if (after_refresh) {
        rp_hist_arr.push(reward_points);
        setCookie ("rp_hist_arr", JSON.stringify(rp_hist_arr), 31);
        // Debug for RP history check
        if (LOGGING > 4) console.log("%c[RPBonuses] [Debug] rp_hist: " +rp_hist_arr, 'color:grey');
    }


    if ($("#bonus_container_free_points").length != 0) {
        // Some promo is already active
        bonus_missing_time.text = $('#bonus_span_free_points').text();
        bonus_missing_time.hour = parseInt(bonus_missing_time.text.split(":")[0]);
        bonus_missing_time.min = parseInt(bonus_missing_time.text.split(":")[1]);

        if (LOGGING > 3) console.log("[RPBonuses] Promo RP is %c active %c for "+bonus_missing_time.hour+":"+bonus_missing_time.min, 'color: purple', css_reset);

        setCookie("last_bonus", d.getTime(), 365);
        isBonusActive = true;

        if(Boolean(PROMO_MODE)) $("#script_output_title_msg_mode").text("Promo");
        $('#script_output_title_bonus_wait_hours').text('Active '+bonus_missing_time.hour+'h '+bonus_missing_time.min+"m").addClass('bold');

    } else {
        // No promos active
        var last_bonus_diff = Math.floor(d.getTime() - last_bonus);
        //if (LOGGING > 4) console.log("%c[RPBonuses] [Debug] lastBonus diff: "+last_bonus_diff+" -- last_bonus: "+last_bonus+" -- now: "+d.getTime()+" var setted: "+milli_between_bonuses, 'color:grey');

        //If disabled not buying
        if (! Boolean(BONUS_WOF)) {
            if (LOGGING > 3) console.log('[RPBonuses] Not buying WOF Bonuses. Not Active by config');
            $('#script_output_title_bonus_wait_hours').text('Disabled').removeClass('true').addClass('false');
            return false;
        } // or if missing time not satisfied
        if ( last_bonus_diff < milli_between_bonuses ) {
            var min_between_bonuses = Math.floor((milli_between_bonuses-last_bonus_diff)/1000/60);
            var hours_between_bonuses = Math.floor(min_between_bonuses/60);
            if (LOGGING > 3) console.log('[RPBonuses] Not buying RPBonuses. Wait HOURS_BETWEEN_BUY_BONUS before buy again, missing: '+hours_between_bonuses+'h '+min_between_bonuses%60+'m');
            $('#script_output_title_bonus_wait_hours').text('Wait '+hours_between_bonuses+"h "+min_between_bonuses%60+"m").removeClass('true').addClass('false');
            return false;
        } // or if missing time on roll error
        if (t[0] < 0){
            if (LOGGING > 3) console.log('[RPBonuses] Error getting missing time less then 0, that was'+t[0]+":"+t[1]);
            $('#script_output_title_bonus_wait_hours').text('E0001').removeClass('true').addClass('false');
            return false;
        } // or before missing 10-20 minutes
        if ( t[0] >= min_missing_min ) {
            if (LOGGING > 3) console.log('[RPBonuses] Not buying RPBonuses. Wait '+Math.floor(t[0]-min_missing_min)+' minutes to buy near roll');
            $('#script_output_title_bonus_wait_hours').text('Wait '+Math.floor(t[0]-min_missing_min)+' m');
            return false;
        }

        // Buy WOF Bonus
        $('.rewards_link').not('.hide_menu').click();
        tot_rp_spent_rewards = parseInt(tot_rp_spent_rewards);
        if (LOGGING > 4) console.log("[RPBonuses] Tot rp spent in Bonuses before: "+tot_rp_spent_rewards);
        setTimeout(function() {

            if (reward_points < 900) {
                if (LOGGING > 2) console.log("[RPBonuses] No enough points to buy bonus. Less then 12. Waiting for points in next rolls");
            } else if (reward_points < 1800) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 1 WOF");
                RedeemRPProduct('free_wof_1');
                tot_rp_spent_rewards+=900;
            } else if (reward_points < 2700) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 2 WOF");
                RedeemRPProduct('free_wof_2');
                tot_rp_spent_rewards+=1800;
            } else if (reward_points < 3600) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 3 WOF");
                RedeemRPProduct('free_wof_3');
                tot_rp_spent_rewards+=2700;
            } else if (reward_points < 4500) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 4 WOF");
                RedeemRPProduct('free_wof_4');
                tot_rp_spent_rewards+=3600;
            } else {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 5 WOF");
                RedeemRPProduct('free_wof_5');
                tot_rp_spent_rewards+=4500;
            }

            if (reward_points >= 4800 && Boolean(BONUS1000) ) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 1000% roll - not convenient anymore");
                setTimeout(function(){ RedeemRPProduct('fp_bonus_1000')},random(5000,10000));
                tot_rp_spent_rewards+=3200;
            }

            $("#script_output_title_msg_mode").text("Promo");

            setTimeout(function(){
                setCookie("tot_rp_spent_rewards",tot_rp_spent_rewards,7);
                if (LOGGING > 4) console.log("[RPBonuses] Tot rp spent in Bonuses after: "+tot_rp_spent_rewards);
                $('.free_play_link').not('.hide_menu').click();
            }, random(10000,20000));

        } ,random(2000,16000));
    }
}

function Roll() {
    if (LOGGING > 4) console.log("%c[Roll] [Debug] Function Roll begin", 'color:grey');
    var d = new Date();
    var h = d.getHours();
    var t = missingTime();

    if (!Boolean(ROLL)) {
        $("#script_output_title_msg_mode").text("Disabled").removeClass('true').addClass('false');
        return true;
    }

    rollTryCount++;
    if ($('#free_play_form_button').is(':visible') && ! $('#play_without_captchas_button').is(':visible')) {
        r=random(1,100);
        if ( isNight() && Boolean(NIGHT_MODE) ) {
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
            if (r <= 5)        rand=random(3000,100000);
            else if (r <= 20)   rand=random(300000,1500000);
            else if (r <= 40)   rand=random(60000,2000000);
            else                rand=random(120000,3000000);
            rolling_mode="Slow";
        }

        if (Boolean(isBonusActive) && Boolean(PROMO_MODE) ) { //If promo is active, roll faster
            if (r <= 5)        rand=random(9000,3600000);
            else if (r <= 20)   rand=random(6000,1500000);
            else if (r <= 40)   rand=random(3000,1000000);
            else                rand=random(500,240000);
            rolling_mode="Promo";
        } else if ( isNight() && Boolean(GHOST_MODE)) {
            // console.log("Ghost mode is active, don't free roll in the night");
            $("#script_output_title_msg_mode").text('Ghost');

            var waiting_milli;
            if (stopNight > h) {
                waiting_milli = (stopNight - h + 1)*60*60*1000;
            } else {
                waiting_milli = (stopNight + (24 - h + 1))*60*60*1000;
            }
            if (waiting_milli > 14400000) waiting_milli = random(14400000,16000000);
            rand=random(waiting_milli, (waiting_milli + 3600000));
            //Regresh every 4/6 hours max to update refers

            if (LOGGING > 2) console.log("%c[Roll] Ghost Mode, Refresh page in rand "+rand/1000+" s", 'color: grey');
            setTimeout(function(){
                location.reload();
            }, rand );

            return true;
        }

        if (tot_btc_winning_rolling == 0) {
            rand=random(1000,2000);
            if (LOGGING > 2) console.log('>>>>> First Execution, fast ROLL');
        }
        $("#script_output_title_msg_mode").text(rolling_mode);
        //rand = rand(1000,2000);


        // Real ROLL Function
        rollAndRetrieve(rand);


    } else if ($('#play_without_captchas_button').is(':visible') ){
        if (Boolean(PLAY_WITHOUT_CAPTCHA)) {
            //Try to play without captcha, if enough RP
            if (LOGGING > 2) console.log ("[Roll] Captcha Roll");
            captchaRoll();
        } else {
            return false;
        }
    } else if (rollTryCount >= 10) {
        // refresh page after 10 minutes trying the next case
        location.reload();
    } else if (t[0] <= 0) {
        // Not in the home page window, try again in a bit
        $('#script_output_title_msg_roll').html('<span class="bold">Waiting 1m</span>');
        if (LOGGING > 2) console.log("[Roll] Retry in 1m");
        setTimeout(function(){
            Roll();
        }, 60000 );
    } else {
        $('#script_output_title_msg_roll').html('<span class="bold">Waiting Next Roll</span>');
        //$("#script_output_title_msg_mode").text("Wait");
        if (LOGGING > 2) console.log("[Roll] No roll");
    }
}

function captchaRoll() {
    if (LOGGING > 4) console.log("%c[Roll] [Debug] Function captchaRoll begin", 'color:grey');
    $('#play_without_captchas_button').click();
    setTimeout(function(){
        var cost_rp = $('.play_without_captcha_description span').text();
        if (LOGGING > 2) console.log ("%c[Roll] Try to play without captcha for "+cost_rp+" RP points. You have "+reward_points+" RP.", 'color:purple;');
        if (reward_points >= cost_rp ) {
            // ROLL anyway paying
            if (LOGGING > 2) console.log ("[Roll] Roll with Captcha");
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
            rand = random(500,60000);
            rollAndRetrieve(rand);
            tot_rp_spent_captcha = Math.floor (parseInt(tot_rp_spent_captcha)+parseInt(cost_rp));
            setCookie("tot_rp_spent_captcha", tot_rp_spent_captcha, 7);
        } else {
            if (LOGGING > 2) console.log ("%c[Roll] Not enough RP. No Roll", 'color: red');
            $('#script_output_title_msg_roll').html('<span class="bold false">Miss RP</span>'); // Status on page
        }
    }, random(1000,3000));
}

function rollAndRetrieve (rand) {
    if (LOGGING > 4) console.log("%c[Roll] [Debug] Function rollAndRetrieve begin", 'color:grey');
    var d = new Date();
    var h = d.getHours();
    // Show hour when will roll in status panel
    // new date to modify various time during function
    var d1 = new Date();
    d1.setSeconds(d.getSeconds() + rand/1000);
    var [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat.formatToParts(d1);
    $('#script_output_title_msg_roll').html('<span class="bold">Roll at <span class="false">'+hour+':'+minute+'</span></span>');
    if (LOGGING > 2) console.log('%c[Roll] ---Will roll in '+rand/1000/60+' minutes','color:green');

    setTimeout(function(){
        //Duplicate the visibility chek to avoid error when humans roll and don't refresh.
        if ( $('#free_play_form_button').is(':visible') ){
            $('body').focus();

            //Update Status on page
            $('#script_output_title_msg_roll').html('<span class="true">++ Rolling NOW!</span>'); // Status on page
            if (LOGGING > 2) console.log('%c+++ROLL!','color:purple; font-weight: bold');

            // Execute the roll!!
            setTimeout(function(){ $('#free_play_form_button').click(); }, 500);
            setTimeout(function(){
                // get some errors and log those :(
                if ( $('#free_play_error').html().length > 0 ) {
                    if (LOGGING > 1) console.log("%c[Roll] Some error occurred in Roll: "+$('#free_play_error').html() );
                    return false;
                } else {
                    var win_btc = $('#winnings').text();
                    var win_lottery = $('#fp_lottery_tickets_won').text();
                    var win_rp = $('#fp_reward_points_won').text();
                    executions++;
                }

                // close tedious popup now
                closePopupInterval($('.close-reveal-modal'));

                //Update Status on page
                $('#script_output_title_msg_roll').html('<span class="true">++ Rolled</span>'); // Status on page
                $('#script_output_title_executions_num').text(executions);
                setCookie('executions', executions, 7);
                if (LOGGING > 2) console.log('%c[Roll] Execution number: '+executions,'font-weight:bold; color:green');
                if (LOGGING > 2) console.log('%c[Roll] Got '+win_btc+' btc, '+win_lottery+' tickets and '+win_rp+' RP!','font-weight:bold; color:green');
                if (win_btc > 0) {
                    tot_btc_winning_rolling = parseFloat(parseFloat(tot_btc_winning_rolling) + parseFloat(win_btc)).toFixed(8);
                    setCookie('tot_btc_winning_rolling', tot_btc_winning_rolling, 7);
                    if (LOGGING > 2) console.log('%c[Roll] BTC Won totally with script %c'+tot_btc_winning_rolling,'color: gray', 'font-weight:bold');
                } else {
                    if (LOGGING > 1) console.log('%c[Roll] Some error retrieving Roll Winnings. Winning btc was: '+win_btc, 'color: red');
                }
                if (win_lottery > 0) {
                    tot_lottery_winning_rolling = parseFloat(parseFloat(tot_lottery_winning_rolling) + parseFloat(win_lottery)).toFixed(0);
                    setCookie('tot_lottery_winning_rolling', tot_lottery_winning_rolling, 7);
                    if (LOGGING > 2) console.log('%c[Roll] Tickets Won with script %c'+tot_lottery_winning_rolling,'color: gray', 'font-weight:bold');
                } else {
                    if (LOGGING > 1) console.log('%c[Roll] Some error retrieving Roll Winnings. Winning lottery was: '+win_btc, 'color: red');
                }
                if (win_rp > 0) {
                    tot_rp_winning_rolling = parseFloat(parseFloat(tot_rp_winning_rolling) + parseFloat(win_rp)).toFixed(0);
                    setCookie('tot_rp_winning_rolling', tot_rp_winning_rolling, 7);
                    if (LOGGING > 2) console.log('%c[Roll] RP Won with script %c'+tot_rp_winning_rolling,'color: gray', 'font-weight:bold');
                } else {
                    if (LOGGING > 1) console.log('%c[Roll] Error retrieving Roll Winnings. Winning RP was: '+win_btc, 'color: red');
                }
            }, 6999);
        } else {
            if (LOGGING > 3) console.log('[Roll] Already Rolled maybe by some human..');
            //Update Status on page
            $('#script_output_title_msg_roll').html('<span class="false">Already Rolled</span>'); // Status on page
            setTimeout(function(){ location.reload(); }, 30000);
        }
    },rand);

    //Random Action After ROLL
    var rand1=rand+random(1000,600000);
    rand=random(0,100);

    if (rand > ROLL_P) {
        if (LOGGING > 2) console.log('[Roll] [Debug] Reload page after roll in '+rand1/1000/60+' minutes!');
        setTimeout(function(){ location.reload(); }, rand1);
    } else if (rand <= ROLL_P && Boolean(MULTIPLY) && Boolean(isMultiplyPlayable)) {
        // Show hour when will multiply in status panel
        d1.setSeconds(d.getSeconds() + rand1/1000);
        [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat.formatToParts(d1);
        if (LOGGING > 0) console.log('[Roll] ---Will multiply in '+rand1/1000/60+' minutes!');
        $('#script_output_multiply_status').html('<span class="bold">Multiply at: <span class="false">'+hour+':'+minute+'</span></span>');
        setTimeout(function(){ multiply(true, false); }, rand1);
    } else {
        if (LOGGING > 2) console.log('[Roll] No action after roll. Rand was '+rand);
    }
}

function lottery () {
    //Plan buying lottery ticket
    if(Boolean(LOTTERY)){
        if (LOGGING > 4) console.log("%c[Lottery] [Debug] Function lottery begin", 'color:gray');
        var r = random(1,100);
        var d = new Date();
        var h = d.getHours();
        var satbalance = parseInt($('#balance').text().split(".")[1]);
        var randl = random(1,LOTTERY_MAX_TICKETS).toFixed(0); //Tickets to buy
        if ( isNight() ) return true;
        else if (satbalance <= randl) return true;
        else if (r>= LOTTERY_P) return true;
        if (LOGGING > 2) console.log("[Lottery] Buy %c"+ randl + " lottery tickets %cin some time....", 'color:yellow', 'color:reset');
        setTimeout(function(){
            $('#lottery_tickets_purchase_count').val(randl);
            setTimeout(function(){
                $('#purchase_lottery_tickets_button').click();
                if (LOGGING > 2) console.log("%c[Lottery] Bought "+ randl + " lottery tickets", 'color:yellow');
                tot_lottery_tickets = Math.floor(parseInt(tot_lottery_tickets) + parseInt(randl));
                setCookie('tot_lottery_tickets',tot_lottery_tickets,7);
            }, random(2000,4000));
        }, random(40000,120000));
    }
}

// Multiply, called after the free roll, sometimes.
// ******** MULTIPLY GAME LOGIC START *********
// Pre start and selector
function multiply(after_roll, forced) {
    if (LOGGING > 4) console.log("%c[Multiply] [Debug] Function multiply begin", 'color:grey');
    var d = new Date();
    var h = d.getHours();
    var t = missingTime();
    var max_missing_min = 0;
    var milli_between_multiplies = Math.floor(MULTIPLY_WAIT_HOURS*60*60*1000);
    var balance = parseFloat($('#balance').text()).toFixed(8);
    var bonus_mul = false;
    var last_multiply_diff = Math.floor(d.getTime() - last_multiply);

    if (LOGGING > 4) console.log("%c[Multiply] [Debug] lastMultiply diff: "+last_multiply_diff+" -- last_multiply: "+last_multiply+" -- now: "+d.getTime(), 'color:grey');

    if ($("#bonus_account_table").length != 0) {
        var bonus_mul_balance = $('#bonus_account_balance').text().split(" ")[0];
        var bonus_mul_wager_remaining = $('#bonus_account_wager').text().split(" ")[0];
        if (LOGGING > 2) console.log('%c[Multiply] bonus balance: '+bonus_mul_balance+', wager remaining: '+bonus_mul_wager_remaining, 'color:grey');
        bonus_mul = true;
    } else bonus_mul = false;

    if (!Boolean(MULTIPLY) && !Boolean(forced)) {
        if (LOGGING > 3) console.log('[Multiply] Not playing multiply. Disabled by config');
        $('#script_output_title_multiply_wait_hours').text('Disabled').removeClass('true').addClass('false');
        $('#multiply_strategy').hide();
        return false;
    }
    if ( !Boolean(MULTIPLY_AT_NIGHT) && isNight() && !Boolean(forced)) {
        if (LOGGING > 3) console.log('%c[Multiply] Not playing multiply in the night','color:gray');
        $('#script_output_title_multiply_wait_hours').text('Wait Morning');
        return false;
    }
    if ( balance < MAX_BET && bonus_mul_balance < MAX_BET && !Boolean(forced)) {
        if (LOGGING > 3) console.log('[Multiply] Not enough balance for MAX_BET');
        $('#script_output_title_multiply_wait_hours').text('Adjust MaxBet');
        return false;
    }
    if ( last_multiply_diff < milli_between_multiplies && !Boolean(forced)) {
        var min_between_mult=Math.floor((milli_between_multiplies - last_multiply_diff)/1000/60);
        var hours_between_mult=Math.floor(min_between_mult/60);
        if (LOGGING > 3) console.log('[Multiply]  Not playing multiply. Wait MULTIPLY_WAIT_HOURS before play again, missing '+hours_between_mult+"h "+min_between_mult%60+"m");
        $('#script_output_title_multiply_wait_hours').text('Wait '+hours_between_mult+"h "+min_between_mult%60+"m");
        //$('#ref_multiply_missing_hours').text(Math.ceil((milli_between_multiplies - last_multiply_diff)/1000/60/60));
        $('#script_output_title_multiply_wait_hours').removeClass('true').addClass('false');
        return false;
    }
    if ( t[0] > 0 && t[0] <= max_missing_min && !Boolean(forced)) {
        if (LOGGING > 3) console.log('[Multiply] Not playing multiply. Wait to play not near next roll, missing just %c'+t[0]+' min', 'color:purple');
        $('#script_output_title_multiply_wait_hours').text('Wait '+t[0]+'m');
        return false;
    }
    if (Boolean(isMultiplyRunning)) {
        if (LOGGING > 3) console.log('[Multiply] Not playing multiply. Some other istance already playing');
        return false;
    }
    if (Boolean(after_roll)) {
        if (!Boolean(forced)) $('.double_your_btc_link').not('.hide_menu').click();

        tot_multiply_games = parseInt(tot_multiply_games)+1;
        setCookie("tot_multiply_games", tot_multiply_games, 30);
        setCookie("last_multiply", d.getTime(), 30);
        $('#script_output_multiply_status').html('<span class="bold">Multiply: <span class="true">Running!</span></span>');
        if (LOGGING > 4) console.log(Boolean(after_roll)+", "+balance+", "+bonus_mul_balance+", "+MAX_BET+", "+Boolean(MULTIPLY));

        multiply_manual();
    } else {
        isMultiplyPlayable = true;
        if (LOGGING > 3) console.log('[Multiply] Yes can play multiply '+isMultiplyPlayable);
    }
}

function multiply_manual() {
    var bet_count=0; var bet_remaining=0;
    var past_bet; var bet_amount; var bet_odds; var bet_hilo;
    var winnings=0;
    var won=0;  // won lost or error -1, 1 or 0
    var consecutive_lost=0; var consecutive_win=0;

    var fast_bet=false; var log_msg = ""; var c;
    var multiply_message="";
    var curr_multiply_balance=0; var curr_multiply_wagered = 0;

    var max_consecutive_losts_session=0; var max_consecutive_wins_session=0;
    var max_consecutive_losts_inplay_session=0; var max_bet_session=0;
    var last_session_hist=[];

    var balance = parseFloat($('#balance').text()).toFixed(8);

    // Global vars setting to avoid duplicate games and increments.
    // as error reported bug on play
    game2_consecutive_lost_passed=false; game2_finished_loosing=false;
    game2_play_after_losses=0; game2_step=0;
    forceMultiplyStopHard=false; forceMultiplyStopSoft=false;
    game_play_began=false; game_play_count=0;

    // Multilpy Running
    isMultiplyRunning = true;
    if ( $('#multiply_full_container').length) {
        multiply_message = "<span class='lime'><b>Running!</b></span>";
        $('#multiply_message').html(multiply_message);
    }
    // Activate DOM Monitors

    /// *** NEW VERSION ***
    if (LOGGING > 4) console.log("[Multiply] Activating MutationObserver Monitors, beginning to play");
    const targetNode = document.getElementById('double_your_btc_result');
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function(mutationsList, observer) {
        //if (LOGGING > 4) console.log("%cDom modified.", "color: grey");
        if ( $('#double_your_btc_error').html().length > 0 ) {
            var multiply_error = $('#double_your_btc_error').html();
            console.log('%c[Multiply] Fatal Error in multiply: '+multiply_error, 'color: red');
            //$('#script_output_title_multiply_wait_hours').text('Fatal Error').removeClass(true).addClass('false');
            setCookie('multiply_error', multiply_error, 31);
            multiply_message = "Finish for some error";
            if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
            multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
            return true;
        } else if ( $("#double_your_btc_bet_win").html().length > 0 ) {
            won = 1; c="green"; fast_bet = true;
            winnings = $("#double_your_btc_bet_win").html().split(" ")[6];
            if (winnings > 0) {
                tot_multiply_balance = parseFloat(parseFloat(tot_multiply_balance) + parseFloat(winnings)).toFixed(8);
                curr_multiply_balance = parseFloat(parseFloat(curr_multiply_balance) + parseFloat(winnings)).toFixed(8);
            }
            consecutive_win++;
            consecutive_lost=0;
            if ( $('#multiply_full_container').length) {
                $('#multiply_cons_wins > b').html(consecutive_win).addClass("green-bg");
                setTimeout(function () { $("#multiply_cons_wins > b").removeClass("green-bg"); },500);
            }
        } else if ($("#double_your_btc_bet_lose").html().length > 0 ) {
            won = -1; c = "red";
            winnings = $("#double_your_btc_bet_lose").html().split(" ")[6];
            if (winnings > 0) {
                tot_multiply_balance = parseFloat(parseFloat(tot_multiply_balance) - parseFloat(winnings)).toFixed(8);
                curr_multiply_balance = parseFloat(parseFloat(curr_multiply_balance) - parseFloat(winnings)).toFixed(8);
            }
            consecutive_lost++;
            consecutive_win=0;
            if ( $('#multiply_full_container').length) {
                $('#multiply_cons_losts > b').html(consecutive_lost).addClass("red-bg");
                setTimeout(function () { $("#multiply_cons_losts > b").removeClass("red-bg"); },500);
            }
        } else won = 0;

        if (won != 0) {
            // COOKIES for STATISTICS
            setCookie("tot_multiply_balance", tot_multiply_balance, 7);
            setCookie('curr_multiply_balance',curr_multiply_balance,7);
            var rolled = $('#previous_roll').text();

            last_session_hist.push(Math.round(curr_multiply_balance*100000000));
            setCookie('last_multiply_session_hist',JSON.stringify(last_session_hist),7)

            // Session Cookie
            if (consecutive_lost >= max_consecutive_losts_session) {
                max_consecutive_losts_session=consecutive_lost;
                setCookie('max_consecutive_losts_session', max_consecutive_losts_session, 7);
            }
            if (consecutive_lost >= max_consecutive_losts_inplay_session && bet_amount > MIN_BET) {
                max_consecutive_losts_inplay_session=consecutive_lost;
                setCookie('max_consecutive_losts_inplay_session',max_consecutive_losts_inplay_session,7);
            }
            if (bet_amount >= max_bet_session) {
                max_bet_session=parseFloat(bet_amount).toFixed(8);
                setCookie('max_bet_session',max_bet_session,7);
            }

            // General Cookies
            if (consecutive_lost > max_consecutive_losts_inplay && bet_amount > MIN_BET) {
                max_consecutive_losts_inplay = consecutive_lost;
                setCookie('max_consecutive_losts_inplay',max_consecutive_losts_inplay,7);
            }
            if (consecutive_lost > max_consecutive_losts) {
                max_consecutive_losts=consecutive_lost;
                setCookie('max_consecutive_losts', consecutive_lost, 365);
            }

            if ( rolled != '7777' ){
                jackpot_distance++;
                setCookie('jackpot_distance', jackpot_distance, 31);
            }

            if ( $('#multiply_full_container').length) {
                // Update the values
                $('#multiply_bet_count > b').html(bet_count).addClass("green-bg");
                setTimeout(function () { $("#multiply_bet_count > b").removeClass("green-bg"); },200);
                $('#multiply_play_count > b').html(game_play_count);
                $('#multiply_max_cons_losts > b').html(max_consecutive_losts_session);
                $('#multiply_max_bet > b').html(max_bet_session);
                $('#balance_before > b').html(balance);
                $('#balance_now > b').html(parseFloat($('#balance').text()).toFixed(8));
                $('#multiply_wagered > b').html(curr_multiply_wagered);
                $('#multiply_profit > b').html(curr_multiply_balance);
            }

            // Next bet values getting It return a FLOAT number. Will be converted in bet function.
            bet_amount = get_bet_amount( past_bet, consecutive_lost, consecutive_win);
            bet_hilo = get_bet_hilo(consecutive_lost);
            bet_odds = get_bet_odds();

            if (LOGGING > 2) {
                log_msg =  "Rolled:"+rolled+",%c Won:"+parseFloat(winnings).toFixed(8)+"%c, Played#:"+bet_count;
                log_msg += "/"+MAX_ROLLS_AT_MULTIPLY+"/"+game_play_count+", L/W: "+consecutive_lost+"/"+consecutive_win;
                log_msg += ", CurrBal:"+curr_multiply_balance+", TotBal:"+tot_multiply_balance;
                log_msg += " <Next bet: "+parseFloat(bet_amount).toFixed(8)+"("+game2_step+") on "+bet_hilo+", Fast: "+fast_bet+">";
                console.log(log_msg, css_bold+"color:"+c, css_reset);
            }

            // EXIT CONDITIONS -- Play or finished logic
            if (Boolean(forceMultiplyStopHard)) {
                multiply_message = "Finish for <b>Stop Button</b> pressed";
                if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if ( bet_count >= MAX_ROLLS_AT_MULTIPLY || Boolean(forceMultiplyStopSoft)) {
                if (LOGGING > 2) console.log("%cSoft finish, wait ending this play", css_bold+"color:"+c+", "+css_reset);
                if ( !Boolean(game_play_began) ) {
                    multiply_message = "Finish for <b>Stop Soft</b> or <b>Max Roll</b> passed";
                    if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
                    multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                    return true;
                }
            } else if (game_play_count >= MAX_PLAY && !Boolean(game_play_began)) {
                multiply_message = "Finish for <b>Game Play</b> count passed";
                if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if (bet_amount > MAX_BET) {
                multiply_message = "Finish for <b>bet amount</b> passed max bet";
                if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if (curr_multiply_balance >= MAX_WIN) {
                multiply_message = "Finish for <b>MAX_WIN</b> passed";
                if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if (bet_amount < 0.00000001) {
                multiply_message = "Finish for error in bet amount value";
                if (LOGGING > 2) console.log("%c"+multiply_message, css_bold+"color:"+c);
                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return false;
            }

            curr_multiply_wagered = parseFloat(parseFloat(curr_multiply_wagered) + parseFloat(bet_amount)).toFixed(8);
            tot_multiply_wagered = parseFloat(parseFloat(tot_multiply_wagered) + parseFloat(bet_amount)).toFixed(8);
            setCookie('tot_multiply_wagered',tot_multiply_wagered, 365);
            setCookie('curr_multiply_wagered',curr_multiply_wagered, 30);

            if (past_bet != bet_amount) fast_bet=false;
            else fast_bet=true;

            bet_count++;
            past_bet=bet_amount;

            //Security wait of 30 seconds if speed fast (3) and every 500 collected

            // call the bet
            bet(bet_amount, bet_hilo, bet_odds, fast_bet);
        } else {
            var winlength=$("#double_your_btc_bet_win").html().length;
            var loslength=$("#double_your_btc_bet_lose").html().length;
            var domtree=$('#double_your_btc_result').html();
            multiply_message = "Finish for no value in DOM var";
            if (LOGGING > 1) console.log("%cFinish for no value in won var, was: "+won+", win l: "+winlength+", los l: "+loslength, css_bold+"color:"+c);
            if (LOGGING > 3) console.log("%cFinish for no value in won var, DOM was: "+domtree, css_bold+"color: grey");

            multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
        }
    };
    // Begin the observer
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    // Disable Animation
    $("#disable_animation_checkbox").prop( "checked", true );
    // First bet that cause all the others and Dom modifications
    setTimeout(function(){
        bet_hilo = get_bet_hilo(0);
        bet_amount = get_bet_amount(MIN_BET,0,0);
        bet_odds = get_bet_odds();
        bet_count++; past_bet=bet_amount;
        bet(bet_amount, bet_hilo, bet_odds, false);
    }, random (3500,6500) );
}

function get_bet_amount(past_bet, consecutive_lost, consecutive_win){
    if (STRATEGY == 0) {
        if (consecutive_lost == 0) {
            game_play_began=false;
            return BAS_BET;
        }
        else {
            if (consecutive_lost == 1) {
                game_play_began = true;
                game_play_count++;
                tot_multiply_play++;
                setCookie('tot_multiply_play', tot_multiply_play, 7);
            }
            return past_bet*2;
        }
    } else if (STRATEGY == 1 || WAIT_PLAY_AFTER_LOSSES == 0){
        if (consecutive_lost < MIN_LOSSES_BEFORE_PLAY) {
            if (Boolean(game_play_began)) {
                game_play_began=false;
            }
            return MIN_BET;
        } else if (consecutive_lost == MIN_LOSSES_BEFORE_PLAY){
            game_play_began=true;
            tot_multiply_play++;
            game_play_count++;
            setCookie('tot_multiply_play', tot_multiply_play, 7);
            return BAS_BET;
        } else {
            return past_bet+(past_bet*INCR/100);
        }
    } else if (STRATEGY == 2 || STRATEGY == 3) {
        if (!Boolean(game2_consecutive_lost_passed)) {
            if (Boolean(game_play_began)) game_play_began=false;
            if (consecutive_lost < MIN_LOSSES_BEFORE_PLAY) {
                game2_step=1;
                return MIN_BET;
            } else if (consecutive_lost == MIN_LOSSES_BEFORE_PLAY){
                // passed tot lost, next step -> else
                game2_step=2;
                game2_consecutive_lost_passed = true;
                return MIN_BET;
            } else return "-009";
        } else {
            if (!Boolean(game2_finished_loosing)) {
                if (consecutive_win == 0 ) {
                    game2_step=3;
                    return MIN_BET;
                } else {
                    //finished loosing, first win, next step -> else
                    game2_step=4;
                    game2_finished_loosing=true;
                    game2_play_after_losses++;
                    return get_bet_amount(MIN_BET,consecutive_lost,consecutive_win);
                }
            } else {
                if (!Boolean(game_play_began)){
                    if (game2_play_after_losses < WAIT_PLAY_AFTER_LOSSES) {
                        game2_step=5;
                        game2_play_after_losses++;
                        return MIN_BET;
                    } else if (game2_play_after_losses >= WAIT_PLAY_AFTER_LOSSES){
                        // Begin to play, next step -> else
                        game2_step=6;
                        game_play_began=true;
                        tot_multiply_play++;
                        game_play_count++;
                        setCookie('tot_multiply_play', tot_multiply_play, 7);
                        return BAS_BET;
                    } else return "-008";
                } else {
                    if (consecutive_lost > 0) {
                        game2_step=7;
                        return past_bet+(past_bet*INCR/100);
                    } else {
                        // Playing and won, go back to the begin
                        game_play_began=false;
                        game2_step=0;
                        game2_consecutive_lost_passed=false;
                        game2_finished_loosing=false;
                        game2_play_after_losses=0;

                        if (STRATEGY == 3) {
                            MIN_LOSSES_BEFORE_PLAY++;
                            if (LOGGING > 2) console.log("New MIN_LOSSES_BEFORE_PLAY value is: "+MIN_LOSSES_BEFORE_PLAY);
                        }
                        return MIN_BET;
                    }
                }
            }
        }
    } else return "-010";
}

function get_bet_odds () {
    if (STRATEGY == 0) { return 2; }
    else return ODDS;
}

function get_bet_hilo (index) {
    if (HIGH_LOW == 3 ) {
        var olaer = ['H','L','L','H','H','H','L','L','L','L','H','H','H','H','H','L','L','L','L','L','L','H','H','H','H','H','H','H','L','L','L','L','L','L','L','L'];
        var key = index % olaer.length;
        return olaer[key];
    } else if (HIGH_LOW == 1) {
        return "H";
    } else if (HIGH_LOW == 2) {
        return "L";
    } else {
        var r = random(1,10);
        if (r<5) return 'H';
        else return 'L';
    }
}

function bet(amount, hl, odds, fast) {
    var toclick; var wait_time_1=0; var wait_time_2=0;
    if (hl == "L") toclick = "#double_your_btc_bet_lo_button";
    else toclick = "#double_your_btc_bet_hi_button";
    //if (LOGGING > 4) console.log(">> playing: "+hl+", betting: "+amount.toFixed(8) );
    tot_multiply_bets++;
    setCookie('tot_multiply_bets', tot_multiply_bets, 7);

    if (SPEED == 0) {
        wait_time_1 = random(2000,10000); wait_time_2=random(1000,5000);
    } else if (SPEED == 1) {
        if (Boolean(fast)) { wait_time_1 = random(300,900); wait_time_2=random(100,200); }
        else { wait_time_1 = random(1133,5544); wait_time_2=random(100,1000); }
    } else if (SPEED == 2) {
        wait_time_1 = random(300,1000); wait_time_2=random(100,200);
    } else {
        wait_time_1 = random(10,20); wait_time_2=0;
    }

    setTimeout (function(){
        $("#double_your_btc_stake").val(parseFloat(amount).toFixed(8));
        $("#double_your_btc_payout_multiplier").val(odds);
        setTimeout(function(){ $(toclick).click(); }, wait_time_1 );
    }, wait_time_2 );
}

function multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message) {
    // Finished playing multiply
    // Deactivate DOM Monitors
    observer.disconnect();

    if ( $('#multiply_full_container').length) {
        $('#multiply_message').html(multiply_message);
    }

    multiply_hist_arr.push(tot_multiply_balance);
    setCookie('multiply_hist_arr',JSON.stringify(multiply_hist_arr),14);
    console.log("%cMultiply hist array: "+multiply_hist_arr, 'color:grey');
    if (LOGGING > 2) {
        if (bet_amount > MAX_BET) {
            console.log("%c Max Bet limit passed. Max Bet: "+MAX_BET+", Next Bet: "+bet_amount, 'color: red');
        } else if (bet_count >= MAX_ROLLS_AT_MULTIPLY ) {
            console.log("%c Max Rolls limit passed. Max Rolls: "+MAX_ROLLS_AT_MULTIPLY+", Tot Rolls: "+bet_count+" with "+consecutive_lost+" cons losts", 'color: red');
        } else if (game_play_count >= MAX_PLAY) {
            console.log("%c Max Plays limit passed. Max Plays: "+MAX_PLAY+", Tot Plays: "+game_play_count, 'color: red');
        }
    }
    if (LOGGING > 4) console.log("%c Disabling Monitors, finished multiply", css_bold+'color:green');
    if (LOGGING > 4) console.log("%c Tot Balance: "+tot_multiply_balance+", Tot games: "+tot_multiply_games+", Tot bets: "+tot_multiply_bets, css_bold+'color: green');
    if (LOGGING > 4) console.log("%c Session Balance: "+curr_multiply_balance+", Session tot bets: "+bet_count, css_bold+'color:green');
    $('#script_output_multiply_status').html('<span class="bold">Multiply: <span class="true">Done!</span></span>');
    isMultiplyRunning=false;
    setTimeout(function(){
        isMultiplyRunning = false;
        $('.free_play_link').not('.hide_menu').click();
    }, random(3000,30000));
}

function missingTime () {
    var min = 0; var sec = 0; var str = "";
    str = $('title').text().split(" ")[0];
    //if (LOGGING > 4) console.log("%c[missingTime] [Debug] string: "+str, 'color: grey');
    if (str.length <= 7 && str.length >= 3) {
        min = str.split(':')[0]; if (min.length > 0) min = min.replace('m','');
        sec = str.split(':')[1]; if (sec.length > 0) sec = sec.replace('s','');
    } else if ( $('#free_play_form_button').is(':visible') ) {
        min = 0; sec = 0;
    } else { min = -1; sec = -1; }
    return [min,sec];
}

function isNight(){
    var d = new Date();
    var h = d.getHours();

    if ( stopNight > startNight && h >= startNight && h <= stopNight)  {
        // console.log(h+" -- "+stopNight)
        return true;
    } else if  (stopNight < startNight && h >= startNight || h <= stopNight ) {
        return true;
    }
    else return false;
}

function random(min,max){
   return min + (max - min) * Math.random();
}

function closePopupInterval (target) {
    //if (LOGGING > 4) console.log("%c[Debug] Function closePopupInterval begin", 'color:grey');
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
    //if (LOGGING > 4) console.log("%c[Debug] Function closeRandomPopupInterval begin", 'color:grey');
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

function reset_all_stats(){
    if (LOGGING > 2) console.log("%c Resettnig all stats deleting all cookies", 'color:red');
    setCookie("last_bonus",0,365); setCookie("last_multiply",0,30); setCookie("rp_hist_arr","[]",31); setCookie("tot_multiply_balance",0,7); setCookie("tot_multiply_games",0,30);
    setCookie("tot_rp_spent_captcha",0,7); setCookie("tot_rp_spent_rewards",0,7); setCookie('curr_multiply_balance',0,7); setCookie('curr_multiply_wagered',0,30);
    setCookie('executions',0,7); setCookie('last_multiply_session_hist',0,7); setCookie('max_bet_session',0,7); setCookie('max_consecutive_losts',0,365);
    setCookie('max_consecutive_losts_inplay',0,7); setCookie('max_consecutive_losts_inplay_session',0,7); setCookie('max_consecutive_losts_session',0,7);
    setCookie('multiply_error',0,31); setCookie('multiply_hist_arr',"[]",14); setCookie('tot_btc_winning_rolling',0,7); setCookie('tot_lottery_tickets',0,7);
    setCookie('tot_lottery_winning_rolling',0,7); setCookie('tot_multiply_balance',0,7); setCookie('tot_multiply_bets',0,7); setCookie('tot_multiply_play',0,7);
    setCookie('tot_multiply_wagered',0,365); setCookie('tot_rp_winning_rolling',0,7);
    location.reload();
}

function showStatus(){
    if (LOGGING > 4) console.log("%c[Debug] Function showStatus begin", 'color:grey');
    var t=missingTime();
    var date = new Date();
    var script_output_msg_1 = "";
    var script_output_msg_2 = "";
    var [{ value: month },,{ value: day },,{ value: year },,{ value: hour },,{ value: minute }] = dateTimeFormat.formatToParts(date);

    var ca='red'; var cb='red'; var cc='red'; var css='font-weight: bold; color:';
    var c1='purple'; var c2='olive';
    var c3='brown'; var c4='teal';
    if (LOGGING > 0) console.log(">>>>>>>>>>%c Status:%c ["+hour+":"+minute+"]", css_bold+'color:'+c1, css_bold);
    //Rewards and multiply infos and colors
    if (Boolean(BONUS_WOF)) ca = 'green'; if (Boolean(MULTIPLY)) cb='green'; if (Boolean(LOTTERY)) cc='green';
    var cssa='font-weight: bold; color:'+ca;
    var cssb='font-weight: bold; color:'+cb;
    var cssc='font-weight: bold; color:'+cc;
    if (LOGGING > 0) console.log(">>>>>>>>>> Buying Rewards: "+"%c"+Boolean(BONUS_WOF)+""+"%c; Playing Multiply: "+"%c"+Boolean(MULTIPLY)+""+"%c; Buying Lottery: "+"%c"+Boolean(LOTTERY), cssa, css_reset,cssb, css_reset, cssc);
    if (t[0] > 0 || t[1] > 0) {
        if (LOGGING > 0) console.log(">>>>>>>>>> Missing "+"%c"+t[0]+" min "+t[1]+" sec"+"%c for next roll",css_bold+"color:"+c1,css_reset);
    }

    if (LOGGING > 0) console.log(">>>>>>>>>> BTC won with script: "+"%c"+tot_btc_winning_rolling, css_bold+'color:'+c4);
    if (LOGGING > 0) console.log(">>>>>>>>>> Tickets won with script: "+"%c"+tot_lottery_winning_rolling, css_bold+'color:'+c4);
    if (LOGGING > 0) console.log(">>>>>>>>>> RP won with script: "+"%c"+tot_rp_winning_rolling, css_bold+'color:'+c4);
    if (LOGGING > 0) console.log(">>>>>>>>>> RP Spent with rewards: "+"%c"+tot_rp_spent_rewards, css_bold+'color:'+c1);
    if (LOGGING > 0) console.log(">>>>>>>>>> RP Spent with captcha: "+"%c"+tot_rp_spent_captcha, css_bold+'color:'+c1);
    if (LOGGING > 0) console.log(">>>>>>>>>> Multiply Balance: "+"%c"+tot_multiply_balance, css_bold+'color:'+c3);
    if (LOGGING > 0) console.log(">>>>>>>>>> Multiply Games played: "+"%c"+tot_multiply_games, css_bold+'color:'+c3);
    if (LOGGING > 0) console.log(">>>>>>>>>> Multiply Wagered: "+"%c"+tot_multiply_wagered, css_bold+'color:'+c3);

    // Update Status Message OnPage
    script_output_msg_1 =  "<span class='bold'>Config: </span>";
    script_output_msg_1 += "<span class='"+Boolean(BONUS_WOF)+"'>WOF BONUS </span> <> ";
    script_output_msg_1 += "<span class='"+Boolean(BONUS1000)+"'>BONUS1000</span> <> ";
    script_output_msg_1 += "<span class='"+Boolean(MULTIPLY)+"'>MULTIPLY</span> <> ";
    script_output_msg_1 += "<span class='"+Boolean(LOTTERY)+"'>LOTTERY</span>";
    $('#script_output_msg_1').html(script_output_msg_1);

    script_output_msg_2 = "<span class='bold'> Script Winnings:  </span> ";
    script_output_msg_2 += "<span class='true'>"+tot_btc_winning_rolling+"</span> btc; ";
    script_output_msg_2 += "<span class='true'>"+tot_lottery_winning_rolling+"</span> tickets; ";
    script_output_msg_2 += "<span class='true'>"+tot_rp_winning_rolling+"</span> RP.";
    script_output_msg_2 += "</br>";
    script_output_msg_2 += "<span class='bold'> Script Spent: </span>";
    script_output_msg_2 += "<span class='true'>"+tot_lottery_tickets+"</span> in lottery tickets; ";
    script_output_msg_2 += "<span class='true'>"+tot_rp_spent_rewards+"</span> RP in bonus; ";
    script_output_msg_2 += "<span class='true'>"+tot_rp_spent_captcha+"</span> RP in captcha. ";
    script_output_msg_2 += "</br>";
    script_output_msg_2 += "<span class='bold'> Script Multiply Balance: </span>";
    script_output_msg_2 += "<span class='true'>"+tot_multiply_balance+"</span> btc in ";
    script_output_msg_2 += "<span class='true'>"+tot_multiply_games+"</span> games and ";
    script_output_msg_2 += "<span class='true'>"+tot_multiply_bets+"</span> bets";
    $('#script_output_msg_2').html(script_output_msg_2);


}

function setBtcPrice(){
    //if (LOGGING > 4) console.log("%c[Debug] Function setBtcPrice begin", 'color:grey');
    var btc_price=$('#btc_usd_price').html().split('.')[0].replace('$','').replace(',','');
    var i=1;
    var to=2000;
    if (i>=10) return false;
    else if (isNaN(btc_price)) {
        if (LOGGING > 4) console.log("%c[setBtcPrice] Price NA, try again in "+to*i/1000+" s", 'color:grey');
        setTimeout(function(){ setBtcPrice(); }, to*i );
        i++;
        return true;
    } else {
        $('#usdxbtc').html(btc_price);
        var usd_price=parseFloat(100000000/btc_price).toFixed(0);
        $('#satxusd').html(usd_price);
    }
}