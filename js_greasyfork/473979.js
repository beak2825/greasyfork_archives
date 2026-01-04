// ==UserScript==
    // @name         laz_autoroll_frebitcoin
    // @namespace    http://tampermonkey.net/
    // @version      0.9.08
    // @description  try to take over the world! https://greasyfork.org/es/scripts/473979-laz-autoroll-frebitcoin
    // @author       LuisAguilarZevallos
    // @match        https://freebitco.in/?op=home*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473979/laz_autoroll_frebitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/473979/laz_autoroll_frebitcoin.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        var nodo_contador = '';
        var min_restantes = 0;
        //var sec_restantes = 0;
        var btc_fun_token = 0.0;
        var btc_balance = 0.0;
        var last_btc_roll = 0.0;
        var id_btc_total = 0;
        var id_fun_total = 0;
        var id_valor_btc = 0;
        var id_valor_fun_venta = 0;
        var id_last_roll_time = 0;
        var id_user_rp = 0;
        var id_rp_ganados = 0;
        var id_btc_ganados = 0;
        var id_fun_ganados = 0;
        var id_rolls_execs = 0;
        var id_modoRoll = 0;
        var id_next_roll_time = 0;
        var id_wof_roll = 0;
        var id_wof_rp = 0;
        var id_wof_btc = 0;
        var id_last_btc_roll = 0;
        var id_last_rpx5fun_time = 0;
        var id_bt_make_fun = 0;

        var id_bt_multi_btc = 0; //almacena el id del boton multi_btc
        var canje_rp_x_btc = 'false'; //indica si se a programado un canje antes del Roll
        var rp_x_multibtc = 500; //almacena los rps necesarios para canjear la promo
        // ver 0.9.0
        var store_rp_bear_market = 0;
        var id_rp_no_usable = 0;
        var id_rp_usable = 0;
        /////
        //var multibtc_activate = false;
        var id_rp_x_mutibtc = 0; //almacena el id del campo donde se muestra los rps necesarios para el canje de la promo

        var btc_price = 0.0;

        var user_rp = 0;

        var panel_html = '';

        var next_roll_time = 0;
        var hora_en_milis = 3600000;
        var retardo_calc = 0;
        var inicioNoche = 0;
        var finNoche = 6;
        var modeNoche = false;
        var modeFinSemanaNoche = false;
        var bonoRPactivo = false;
        var rpx5fun_value = 0;
        var canje_rp_x_fun = 'false'; //variable q define si se ha programado un canje
        var enable_rp_x_fun = false;
        var msj_rpxfun = ''; //mensaje a mostrar junto con los rps necesarios para adquirir 5FUN por Roll
        const script_version = GM_info.script.version;

        var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false });

        //  COOKIES  //
        var tot_exec = +getCookie("ejecuciones");
        var tot_btc_ganados_rolleando = parseFloat(getCookie('tot_btc_ganados_rolleando')).toFixed(8);
        var tot_rp_ganados_rolleando = +getCookie('tot_rp_ganados_rolleando');
        var tot_fun_ganados_rolleando = +getCookie('tot_fun_ganados_rolleando');
        var last_roll_time = +getCookie('last_roll_time');
        var wof_roll = +getCookie('wof_roll');
        var wof_rp = +getCookie('wof_rp');
        var wof_btc = +getCookie('wof_btc');
        var last_rpx5fun_time = +getCookie('last_rpx5fun_time');
        var rpx5fun = +getCookie('rpx5fun');
        // ver 0.9.0
        var enable_store_rp_bm = +getCookie('enable_store_rp_bm');
        /////
        canje_rp_x_fun = getCookie('rpx5fun_activate');
        canje_rp_x_btc = getCookie('rpxbtc_activate');
        rp_x_multibtc = getCookie('rp_x_multibtc');

        console.log('rpx5fun: ' + rpx5fun);
        //console.log('1)typeof:rpx5fun_activate: ' + typeof(canje_rp_x_fun));
        console.log('1)rpx5fun_activate: ' + canje_rp_x_fun);
        if (! (tot_exec > 0)) tot_exec = 0;
        if (! (tot_btc_ganados_rolleando > 0)) tot_btc_ganados_rolleando = 0.0;
        if (! (tot_rp_ganados_rolleando > 0)) tot_rp_ganados_rolleando = 0;
        if (! (tot_fun_ganados_rolleando > 0)) tot_fun_ganados_rolleando = 0;
        if (! (last_roll_time > 0)) last_roll_time = 0;
        if (! (wof_roll > 0)) wof_roll = 0;
        if (! (wof_rp > 0)) wof_rp = 0;
        if (! (wof_btc > 0)) wof_btc = 0;
        if (! (last_rpx5fun_time > 0)) last_rpx5fun_time = 0;
        if (! (rpx5fun > 0)) rpx5fun = 0;
        if (! (canje_rp_x_fun == 'true')) canje_rp_x_fun = 'false';
        if (! (rp_x_multibtc > 0)) rp_x_multibtc = 0;
        // ver 0.9.0
        if (! (enable_store_rp_bm > 0)) enable_store_rp_bm = 1;
        console.log('enable_store_rp_bm: ' + enable_store_rp_bm);
        //
        console.log('timestamp rpx5fun: ' + last_rpx5fun_time);
        console.log('2)rpx5fun_activate: ' + canje_rp_x_fun);

        console.log('1) btc_cookie: ' + tot_btc_ganados_rolleando);
        // Your code here...
        var navegador = 'PC';

        if((/Android/i).test(navigator.userAgent)) {
            navegador = 'Android';
        }

        $(document).ready(function(){
            console.log('pagina cargada');
            console.log('insertamos containers');

            panel_html += '<div><h1 style="font-size:large;" align="center">version: <span>' + script_version + '</span> '+ navegador + '</h1></div>';
            panel_html += `<div align="center" id="bt_make_fun" style="display:none;"><p><button class="new_button_style profile_page_button_style free_play_result_success center" style="width:150px; margin:auto; margin-top:10px;"
                            >make fun</button></p></div>`;
            panel_html += `<div align="center" id="bt_multi_btc" style="display:none;"><p><button class="new_button_style profile_page_button_style free_play_result_success center" style="width:150px; margin:auto; margin-top:10px;"
                           >multi btc..`+ getDateWeek()**2 + '</button></p></div>';
            // ver 0.9.0
            panel_html += `<div><h1 style="font-size:large;" align="center"><span id="store_rp_bear_market">store_rp_en
                         ` + enable_store_rp_bm + '</span> - RP NO USABLE: <span id="rp_no_usable">___</span> - RP USABLE: <span id="rp_usable">___</span></h1></div>';
            //
            panel_html += '<div><h1 style="font-size:large;" align="center"><i class="fa fa-btc" aria-hidden="true"></i><span id="btc_total_mio">0.00000001</span> - FUN: <span id="fun_total_mio">2500</span> - RPx5FUN: <span id="rp_x_5fun">___</span>- RPx1000%btc: <span id="rp_x_multibtc">___</span></h1></div>';
            panel_html += '<div><h1 style="font-size:large;" align="center">valor btc: <span id="valor_btc_actual">$ 30</span> - precio FUN: <span id="valor_fun_venta">0.00000015</span></h1></div>';
            panel_html += '<div><h1 style="font-size:large;" align="center">ult roll: <span id="last_roll_time">18:39</span></h1></div>';
            panel_html += '<div><h1 style="font-size:large;" align="center">ult btc ganado: <span id="last_btc_roll">0.0</span></h1></div>';
            panel_html += '<div><h1 style="font-size:large;" id="modoRoll" align="center">Noche</h1></div>';
            panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">rp: <span id="rp_stats">0</span></h1></div>';
            panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">rp ganados: <span id="rp_ganados">0</span></h1></div>';
            panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">btc ganados: <span id="btc_ganados">0</span></h1></div>';
            panel_html += '<div id="div_fun_ganados" style="display:none;"><h1 style="font-size: large;color:limegreen;" align="center">fun ganados: <span id="fun_ganados"></span></h1></div>'; // fun token
            panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">roll ejecutados: <span id="rolls_execs">0</span></h1></div>';
            panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">roll a: <span id="next_roll_time">0</span></h1></div>';
            // panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">wof: <span id="wof_roll">0</span></h1></div>';
            // panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">wof rp: <span id="wof_rp">0</span></h1></div>';
            // panel_html += '<div><h1 style="font-size: large;color:crimson;" align="center">wof sts: <span id="wof_btc">0</span></h1></div>';
            panel_html += '';
            panel_html += '<div align="center"><p><button id="reset_stats_autoroll" class="new_button_style profile_page_button_style free_play_result_success center" style="width:150px; margin:auto; margin-top:10px;">reset cookies</button></p></div>';


            //$('#deposit_withdraw_container').append(panel_html);
            document.querySelector('#deposit_withdraw_container').insertAdjacentHTML('afterend',panel_html);
            document.querySelector('#reset_stats_autoroll').onclick = reset_stat_autoroll;
            document.querySelector('#bt_make_fun').onclick = start_make_fun;
            document.querySelector('#bt_multi_btc').onclick = start_multi_btc;

            getIdsPanel();
            // ver 0.9.0
            store_rp_bear_market = getDateWeek()**2;
            //
            refreshPanel();
            console.log(getDateTime(new Date()));
            // Cerrar modals
            //closePopupInterval($('.close-reveal-modal'));
            setInterval(function(){
                closePopupInterval($('.close-reveal-modal'));
                closePopupInterval($('.pushpad_deny_button'));
            }, 20000 );

            setTimeout(function(){
                console.log('spins');
                if(navegador == 'PC'){
                    //runSpins();
                }
            }, 10000);
            bonoRPactivo = detectPromos();

            if ($('#free_play_form_button').is(':visible')) {
                //$('#free_play_form_button').trigger('click');
                calcRetardoRoll(0);
                //let retardo = random(1000,120000);
                //console.log(getDateTime(new Date()) + ': Primer Roll en ' + retardo/1000 + ' segundo(s)');
                //setTimeout( Roll(), retardo);
                //retardo_calc = calcRetardoRoll(retardo);
                //if (retardo_calc > 0){
                //    console.log(getDateTime(new Date()) + ': Roll en ' + retardo_calc/1000 + ' segundo(s)');
               //     Roll(retardo_calc);
               // }else{ //sino se puede programar un Roll, se programa una recarga de pagina entre 30 min (aprox) a 50 min aprox
                //    console.log('Roll en ' + retardo_calc/1000 + ' segundo(s)');
                //    console.log(getDateTime(new Date()) + ': No Roll por ahora, programamos recarga de pagina');
                //    setTimeout(function(){ location.reload(); }, random(1700000,2950000));
                //}

            }else{
                console.log('no visible boton de Roll');
                console.log('averiguamos si MULTIPLICITY BUTTON esta activo');
                if ($(':button.free_play_result_success').is(':visible')){
                    console.log('MULTIPLICITY BUTTON esta activo');
                    console.log('revisamos si el contador esta activo');
                    nodo_contador = document.querySelectorAll("#time_remaining .countdown_amount");
                    if (nodo_contador.length === 2) {
                        console.log('contador esta activo');
                        min_restantes = +nodo_contador[0].innerText;
                        //si contador esta en 0 min recargamos la pagina para q aparezca el boton de roll
                        if (min_restantes == 0) {
                            setTimeout(function(){ location.reload(); }, random(6000,10000));
                        }else{//sino programamos un roll teniendo en cuenta los min q quedan
                            calcRetardoRoll(min_restantes * 60 * 1000);


                        }
                    }
                }
            }
        });

        function calcRetardoRoll(milisec_restantes) {
            var d = new Date();
            var h = d.getHours();
            var doW = d.getDay();
            var r=random(1,100);
            console.log('r: ' + r);
            var retardo = 0;
            var divisorBono = 1;

            if (bonoRPactivo) divisorBono = 3;

            if (h >= inicioNoche && h < finNoche){
                modeNoche = true;
            }else{
                modeNoche = false;
            }
            //S-D
            modeFinSemanaNoche = false;
            if (doW === 6 || doW === 0){
                if (!modeNoche || bonoRPactivo){
                    //retardo = random(3000,(900000/divisorBono));
                    if (r < 85) retardo = random(2400,(300000/divisorBono));//2.4s-5min
                    if (r > 84) retardo = random(300000,(1800000/divisorBono));//5min-30min
                    if (r > 95) retardo = random(7200000,(14400000/divisorBono));//2h-4h
                }else{
                    modeFinSemanaNoche = true;
                    //sino se puede programar un Roll, se programa una recarga de pagina entre 30 min (aprox) a 50 min aprox
                    console.log(getDateTime(new Date()) + ': No Roll por ahora, fds programamos recarga de pagina');
                    setTimeout(function(){ location.reload(); }, random(1700000,2950000));
                    return;
                }
            //L-V
            }else{
                if (modeNoche){
                    if (r < 70) retardo = random(90000,(900000/divisorBono));//1.30m-15min
                    if (r > 69) retardo = random(600000,(1800000/divisorBono));//10min-30min
                    if (r > 95) retardo = random(7200000,(14400000/divisorBono));//2h-4h
                }else{//dia
                    if (r < 80) retardo = random(3000,(300000/divisorBono));//3s-5min
                    if (r > 79) retardo = random(300000,(900000/divisorBono));//5min-15min
                }
            }
            console.log('retardo asignado: ' + milisec_restantes/60000 + 'm en milis: ' + milisec_restantes );
            retardo = milisec_restantes + retardo;
            console.log('retardo total: ' + retardo );
            var d1 = new Date();
            d1.setSeconds(d.getSeconds() + retardo/1000);
            var [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat.formatToParts(d1);
            next_roll_time = hour + ':' + minute;
            refreshPanel();
            console.log(getDateTime(new Date()) + ': Roll en ' + retardo/1000 + ' segundo(s)');
            setTimeout(function(){ Roll(); }, retardo);
        }

        function Roll(){
            if ($('#free_play_form_button').is(':visible')) {
                // si hay canje programado, realizamos el canje primero
                //console.log('Roll)typeof:rpx5fun_activate: ' + typeof(canje_rp_x_fun));
                if ( canje_rp_x_fun == 'true'){
                    RedeemRPProduct('fun_token_5');
                    //desactivamos el canje
                    console.log('Ejecutamos RedeemRPProduct');
                    canje_rp_x_fun = 'false';
                    //console.log('Roll_2)typeof:rpx5fun_activate: ' + typeof(canje_rp_x_fun));
                    setCookie('rpx5fun_activate', canje_rp_x_fun,365);
                    setTimeout(function(){
                        var msj_respuesta_redeem = document.querySelector('.reward_point_redeem_result_box').innerText;
                        id_last_rpx5fun_time.innerText = id_last_rpx5fun_time.innerText.split(';')[0] + ';' + msj_respuesta_redeem;
                        console.log('respuesta Redeem: ' + msj_respuesta_redeem);
                    },500);
                }
                if ( canje_rp_x_btc == 'true'){
                    RedeemRPProduct('fp_bonus_1000');
                    // ver 0.9.0
                    // cada vez q canjeamos rp por bono btc, habilitamos el almacenamiento de rps para mercados bajista
                    enable_store_rp_bm = 1;
                    setCookie('enable_store_rp_bm', enable_store_rp_bm,365);
                    console.log('desactivar enable_store_rp_bm (debe ser 1):' + +getCookie('enable_store_rp_bm'));
                    /////
                    //desactivamos el canje
                    console.log('Ejecutamos RedeemRPProduct 1000btc');
                    canje_rp_x_btc = 'false';
                    //console.log('Roll_2)typeof:rpx5fun_activate: ' + typeof(canje_rp_x_fun));
                    setCookie('rpxbtc_activate', canje_rp_x_btc,365);
                    setTimeout(function(){
                        var msj_respuesta_redeem = document.querySelector('.reward_point_redeem_result_box').innerText;
                        //id_last_rpx5fun_time.innerText = id_last_rpx5fun_time.innerText.split(';')[0] + ';' + msj_respuesta_redeem;
                        console.log('respuesta Redeem: ' + msj_respuesta_redeem);
                    },500);
                }else{
                    if(bonoRPactivo){
                        console.log('bonoRPactivo es true, no consultamos promociones por mientras');
                    }else{
                        console.log('bonoRPactivo es false, no hay promociones activas, consultamos rps necesarios para activar promos');
                        //ejecutamos el request general para todos las promos rps
                        var data_peticion = myAjaxRequestBTC(makeUrlFunRequest());
                    }
                    
                }
                var texta = document.getElementsByTagName('input')[2].outerHTML;
                console.log('captcha: insertamos valor de inout[2]');
                document.querySelector('#free_play_form_button').insertAdjacentText('afterend','<p>' + texta + '</p>');
                setTimeout(function(){
                    $('#free_play_form_button').click();
                    console.log(getDateTime(new Date()) + ': Roll ejecutado');
                }, 1000);
                console.log('captcha: ' + document.getElementsByTagName('input')[2].outerHTML);
                //damos 7 segundos para buscar errores en el primer intento de Roll
                setTimeout(function(){ //7 segundos
                    if (document.querySelector('#free_play_error').innerText.length > 0) {
                        console.log(getDateTime(new Date()) + ': Errores en el Roll: ' + document.querySelector('#free_play_error').innerText);
                        //como hay errores, intentamos uns segundo roll por si es un tema de darle mas tiempo al captcha
                        console.log('2do Roll: por si es un tema de capcha lento');
                        document.querySelector('#free_play_form_button').insertAdjacentText('afterend','<p>' + '2do Roll' + '</p>');
                        setTimeout(function(){
                            $('#free_play_form_button').click();
                            console.log(getDateTime(new Date()) + ': 2do Roll ejecutado');
                        }, 1000);

                        //esperamos 7 segundos para darle tiempo al Roll a q se detenga
                        setTimeout(function(){ //7 segundos
                            document.querySelector('#free_play_form_button').insertAdjacentText('afterend','<p>' + 'Consultamos por erores' + '</p>');
                            if (document.querySelector('#free_play_error').innerText.length > 0) {
                                console.log(getDateTime(new Date()) + ': Errores en el  2do Roll: ' + document.querySelector('#free_play_error').innerText);
                                //como siguen los errores, programaremos un reinicio
                                setTimeout(function(){ location.reload(); }, 3000);
                            } else {
                                console.log(getDateTime(new Date()) + ':Sin errores en el 2do Roll');
                                document.querySelector('#free_play_form_button').insertAdjacentText('afterend','<p>' + 'Sin errores en el 2do Roll' + '</p>');
                                //confirmaremos el Roll con los winnings
                                if (document.querySelector('#winnings').innerText.length > 0) {
                                    //confirmado, 2do Roll exitoso
                                    tot_exec += 1;
                                    last_roll_time = getDateTime(new Date());
                                    setCookie('ejecuciones',tot_exec, 365);
                                    getResultRoll();
                                }else {
                                    //sino reload
                                    setTimeout(function(){ location.reload(); }, 3000);
                                }//if winninga
                            }// if 2da verificacion

                        }, 7000);


                        //if(document.getElementsByTagName('input')[2].value.length > 700){
                //    setTimeout(function(){ $('#free_play_form_button').click(); }, 300);
                //}else{
                //    setTimeout(function(){
                 //       if(document.getElementsByTagName('input')[2].value.length > 700) {
                  //          setTimeout(function(){ $('#free_play_form_button').click(); }, 300);
                   //     }
                //
                 //   }, 1000);
                //}
                    }else{
                        console.log(getDateTime(new Date()) + ':Sin errores en el 1er Roll');
                        document.querySelector('#free_play_form_button').insertAdjacentText('afterend','<p>' + 'Sin errores en el 1er Roll' + '</p>');
                        tot_exec += 1;
                        last_roll_time = getDateTime(new Date());
                        setCookie('ejecuciones',tot_exec, 365);
                        getResultRoll();
                    }
                    // programamos el siguiente Roll
                    calcRetardoRoll(hora_en_milis);
                }, 7000);

                closePopupInterval($('.close-reveal-modal'));
            }else{
                console.log(getDateTime(new Date()) + ': Parece ya ha sido roleado manualmente');
                setTimeout(function(){ location.reload(); }, 30000);
            }
        }

        function reset_stat_autoroll() {
            console.log('reseteando estadisticas...');
            tot_exec = 0; setCookie('ejecuciones',tot_exec,7);
            tot_btc_ganados_rolleando= 0.0; setCookie('tot_btc_ganados_rolleando',tot_btc_ganados_rolleando,7);
            tot_rp_ganados_rolleando = 0; setCookie('tot_rp_ganados_rolleando',tot_rp_ganados_rolleando,7);
            last_roll_time = 0; setCookie('last_roll_time',last_roll_time,7);
            wof_roll = 0; setCookie('wof_roll',wof_roll,7);
            wof_rp = 0; setCookie('wof_rp',wof_rp,7);
            wof_btc = 0; setCookie('wof_btc',wof_btc,7);
            // ver 0.9.0
            // desactivamos el almacenamiento de rps para mercados bajistas
            enable_store_rp_bm = 0;
            setCookie('enable_store_rp_bm', enable_store_rp_bm,365);
            /////
            refreshPanel();
        }


        function refreshPanel(){
            setTimeout(function(){
                //valor de fun tokens stakeados en btc
                //btc_fun_token = +document.querySelectorAll('#user_fun_stats .lottery_winner_table_first_last_cell')[1].innerText;
                //sumando variable propias de freebitcoin
                btc_fun_token = 0;
                //id_fun_total.innerText = user_locked_fun_balance + user_unlocked_fun_balance; // o tambien se puede usar user_fun_balance
                console.log(btc_fun_token);
                //btc actual en el balance
                btc_balance = +document.querySelector('#balance').innerText;
                id_btc_total.innerText = (btc_balance + btc_fun_token).toFixed(8);
                btc_price = +document.querySelector('#btc_usd_price').innerText.split('.')[0].replace('$','').replace(',','');

                console.log(btc_price);
                id_valor_btc.innerText = '$' + (parseFloat((btc_fun_token + btc_balance).toFixed(8)) * btc_price).toFixed(2);
                id_valor_fun_venta.innerText = fun_sell_price_btc;

                user_rp = document.querySelector('.user_reward_points').innerText;
                id_user_rp.innerText = user_rp;

                id_rp_ganados.innerText = tot_rp_ganados_rolleando;

                id_last_roll_time.innerText = last_roll_time;
                id_btc_ganados.innerText = tot_btc_ganados_rolleando;
                id_fun_ganados.innerText = tot_fun_ganados_rolleando;
                id_rolls_execs.innerText = tot_exec;
                id_next_roll_time.innerText = next_roll_time;
                //id_wof_roll.innerText = +getCookie('wof_roll');
                //id_wof_rp.innerText = +getCookie('wof_rp');
                //id_wof_btc.innerText = +getCookie('wof_btc');
                id_last_btc_roll.innerText = last_btc_roll;

                if (modeNoche) {
                    id_modoRoll.innerText = 'Noche';
                    if (modeFinSemanaNoche) id_modoRoll.innerText = 'Descanso';
                }else{
                    id_modoRoll.innerText = 'Dia';
                }

                if ( bonoRPactivo ){
                    id_modoRoll.innerText += ' promo';
                    console.log('aceleracion activa')
                }
                if (rp_promo_active == 1 ){
                    id_modoRoll.innerText += ' rp';
                    console.log('promo rp activa')
                }

                if (document.querySelector('#bonus_container_fp_bonus')){
                    //<div class="bold center free_play_bonus_box_large" id="bonus_container_fp_bonus"><p>Active bonus <span class="free_play_bonus_box_span_large">1000% FREE BTC bonus</span> ends in <span class="free_play_bonus_box_span_large" id="bonus_span_fp_bonus">10h:12m:33s</span></p><script>$(document).ready(function() {BonusEndCountdown("fp_bonus",37166)});</script> </div>
                    // si promo fun token esta activa, visualizamos lod FUN ganados
                    //document.querySelector('#div_fun_ganados').style.display = "block";
                    id_modoRoll.innerText += ' multi_btc';
                    console.log('promo multi_btc activa')
                }
                if (document.querySelector('#bonus_container_fun_token')){
                    // si promo fun token esta activa, visualizamos lod FUN ganados
                    document.querySelector('#div_fun_ganados').style.display = "block";
                    id_modoRoll.innerText += ' fun';
                    console.log('promo fun activa')
                }

                //consultamos los rps necesarios para pedir la promo de 5 fun_token
                if( boolIsTimeGetRpx5Fun() ){
                    //si ya pasaron 24 horas, hacemos la peticion
                    //var data_peticion = myAjaxRequest(makeUrlFunRequest());
                }
                msj_rpxfun = id_last_rpx5fun_time.innerText.split(';')[1];
                if (!(msj_rpxfun)) msj_rpxfun = "--";
                if ( (rpx5fun > 0)) id_last_rpx5fun_time.innerText = rpx5fun + ';' + msj_rpxfun;
                if ( (rp_x_multibtc > 0)) id_rp_x_mutibtc.innerText = rp_x_multibtc + ';' ;
                getButtonFunVisible(rpx5fun);
                getButton_multiBTCVisible(rp_x_multibtc);
                // ver 0.9.0
                id_rp_no_usable.innerText = store_rp_bear_market;
                id_rp_usable.innerText = user_rp - store_rp_bear_market;
                //
                //si hay programado un canje, cambiamos de color
                console.log('3)rpx5fun_activate: ' + canje_rp_x_fun);
                //console.log('3)typeof:rpx5fun_activate: ' + typeof(canje_rp_x_fun));
                if ( canje_rp_x_fun == 'true' ) {
                    id_last_rpx5fun_time.style.color = "crimson";
                }else{
                    id_last_rpx5fun_time.style.color = "blue";
                }
                if ( canje_rp_x_btc == 'true' ) {
                    id_rp_x_mutibtc.style.color = "crimson";
                }else{
                    id_rp_x_mutibtc.style.color = "blue";
                }
            }, 3000);
        }


        function getIdsPanel(){
            setTimeout(function(){
                id_btc_total = document.querySelector('#btc_total_mio');
                id_fun_total = document.querySelector('#fun_total_mio');
                id_valor_btc = document.querySelector('#valor_btc_actual');
                id_valor_fun_venta = document.querySelector('#valor_fun_venta');
                id_user_rp = document.querySelector('#rp_stats');
                id_rp_ganados = document.querySelector('#rp_ganados');
                id_modoRoll = document.querySelector('#modoRoll');
                id_last_roll_time = document.querySelector('#last_roll_time');
                id_btc_ganados = document.querySelector('#btc_ganados');
                id_fun_ganados = document.querySelector('#fun_ganados');
                id_rolls_execs = document.querySelector('#rolls_execs');
                id_next_roll_time = document.querySelector('#next_roll_time');
                id_wof_roll = document.querySelector('#wof_roll');
                id_wof_rp = document.querySelector('#wof_rp');
                id_wof_btc = document.querySelector('#wof_btc');
                id_last_btc_roll = document.querySelector('#last_btc_roll');
                id_last_rpx5fun_time = document.querySelector('#rp_x_5fun');
                id_bt_make_fun =document.querySelector('#bt_make_fun');
                id_rp_x_mutibtc = document.querySelector('#rp_x_multibtc');
                // ver 0.9.0
                id_rp_no_usable = document.querySelector('#rp_no_usable');
                id_rp_usable = document.querySelector('#rp_usable');
                //
            }, 1500);
        }


        function getResultRoll(){
            var result_btc = parseFloat(document.querySelector('#winnings').innerText).toFixed(8);
            // si es NaN
            if (result_btc !== result_btc) {
                console.log(getDateTime(new Date()) + ': error NaN');
                console.log(getDateTime(new Date()) + ': winning: ' + document.querySelector('#winnings').innerText);
                console.log(getDateTime(new Date()) + ': parse winning: ' + parseFloat(document.querySelector('#winnings').innerText));
                console.log(getDateTime(new Date()) + ': : free_play_result' + document.querySelector('#free_play_result').innerText);
                result_btc = 0.0;
            }
            last_btc_roll = result_btc;
            var result_rp = +document.querySelector('#fp_reward_points_won').innerText;
            
            if (document.querySelector('#fp_bonus_wins a')){
                //hay funtoken q contar
                console.log('Existen fun tokens a contar');
                var fun_token_ganados = parseInt(document.querySelector('#fp_bonus_wins a').innerText.split(' ')[0]);
                if (fun_token_ganados !== fun_token_ganados) {
                    console.log('NaN fun token error: ' + document.querySelector('#fp_bonus_wins a').innerText);
                }else{
                    tot_fun_ganados_rolleando += fun_token_ganados;
                    setCookie('tot_fun_ganados_rolleando',tot_fun_ganados_rolleando,365);
                }
            }
            console.log('2) result_btc: ' + result_btc);
            console.log('3) tot_btc_ganados_rolleando: ' + tot_btc_ganados_rolleando);
            console.log('4) parse tot_btc_ganados_rolleando: ' + parseFloat(tot_btc_ganados_rolleando));
            console.log('5) parse result_btc : ' + parseFloat(result_btc));
            console.log('6) suma parses : ' + (parseFloat(tot_btc_ganados_rolleando) + parseFloat(result_btc)).toFixed(8));
            tot_btc_ganados_rolleando = (parseFloat(tot_btc_ganados_rolleando) + parseFloat(result_btc)).toFixed(8);
            tot_rp_ganados_rolleando = tot_rp_ganados_rolleando + result_rp;
            console.log('7) tot_btc_ganados_rolleando : ' + tot_btc_ganados_rolleando);
            setCookie('tot_btc_ganados_rolleando',tot_btc_ganados_rolleando,365);
            console.log('8) +getcookie : ' + +getCookie('tot_btc_ganados_rolleando'));
            console.log('9) getcookie : ' + getCookie('tot_btc_ganados_rolleando'));
            setCookie('tot_rp_ganados_rolleando', tot_rp_ganados_rolleando,365);
            refreshPanel();
        }


        function detectPromos(){
            var promo = false;
            if (rp_promo_active == 1 || document.querySelector('#bonus_container_fun_token')  || document.querySelector('#bonus_container_fp_bonus')) {
                promo = true;
                console.log('promo activa');
            }
            return promo;

        }


        function closePopupInterval(target) {
            setInterval(function(){
                if (target.is(':visible')) {
                    console.log("Cerrando el popup");
                    setTimeout(function(){
                        target.click();
                    }, random (3000,6000));
                }
            },15000);
        }


        function runSpins(){
            var wof_spins = document.querySelectorAll('#free_wof_spins_msg font').length;
            console.log('wof_spins: ' + wof_spins);
            if (wof_spins > 0){
                var num_spins = document.querySelectorAll('#free_wof_spins_msg font')[1].innerText;
                console.log('num_spins: ' + num_spins);
                if (num_spins > 0){
                    console.log('open spins ');
                    window.open("https://freebitco.in/static/html/wof/wof-premium.html", "_blank");
                }
            }
        }


        function getHoraMinActual(){
            var d = new Date();
            var h = d.getHours;
            var m = d.getMinutes;

            return formatDosDigitos(h) + ":" + formatDosDigitos(m);
        }


        function formatDosDigitos(n){
            if (n < 10) {
                n = '0' + n;
            }
            return n;
        }


        function getDateTime(d){
            return formatDosDigitos(d.getMonth()) + '/' + formatDosDigitos(d.getDate()) + '  ' + formatDosDigitos(d.getHours()) + ':' + formatDosDigitos(d.getMinutes());
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

        function random(min,max){
            console.log('ramdom min: ' + min + ' max: ' + max);
            return min + (max - min) * Math.random();

        }

// make multi btc

        function myAjaxRequestBTC(url, type_request = 'GET' ,post_data = 0){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var myArr = JSON.parse(this.responseText);
                    console.log(myArr);
                    console.log('myAjaxRequestBTC exitoso');
                    var rp_points_x_multibtc = getRpxbtc_points(myArr);
                    console.log('rp_points_x_multibtc-: ' +rp_points_x_multibtc);
                    //si obtenemos un valor valido actualizamos la variable
                    if(rp_points_x_multibtc){
                        rp_x_multibtc = rp_points_x_multibtc;
                        //id_last_rpx5fun_time.innerText = rpx5fun_value + ';' + msj_rpxfun;
                        //setCookie('last_rpx5fun_time', Date.now(),365);

                        setCookie('rp_x_multibtc', rp_x_multibtc,365);
                        console.log('cookie_rp_x_multibtc: ' + getCookie('rp_x_multibtc'));
                        //console.log('user_rp: ' + user_rp);
                        getButton_multiBTCVisible(rp_x_multibtc);
                        return true;

                    }
                    return false;
                }else{
                    return false;
                }
            };

            xmlhttp.open(type_request, url);
            xmlhttp.send();
        }


        //funcion para extraer el dato de la respuesta ajax
        function getRpxbtc_points(data){ //fp_bonus_1000
            if (data){
                var valor_item = 0;
                var items = data.rp_prizes.values();
                do{
                    valor_item = items.next().value;
                }
                while(valor_item.product_type != 'fp_bonus_1000');
                console.log('points rp: ' + valor_item.points);
                return stringDecimalToInt(valor_item.points);
            }else{
                console.log('la peticion esta vacia');
                return null;
            }

        }


        function start_multi_btc(){
            // realizamos una nueva peticion para actualizar lo datos
            var data_peticion = myAjaxRequestBTC(makeUrlFunRequest());
            // esperamos el resultado del request, 1 segundo
            console.log('0.1)start_multi_btc: ' + data_peticion);
            setTimeout(function(){
                // si se llegan a actualizar los datos, verificamos q el boton siga apareciendo, l q indicaria q es
                // factible hacer el canje de rps

                console.log('1)start_multi_btc: ' + data_peticion);

                var estado_boton = document.querySelector('#bt_multi_btc').style.display;
                console.log('2)start_multi_btc: ' + estado_boton);
                // si boton es visible programamos un canje
                if ( estado_boton == "block" ){
                    canje_rp_x_btc = 'true';
                }else{
                   canje_rp_x_btc = 'false';
                } // "RedeemRPProduct('fun_token_5')"id_last_rpx5fun_time
                setCookie('rpxbtc_activate', canje_rp_x_btc,365);
                refreshPanel();
                console.log('3)canje_Rps: ' + getCookie('rpxbtc_activate'));
            }, 1000);

        }

        function getButton_multiBTCVisible(rpxbtc){
            //console.log('prueba');
            var user_rp_num = stringDecimalToInt(user_rp);
            // ver 0.9.0
            console.log('suma de rps: ');
            console.log(Number(rpxbtc) + (getDateWeek()**2));
            //
            if ( (Number(rpxbtc) + (getDateWeek()**2)) < stringDecimalToInt(user_rp) ) {
                document.querySelector('#bt_multi_btc').style.display = "block";
                console.log('habilitamos boton multi_btc');
                return true;
            }else{
                document.querySelector('#bt_multi_btc').style.display = "none";
                console.log('ocultamos boton multi_btc');
                //reseteamos la opcion de canje, cuando no se tienen los rps necesarios
                canje_rp_x_btc = 'false';
                console.log('7)rpxbtc_activate: ' + canje_rp_x_btc);
                setCookie('rpxbtc_activate', canje_rp_x_btc,365);

                console.log('2)leemos la cookie de multibtc_activate: ' + getCookie('rpxbtc_activate'));
                return false;
            }
        }


