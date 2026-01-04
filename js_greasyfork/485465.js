// ==UserScript==
// @name         freematic
// @namespace    http://tampermonkey.net/
// @version      1.11.11
// @description  Freematic auto roll
// @author       You
// @match        https://app.freematic.com/free
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freematic.io
// @updateURL
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485465/freematic.user.js
// @updateURL https://update.greasyfork.org/scripts/485465/freematic.meta.js
// ==/UserScript==

(function() {
    'use strict';
//document.querySelector('.popup-close').click()
    //balance document.querySelector('.navbar-coins a').innerText.split(' ')[0]
    // contador segundos document.querySelector('.seconds .digits').innerText
    // contador minutos document.querySelector('.minutes .digits').innerText
    // document.querySelector('.roll-button').click()
    // document.querySelector('.roll-button').style.display
    //<div class="result" style="">Has recibido 0.00001152</div>
    // 1.10.5 aumentamos los segundos despues del roll, en celulares corre mas lento
    console.log('precarga script');
    var noRunScript = true;
    setTimeout(function(){
        console.log('ejecutamos script');
        cargaFreedashRoller();
    }, 40000);

    function cargaFreedashRoller() {
        //variables
        const script_version = GM_info.script.version;
        var panel_html = "";
        //var balance_dash = 0;
        var id_last_roll_time = 0;
        var next_roll_time = 0;
        var id_next_roll_time = 0;
        var id_hora_ult_roll = 0;

        noRunScript = false;
        console.log(' noRunScript: ' + noRunScript);
        //var hora_ult_reinicio = 0;
        var dateTimeFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: 'numeric', hour12: false });

        //obtener cookies
        //  COOKIES  //
        var tot_exec = +getCookie("ejecuciones");
        var tot_dash_ganados_rolleando = parseFloat(getCookie('tot_dash_ganados_rolleando')).toFixed(8);
        var time_elapsed_last_roll1 = getCookie('time_elapsed_last_roll1');
        var hora_ult_reinicio = getCookie('hora_ult_reinicio');
        var hora_ult_roll = getCookie('hora_ult_roll');
        console.log("1) hora_ult_roll: " + hora_ult_roll);
        var hora_min_actual = getHoraMinActual();
        console.log("56) getHoraMinActual: " + hora_min_actual);

        if (! (tot_exec > 0)) tot_exec = 0;
        if (! (tot_dash_ganados_rolleando > 0)) tot_dash_ganados_rolleando = 0.0;
        if (! (time_elapsed_last_roll1 > 0)) time_elapsed_last_roll1 = 0;
        if (! (hora_ult_reinicio > 0)) hora_ult_reinicio = 0;
        if (! (hora_ult_roll.length > 1 )) hora_ult_roll = '';
        console.log("2) hora_ult_roll: " + hora_ult_roll);
        //hacer panel
        panel_html += '<div><h1 class="color-1" style="font-size:large;" align="center">relleno<span>relleno</span></h1></div>';
        panel_html += '<div><h1 class="color-1" style="font-size:large;" align="center">relleno<span>relleno</span></h1></div>';
        panel_html += '<div><h1 class="color-1" style="font-size:large;" align="center">version: <span>' + script_version + '</span></h1></div>';
        panel_html += '<div><h1 class="color-1" style="font-size:large;" align="center">ult reinicio: <span id="last_roll_time">18:39</span></h1></div>';
        panel_html += '<div><h1 class="color-1" style="font-size:large;" align="center">sgt reinicio: <span id="next_roll_time">18:39</span></h1></div>';
        panel_html += '<div><h1 class="color-1" style="font-size:large;" align="center">hora ult roll: <span id="hora_ult_roll">18:39</span></h1></div>';
        //mostrar panel
        console.log('cargando panel');
        document.querySelector('header').insertAdjacentHTML('afterend',panel_html);
        refreshPanel();
        setTimeout(function(){
            console.log('cerramos popup');
            if (document.querySelector('.p-dialog-header-close')){
                document.querySelector('.p-dialog-header-close').click();
            }
           // if (document.querySelector('#CloseBtn')){
           //     document.querySelector('#CloseBtn').click();
          //  }
        }, 3000);

        //consultar con cookie tiempo desde ultimo roll o reload
        if (time_elapsed_last_roll1 == 0) {
            saveCookieandReload();
        }else{//si tiempo es mayor a una hora; reload
            var d = new Date();
            var segundos = (d.getTime() - time_elapsed_last_roll1);
            console.log('segundos: ' + segundos);
            if (segundos > 3600000){
                console.log('1) tiene mas de una hora sin recargar, guardamos cookies y recargamos');
                saveCookieandReload();
            }else{ //si es menor a una hora, revisamos el contador
                //var minutos_cont = document.querySelector('.minutes').childNodes[0].innerText;
                //var segundos_cont = document.querySelector('.seconds').childNodes[0].innerText;
                //console.log('min:' + +document.querySelector('.minutes').childNodes[0].innerText);
                //console.log('min2:' + document.querySelector('.minutes').childNodes[0].innerText);
                //if (minutos_cont == '0'){
                 //   if (segundos_cont == '0'){
                  //      console.log('Los contadores estan en cero, reniciamos');
                   //     saveCookieandReload();
                   // }
                //}else if (minutos_cont == '' && segundos_cont == ''){//si minutos y segundos no son visible, es momento de roll
                if ( !document.querySelector('.minutes') ){
                    console.log('--Roll--');//sino leer minutos y segundos
                    Roll();
                }else{ //min y segundos son validos, extraemos min, agregamos un min aleatorios y seteamos Timeout
                    var minutos_cont = document.querySelector('.minutes').childNodes[0].innerText;
                    var segundos_cont = document.querySelector('.seconds').childNodes[0].innerText;
                    console.log('min:' + +document.querySelector('.minutes').childNodes[0].innerText);
                    console.log('min2:' + document.querySelector('.minutes').childNodes[0].innerText);
                    minutos_cont = parseInt(minutos_cont) + random(1,4);
                    var retardo_mili = minutos_cont * 60 * 1000;
                    var d1 = new Date();
                    d1.setSeconds(d.getSeconds() + retardo_mili/1000);
                    var [{ value: year },,{ value: month },,{ value: day },,{ value: hour },,{ value: minute }] = dateTimeFormat.formatToParts(d1);
                    next_roll_time = hour + ':' + minute;
                    console.log('minu parseados: ' + minutos_cont);
                    setTimeout(function(){
                        console.log('Roll 2');
                        saveCookieandReload();
                    }, retardo_mili);
                }
            }
        }


        //funciones
        function refreshPanel(){
            setTimeout(function(){
                console.log('refresh');
                // balance_dash = document.querySelector('.navbar-coins a').innerText.split(' ')[0];
                if (time_elapsed_last_roll1 == 0) {
                    document.querySelector('#last_roll_time').innerText = 'Primer arranque';
                }else{
                    var d = new Date();
                    var segundos = (d.getTime() - time_elapsed_last_roll1)/1000;
                    document.querySelector('#last_roll_time').innerText = segundos + ' segundos' ;
                }
                document.querySelector('#next_roll_time').innerText = next_roll_time;
                console.log("3) hora_ult_roll: " + hora_ult_roll);
                document.querySelector('#hora_ult_roll').innerText = hora_ult_roll;
            }, 3000);
        }


        function getIdsPanel(){
            setTimeout(function(){
                id_last_roll_time = document.querySelector('#btc_total_mio');
                id_next_roll_time = document.querySelector('#next_roll_time');
                id_hora_ult_roll = document.querySelector('#hora_ult_roll');


            }, 1500);
        }


        function saveCookieandReload(){
            var d = new Date();
            setCookie('time_elapsed_last_roll1', d.getTime(), 365);
            setCookie('hora_ult_reinicio', getHoraMinActual(), 365);
            setTimeout(function() {
                location.reload();
            }, 1000);
        }


        function Roll(){
            //verificamos si el boton esta deshabilitad
            if (document.querySelectorAll('.p-button-label')[1].classList.contains('p-disabled')){
                console.log('El boton esta deshabilitado');
            //}else if (document.querySelector('.roll-button').style.display == 'none'){
             //   console.log('Error2: no se encontró el boton de Roll');
            }else{
                console.log('el boton de roll es visible');
                document.querySelectorAll('.p-button-label')[1].click()
                //document.querySelector('.roll-button').click();
                setTimeout(function(){
                    console.log('cerramos popup 2');
                    if (document.querySelector('.p-dialog-header-close')){
                       console.log('pop up cerrado 2');
                       document.querySelector('.p-dialog-header-close').click();
                    }
                    //if (document.querySelector('#CloseBtn')){
                    //    document.querySelector('#CloseBtn').click();
                    //}
                }, 9000);
                console.log('esperamos 11 segundos');
                setTimeout(function(){
                    console.log('despues de 11 segundos');
                    getResultRoll();
                },11000);

            }
        }


        function getResultRoll(){

            console.log('1).minutos .digits: ' + document.querySelector('.minutes').childNodes[0].innerText);
            if ( document.querySelector('.minutes').childNodes[0] && document.querySelector('.minutes').childNodes[0].innerText == '59') {
                hora_ult_roll = getDateTime(new Date());
                console.log('Roll exitoso: ' + hora_ult_roll);
                console.log("4) hora_ult_roll: " + hora_ult_roll);
                setCookie('hora_ult_roll', hora_ult_roll, 365);
                console.log("5) hora_ult_roll: " + getCookie('hora_ult_roll'));
                refreshPanel();
                setTimeout(function(){
                    saveCookieandReload();
                }, 6000);
            }else{
                console.log('Error: el roll no fue exitoso');
                setTimeout(function(){
                    saveCookieandReload();
                }, 6000);
            }
        }



        function getHoraMinActual(){
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();

            return formatDosDigitos(h) + ":" + formatDosDigitos(m);
        }


        function formatDosDigitos(n){
            if (n < 10) {
                n = '0' + n;
            }
            return n;
        }


        function getDateTime(d){
            return formatDosDigitos(d.getMonth()) + '/' + formatDosDigitos(d.getDate()) + '_' + formatDosDigitos(d.getHours()) + ':' + formatDosDigitos(d.getMinutes());
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

    }
})();