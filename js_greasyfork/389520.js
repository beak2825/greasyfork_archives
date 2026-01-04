    // ==UserScript==
    // @name         Freebitcoin Robo auto Rewards
    // @version      1.0.1
    // @description  Coleta automática
    // @namespace    https://www.rededigital.info
    // @description  Coleta btc e resgata pontos bonos, btc bonus 
    // @author       rededigital.info
    // @match        https://freebitco.in/*
    // @match        https://freebitco.in/?op=home
    // @match        https://freebitco.in/?op=home#
    // @match        https://freebitco.in/
    // @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/389520/Freebitcoin%20Robo%20auto%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/389520/Freebitcoin%20Robo%20auto%20Rewards.meta.js
    // ==/UserScript==


//!!Os valores abaixo são binários e só podem ser enabled ou disabled em letras minúsculas!!
var
    AutoFreeroll   = 'enabled',     //Quando enabled, o jogo automaticamente pedirá seu satoshi grátis por hora
    AutoRewards    = 'enabled';     //Quando enabled, o jogo trocará automaticamente seus pontos de recompensa por pontos de recompensa extra e 1000% de btc gratuito

//não mude nada depois desta linha
    window.onload = function() { setTimeout(function() { start();1000})};

function Rewards()
{
        var reward = parseInt($('.user_reward_points').text().replace(',',""));
        var lotteryTickets = parseInt($('#user_lottery_tickets').text());
        var rewardbonustime = {};
        if ($("#bonus_container_free_points").length !== 0)
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

    start();

    toggleFeatures('#RonAMXX_toggle_freeroll','Auto-Freeroll',AutoFreeroll);
    toggleFeatures('#RonAMXX_toggle_rewards','Auto-Rewards',AutoRewards);

function start()
{
    if(AutoRewards == 'enabled')
    {
        Rewards();
    }
	    if(AutoFreeroll == 'enabled')
    {
        AutoRoll();
    }
}