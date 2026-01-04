// ==UserScript==
// @name         Freebitco.in Full auto Martingale Prerolls Freeroll Rewards GUI 2022 Crypto Generator
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Multiply BTC bot using martingale system with cheap prerolls.
// @author       dinothor
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446095/Freebitcoin%20Full%20auto%20Martingale%20Prerolls%20Freeroll%20Rewards%20GUI%202022%20Crypto%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/446095/Freebitcoin%20Full%20auto%20Martingale%20Prerolls%20Freeroll%20Rewards%20GUI%202022%20Crypto%20Generator.meta.js
// ==/UserScript==
//If you like this script, please signup through the following link https://freebitco.in/?r=11742220
//Or throw a few of satoshi my way "17QLjfMeqnMwaZPKiz6goC2zqRa1MyaEhw"
//This script uses the martingale system and is an improved version of the low balance script by buylistas.com
//It uses a preroll system to hedge bets against the system.  The bot will roll the set amount of prerolls at
//startvalue (0.00000001 btc) and will then start wagering the basebet amount.  Each loss it will increase the
//bet with the multiplierbase (currently set to 2.1) use 2 for martingale system.
//Added features in version 0.2 include autoreward and autofreeroll to make the script full auto
//Added features in version 0.3 include adjustable odds + bugfix win/loss calculator & session earnings
//Added features in version 0.4 include GUI & Bonus, lottery, reward points builder
//Added features in version 0.5 include max loss calculator, betting table, currencyconverter, safety and preroll progressbars
//Added features in version 0.6 include autobuy lottery tickets, handbrake feature
//Added features in version 0.62 include fixed autostop bug, autostop timeslider, run/pause game with autostop
//Change in version 0.62 removed console log entries
//Added feature in version 0.63 safetyrun at the beginning of each session
//Added feature in version 0.64 safetyrun timeout function,  stops safetyrun automatically x amount of minutes before refresh if safetybar isnt filled
//Added features in version 0.71 autoclaim bonus account, enable / disable auto; freeroll, rewards, bonus account, lottery
//Added features in version 0.72 fixed max bet bug
//Modified maxWait to be lower and have 0 for pre-roll to speed up initial ramp up

//settings
var startValue     = '0.00000001',  //Best not to adjust this value
    baseBet        = '0.00000001',  //The amount of satoshi to wager after the prerolls are reached
    stopPercentage = 0.001,         //When to stop gambling
    MultiPlierBase = 1.511,         //The multiplier to use after losing set to 2 for martingale system
    Odds           = 3,          //The odds to play
    preRolls       = 2,             //the amount of rolls at minimum amount before starting martingale system
    safetyRun      = 6,             //adds extra rolls to the preroll setting in the beginning of the session until max bet has been reached once
    safetyOverride = 6,             //in minutes before refresh to end safetyrun even if max losses arent reached
    BTCPrice       = 10000  ,       //Bitcoin price
    Currency       = 'S$',           //Currency to display
    ClaimBonus     = '0.00001000',  //Autoclaim bonus when higher than the set amount(0 to disable)
    LeaveBonus     = '0.00001200',  //Bonus money to leave in account (above 1000 builds bonus faster)
    HandBrake      = '0.00001600',  //Stop increasing when this amount is spent
    LotteryOnWin   = '0.00000001',  //Number of lotterytickets to buy on each win, improves hourly bonus (0 to disable)
    LotterySession = '0.00000010',  //Number of lotterytickets to buy every session,improves hourly bonus (0 to disable)
    stopBefore     = 1,             //In minutes for timer before stopping redirect on webpage
//!!The values below are binary and can only be set to enabled or disabled in lower case letters!!
    AutoLottery    = 'disabled',       //When enabled the game will buy the set amount of lottery tickets on events
    AutoBonus      = 'enabled',       //When enabled the game will automatically claim the money in your bonus account
    AutoFreeroll   = 'enabled',       //When enabled the game will automatically claim your free hourly satoshi
    AutoRewards    = 'disabled';       //When enabled the game will automatically trade your reward points for extra reward points and 1000% free btc

//do not change after this line
var maxWait = 100,
    StartCounter = '0',
    maxRolls=0,
    sessionBalance=0,
    MultiPlierBaseSet = 1.00,
    biggestBet = '0.00000001',
    biggestWin = '0.00000001',
    stopped = false,
    displayList=1;
