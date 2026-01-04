// ==UserScript==
// @name         RobitRaclamoBonus 1.1x
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://freebitco.in/?op=home
// @match        https://freebitco.in/?op=home#
// @match        https://freebitco.in/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373657/RobitRaclamoBonus%2011x.user.js
// @updateURL https://update.greasyfork.org/scripts/373657/RobitRaclamoBonus%2011x.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var totalPuntos;
    var horaPuntos;
    var tiempoPuntos;
    var IntervaloHoraPuntos;
    var IntervaloHoraBTC;
    var TimeOutHoraPuntos;
    var TimeOutHoraBTC;

    //var minutosTitulo = $('title').text();
    //alert (minutosTitulo);

    function tomaHoraPuntos()
    {
        //hora bonus puntos id: #bonus_span_free_points
        //alert ("tiempo Puntos visible");
        tiempoPuntos =$("#bonus_span_free_points").html();
        horaPuntos=tiempoPuntos.split(":");

        var mostrarH=parseInt(horaPuntos[0].substr(0,horaPuntos[0].length));
        var mostrarM=parseInt(horaPuntos[1].substr(0,horaPuntos[1].length));
        var mostrarS=parseInt(horaPuntos[2].substr(0,horaPuntos[2].length));

        if (isNaN(mostrarH) || isNaN(mostrarM) || isNaN(mostrarS)) {mostrarH=0; mostrarM=0; mostrarS=0;}

        if (mostrarH>0) {/*alert("hora mayor a cero No reclamar todavia");*/ }
        else
        {
            if (mostrarM>0) {/*alert("Minuto mayor a cero No reclamar todavia");*/ }
            else
            {
                if (mostrarS>0)
                {
                    //alert("Segundo mayor a cero No reclamar todavia pero ya mismo en:" + mostrarS);
                    clearInterval(IntervaloHoraPuntos);
                    TimeOutHoraPuntos = setTimeout(reclamarPuntos,((mostrarS+5)*1000));
                }
                else
                {
                    clearInterval(IntervaloHoraPuntos);
                    reclamarPuntos();
                }
            }
        }
    }

    function tomaHoraBTC()
    {
        //Hora Free btc bonus id: #bonus_span_fp_bonus
        //alert ("tiempo BTC visible");
        tiempoPuntos =$("#bonus_span_fp_bonus").html();
        horaPuntos=tiempoPuntos.split(":");

        var mostrarH=parseInt(horaPuntos[0].substr(0,2));
        var mostrarM=parseInt(horaPuntos[1].substr(0,2));
        var mostrarS=parseInt(horaPuntos[2].substr(0,2));

        if (isNaN(mostrarH) || isNaN(mostrarM) || isNaN(mostrarS)) {mostrarH=0; mostrarM=0; mostrarS=0;}

        if (mostrarH>0) {/*alert("hora mayor a cero No reclamar todavia");*/ }
        else
        {
            if (mostrarM>0) {/*alert("Minuto mayor a cero No reclamar todavia");*/ }
            else
            {
                if (mostrarS>0)
                {
                    //alert("Segundo mayor a cero No reclamar todavia pero ya mismo en:" + mostrarS);
                    clearInterval(IntervaloHoraBTC);
                    TimeOutHoraBTC = setTimeout(reclamarBTC,((mostrarS+5)*1000));
                }
                else
                {
                    clearInterval(IntervaloHoraBTC);
                    reclamarBTC();
                }
            }
        }
    }
    //Total de puntos clase: .user_reward_points

    //reclamo de 100 Reward pints (1,200 RP) onclick: RedeemRPProduct('free_points_100')
    //reclamo de  50 Reward pints (  600 RP) onclick: RedeemRPProduct('free_points_50')
    //reclamo de  25 Reward pints (  300 RP) onclick: RedeemRPProduct('free_points_25')
    //reclamo de  10 Reward pints (  120 RP) onclick: RedeemRPProduct('free_points_10')
    //reclamo de   1 Reward pints (   12 RP) onclick: RedeemRPProduct('free_points_1')
    function reclamarPuntos()
    {
        var totalPuntosComa = $(".user_reward_points").html();
        totalPuntos = parseInt(totalPuntosComa.replace(",",""));

        if (totalPuntos>=1200) {RedeemRPProduct('free_points_100');}
        else
        {
            if (totalPuntos>=600) {RedeemRPProduct('free_points_50');}
            else
            {
                if (totalPuntos>=300) {RedeemRPProduct('free_points_25');}
                else
                {
                    if (totalPuntos>=120) {RedeemRPProduct('free_points_10');}
                    else
                    {
                        if (totalPuntos>=12) {RedeemRPProduct('free_points_1');}
                        else
                        {
                            alert ("No tiene saldo para bonus puntos");
                        }
                    }
                }
            }
        }
    }

    function reclamarBTC()
    {
        var totalPuntosComa = $(".user_reward_points").html();
        totalPuntos = parseInt(totalPuntosComa.replace(",",""));

        if (totalPuntos>=3200) {RedeemRPProduct('fp_bonus_1000');}
        else
        {
            if (totalPuntos>=1600) {RedeemRPProduct('fp_bonus_500');}
            else
            {
                if (totalPuntos>=320)  {RedeemRPProduct('fp_bonus_100');}
                else
                {
                    if (totalPuntos>=160)  {RedeemRPProduct('fp_bonus_50');}
                    else
                    {
                        if (totalPuntos>=32)   {RedeemRPProduct('fp_bonus_10');}
                        else
                        {
                            alert ("No tiene mas saldo para bonus BTC");
                        }
                    }
                }
            }
        }
    }

    IntervaloHoraPuntos = setInterval(tomaHoraPuntos,3000);
    IntervaloHoraBTC = setInterval(tomaHoraBTC,3000);

})();
