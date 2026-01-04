// ==UserScript==
// @name        Malvinas en V6
// @namespace   https://greasyfork.org/es/users/kchamat
// @description Muestra el logo de la guerra de malvinas
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @match       *://*.taringa.net/*
// @version     1.2
// @license     GPLv3
// @grant       none
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/381295/Malvinas%20en%20V6.user.js
// @updateURL https://update.greasyfork.org/scripts/381295/Malvinas%20en%20V6.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var d = new Date();
var dia = d.getDate();
var mes = d.getMonth();


function malvinas_v6(){
    if (dia == 2 && mes == 3)
        {
 var x = document.getElementsByClassName("header-main__logo");
 x[0].style.background = "url('https://k62.kn3.net/taringa/0/7/8/9/0/2/kchamat/53D.jpg')";
}
}

$(function() {

  malvinas_v6();
});

