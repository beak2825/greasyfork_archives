    // ==UserScript==
    // @name         Freebitcoin Robo auto Martingale + Prerolls + Freeroll + Rewards + Bonus
    // @version      4.5.36
    // @description  Coleta automática, recompensas automáticas, bônus automático e martingale com prerolls e freeroll
    // @namespace    https://www.rededigital.info
    // @description  Multiplique BTC usando o sistema de martingale com prerolls.
    // @author       rededigital.info
    // @match        https://freebitco.in/*
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/?op=home#
    // @match        https://freebitco.in/
    // @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389457/Freebitcoin%20Robo%20auto%20Martingale%20%2B%20Prerolls%20%2B%20Freeroll%20%2B%20Rewards%20%2B%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/389457/Freebitcoin%20Robo%20auto%20Martingale%20%2B%20Prerolls%20%2B%20Freeroll%20%2B%20Rewards%20%2B%20Bonus.meta.js
    // ==/UserScript==

//Configuracoes
var startValue     = '0.00000000',  //Melhor não mexer neste valor
    baseBet        = '0.00000000',  //A quantia de satoshi apostada após prerolls alcançado
    stopPercentage = 0.001,         //Quando parar de jogar
    MultiPlierBase = 1.511,         //Multiplicador usado após a perda de 2 martingales
    Odds           = 3.00,          //Multiplicador usado padrão
    preRolls       = 9,             //Quantidade minima de jogadas antes de iniciar o sistema de martingale
    safetyRun      = 6,             //Adiciona jogadas extras à configuração prévia  da sessão até que a aposta máxima seja alcançada uma vez
    safetyOverride = 2,             //Minutos antes da atualização para finalizar a segurança
    BTCPrice       = 41613,         //Preço do Bitcoin
    Currency       = '$',           //Moeda para exibir
    ClaimBonus     = '0.00000000',  //Bônus de reivindicação automática quando superior ao valor definido (0 desabilitar)
    LeaveBonus     = '0.00001000',  //Bônus em dinheiro para deixar em conta (acima de 1000 acumula bônus mais rápido))
    HandBrake      = '0.00001600',  //Pare de aumentar quando esse valor for gasto
    LotteryOnWin   = '0.00000001',  //Número de loterias para comprar em cada vitória, melhora o bônus por hora (0 para desativar)
    LotterySession = '0.00000010',  //Número de loteria para comprar todas as sessões, melhora o bônus por hora (0 para desativar)
    stopBefore     = 1,             //Em minutos para o timer antes de parar o redirecionamento na página da web

//!!Os valores abaixo são binários e só podem ser enabled ou disabled em letras minúsculas!!
    AutoLottery    = 'disabled',     //Quando enabled, o jogo comprará a quantia definida de bilhetes de loteria em eventos
    AutoBonus      = 'disabled',    //Quando enabled, o jogo automaticamente pedirá o dinheiro em sua conta de bônus
    AutoFreeroll   = 'enabled',     //Quando enabled, o jogo automaticamente pedirá seu satoshi grátis por hora
    AutoRewards    = 'enabled';     //Quando enabled, o jogo trocará automaticamente seus pontos de recompensa por pontos de recompensa extra e 1000% de btc gratuito

