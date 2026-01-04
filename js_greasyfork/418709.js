// ==UserScript==
// @name         CoinPot - Auto Multiplier/Lottery (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Faz os desafios de rolls diarios, usa os tickets de loteria, notifica no Telegram
// @author       Jadson Tavares
// @match        *://coinpot.co/dashboard*
// @match        *://coinpot.co/lottery*
// @match        *://coinpot.co/multiplier*
// @match        *://coinpot.co/challenges*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418709/CoinPot%20-%20Auto%20MultiplierLottery%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/418709/CoinPot%20-%20Auto%20MultiplierLottery%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////////////////* CONFIGURA��ES DO SCRIPT */////////////////////////
    var config = {
        auto_start: true,         // true = verdadeiro / false = falso
        challenge: 30000,         // valor da meta di�ria de rolls
        verificar_challenge:10,   // tempo em minutos para verificar o challenge
        toggleHiLo: true          // true = verdadeiro / false = falso
    }
    //////////////////////////////////////////////////////////////////////////////

    /////////////////////* CONFIGURA��O NOTIFICA��O TELEGRAM *////////////////////
    var bot_telegram = {
        token: "", // token do bot
        chat_id: "", // id do seu chat
        message:""
    }
    //////////////////////////////////////////////////////////////////////////////

    function ntb(msg){
        $.ajax({
            url:'https://api.telegram.org/bot'+bot_telegram.token+'/sendMessage',
            method:'POST',
            data:{
                chat_id: bot_telegram.chat_id,
                text: msg
            },
            success:function(){
                console.log(msg);
            }
        });
    }

    function getSearchParams(k){
        var p={};
        location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
        return k?p[k]:p;
    }

    var hilo = 1;
    function toggleHiLo() {
        if (hilo === '2') {
            hilo = '1';
        } else {
            hilo = '2';
        }
    }

    $(document).ready(function(){
        if(config.auto_start) {
            setInterval(function(){
                var d = new Date();
                var getHour = d.getHours() * (1000*60*60) + d.getMinutes() * (1000*60) + d.getSeconds() * (1000);
                if(getHour == 75780000) {
                    window.location.href = "/dashboard";
                }
            },1000);
        }

        if (window.location.href.indexOf("dashboard") > -1) {
            if(config.auto_start){
                setTimeout(function(){
                    var t_balance = $('#DashboardPanel > div:nth-child(1) > div:nth-child(1) > div > h3:nth-child(4)');
                    if(t_balance.is(':visible')){
                        if (window.location.href.indexOf("startBalance") < 0) {
                            t_balance = t_balance.text().substr(0,$('#DashboardPanel > div:nth-child(1) > div:nth-child(1) > div > h3:nth-child(4)').text().indexOf('t')-1);
                            window.location.href = "/challenges?startBalance="+t_balance;
                        } else {
                            if (window.location.href.indexOf("rolls") > -1) {
                                bot_telegram.message = "CoinPot.co\n- Email: "+$('#PageContent_AccountEmail').text()+"\n- Sucesso: "+config.challenge+" rolls completado!\n- Balan�a inicial: "+getSearchParams('startBalance')+" tokens\n- Balan�a final: "+t_balance.text()+"\n- Rolls: "+getSearchParams('rolls')+"\n- Stakeds: "+getSearchParams('stakeds')+"\n- Tickets: "+getSearchParams('tickets');
                                ntb(bot_telegram.message);
                            }
                        }
                    }
                },10000);
            }
        }

        if (window.location.href.indexOf("challenges") > -1) {
            setTimeout(function(){
                if (window.location.href.indexOf("startBalance") < 0) {
                    window.location.href = "/dashboard";
                } else {
                    var challenge;
                    if(config.challenge == 1000) {
                        challenge = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(77) > div:nth-child(1) > div.col.col-lg-3 > div > div.progress-bar.bg-success');
                    } else if(config.challenge == 3000) {
                        challenge = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(77) > div:nth-child(2) > div.col.col-lg-3 > div > div.progress-bar.bg-success');
                    } else if(config.challenge == 10000) {
                        challenge = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(77) > div:nth-child(3) > div.col.col-lg-3 > div > div.progress-bar.bg-success');
                    } else if(config.challenge == 30000) {
                        challenge = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(77) > div:nth-child(4) > div.col.col-lg-3 > div > div.progress-bar.bg-success');
                    } else if(config.challenge == 100000) {
                        challenge = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(77) > div:nth-child(5) > div.col.col-lg-3 > div > div.progress-bar.bg-success');
                    }

                    if(challenge.is(':visible')){
                        var roll = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(74) > div > span').text();
                        var strRoll = roll.indexOf('made')+5;
                        var roll2 = roll.substr(strRoll);
                        var strRoll2 = roll2.indexOf('multiplier')-1;
                        var rolls = roll2.substr(0,strRoll2);

                        var staked = $('#ChallengesPanel > div > div.col-lg-8 > div > div:nth-child(3) > div:nth-child(81) > div > span').text();
                        var strStaked = staked.indexOf('staked')+7;
                        var staked2 = staked.substr(strStaked);
                        var strStaked2 = staked2.indexOf('tokens')-1;
                        var stakeds = staked2.substr(0,strStaked2);

                        window.location.href = "/lottery?startBalance="+getSearchParams('startBalance')+"&rolls="+rolls+"&stakeds="+stakeds;
                    } else {
                        window.location.href = "/multiplier?startBalance="+getSearchParams('startBalance');
                    }
                }
            },10000);
        }

        if (window.location.href.indexOf("multiplier") > -1) {
            if (window.location.href.indexOf("startBalance") < 0) {
                window.location.href = "/dashboard";
            } else {
                var stakeButton = document.querySelector("#StakeButtons > div > button:nth-child(2)");
                var stopButton = document.querySelector("#OptionsButtons > div > button.btn.btn-danger.btn-outline");

                setInterval(function(){
                    stakeButton.click();
                    if(config.toggleHiLo)toggleHiLo();
                    document.querySelector("#SettingsPanel > div:nth-child(1) > div > label:nth-child("+hilo+")").click();
                },100);
                setInterval(function(){
                    stopButton.click();
                },10000);
                setInterval(function(){
                    window.location.href = "/challenges?startBalance="+getSearchParams('startBalance');
                },config.verificar_challenge*1000*60);
            }
        }

        if (window.location.href.indexOf("lottery") > -1) {
            setTimeout(function(){
                if(parseInt($('#PageContent_FreeLotteryTickets').text()) > 0) {
                    lotterySummaryVM.useFreeTickets($('#PageContent_FreeLotteryTickets').text());
                    window.location.href = "/dashboard?startBalance="+getSearchParams('startBalance')+"&rolls="+getSearchParams('rolls')+"&stakeds="+getSearchParams('stakeds')+"&tickets="+$('#PageContent_FreeLotteryTickets').text();
                } else {
                    window.location.href = "/dashboard?startBalance="+getSearchParams('startBalance')+"&rolls="+getSearchParams('rolls')+"&stakeds="+getSearchParams('stakeds')+"&tickets="+$('#PageContent_FreeLotteryTickets').text();
                }
            },10000);
        }
    });
})();