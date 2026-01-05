// ==UserScript==
// @name         FonGIF(v6)
// @namespace    FonGIF
// @version      3.0
// @description  Cambiar fondo de perfil y comunidad por un GIF.
// @match        *://*.taringa.net/cuenta
// @include      *://*.taringa.net/cuenta
// @include      *://*.taringa.net/comunidades/*/editar/
// @include      *://*.kn3.net/
// @icon         http://o1.t26.net/images/favicon.ico
// @copyright    @EdvardGrieg
// @downloadURL https://update.greasyfork.org/scripts/17258/FonGIF%28v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17258/FonGIF%28v6%29.meta.js
// ==/UserScript==
(function ($) {
///////// Estilos y botones...
    var cuenta = $('<style type="text/css">.fon-gif {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 140px; height: 15px; border: 2px solid rgba(13,215,105,0.0980392); font: normal 14px/normal Arial, Helvetica, sans-serif; color: rgb(10, 104, 51); text-align: center; -o-text-overflow: clip; text-overflow: clip; background: rgba(13,215,105,0.1); -webkit-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .fon-gif:hover {width: 150px; border: 2px solid rgba(0,0,255,0.19); -webkit-border-radius: 5px; border-radius: 5px; color: rgba(121,173,143,0.35); background: rgba(13,215,105,0.24); -webkit-transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; -moz-transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; -o-transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; } .fon-gif:focus {border: 2px solid rgba(13,215,105,0.498039); -webkit-border-radius: 10px; border-radius: 10px; color: rgba(10,104,51,0.2); background: none; -webkit-transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); -moz-transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); -o-transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); }</style><div class="field clearfix"><label for="background-image">Fondo gif</label><input type="text" class="fon-gif" name="link" id="link" autocomplete="on" placeholder="Link de kn3" title="Colocar el link del gif subido a Kn3 por favor."><button type="button" class="btn v" id="cambiar-perfil" ><font color="#fff">Cambiar</font></button></div>');
    $('#design-tab-account').prepend(cuenta);
    var comunidad = $('<style type="text/css">.fon-gif {display: inline-block; -webkit-box-sizing: content-box; -moz-box-sizing: content-box; box-sizing: content-box; width: 140px; height: 15px; border: 2px solid rgba(13,215,105,0.0980392); font: normal 14px/normal Arial, Helvetica, sans-serif; color: rgb(10, 104, 51); text-align: center; -o-text-overflow: clip; text-overflow: clip; background: rgba(13,215,105,0.1); -webkit-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -moz-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); -o-transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); transition: all 500ms cubic-bezier(0.68, -0.75, 0.265, 1.75); } .fon-gif:hover {width: 150px; border: 2px solid rgba(0,0,255,0.19); -webkit-border-radius: 5px; border-radius: 5px; color: rgba(121,173,143,0.35); background: rgba(13,215,105,0.24); -webkit-transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; -moz-transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; -o-transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; transition: all 300ms cubic-bezier(0.68, -0.75, 0.265, 1.75) 10ms; } .fon-gif:focus {border: 2px solid rgba(13,215,105,0.498039); -webkit-border-radius: 10px; border-radius: 10px; color: rgba(10,104,51,0.2); background: none; -webkit-transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); -moz-transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); -o-transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); transition: all 300ms cubic-bezier(0.6, 0.04, 0.98, 0.335); }</style><div class="clearfix com-edit"><input type="text" name="link" class="fon-gif" id="link" autocomplete="on" placeholder="Link de kn3" title="Colocar el link del gif subido a Kn3 por favor."><button type="button" class="btn v" id="cambiar-comu" ><font color="#fff">Cambiar</font></button></div>');
    $('div.clearfix.com-edit.fdo').append(comunidad);
/////////////// Ahora la funcion para el perfil
    $('#cambiar-perfil').on('click', function(){
        $("#cambiar-perfil").addClass('loading');
        var fondo = $('#link').val().trim(); // se obtine el fondo
        $.ajax({
            type     : 'POST',
            dataType : 'json',
            url      : '/ajax/user/background',
            data     : {
                url : fondo.replace('.gif','%2E%67%69%66?/bg.jpg') // se reemplaza el fondo
            },
            complete: function(){
                location.reload(true);
            },
            error: function (){
                alert("Hubo un error, recargue la pagina e intente nuevamente.");
            }
        });
    });
//////////// Cambiar el fondo a tu comunidad
    $('#cambiar-comu').on('click', function(){
        $("#cambiar-comu").addClass('loading');
        var fondo = $('#link').val().trim(); // se obtine el fondo
        $.ajax({
            type     : 'POST',
            dataType : 'json',
            url      : '/ajax/comunidad/background',
            data     : {
                url : fondo.replace('.gif','%2E%67%69%66?/cbg.jpg'), // se reemplaza el fondo
                id: global_data.comid
            },
            complete: function(){
                location.reload(true);
            },
            error: function(){
                alert("Hubo un error, recargue la pagina e intente nuevamente.");
            }
        });
    });
})(jQuery);
/*
Espero que les haya gustado. :)
cualquier sugerencia comentar en el tema oficial
de la comunidad:
http://www.taringa.net/comunidades/-cazadores-/9551482/
*/