//não mude nada depois desta linha
var maxWait = 777,
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
    var XX_class_input = 'background-color:lightblue; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; height:20px;';
    var XX_class_caption = 'text-align:left; margin-left:10px;';
    var XX_class_value = 'background-color:#DEDEDE; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:#000; height:23px;';
    var XX_class_progress = 'overflow:hidden; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; color:#000; height:23px;';
    var XX_class_title = 'text-decoration:underline;text-align:center; font-weight:bold;';
    var XX_class_widebox = 'padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px;';
    var XX_class_disabletable = 'height:0px; padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px; font-size:10.5px; text-align:center; line-height:20px; visibility: hidden;';
    var XX_class_toggle = 'border:0px; background-color:#DEDEDE; border-radius:5px; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:#000; height:23px;';
    body.prepend(
    $('<div/>').attr('style',"border:2px solid darkblue; padding:5px; border-radius:5px; margin-bottom:10px;margin-left:auto;margin-right:auto;z.index:999;max-width:600px;background-color:#069;color:white; text-align: left;")
    .append(
        $('<div/>').attr('id','autofaucet')
        .append($('<p/>').attr('style','text-decoration:underline;text-align:center;').text("Freebitco.in ROBOT by RonAMXX"))
        .append($('<p/>').attr('style',XX_class_widebox).attr('id','RonAMXX_warning').text("** AVISO! ** Essas configurações serão aplicadas em tempo real na edição, não altere esses valores se você não souber o que está fazendo. Essas configurações serão aplicadas somente durante a duração máxima de uma hora, se você quiser alterá-las permanentemente, ajuste-as no próprio script."))
        .append($('<p/>').attr('style',XX_class_title).text("Configurações"))
        .append($('<p/>').attr('id','RonAMXX_toggle_lottery').text("Auto Loteria"))
        .append($('<p/>').attr('id','RonAMXX_toggle_bonus').text("Auto Bônus"))
        .append($('<p/>').attr('id','RonAMXX_toggle_rewards').text("Auto Rewards"))
        .append($('<p/>').attr('id','RonAMXX_toggle_freeroll').text("Auto Freeroll"))
        .append($('<p/>').attr('style',XX_class_caption + 'height:55px;').text("Processos Automáticos"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_multiplier').attr('value',MultiPlierBase))
        .append($('<p/>').attr('style',XX_class_caption).text("Multiplicador"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_odds').attr('value',Odds))
        .append($('<p/>').attr('style',XX_class_caption).text("Odds"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_prerolls').attr('value',preRolls))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_caption_prerolls').text("Pre rodadas"))
        .append($('<input/>').attr('style',XX_class_toggle).attr('id','RonAMXX_setup_safetyrun').attr('type','range').attr('value',safetyRun).attr('min','0').attr('max',preRolls))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_display_safetyrun').text("Execução segura adciona [" + safetyRun + "] rodadas de pré rodadas até a perda máxima"))
        .append($('<input/>').attr('style',XX_class_toggle).attr('id','RonAMXX_setup_safetyoverride').attr('type','range').attr('value',safetyOverride).attr('min',stopBefore).attr('max','60'))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_display_safetyoverride').text("Execução segura termina [" + safetyOverride + "] minutos antes da atualização"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_basebet').attr('value',baseBet))
        .append($('<p/>').attr('style',XX_class_caption).text("Aposta início"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_handbrake').attr('value',HandBrake))
        .append($('<p/>').attr('style',XX_class_caption).text("Max aposta"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_bonus').attr('value',ClaimBonus))
        .append($('<p/>').attr('style',XX_class_caption).text("Pega bonus"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_lotteryonwin').attr('value',LotteryOnWin))
        .append($('<p/>').attr('style',XX_class_caption).text("Compra ticket loteria se ganha"))
        .append($('<input/>').attr('style',XX_class_input).attr('type','text').attr('id','RonAMXX_setup_lotterysession').attr('value',LotterySession))
        .append($('<p/>').attr('style',XX_class_caption).text("Compra ticket loteria no final de cada sessão"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_max_bets').text(""))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_caption_maxrolls').text("Rodada Segura termina após"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_bet_break').text(""))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_caption_breakbet').text("Max Perda"))
        .append($('<input/>').attr('style',XX_class_toggle).attr('id','RonAMXX_setup_autostop').attr('type','range').attr('value',stopBefore).attr('min','1').attr('max','60'))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_display_autostop').text("Auto Parada " + stopBefore + " minutos depois atualizar"))
        .append($('<input/>').attr('style',XX_class_toggle).attr('id','RonAMXX_setup_playpause').attr('type','button').attr('value','Pause game'))
        .append($('<p/>').attr('style',XX_class_caption).text("Pausa / Roda BOT"))
        .append($('<input/>').attr('style',XX_class_toggle).attr('id','RonAMXX_setup_displaytable').attr('type','button').attr('value','Enable'))
        .append($('<p/>').attr('style',XX_class_caption).text("Exibir tabela de apostas"))
        .append($('<p/>').attr('style',XX_class_disabletable).attr('id','RonAMXX_propagate_lines').text(""))
        .append($('<p/>').attr('style',XX_class_title).text("Seus Saldos"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_total_currency').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Saldo total em moeda"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_total_balance').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Total Saldo"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_main_balance').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Saldo principal"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_bonus_account_balance').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Saldo da conta de bônus"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_bonus_account_wager').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Aposta na conta de bónus"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_bonus_account_builder').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Conta de bônus elegível"))
        .append($('<progress/>').attr('style',XX_class_progress).attr('id','RonAMXX_bonus_account_progress').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',XX_class_caption).text("Progresso da conta bônus"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_reward_points').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Pontos de recompensa"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_lottery_tickets').text("/"))
        .append($('<p/>').attr('style',XX_class_caption).text("Bilhetes de loteria"))
        .append($('<p/>').attr('style',XX_class_disabletable).attr('id','RonAMXX_propagate_lines').text(""))
        .append($('<p/>').attr('style',XX_class_title).text("Aposta atual"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_current_win').text(baseBet))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_current_winlose').text("Ganhos/Perdas"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_current_bet').text(baseBet))
        .append($('<p/>').attr('style',XX_class_caption).text("Sua Aposta"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_current_preroll').text("0/"+preRolls))
        .append($('<p/>').attr('style',XX_class_caption).text("Pré Aposta"))
        .append($('<progress/>').attr('style',XX_class_progress).attr('id','RonAMXX_display_preroll').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',XX_class_caption).text("progresso atual / pré rolos"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_current_action').text("none"))
        .append($('<p/>').attr('style',XX_class_caption).text("Ação"))
        .append($('<p/>').attr('style',XX_class_disabletable).attr('id','RonAMXX_propagate_lines').text(""))
        .append($('<p/>').attr('style',XX_class_title).text("Sessão"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_this_session').text(baseBet))
        .append($('<p/>').attr('style',XX_class_caption).text("Balanço da sessão"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_biggest_bet').text(baseBet))
        .append($('<p/>').attr('style',XX_class_caption).text("Maior aposta"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_biggest_win').text(baseBet))
        .append($('<p/>').attr('style',XX_class_caption).text("Maior vitória"))
        .append($('<p/>').attr('style',XX_class_value).attr('id','RonAMXX_longest_lose').text(0))
        .append($('<p/>').attr('style',XX_class_caption).text("Maior período de derrota"))
        .append($('<progress/>').attr('style',XX_class_progress).attr('id','RonAMXX_display_safety').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_text_safety').text("Maior perda de segurança / perda máxima"))
        .append($('<progress/>').attr('style',XX_class_progress).attr('id','RonAMXX_display_safetyoverrun').attr('max','').attr('value',''))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_text_safetyoverrun').text("Maior perda de segurança / perda máxima"))
        .append($('<progress/>').attr('style',XX_class_progress).attr('id','RonAMXX_session_progress').attr('min','1').attr('max','60').attr('value',''))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_session_display').text("Progresso da sessão"))
        .append($('<p/>').attr('style',XX_class_caption).attr('id','RonAMXX_stop_bet').text(""))
        .append($('<p/>').attr('style',XX_class_widebox).text("Venha se juntar a grande equipe do RonAM registre-se em https://freebitco.in/?r=1993668"))
        .append($('<p/>').attr('style',XX_class_widebox).text("Ou se este script lhe ajudar faça doações, por favor ''1ERcLySzRkXDDttk2Pk2VLCXxD6FW7BLUc''"))
        .append($('<p/>')
                )
        )
)
    .prepend($('<style/>').text("#autofaucet p { margin: 0; margin-left: 2px; text-align: left; }"));
}
    window.onload = function() { setTimeout(function() { startGame();1000})};
function toggleFeatures(toggleId, toggleName, toggleOnOff)
{
    var XX_class_enabled = 'background-color:lightgreen; border-radius:5px; text-align:right; float:right; margin:0; width:110px; font-size:15px; padding:5; margin-right:5px; color:Green; height:50px; text-align:center;';
    var XX_class_disabled = 'background-color:pink; border-radius:5px; text-align:right; float:right; margin:0; width:110px; font-size:15px; padding:5; margin-right:5px; color:red; height:50px; text-align:center;';
    if(toggleOnOff=='enabled')
    {
        $(toggleId).attr('style',XX_class_enabled + '').text(toggleName + ' ' + toggleOnOff);
    }
    else
    {
        $(toggleId).attr('style',XX_class_disabled + '').text(toggleName + ' ' + toggleOnOff);
    }
}
function calculaterounds()
{
    var RoundsBalance = parseFloat($('#balance').text()).toFixed(8);
    var CurrentBalance = parseFloat($('#balance').text()).toFixed(8);
    var CurrentHandbrake = parseFloat($('#RonAMXX_setup_handbrake').val()).toFixed(8);
    var endTableAt= parseInt($('#RonAMXX_max_bets').text());
    var HighestLoss= parseInt($('#RonAMXX_longest_lose').text());
    var SafetyExtend= parseInt($('#RonAMXX_setup_safetyrun').val());
    var SafetyOverride= parseInt($('#RonAMXX_setup_safetyoverride').val());
    var RoundsCurrentRound=preRolls;
    var CurrentMinute = parseInt($('title').text());
    if(SafetyOverride > CurrentMinute)
    {
        SafetyExtend=0;
        RoundsCurrentRound=preRolls;
        $('#RonAMXX_caption_prerolls').text('Pre rolls [' + preRolls + ']');
        $('#RonAMXX_caption_breakbet').text('Max loss [Safety run ended]');
        $('#RonAMXX_bet_break').attr('style','background-color:pink; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:red; height:23px;');
    }
    else
    {
        if(HighestLoss < endTableAt)
        {
            endTableAt=endTableAt+SafetyExtend;
            RoundsCurrentRound=RoundsCurrentRound+SafetyExtend;
            $('#RonAMXX_caption_prerolls').text('Pre rolls [' + RoundsCurrentRound + ']');
            $('#RonAMXX_caption_breakbet').text('Max loss [Safety run active]');
            $('#RonAMXX_bet_break').attr('style','background-color:lightgreen; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:green; height:23px;');
        }
        if(HighestLoss >= endTableAt)
        {
            SafetyExtend=0;
            $('#RonAMXX_caption_prerolls').text('Pre rolls [' + preRolls + ']');
            $('#RonAMXX_caption_breakbet').text('Max loss [Safety run ended]');
            $('#RonAMXX_bet_break').attr('style','background-color:pink; border-radius:5px; text-align:right; float:right; margin:0; margin-right:5px; width:110px; font-size:15px; padding:5; padding-right:10px; color:red; height:23px;');
        }
    }
        $('#RonAMXX_caption_maxrolls').text('End safety run @');
        $('#RonAMXX_bet_break').text(endTableAt);
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
    var multiplytable = parseFloat($('#RonAMXX_setup_multiplier').val()).toFixed(2);
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
        $('#RonAMXX_max_bets').text(RoundsCurrentRound);
        $('#RonAMXX_propagate_lines').text(propagatelines);
        $('#RonAMXX_display_safety').attr('max',RoundsCurrentRound);
}

function AutoClaimBonus()
{
    ClaimBonus = parseFloat($('#RonAMXX_setup_bonus').val()).toFixed(8);
    var DisplayClaimBonus=ClaimBonus*100000000;
    var DisplayLeaveBonus=LeaveBonus*100000000;
    var DisplayBonusTarget=parseInt(DisplayClaimBonus+DisplayLeaveBonus);
    $('#RonAMXX_bonus_account_progress').attr('max',DisplayClaimBonus);
    var bonusbuild=parseFloat($('.dep_bonus_max').text().slice(0, 10)).toFixed(8);
    var Displaybonusbuild=bonusbuild*100000000;
    $('#RonAMXX_bonus_account_progress').val(Displaybonusbuild);
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
    var XX_class_enabletable = 'padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px; font-size:10.5px; text-align:center; line-height:20px; visibility: visible;';
    var XX_class_disabletable = 'height:0px; padding:5px; border-radius:5px; background-color:#DEDEDE; text-align:left; margin:5px; color:#000; font-size:11px; font-size:10.5px; text-align:center; line-height:20px; visibility: hidden;';
    if(toggleTable==("Enable"))
    {
        $('#RonAMXX_setup_displaytable').val("Disable");
        $('#RonAMXX_propagate_lines').attr('style',XX_class_enabletable);
    }
    if(toggleTable==("Disable"))
    {
        $('#RonAMXX_setup_displaytable').val("Enable");
        $('#RonAMXX_propagate_lines').attr('style',XX_class_disabletable);
    }
}
function pauseGame(pauseGame)
{
    if(pauseGame==("Pause game"))
    {
        $('#RonAMXX_setup_playpause').val("Run game");
        stopBeforeRedirect();
    }
    if(pauseGame==("Run game"))
    {
        $('#RonAMXX_setup_playpause').val("Pause game");
        stopped = false;
        startGame();
    }
}

function Rewards()
{
        var reward = parseInt($('.user_reward_points').text().replace(',',""));
        var lotteryTickets = parseInt($('#user_lottery_tickets').text());
        var rewardbonustime = {};
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
        $('#RonAMXX_reward_points').text(reward);
        lotteryTickets=parseInt($('#user_lottery_tickets').text().replace(',',""));
        $('#RonAMXX_lottery_tickets').text(lotteryTickets);

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
    var maxBetStop = parseInt($('#RonAMXX_max_bets').text());
    var safetyOverride = parseInt($('#RonAMXX_setup_safetyoverride').val());
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
    $('#RonAMXX_current_action').text("Start betting");
    }
    if (round > preRolls)
    {
    MultiPlierBaseSet=parseFloat($('#RonAMXX_setup_multiplier').val()).toFixed(2);
    $('#RonAMXX_current_action').text("Increase bet");
    }
    if (round < preRolls)
    {
    $('#double_your_btc_stake').val(startValue);
    MultiPlierBaseSet = 1.00;
    $('#RonAMXX_current_action').text("None");
    }

    $('#RonAMXX_longest_lose').text(maxRolls);
    $('#RonAMXX_current_preroll').text(round + '/' + preRolls);
    $('#RonAMXX_display_preroll').attr('max',preRolls);
    $('#RonAMXX_display_preroll').val(round);
    $('#RonAMXX_display_safety').val(maxRolls);

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
    $('#RonAMXX_bonus_account_balance').text(BonusBalance);
    $('#RonAMXX_bonus_account_wager').text(BonusWager);
    var bonusbalancemath=BonusBalance*100000000;
    var totalbalancemath=BalanceUpdate*100000000;
    var BalanceTotal=bonusbalancemath+totalbalancemath;
    BalanceTotal=(BalanceTotal/100000000).toFixed(8);
    $('#RonAMXX_main_balance').text(BalanceUpdate);
    $('#RonAMXX_total_balance').text(BalanceTotal);
    var BalanceCurrency=parseFloat((BalanceTotal*BTCPrice)).toFixed(2);
    $('#RonAMXX_total_currency').text(Currency + " " + BalanceCurrency);
    Odds=parseFloat($('#RonAMXX_setup_odds').val()).toFixed(2);
    preRolls=parseInt($('#RonAMXX_setup_prerolls').val());
    baseBet=parseFloat($('#RonAMXX_setup_basebet').val()).toFixed(8);
    var bonusbuild=parseFloat($('.dep_bonus_max').text().slice(0, 10)).toFixed(8);
    $('#RonAMXX_bonus_account_builder').text(bonusbuild);
    stopBefore = parseInt($('#RonAMXX_setup_autostop').val());
    $('#RonAMXX_display_autostop').text("Autostop [" + stopBefore + "] minutes before autorefresh");
    safetyRun = parseInt($('#RonAMXX_setup_safetyrun').val());
    $('#RonAMXX_display_safetyrun').text("Safety run adds [" + safetyRun + "] to preroll until safetybar filled");
    safetyOverride = parseInt($('#RonAMXX_setup_safetyoverride').val());
    $('#RonAMXX_display_safetyoverride').text("Safety run ends [" + safetyOverride + "] minutes before autorefresh");
    document.getElementById('RonAMXX_setup_displaytable').onclick=function(){toggleTable($('#RonAMXX_setup_displaytable').val());};
    document.getElementById('RonAMXX_setup_playpause').onclick=function(){pauseGame($('#RonAMXX_setup_playpause').val());};
    var GameTime = 60-stopBefore;
    var GameEnds = 60-CurrentMinute;
    var SafetyEnds=60-safetyOverride;
    $('#RonAMXX_session_progress').attr('value',GameEnds);
    $('#RonAMXX_session_progress').attr('max',GameTime);
    $('#RonAMXX_display_safetyoverrun').attr('value',GameEnds);
    $('#RonAMXX_display_safetyoverrun').attr('max',SafetyEnds);
    var LoterySession = parseFloat($('#RonAMXX_setup_lotterysession').val()).toFixed(8);
    var maxBetStop = parseInt($('#RonAMXX_max_bets').text());
    if (GameEnds >= GameTime)
    {
        $('#RonAMXX_session_display').text('Session ended');
    }
    else
    {
        $('#RonAMXX_session_display').text('Session progress [' + GameEnds + '] / [' + GameTime + '] minutes');
    }
        if (maxRolls >= maxBetStop)
    {
        $('#RonAMXX_text_safety').text('Safety bar filled, safety run ended');
        $('#RonAMXX_text_safetyoverrun').text('Safety bar filled, safety run ended');
    }
    else
    {
        $('#RonAMXX_text_safety').text('Safety bar losing streak [' + maxRolls + '] / [' + maxBetStop + ']');
    }
    if (GameEnds >= SafetyEnds)
    {
        $('#RonAMXX_text_safety').text('Timer ran out Safety run ended');
        $('#RonAMXX_text_safetyoverrun').text('Timer ran out Safety run ended');
    }
    else
    {
        $('#RonAMXX_text_safetyoverrun').text('Safety run progress [' + GameEnds + '] / [' + SafetyEnds + '] minutes');
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
    $('#RonAMXX_this_session').text(sessionDisplay);
    $('#RonAMXX_biggest_bet').text(biggestBet);
    $('#RonAMXX_biggest_win').text(biggestWin);
    $('#RonAMXX_current_winlose').text("Voce Ganhou");
    $('#RonAMXX_current_win').text(stakeMath2);
    $('#RonAMXX_current_preroll').text('Reset');
    var WinLoteryAmount = parseFloat($('#RonAMXX_setup_lotteryonwin').val()).toFixed(8);
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
    $('#RonAMXX_this_session').text(sessionDisplay);
    $('#RonAMXX_biggest_bet').text(biggestBet);
    $('#RonAMXX_current_winlose').text("Voce Perdeu");
    $('#RonAMXX_current_win').text(stakeMath);
}

function multiply()
{
    var PullBrake = $('#RonAMXX_setup_handbrake').val();
    var current = $('#double_your_btc_stake').val();
    var StopBetAt = parseInt($('#RonAMXX_max_bets').text());
    var BreakBet = parseInt($('#RonAMXX_bet_break').text());
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
        $('#RonAMXX_current_bet').text(multiply);
    }
    else
    {
        var stakeMath=$('#double_your_btc_stake').val();
        stakeMath=stakeMath*Odds;
        var stakeMathCalc=stakeMath*100000000;
        sessionBalance = sessionBalance - stakeMathCalc;
        $('#RonAMXX_current_action').text('pulling brake');
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
    var PauseTheGame = $('#RonAMXX_setup_playpause').val();
    if( PauseTheGame  )
    {
        $('#RonAMXX_warning').text("** AVISO! ** Essas configurações serão aplicadas em tempo real na edição. Não altere esses valores se você não souber o que está fazendo. Essas configurações serão aplicadas apenas pela duração máxima de uma hora, se você desejar alterá-las permanentemente, ajuste-as no próprio script.");
    }
    else
    {
        Message();
    }
    reset();

    toggleFeatures('#RonAMXX_toggle_lottery','Auto-Lottery',AutoLottery);
    toggleFeatures('#RonAMXX_toggle_bonus','Auto-Bonus',AutoBonus);
    toggleFeatures('#RonAMXX_toggle_freeroll','Auto-Freeroll',AutoFreeroll);
    toggleFeatures('#RonAMXX_toggle_rewards','Auto-Rewards',AutoRewards);
    if(AutoBonus == 'enabled')
    {
        AutoClaimBonus();
    }
    $('#RonAMXX_setup_autostop').val(stopBeforeReset);
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
    document.getElementById('RonAMXX_setup_playpause').onclick=function(){pauseGame($('#RonAMXX_setup_playpause').val());};
    $('#RonAMXX_setup_playpause').val("Run game");
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
        $('#RonAMXX_warning').text("Approaching redirect! Stopping autoroll so we don't get redirected while loosing.  All applied settings will be reset to safe mode after redirect");
        stopGame();
        return true;
    }
    var PauseTheGame = $('#RonAMXX_setup_playpause').val();
    if( PauseTheGame == "Run game" )
    {
        $('#RonAMXX_warning').text("Pausing game! Finishing autoroll so we don't lose our current bets");
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
startGame();