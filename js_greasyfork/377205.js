// ==UserScript==
// @name         VioLikes(v6)
// @namespace    violikes(v6)
// @version      0.2
// @description  Dar likes a usuario específico...
// @author       @Cazador4ever
// @match        *://*.taringa.net/mi
// @include      *://*.taringa.net/mi
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377205/VioLikes%28v6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/377205/VioLikes%28v6%29.meta.js
// ==/UserScript==
(function($) {
    var boton;
    boton = '<center><input type="text" class="form" name="Nombre" id="NombreU" autocomplete="on" placeholder="Nombre de usuario sin @ (arroba)"title="Coloca el nombre de usuario sin @ (arroba)"><button class="btn a" id="violaR"><font color="#fff">VIOLAR</font></button><img src="https://k62.kn3.net/taringa/2/6/8/2/7/6/83/cazador4ever/3E8.gif" id="load" style="display:none"/><img src="https://k61.kn3.net/FEF3DDEDC.gif" id="error" style="display:none"/><img src="https://i.imgur.com/cKFUC1a.png" id="listop" style="display:none"/></center>';
    $('#sidebar').prepend(boton);
    function ResetUUI() {
        $('#listop').hide();
        $('#violaR').show();
        $('#NombreU').show();
        $('#NombreU').val('');
    }
    $("#violaR").on('click', function viol() {
        var usario = $('#NombreU').val().trim();
        var apo = 'https://api.taringa.net/user/nick/view/' + usario;
        $('#NombreU').hide();
        $('#violaR').hide();
        $('#load').show();
        $.getJSON(apo, function(usuario) {
            var ido = usuario.id;
            $.getJSON("https://api.taringa.net/shout/user/view/" + ido, function(data) {
                $.each(data, function(i, item) {
                    var id = item.id;
                    var owner = item.owner.id;
                    $.ajax({
                        url: '/ajax/shout/vote',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            owner: owner,
                            uuid: id,
                            score: 1
                        },
                        error: function(){
                            $('#error').show();
                            alert('Hubo un herror, recargando web, vuelva a intentarlo...');
                            console.info('Los servidores de mierdinga funcionan mal...');
                            location.reload(true);
                        },
                        success: function ok() {
                            $('#load').hide();
                            $('#listop').show();
                            console.info('Shout: ' + id);
                        },
                        complete: function(){
                            setTimeout(ResetUUI, 2000);

                        },
                    });
                });
            });
        });
    });
})(jQuery);