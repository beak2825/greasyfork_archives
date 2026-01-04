// ==UserScript==
// @name         autoclaim fbtcbz without captcha
// @namespace    https://freebitco.in/?r=10740176
// @version      0.1.7
// @description  autoclaim freebitco.in https://freebitco.in/?r=10740176
// @author       fbtcbz
// @match        https://freebitco.in/?op=home
// @match        https://freebitco.in/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392662/autoclaim%20fbtcbz%20without%20captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/392662/autoclaim%20fbtcbz%20without%20captcha.meta.js
// ==/UserScript==

$(document).ready(function(){
    setTimeout(function(){
        var d = new Date();
        var hora = d.getHours();
        var titulo= $("title").html();
        var primeraletra = titulo.substring(0, 1);
        if ((hora>=23 || hora<=8) && primeraletra=="F")
        {
            //abrirNuevoTab('');
            $('#free_play_captcha_container').hide();
            $('#play_without_captchas_button').hide();
            $('#play_with_captcha_button').show();
            $('#play_without_captcha_desc').show();
            $('#pwc_input').val("1");
            //$('#free_play_form_button').trigger('click')
            $('#free_play_form_button').click();
            //console.log("Status: Button ROLL clicked.");
        }
        else
        {

        }
     },10000);

     function abrirNuevoTab(url) {
        // Abrir nuevo tab
        var win = window.open(url, '_blank');
        // Cambiar el foco al nuevo tab (punto opcional)
        win.focus();
     }

});

