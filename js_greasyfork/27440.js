// ==UserScript==
// @name         Unfollowey
// @namespace    Mierdinga
// @version      0.4
// @description  Script que sirve para dejar de seguir a un usuario que tal vez desactivó la cuenta o por algun otro problema en que no lo puedas hacer de la forma habitual. Solo funciona en la pagina www.taringa.net/TU_NOMBRE_DE_USUARIO/siguiendo
// @author       @Cazador4ever
// @match        http*://*.taringa.net/*
// @include      http*://*.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27440/Unfollowey.user.js
// @updateURL https://update.greasyfork.org/scripts/27440/Unfollowey.meta.js
// ==/UserScript==
(function($) {
    'use strict';
    //Resetea el botón y el input, sirve más abajo
    function resetUI() {
        $('#CU').val('');
        $('.CazaUnbotton').attr("value", "Dejar de seguir");
    }
    // Funcion para ver baneados en pestaña de /siguiendo (tomado de otro script)
    var name = $('.nickname').html().replace("@", "");
    var loc = window.location.pathname;
    var followingsLoc = '/' + name + '/siguiendo';
    if (loc.match(followingsLoc)) { // Solo se ejecuta si estoy en la pestaña siguiendo
        // Botón e input más un contenedor centrado en la pantalla a la derecha
        $('body').append('<style type="text/css">.cTools {-webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; float: left; width: 300px; heigh: 250px; position: fixed; top: 50%; right: 2px; overflow: auto; border: none; -webkit-border-radius: 10px; border-radius: 10px; font: normal 16px/1 "Lucida Console", Monaco, monospace; color: rgb(255, 255, 255); text-align: center; -o-text-overflow: ellipsis; text-overflow: ellipsis; }</style>' +
                         '<style type="text/css">.CazaUnbotton {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; cursor: pointer; padding: 10px 20px; border: 1px solid #ffffff; margin: 10px 0 0; -webkit-border-radius: 3px; border-radius: 3px; font: normal 15px/normal "Lucida Console", Monaco, monospace; color: rgba(255,255,255,0.9); -o-text-overflow: clip; text-overflow: clip; background: rgba(0,0,0,1); -webkit-transition: all 50ms cubic-bezier(0.42, 0, 0.58, 1); -moz-transition: all 50ms cubic-bezier(0.42, 0, 0.58, 1); -o-transition: all 50ms cubic-bezier(0.42, 0, 0.58, 1); transition: all 50ms cubic-bezier(0.42, 0, 0.58, 1); } .CazaUnbotton:hover {border: 1px solid #c10101; color: rgba(255,0,0,1); background: #000000; } .CazaUnbotton:active {border: 1px solid #018dc4; color: rgba(0,0,0,1); background: rgba(192,255,188,1); }</style>' +
                         '<style type="text/css">.CazaUnFollow {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; padding: 10px 20px; border: 1px solid #b7b7b7; -webkit-border-radius: 3px; border-radius: 3px; font: normal 15px/normal "Lucida Console", Monaco, monospace; color: rgba(0,0,0,1); -o-text-overflow: clip; text-overflow: clip; background: rgba(255,255,255,1); -webkit-box-shadow: 1px 1px 3px 0 rgba(0,0,0,0.2) inset; box-shadow: 1px 1px 3px 0 rgba(0,0,0,0.2) inset; -webkit-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1); -moz-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1); -o-transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1); transition: all 200ms cubic-bezier(0.42, 0, 0.58, 1); } .CazaUnFollow:hover {color: rgba(188,188,188,1); -webkit-box-shadow: 1px 1px 3px 0 rgba(0,0,0,0.33) ; box-shadow: 1px 1px 3px 0 rgba(0,0,0,0.33) ; } .CazaUnFollow:focus {color: rgba(0,0,0,1); -webkit-box-shadow: 1px 1px 3px 0 rgba(0,0,0,0.2) inset; box-shadow: 1px 1px 3px 0 rgba(0,0,0,0.2) inset; }</style>' +
                         '<div id="cazaTools" class="cTools" style="position: fixed;">' +
                         '<input type="text" id="CU" name="unfollower "class="CazaUnFollow" placeholder="Nick del usuario">' +
                         '<input type="button" class="CazaUnbotton" value="Dejar de seguir">' +
                         '</div>');
        // Esto es para poder moverlo a cualquier parte de la pantalla
        $('.cTools').draggable();
        // Acción del boton Dejar de seguir
        $('.CazaUnbotton').on( 'click', function(){
            var nickUs = $('#CU').val().trim();
            $.ajax({
                url    : 'https://api.taringa.net/user/nick/view/' + nickUs,
                success: function(data) {
                    var UsId = data.id;
                    notifica.ajax(Array("action=unfollow","type=user","obj=" + UsId),null,null,true,false);
                    $('.CazaUnbotton').attr("value", "¡Listo!");
                    setTimeout(resetUI, 3000);
                }
            });
        });
        //fin
    }
})(jQuery);