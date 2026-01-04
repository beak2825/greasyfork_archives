// ==UserScript==
// @name         freebitcoin wof
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Script para lanzar los WOF de freebitco.in
// @author       You
// @match        https://freebitco.in/static/html/wof/wof-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474190/freebitcoin%20wof.user.js
// @updateURL https://update.greasyfork.org/scripts/474190/freebitcoin%20wof.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('cargo1');
    // Your code here...
    $(document).ready(function(){
        console.log('cargo');
        var wof_roll = +getCookie('wof_roll');
        setTimeout(function(){
            var num_spins = +document.querySelector('#token_count').innerText;
            console.log(num_spins);

            if (num_spins == 0){
                setCookie('wof_roll',1,365);
                console.log('procedemos a cerrar');
                setTimeout(function(){
                   window.close()
                }, 5000);
            }else{//jugamos
                console.log('jugamos');
                setTimeout(function(){
                    PlayOne();
                    wof_roll += 1;
                    setCookie('wof_roll',wof_roll,365);
                },3000);
                //recargamos
                console.log('recargamos pagina');
                setTimeout(function(){
                    location.reload();
                }, 6000);

        }
        }, 4000);
        
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

})();