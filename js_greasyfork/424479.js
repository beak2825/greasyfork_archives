// ==UserScript==
// @name         Freebitco.in Multiply By Chackman. Abril 2021
// @description  visit https://www.facebook.com/groups/199437058833014 for more script premium level
// @author       chackman
// @match        https://freebitco.in/*
// @grant        none k
// @create       2021-03-27
// @lastmodified 2021-04-11
// @version      3.4
// @compatible   firefox Tested with Tampermonkey
// @compatible   chrome Tested with Tampermonkey
// @namespace
// @license      GPL
// @supportURL
// @homepage
// @home-url
// @home-url2
// @homepageURL  https://greasyfork.org/en/scripts/424479
// @copyright
// @run-at       document-begin
// Se ha añadido una configuración diferente para gasnar mas satochis te en cuenta que tienes que tener 0.001 para para jugar con poco riesgo
// @namespace https://greasyfork.org/users/754790
// @downloadURL https://update.greasyfork.org/scripts/424479/Freebitcoin%20Multiply%20By%20Chackman%20Abril%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/424479/Freebitcoin%20Multiply%20By%20Chackman%20Abril%202021.meta.js
// ==/UserScript==
//donation 3LdEqqK5Jgj8Avc8m1Dvaw3qm6iox4xGi7
// Estrategia de juego
var STRATEGY = 0// [0-3] ---> ..(0) [martingala clásica, odds2 incr100; .. (1) esperar min_losses; .. (2) esperar despues de las perdidas; .. (3) igual que 2, con min_lossess incrementos en cada jugada. Consultar guías.

// Exit Vars. **Primera condición cumplida, la multiplicación se detendrá**
var MAX_ROLLS_AT_MULTIPLY = 130;       //cuántos rollos se multiplican. Jugará de forma segura hasta que gane o alcance maxbet.
var MAX_PLAY =13;                     //Cuántas veces máximo jugará la martingala. Cuánto tiempo se juega BASE_BET.
var MAX_WIN = 0.00050000;            // Obetivo a ganar para cuando ganemos esos satochis
var MAX_BET = 0.00020000;           // MAX BET alcanzo la condicion de  STOP

// Montos de apuestas.
var MIN_BET = 0.00000016; //A partir de la segunda tirada para jugar hasta que no pierdas LOSSES_BEFORE_PLAY veces; Simplemente trabaje en MODE = manual.
var BAS_BET = 0.00000013; // APUESTA BASE cuando comience el JUEGO

//Estrategias Vars. **Cómo jugar**.
var ODDS = 3     //Probabilidades del juego de multiplicar.
var INCR = 5;    //Porcentaje de incremento en caso de pérdida.
var HIGH_LOW = 0; //Puedes decidir cómo jugar; 0 aleatorio, 1 H, 2 L, 3 OLAER;

var MIN_LOSSES_BEFORE_PLAY = 4;  //Cuántas veces jugará MIN_BET y perderá antes de comenzar a jugar bas_bet y doblar; estrategia> = 1
var WAIT_PLAY_AFTER_LOSSES = 1; // solo con STRATEGY=2;
var MULTIPLY = true;

var SPEED = 3; //Velocidad de multiplicar las apuestas en modo manual, 3 rápido, 2 medio, 1 humano, 0 más lento


// intervalo de la noche
var startNight = 22;
var stopNight = 7;
//////////////

// ** Logging
var LOGGING = 5; //0 is no traZA, 5 es debug


// Constantes de sistema //

var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false });

// System Variables //
var reward_points=0;
var ads_closed=0; //number of ads closed, increasing

var rand = 0;
var r = 0;
var rollTryCount=0;
var bandera ='0';



// Multiply global variables
var isMultiplyRunning = false;
var isMultiplyPlayable=false;
var forceMultiplyStopHard=false;
var forceMultiplyStopSoft=false;
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
// END COOKIES //cript_output_33

(function() {

    setTimeout(function(){ showStatus(); }, 1000 );
    setTimeout(function(){ setBtcPrice(); }, 3000 );


    // Update BTC Price every 10s
    setInterval(function(){
        // Update website stats
        UpdateStats();
        setTimeout(function(){ setBtcPrice(); }, 10000 );
    }, 600000);


    setInterval(function(){
        closePopupInterval($('#myModal22 .close-reveal-modal'));
        closePopupInterval($('.pushpad_deny_button'));
    }, 20000 );

    setInterval(function(){
        showStatus();
    }, 1800000);




})();




// ******** MULTIPLY GAME LOGIC START *********
// Pre start and selector


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
            }

            // EXIT CONDITIONS -- Play or finished logic
            if (Boolean(forceMultiplyStopHard)) {
                multiply_message = "Finish for <b>Stop Button</b> pressed";
                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if ( bet_count >= MAX_ROLLS_AT_MULTIPLY || Boolean(forceMultiplyStopSoft)) {

                if ( !Boolean(game_play_began) ) {
                    multiply_message = "Finish for <b>Stop Soft</b> or <b>Max Roll</b> passed";

                    multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                    return true;
                }
            } else if (game_play_count >= MAX_PLAY && !Boolean(game_play_began)) {
                multiply_message = "Finish for <b>Game Play</b> count passed";

                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if (bet_amount > MAX_BET) {
                multiply_message = "Finish for <b>bet amount</b> passed max bet";

                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if (curr_multiply_balance >= MAX_WIN) {
                multiply_message = "Finish for <b>MAX_WIN</b> passed";

                multiplyEndGame(bet_amount, bet_count, consecutive_lost, curr_multiply_balance, observer, multiply_message);
                return true;
            } else if (bet_amount < 0.00000001) {
                multiply_message = "Finish for error in bet amount value";

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


    var cssa='font-weight: bold; color:'+ca;
    var cssb='font-weight: bold; color:'+cb;
    var cssc='font-weight: bold; color:'+cc;


    // Update Status Message OnPage
    script_output_msg_1 =  "<span class='bold'>Config: </span>";

    script_output_msg_1 += "<span class='"+Boolean(MULTIPLY)+"'>MULTIPLY</span> <> ";

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


function delay(){
				var n =1;
				while (n < 8000)
				{
					console.log('..........');
					n++;
				}
			}

function inicia () {

    var fecha = new Date();
    var hora = fecha.getHours();
    var minutos = fecha.getMinutes();
    console.log('hora ' + hora + ' ' + minutos);

   // Multilpy Running

  //lo lanzo 4 veces al dia.cada 6 horas juego
    
    if (hora == '3' && minutos == '1' && bandera == '0' )
	{


	 bandera='1';
	 setTimeout(() => {multiply_manual();}, 60000);
	 bandera='0';

    }

	if (hora == '9' && minutos == '1' && bandera == '0' )
	{


	 bandera='1';
	 setTimeout(() => {multiply_manual();}, 60000);
	 bandera='0';

    }

	if (hora == '15' && minutos == '18' && bandera == '0' )
	{


	 bandera='1';
	 setTimeout(() => {multiply_manual();}, 60000);
	 bandera='0';

    }

	if (hora == '21' && minutos == '01' && bandera == '0' )
	{


	 bandera='1';
	 setTimeout(() => {multiply_manual();}, 60000);
	 bandera='0';

    }


}

    setInterval(function(){inicia();}, 60000);