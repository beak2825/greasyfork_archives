// ==UserScript==
// @name         freebitco.in spin
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  Script para ejecutar automaticamente el spin de freebitco.in
// @author       You
// @match        https://freebitco.in/static/html/wof/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebitco.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474189/freebitcoin%20spin.user.js
// @updateURL https://update.greasyfork.org/scripts/474189/freebitcoin%20spin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.addEventListener('load', function () {
        setTimeout(function(){
            console.log('hacemos click en el spin');
            document.querySelector('.spin-button').click();
            //en celulares lentos demora en girar
            console.log('esperaremos 10 segundos para q termine de girar y ver el resultado');
            setTimeout(function(){
                console.log('leemos el resultado');
                var result_spin = document.querySelector('.winner__dynamic').innerText;
                console.log('resultado: ' + result_spin);
                var ar_result = result_spin.split(' ');
                if (ar_result[1].toUpperCase() == 'REWARD'){
                    var rp = parseInt(getCookie('wof_rp'));
                    rp += parseInt(ar_result[0]);
                    console.log('guardando rps');
                    setCookie('wof_rp', rp, 365);
                }else if (ar_result[1].toUpperCase() == 'SATOSHI'){
                    var btc = parseInt(getCookie('wof_btc'));
                    console.log('btc from cookie: ' + btc)
                    console.log('btc parse: ' + parseInt(ar_result[0]))
                    console.log('ar_result[0]: ' + ar_result[0])
                    btc += parseInt(ar_result[0]);
                    console.log('guardando satoshis: ' + btc);
                    setCookie('wof_btc', btc, 365);
                }
                console.log('procedemos a cerrar en 3 segundos');
                setTimeout(function(){
                    window.close();
                },3000);
            },10000);
        },8000); //esperamos 8 segundos para apretar el boton del spin
    })

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

    //
})();