var stopBeforeReset=stopBefore;
var $loButton = $('#double_your_btc_bet_lo_button'),
    $hiButton = $('#double_your_btc_bet_hi_button');
    Odds=parseFloat(Odds).toFixed(2);
    MultiPlierBase=parseFloat(MultiPlierBase).toFixed(3);
    ClaimBonus=parseFloat(ClaimBonus).toFixed(8);
var round = 0;

function Message()
{
    'use strict';
    var body = $('#reward_points_bonuses_main_div');
    var yy_class_input = 'background-color:lightblue; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; height:20px;';
    var yy_class_caption = 'text-align:left; margin-left:10px;';
    var yy_class_value = 'background-color:#DEDEDE; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:#000; height:23px;';
    var yy_class_progress = 'overflow:hidden; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; color:#000; height:23px;';
    var yy_class_title = 'text-decoration:underline;text-align:center; font-weight:bold;';
    var yy_class_widebox = 'padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px;';
    var yy_class_disabletable = 'height:0px; padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px; font-size:10.5px; text-align:center; line-height:20px; visibility: hidden;';
    var yy_class_toggle = 'border:0px; background-color:#DEDEDE; border-radius:5px; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:#000; height:23px;';
    body.prepend(
    $('<div/>').attr('style',"border:1px solid darkblue; padding:5px; border-radius:5px; margin-bottom:10px;margin-left:auto;margin-right:auto;z.index:999;max-width:600px;background-color:#70814c;color:white; text-align: left;")
    .append(
        $('<div/>').attr('id','autofaucet')
        .append($('<p/>').attr('style','text-decoration:underline;text-align:center;').text("Freebitco.in Full auto WORKING 2022 By dinoTh0r"))
        .append($('<p/>').attr('style',yy_class_widebox + 'background-color:lightyellow; color:orange;').attr('id','yy_warning').text("**WARNING!** These settings will be applied realtime on editing,  do not change these values if you do not know what you are doing. These settings will will be applied only for the duration of maximum one hour,  if you wish to change them permanently adjust them in the script itself."))
        .append($('<p/>').attr('style',yy_class_title).text("Settings"))
        .append($('<p/>').attr('id','yy_toggle_lottery').text("Auto Lottery"))
        .append($('<p/>').attr('id','yy_toggle_bonus').text("Auto Bonus"))
        .append($('<p/>').attr('id','yy_toggle_rewards').text("Auto Rewards"))
        .append($('<p/>').attr('id','yy_toggle_freeroll').text("Auto Freeroll"))
        .append($('<p/>').attr('style',yy_class_caption + 'height:55px;').text("Automated processes"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_multiplier').attr('value',MultiPlierBase))
        .append($('<p/>').attr('style',yy_class_caption).text("Multiplier"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_odds').attr('value',Odds))
        .append($('<p/>').attr('style',yy_class_caption).text("Odds"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_prerolls').attr('value',preRolls))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_caption_prerolls').text("Pre rolls"))
        .append($('<input/>').attr('style',yy_class_toggle).attr('id','yy_setup_safetyrun').attr('type','range').attr('value',safetyRun).attr('min','0').attr('max',preRolls))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_display_safetyrun').text("Safety run adds [" + safetyRun + "] rolls to pre rolls until max loss reached"))
        .append($('<input/>').attr('style',yy_class_toggle).attr('id','yy_setup_safetyoverride').attr('type','range').attr('value',safetyOverride).attr('min',stopBefore).attr('max','60'))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_display_safetyoverride').text("Safety run ends [" + safetyOverride + "] minutes before autorefresh"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_basebet').attr('value',baseBet))
        .append($('<p/>').attr('style',yy_class_caption).text("Start bet"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_handbrake').attr('value',HandBrake))
        .append($('<p/>').attr('style',yy_class_caption).text("Maximum bet"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_bonus').attr('value',ClaimBonus))
        .append($('<p/>').attr('style',yy_class_caption).text("Claim bonus"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_lotteryonwin').attr('value',LotteryOnWin))
        .append($('<p/>').attr('style',yy_class_caption).text("Buy lotery tickets on win"))
        .append($('<input/>').attr('style',yy_class_input).attr('type','text').attr('id','yy_setup_lotterysession').attr('value',LotterySession))
        .append($('<p/>').attr('style',yy_class_caption).text("Buy lotery tickets at end of each session"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_max_bets').text(""))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_caption_maxrolls').text("Safe run ends after"))

        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_bet_break').text(""))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_caption_breakbet').text("Max loss"))

        .append($('<input/>').attr('style',yy_class_toggle).attr('id','yy_setup_autostop').attr('type','range').attr('value',stopBefore).attr('min','1').attr('max','60'))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_display_autostop').text("Autostop " + stopBefore + " minutes before autorefresh"))
        .append($('<input/>').attr('style',yy_class_toggle).attr('id','yy_setup_playpause').attr('type','button').attr('value','Pause game'))
        .append($('<p/>').attr('style',yy_class_caption).text("Pause / run game"))
        .append($('<input/>').attr('style',yy_class_toggle).attr('id','yy_setup_displaytable').attr('type','button').attr('value','Enable'))
        .append($('<p/>').attr('style',yy_class_caption).text("Display betting table"))
        .append($('<p/>').attr('style',yy_class_disabletable).attr('id','yy_propagate_lines').text(""))
        .append($('<p/>').attr('style',yy_class_title).text("Balance"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_total_currency').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Total balance in currency"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_total_balance').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Total balance"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_main_balance').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Main balance"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_bonus_account_balance').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Bonus account balance"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_bonus_account_wager').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Bonus account wager"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_bonus_account_builder').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Bonus account eligable"))
        .append($('<progress/>').attr('style',yy_class_progress).attr('id','yy_bonus_account_progress').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',yy_class_caption).text("Bonus account progress"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_reward_points').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Reward points"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_lottery_tickets').text("/"))
        .append($('<p/>').attr('style',yy_class_caption).text("Lottery tickets"))
        .append($('<p/>').attr('style',yy_class_title).text("Current bet"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_current_win').text(baseBet))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_current_winlose').text("Win/Lose"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_current_bet').text(baseBet))
        .append($('<p/>').attr('style',yy_class_caption).text("You bet"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_current_preroll').text("0/"+preRolls))
        .append($('<p/>').attr('style',yy_class_caption).text("Preroll"))
        .append($('<progress/>').attr('style',yy_class_progress).attr('id','yy_display_preroll').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',yy_class_caption).text("Progress current/prerolls"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_current_action').text("none"))
        .append($('<p/>').attr('style',yy_class_caption).text("Action"))
        .append($('<p/>').attr('style',yy_class_title).text("Session"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_this_session').text(baseBet))
        .append($('<p/>').attr('style',yy_class_caption).text("Session balance"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_biggest_bet').text(baseBet))
        .append($('<p/>').attr('style',yy_class_caption).text("Biggest bet"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_biggest_win').text(baseBet))
        .append($('<p/>').attr('style',yy_class_caption).text("Biggest win"))
        .append($('<p/>').attr('style',yy_class_value).attr('id','yy_longest_lose').text(0))
        .append($('<p/>').attr('style',yy_class_caption).text("Longest losing streak"))
        .append($('<progress/>').attr('style',yy_class_progress).attr('id','yy_display_safety').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_text_safety').text("Safety longest losing streak/max loss"))
        .append($('<progress/>').attr('style',yy_class_progress).attr('id','yy_display_safetyoverrun').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_text_safetyoverrun').text("Safety longest losing streak/max loss"))
        .append($('<progress/>').attr('style',yy_class_progress).attr('id','yy_session_progress').attr('min','1').attr('max','60').attr('value',''))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_session_display').text("Session progress"))
        .append($('<p/>').attr('style',yy_class_caption).attr('id','yy_stop_bet').text(""))
        .append($('<p/>').attr('style',yy_class_widebox).text("If you like this script, please signup through the following link https://freebitco.in/?r=3329532"))
        .append($('<p/>').attr('style',yy_class_widebox).text("Or throw a couple of satoshi my way ''17QLjfMeqnMwaZPKiz6goC2zqRa1MyaEhw''"))
        .append($('<p/>')
                )
        )
)
    .prepend($('<style/>').text("#autofaucet p { margin: 0; margin-left: 2px; text-align: left; }"));
}
function toggleFeatures(toggleId, toggleName, toggleOnOff)
{
    var yy_class_enabled = 'background-color:lightgreen; border-radius:5px; text-align:right; float:right; margin:0; width:110px; font-size:15px; padding:5; margin-right:5px; color:Green; height:50px; text-align:center;';
    var yy_class_disabled = 'background-color:pink; border-radius:5px; text-align:right; float:right; margin:0; width:110px; font-size:15px; padding:5; margin-right:5px; color:red; height:50px; text-align:center;';
    if(toggleOnOff=='enabled')
    {
        $(toggleId).attr('style',yy_class_enabled + '').text(toggleName + ' ' + toggleOnOff);
    }
    else
    {
        $(toggleId).attr('style',yy_class_disabled + '').text(toggleName + ' ' + toggleOnOff);
    }
}
function calculaterounds()
{
    var RoundsBalance = parseFloat($('#balance').text()).toFixed(8);
    var CurrentBalance = parseFloat($('#balance').text()).toFixed(8);
    var CurrentHandbrake = parseFloat($('#yy_setup_handbrake').val()).toFixed(8);
    var endTableAt= parseInt($('#yy_max_bets').text());
    var HighestLoss= parseInt($('#yy_longest_lose').text());
    var SafetyExtend= parseInt($('#yy_setup_safetyrun').val());
    var SafetyOverride= parseInt($('#yy_setup_safetyoverride').val());
    var RoundsCurrentRound=preRolls;
    var CurrentMinute = parseInt($('title').text());
    if(SafetyOverride > CurrentMinute)
    {
        SafetyExtend=0;
        RoundsCurrentRound=preRolls;
        $('#yy_caption_prerolls').text('Pre rolls [' + preRolls + ']');
        $('#yy_caption_breakbet').text('Max loss [Safety run ended]');
        $('#yy_bet_break').attr('style','background-color:pink; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:red; height:23px;');
    }
    else
    {
        if(HighestLoss < endTableAt)
        {
            endTableAt=endTableAt+SafetyExtend;
            RoundsCurrentRound=RoundsCurrentRound+SafetyExtend;
            $('#yy_caption_prerolls').text('Pre rolls [' + RoundsCurrentRound + ']');
            $('#yy_caption_breakbet').text('Max loss [Safety run active]');
            $('#yy_bet_break').attr('style','background-color:lightgreen; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:green; height:23px;');
        }
        if(HighestLoss >= endTableAt)
        {
            SafetyExtend=0;
            $('#yy_caption_prerolls').text('Pre rolls [' + preRolls + ']');
            $('#yy_caption_breakbet').text('Max loss [Safety run ended]');
            $('#yy_bet_break').attr('style','background-color:pink; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:red; height:23px;');
        }
    }
        $('#yy_caption_maxrolls').text('End safety run @');
        $('#yy_bet_break').text(endTableAt);
    RoundsCurrentRound=RoundsCurrentRound-1;
    if(CurrentHandbrake < RoundsBalance)
    {
        RoundsBalance=CurrentHandbrake;
        CurrentBalance=CurrentHandbrake;
    }
    var RoundsCurrentBet=baseBet;
    var RoundsCurrentEarn=0;
    var RoundsCurrentWin=(RoundsCurrentBet*Odds).toFixed(8);
    var propagatelines='';
    var multiplytable = parseFloat($('#yy_setup_multiplier').val()).toFixed(2);
    RoundsCurrentRound=RoundsCurrentRound+1;
    RoundsBalance = (RoundsBalance-RoundsCurrentBet).toFixed(8);
    RoundsCurrentWin=(RoundsCurrentBet*Odds).toFixed(8);
    var RoundsCurrentSpent=(CurrentBalance-RoundsBalance).toFixed(8);
    RoundsCurrentEarn=(RoundsCurrentWin-RoundsCurrentSpent).toFixed(8);
        propagatelines=propagatelines + ' [ROUND=' + RoundsCurrentRound + ']';
        propagatelines=propagatelines + '[BET=' + RoundsCurrentBet + ']';
        propagatelines=propagatelines + '[WIN=' + RoundsCurrentWin + ']';
        propagatelines=propagatelines + '[SPENT=' + RoundsCurrentSpent + ']';
        propagatelines=propagatelines + '[PROFIT=' + RoundsCurrentEarn + ']';
        propagatelines=propagatelines + '[BALANCE=' + RoundsBalance + ']';
    while (RoundsBalance > 0)
    {
            RoundsCurrentRound=RoundsCurrentRound+1;
            RoundsCurrentBet=(RoundsCurrentBet*multiplytable).toFixed(8);
            RoundsBalance = (RoundsBalance-RoundsCurrentBet).toFixed(8);
            RoundsCurrentWin=(RoundsCurrentBet*Odds).toFixed(8);
            RoundsCurrentSpent=(CurrentBalance-RoundsBalance).toFixed(8);
            RoundsCurrentEarn=(RoundsCurrentWin-RoundsCurrentSpent).toFixed(8);
        if(RoundsCurrentRound <= endTableAt)
        {
            propagatelines=propagatelines + ' [ROUND=' + RoundsCurrentRound + ']';
            propagatelines=propagatelines + '[BET=' + RoundsCurrentBet + ']';
            propagatelines=propagatelines + '[WIN=' + RoundsCurrentWin + ']';
            propagatelines=propagatelines + '[SPENT=' + RoundsCurrentSpent + ']';
            propagatelines=propagatelines + '[PROFIT=' + RoundsCurrentEarn + ']';
            propagatelines=propagatelines + '[BALANCE=' + RoundsBalance + ']';
        }
    }
        RoundsCurrentRound=RoundsCurrentRound-1-SafetyExtend;
        $('#yy_max_bets').text(RoundsCurrentRound);
        $('#yy_propagate_lines').text(propagatelines);
        $('#yy_display_safety').attr('max',RoundsCurrentRound);
}
//Revisit this later! reactivate in start()
function AutoClaimBonus()
{
    ClaimBonus = parseFloat($('#yy_setup_bonus').val()).toFixed(8);
    var DisplayClaimBonus=ClaimBonus*100000000;
    var DisplayLeaveBonus=LeaveBonus*100000000;
    var DisplayBonusTarget=parseInt(DisplayClaimBonus+DisplayLeaveBonus);
    $('#yy_bonus_account_progress').attr('max',DisplayClaimBonus);
    var bonusbuild=parseFloat($('.dep_bonus_max').text().slice(0, 10)).toFixed(8);
    var Displaybonusbuild=bonusbuild*100000000;
    $('#yy_bonus_account_progress').val(Displaybonusbuild);
    if(Displaybonusbuild >= DisplayBonusTarget)
    {
        setTimeout(function()
        {
            document.getElementById('claim_bonus_link').click();
        }, random(19000,19500));
        setTimeout(function()
        {
            $('#claim_bonus_amount').val(ClaimBonus);
            document.getElementById('accept_bonus_terms').click();
        }, random(20000,20500));
        setTimeout(function()
        {
            document.getElementById('claim_bonus_button').click();
        }, random(20500,21000));
        setTimeout(function()
        {
             $('.close-reveal-modal')[0].click();
        }, random(21500,22000));
    }
}
function BuyLotteryTickets(BuyTicketAmout)
{
    var WinLoteryPrice = parseFloat($('.lottery_ticket_price').text()).toFixed(8);
    var CalculateTickets = Math.floor(BuyTicketAmout/WinLoteryPrice);
    if(BuyTicketAmout>0)
    {
        $('#lottery_tickets_purchase_count').val(CalculateTickets);
        document.getElementById('purchase_lottery_tickets_button').click();
    }
}
function toggleTable(toggleTable)
{
    var yy_class_enabletable = 'padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px; font-size:10.5px; text-align:center; line-height:20px; visibility: visible;';
    var yy_class_disabletable = 'height:0px; padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px; font-size:10.5px; text-align:center; line-height:20px; visibility: hidden;';
    if(toggleTable==("Enable"))
    {
        $('#yy_setup_displaytable').val("Disable");
        $('#yy_propagate_lines').attr('style',yy_class_enabletable);
    }
    if(toggleTable==("Disable"))
    {
        $('#yy_setup_displaytable').val("Enable");
        $('#yy_propagate_lines').attr('style',yy_class_disabletable);
    }
}
function pauseGame(pauseGame)
{
    if(pauseGame==("Pause game"))
    {
        $('#yy_setup_playpause').val("Run game");
        stopBeforeRedirect();
    }
    if(pauseGame==("Run game"))
    {
        $('#yy_setup_playpause').val("Pause game");
        stopped = false;
        startGame();
    }
}

function Rewards()
{
        var reward = parseInt($('.user_reward_points').text().replace(',',""));
        var lotteryTickets = parseInt($('#user_lottery_tickets').text());
        var rewardbonustime = {};
  			var RedeemRPProduct = unsafeWindow.RedeemRPProduct;
        if ($("#bonus_container_free_points").length != 0)
        {
            rewardbonustime.text = $('#bonus_span_free_points').text();
            rewardbonustime.hour = parseInt(rewardbonustime.text.split(":")[0]);
            rewardbonustime.min = parseInt(rewardbonustime.text.split(":")[1]);
            rewardbonustime.sec = parseInt(rewardbonustime.text.split(":")[2]);
            rewardbonustime.current = rewardbonustime.hour * 3600 + rewardbonustime.min * 60 + rewardbonustime.sec;
        }
        else
            rewardbonustime.current = 0;
        $('#yy_reward_points').text(reward);
        lotteryTickets=parseInt($('#user_lottery_tickets').text().replace(',',""));
        $('#yy_lottery_tickets').text(lotteryTickets);

       if (rewardbonustime.current !== 0) {
        } else {
            if (reward < 12) {
                console.log("waiting for points");
            }
            else if (reward < 120) {
                    console.log("waiting for points 60");
                    RedeemRPProduct('free_points_1');
                }
            else if (reward < 600) {
                    console.log("waiting for points 120");
                    RedeemRPProduct('free_points_10');
                }
            else if (reward < 1200) {
                    console.log("waiting for points 600");
                    RedeemRPProduct('free_points_50');
                }
            else {
                RedeemRPProduct('free_points_100');
            }
            if ($('#bonus_span_fp_bonus').length === 0)
                if (reward >= 4400)
                    RedeemRPProduct('fp_bonus_1000');
        }
}
function AutoRoll()
{
        var timeindicatorfreeplay = parseInt($('#time_remaining').text());
        console.log(timeindicatorfreeplay);
        if(timeindicatorfreeplay > 0)
        {
        }
        else
        {
                $('#free_play_form_button').click();
                console.log("Status: Button ROLL clicked.");
                setTimeout(function()
                {
                    $('.close-reveal-modal')[0].click();
                    console.log("Status: Button CLOSE POPUP clicked.");
                }, random(12000,18000));
       }
}
function random(min,max)
{
   return min + (max - min) * Math.random();
}
function roundnumb()
{
    round = round + 1;
    if (round > maxRolls)
    {
        maxRolls = round;
    }
    var maxBetStop = parseInt($('#yy_max_bets').text());
    var safetyOverride = parseInt($('#yy_setup_safetyoverride').val());
    var CurrentMinute = parseInt($('title').text());
    if(safetyOverride < CurrentMinute)
    {
        if (maxRolls < maxBetStop)
        {
            preRolls=preRolls+safetyRun;
        }
    }
    if (round == preRolls)
    {
    $('#double_your_btc_stake').val(baseBet);
    $('#yy_current_action').text("Start betting");
    }
    if (round > preRolls)
    {
    MultiPlierBaseSet=parseFloat($('#yy_setup_multiplier').val()).toFixed(2);
    $('#yy_current_action').text("Increase bet");
    }
    if (round < preRolls)
    {
    $('#double_your_btc_stake').val(startValue);
    MultiPlierBaseSet = 1.00;
    $('#yy_current_action').text("None");
    }

    $('#yy_longest_lose').text(maxRolls);
    $('#yy_current_preroll').text(round + '/' + preRolls);
    $('#yy_display_preroll').attr('max',preRolls);
    $('#yy_display_preroll').val(round);
    $('#yy_display_safety').val(maxRolls);

    updateGUI();
    calculaterounds();
}
function updateGUI()
{
    var CurrentMinute = parseInt($('title').text());
    var BonusBalance = $('#bonus_account_balance').text().replace('BTC',"");
    BonusBalance = parseFloat($('#bonus_account_balance').text()).toFixed(8);
    var BonusWager = $('#bonus_account_wager').text().replace('BTC',"");
    BonusWager = parseFloat($('#bonus_account_wager').text()).toFixed(8);
    var BalanceUpdate = parseFloat($('#balance').text()).toFixed(8);
    $('#yy_bonus_account_balance').text(BonusBalance);
    $('#yy_bonus_account_wager').text(BonusWager);
    var bonusbalancemath=BonusBalance*100000000;
    var totalbalancemath=BalanceUpdate*100000000;
    var BalanceTotal=bonusbalancemath+totalbalancemath;
    BalanceTotal=(BalanceTotal/100000000).toFixed(8);
    $('#yy_main_balance').text(BalanceUpdate);
    $('#yy_total_balance').text(BalanceTotal);
    var BalanceCurrency=parseFloat((BalanceTotal*BTCPrice)).toFixed(2);
    $('#yy_total_currency').text(Currency + " " + BalanceCurrency);
    Odds=parseFloat($('#yy_setup_odds').val()).toFixed(2);
    preRolls=parseInt($('#yy_setup_prerolls').val());
    baseBet=parseFloat($('#yy_setup_basebet').val()).toFixed(8);
    var bonusbuild=parseFloat($('.dep_bonus_max').text().slice(0, 10)).toFixed(8);
    $('#yy_bonus_account_builder').text(bonusbuild);
    stopBefore = parseInt($('#yy_setup_autostop').val());
    $('#yy_display_autostop').text("Autostop [" + stopBefore + "] minutes before autorefresh");
    safetyRun = parseInt($('#yy_setup_safetyrun').val());
    $('#yy_display_safetyrun').text("Safety run adds [" + safetyRun + "] to preroll until safetybar filled");
    safetyOverride = parseInt($('#yy_setup_safetyoverride').val());
    $('#yy_display_safetyoverride').text("Safety run ends [" + safetyOverride + "] minutes before autorefresh");
    document.getElementById('yy_setup_displaytable').onclick=function(){toggleTable($('#yy_setup_displaytable').val());};
    document.getElementById('yy_setup_playpause').onclick=function(){pauseGame($('#yy_setup_playpause').val());};
    var GameTime = 60-stopBefore;
    var GameEnds = 60-CurrentMinute;
    var SafetyEnds=60-safetyOverride;
    $('#yy_session_progress').attr('value',GameEnds);
    $('#yy_session_progress').attr('max',GameTime);
    $('#yy_display_safetyoverrun').attr('value',GameEnds);
    $('#yy_display_safetyoverrun').attr('max',SafetyEnds);
    var LoterySession = parseFloat($('#yy_setup_lotterysession').val()).toFixed(8);
    var maxBetStop = parseInt($('#yy_max_bets').text());
    if (GameEnds >= GameTime)
    {
        $('#yy_session_display').text('Session ended');
    }
    else
    {
        $('#yy_session_display').text('Session progress [' + GameEnds + '] / [' + GameTime + '] minutes');
    }
        if (maxRolls >= maxBetStop)
    {
        $('#yy_text_safety').text('Safety bar filled, safety run ended');
        $('#yy_text_safetyoverrun').text('Safety bar filled, safety run ended');
    }
    else
    {
        $('#yy_text_safety').text('Safety bar losing streak [' + maxRolls + '] / [' + maxBetStop + ']');
    }
    if (GameEnds >= SafetyEnds)
    {
        $('#yy_text_safety').text('Timer ran out Safety run ended');
        $('#yy_text_safetyoverrun').text('Timer ran out Safety run ended');
    }
    else
    {
        $('#yy_text_safetyoverrun').text('Safety run progress [' + GameEnds + '] / [' + SafetyEnds + '] minutes');
    }
}
function balanceadd()
{
    var stakeMath1=$('#double_your_btc_stake').val();
    var stakeMath2=(stakeMath1*Odds).toFixed(8);
    var stakeMath=parseFloat((stakeMath2 - stakeMath1)).toFixed(8);
    var stakeMathCalc=stakeMath*100000000;
    sessionBalance = sessionBalance + stakeMathCalc;
    sessionBalance=Math.round(sessionBalance);
    var sessionDisplay = (sessionBalance / 100000000).toFixed(8);
    if(stakeMath1 > biggestBet)
    {
        biggestBet = stakeMath1;
    }
    if(stakeMath2 > biggestWin)
    {
        biggestWin = stakeMath2;
    }
    $('#yy_this_session').text(sessionDisplay);
    $('#yy_biggest_bet').text(biggestBet);
    $('#yy_biggest_win').text(biggestWin);
    $('#yy_current_winlose').text("You won");
    $('#yy_current_win').text(stakeMath2);
    $('#yy_current_preroll').text('Reset');
    var WinLoteryAmount = parseFloat($('#yy_setup_lotteryonwin').val()).toFixed(8);
    if(AutoLottery == 'enabled')
    {
        if(stakeMath1 > baseBet)
        {
            BuyLotteryTickets(WinLoteryAmount);
        }
    }
}

function balancesub()
{
    var stakeMath=$('#double_your_btc_stake').val();
    var stakeMathCalc=stakeMath*100000000;
    sessionBalance = sessionBalance - stakeMathCalc;
    sessionBalance=Math.round(sessionBalance);
    var sessionDisplay = (sessionBalance / 100000000).toFixed(8);
    if(stakeMath > biggestBet)
    {
        biggestBet = stakeMath;
    }
    $('#yy_this_session').text(sessionDisplay);
    $('#yy_biggest_bet').text(biggestBet);
    $('#yy_current_winlose').text("You lost");
    $('#yy_current_win').text(stakeMath);
}

function multiply()
{
    var PullBrake = $('#yy_setup_handbrake').val();
    var current = $('#double_your_btc_stake').val();
    var StopBetAt = parseInt($('#yy_max_bets').text());
    var BreakBet = parseInt($('#yy_bet_break').text());
    if(round == BreakBet)
    {
        reset();
    }
    if(current < PullBrake)
    {
        var multiply = parseFloat((current * MultiPlierBaseSet)).toFixed(8);
        $('#double_your_btc_stake').val(multiply);
        MultiPlierBaseSet=parseFloat(MultiPlierBaseSet).toFixed(2);
        var Multiplierinputbox = $('#double_your_btc_payout_multiplier').val();
        $('#yy_current_bet').text(multiply);
    }
    else
    {
        var stakeMath=$('#double_your_btc_stake').val();
        stakeMath=stakeMath*Odds;
        var stakeMathCalc=stakeMath*100000000;
        sessionBalance = sessionBalance - stakeMathCalc;
        $('#yy_current_action').text('pulling brake');
        reset();
    }
}

function getRandomWait()
{
    var wait = Math.floor(Math.random() * maxWait ) + 100;
    return wait ;
}
function startGame()
{
    if(AutoFreeroll == 'enabled')
    {
        AutoRoll();
    }
    stopBefore=stopBeforeReset;
    var PauseTheGame = $('#yy_setup_playpause').val();
    if( PauseTheGame  )
    {
        $('#yy_warning').text("**WARNING!** These settings will be applied realtime on editing,  do not change these values if you do not know what you are doing. These settings will will be applied only for the duration of maximum one hour,  if you wish to change them permanently adjust them in the script itself.");
    }
    else
    {
        Message();
    }
    reset();

    toggleFeatures('#yy_toggle_lottery','Auto-Lottery',AutoLottery);
    toggleFeatures('#yy_toggle_bonus','Auto-Bonus',AutoBonus);
    toggleFeatures('#yy_toggle_freeroll','Auto-Freeroll',AutoFreeroll);
    toggleFeatures('#yy_toggle_rewards','Auto-Rewards',AutoRewards);
    if(AutoBonus == 'enabled')
    {
        AutoClaimBonus();
    }
    $('#yy_setup_autostop').val(stopBeforeReset);
    $loButton.trigger('click');
}
function stopGame()
{
    stopped = true;
    balanceadd();
    if(AutoLottery == 'enabled')
    {
        BuyLotteryTickets(LotterySession);
    }
    document.getElementById('yy_setup_playpause').onclick=function(){pauseGame($('#yy_setup_playpause').val());};
    $('#yy_setup_playpause').val("Run game");
}
function reset()
{
    $('#double_your_btc_stake').val(startValue);
    $('#double_your_btc_payout_multiplier').val(Odds);
    round = 0;
    if(AutoRewards == 'enabled')
    {
        Rewards();
    }
}
function deexponentize(number)
{
    return number * 10000000;
}
function iHaveEnoughMoni()
{
    var balance = deexponentize(parseFloat($('#balance').text()));
    var current = deexponentize($('#double_your_btc_stake').val());
    return ((balance)*2/100) * (current*2) > stopPercentage/100;
}
function stopBeforeRedirect()
{
    var minutes = parseInt($('title').text());
    if( minutes < stopBefore )
    {
        $('#yy_warning').text("Approaching redirect! Stopping autoroll so we don't get redirected while loosing.  All applied settings will be reset to safe mode after redirect");
        stopGame();
        return true;
    }
    var PauseTheGame = $('#yy_setup_playpause').val();
    if( PauseTheGame == "Run game" )
    {
        $('#yy_warning').text("Pausing game! Finishing autoroll so we don't lose our current bets");
        stopGame();
        return true;
    }
    else
    {
    return false;
    }
    return false;
}
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified",function(event){
if( $(event.currentTarget).is(':contains("lose")') )
{
    balancesub();
    roundnumb();
    multiply();
    setTimeout(function(){
    $loButton.trigger('click');
}, getRandomWait());
}
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified",function(event){
if( $(event.currentTarget).is(':contains("win")') )
{
if( stopBeforeRedirect() )
                {
                        return;
                }
if( iHaveEnoughMoni() )
{
balanceadd();
reset();
if( stopped )
{
stopped = false;
return false;
}
}
else
{
balanceadd();
}
setTimeout(function(){
$loButton.trigger('click');
}, getRandomWait());
}
});


(function() {
    'use strict';

    $(document).ready(function() {

			startGame();
    });
})();