// make fun

        function myAjaxRequest(url, type_request = 'GET' ,post_data = 0){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200){
                    var myArr = JSON.parse(this.responseText);
                    console.log(myArr);
                    console.log('request exitoso');
                    var rp_points_x_5fun = getRpx5FUN_points(myArr);
                    console.log('rp_points_x_5fun-: ' + rp_points_x_5fun);
                    //si obtenemos un valor valido actualizamos la variable
                    if(rp_points_x_5fun){
                        rpx5fun_value = rp_points_x_5fun;
                        id_last_rpx5fun_time.innerText = rpx5fun_value + ';' + msj_rpxfun;
                        setCookie('last_rpx5fun_time', Date.now(),365);
                        setCookie('rpx5fun', rpx5fun_value,365);
                        console.log('cookie_rpx5fun: ' + getCookie('rpx5fun'));
                        console.log('user_rp: ' + user_rp);
                        getButtonFunVisible(rpx5fun_value);
                        return true;

                    }
                    return false;
                }else{
                    return false;
                }
            };

            xmlhttp.open(type_request, url);
            xmlhttp.send();
        }



        function makeUrlFunRequest(){
            var url_peticion = new URL('https://freebitco.in/cf_stats_public/');
            url_peticion.searchParams.set('f','public_stats_initial');
            url_peticion.searchParams.set('csrf_token',getCookie('csrf_token'));
            console.log('url_peticion: ' + url_peticion.href);
            return url_peticion;
        }

        //oculta o muestra el boton segun los rps alcancen el minimo necesario
        function getButtonFunVisible(rpxfun){
            if ( !enable_rp_x_fun ){
                console.log('rp_x_fun deshabilitado');
                document.querySelector('#bt_make_fun').style.display = "none";
                return false;
            }
            var user_rp_num = stringDecimalToInt(user_rp);
            if ( rpxfun < stringDecimalToInt(user_rp) ) {
                document.querySelector('#bt_make_fun').style.display = "block";
                console.log('habilitamos boton make_fun');
                return true;
            }else{
                document.querySelector('#bt_make_fun').style.display = "none";
                console.log('ocultamos boton make_fun');
                //reseteamos la opcion de canje, cuando no se tienen los rps necesarios
                canje_rp_x_fun = 'false';
                console.log('7)rpx5fun_activate: ' + canje_rp_x_fun);
                setCookie('rpx5fun_activate', canje_rp_x_fun,365);
                //console.log('1)leemos la cookie de rpx5fun_activate: ' + Boolean(getCookie('rpx5fun_activate')));
                console.log('2)leemos la cookie de rpx5fun_activate: ' + getCookie('rpx5fun_activate'));
                return false;
            }

        }

        //funcion para realizar las consultas ajax cada cierto tiempo
        function boolIsTimeGetRpx5Fun(){
            var tiempo_actual = Date.now();
            var time_difference = tiempo_actual - last_rpx5fun_time;
            if (time_difference > 86400000){//86400000
                console.log('Es tiempo de consultar rpx5fun');
                return true;
            }
            console.log('Todavia no es tiempo de consultar rpx5fun');
            return false;
        }

        //funcion para extraer el dato de la respuesta ajax
        function getRpx5FUN_points(data){ //fp_bonus_1000
            if (data){
                var valor_item = 0;
                var items = data.rp_prizes.values();
                do{
                    valor_item = items.next().value;
                }
                while(valor_item.product_type != 'fun_token_5');
                console.log('points rp: ' + valor_item.points);
                return stringDecimalToInt(valor_item.points);
            }else{
                console.log('la peticion esta vacia');
                return null;
            }

        }


        function start_make_fun(){
            // realizamos una nueva peticion para actualizar lo datos
            var data_peticion = myAjaxRequest(makeUrlFunRequest());
            // esperamos el resultado del request, 1 segundo
            console.log('0.1)start_make_fun: ' + data_peticion);
            setTimeout(function(){
                // si se llegan a actualizar los datos, verificamos q el boton siga apareciendo, l q indicaria q es
                // factible hacer el canje de rps

                console.log('1)start_make_fun: ' + data_peticion);

                var estado_boton = document.querySelector('#bt_make_fun').style.display;
                console.log('2)start_make_fun: ' + estado_boton);
                // si boton es visible programamos un canje
                if ( estado_boton == "block" ){
                    canje_rp_x_fun = 'true';
                }else{
                   canje_rp_x_fun = 'false';
                } // "RedeemRPProduct('fun_token_5')"id_last_rpx5fun_time
                setCookie('rpx5fun_activate', canje_rp_x_fun,365);
                refreshPanel();
                console.log('3)canje_Rps: ' + getCookie('rpx5fun_activate'));
            }, 1000);

        }


        //convertir de '1,650' a 1650 (int)
        function stringDecimalToInt(dec){
            return +dec.replace(',', '');
        }

        function getDateWeek(date) {
            //console.log('semana del año');
            const currentDate =
                (typeof date === 'object') ? date : new Date();
            const januaryFirst =
               new Date(currentDate.getFullYear(), 0, 1);
            const daysToNextMonday =
               (januaryFirst.getDay() === 1) ? 0 :
               (7 - januaryFirst.getDay()) % 7;
            const nextMonday =
               new Date(currentDate.getFullYear(), 0,
               januaryFirst.getDate() + daysToNextMonday);

        return (currentDate < nextMonday) ? 52 :
           (currentDate > nextMonday ? Math.ceil(
           (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}


    })();

