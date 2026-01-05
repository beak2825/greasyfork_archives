// ==UserScript==
// @name       USB
// @version    1.0
// @description  Ver usuarios baneados
// @match      http://www.taringa.net/*
// @include    http*://www.taringa.net/*
// @copyright  ***
// @namespace  ****
// @downloadURL https://update.greasyfork.org/scripts/11229/USB.user.js
// @updateURL https://update.greasyfork.org/scripts/11229/USB.meta.js
// ==/UserScript==

(function(){
    var ban = function(user){
        var state;
        $.get('https://api.taringa.net/user/nick/view/' + user, function(data){
            if (data.status === 10) {
                state = data.gender == 'f' ? "Activa" : "Activo";
                $('.perfil-info').append('<span class="btn a" style="cursor: default;">' + state + '</span>');
            }
            else if (data.status === 5) {
                state = data.gender == 'f' ? "Baneada" : "Baneado";
                $('.perfil-info').append('<span class="btn r" style="cursor: default;">' + state + '</span>');
            }
        });
    };
    var name = $('.nickname').html();
    if (name == null) {
        name = $('.fn').html(); // Esto es para poder obtener el nick de los que la bugean como http://www.taringa.net/OverJT
        if (name == null) return; // ??
    }
    name = name.replace("@", "");
    ban(name);

    // Funcion para ver baneados en pestaña de seguidos/seguidores
    var loc = window.location.pathname;
    var followingsLoc = '/' + name + '/siguiendo';
    var followersLoc = '/' + name + '/seguidores';

    if (loc.match(followingsLoc) || loc.match(followersLoc)) { // Solo se ejecuta si estoy en la pestaña seguidos/seguidores. [esto es para ver mas de 1 pagina]
        var array = [];
        var nick = $('.txt a');
        nick.each(function(){
            nick = $(this).html().replace(/\s/g, "");
            array.push(nick);
        });

        var states = [];
        var i = 0;
        var massiveBan = function() {
            var dfd = $.Deferred();
            $.ajax({
                url    : 'https://api.taringa.net/user/nick/view/' + array[i],
                success: function(data) {
                    if (data.status === 5){
                        states.push( data.gender == 'f' ? "Baneada" : "Baneado" );
                        dfd.resolve();
                    }
                    else if (data.status === 10) {
                        states.push( data.gender == 'f' ? "Activa" : "Activo" );
                        dfd.resolve();
                    }
                }
            });
            return dfd.promise();
        };

        $('.mesigue').css({"margin-right": "70px", "font-family": "Lato", "font-style": "normal"}); // Corro el "Te esta siguiendo" un poco a la izquierda y de paso saco la fuente asquerosa.
        $('.grey.floatL').css('padding-top', '20px'); // Corro la descripcion un poco para abajo asi no choque con los botones de baneados
        var main = function(){
            massiveBan().then(
                function() {
                    if (states.length === 26) return;
                    else {
                        var divs = $('#full-col .follow-buttons');
                        if (states[i] == "Activo" || states[i] === "Activa") {
                            divs.eq(i).prepend('<span class="btn a" style=" cursor: default; width: 80px;">' + states[i] + '</span>');
                        }
                        else {
                            divs.eq(i).prepend('<span class="btn r" style=" cursor: default; width: 80px;">' + states[i] + '</span>');
                        }
                        i +=1;
                        main();
                    }
                });
        };
        main();
    }
})();