// ==UserScript==
// @name         Ver banes
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Te muestra si un user esta ban o no.
// @author       --
// @include      http*://www.taringa.net/*
// @include      http*://www.taringa.net/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15742/Ver%20banes.user.js
// @updateURL https://update.greasyfork.org/scripts/15742/Ver%20banes.meta.js
// ==/UserScript==

(function(){
    var ban = function(user){
        var state;
        $.get('https://api.taringa.net/user/nick/view/' + user, function(data){
            if (data.status === 10) {
                state = "Activo";
                $('.perfil-info').append('<span class="btn v" style="background-color: #5bd3af; font-size: 13px; font-weight: bold; cursor: default;">' + state + '</span>');
            }
            else if (data.status === 5) {
                state = "Baneado";
                $('.perfil-info').append('<span class="btn v" style="background-color: #e2364d; font-size: 13px; font-weight: bold; cursor: default;">' + state + '</span>');
            }


        });
    };
    var name = $('.nickname').html();
    if (name == null) {
        name = $('.fn').html(); // Esto es para poder obtener el nick de los que la bugean como http://www.taringa.net/OverJT
        if (name == null) return; // ?? Por si pasa algo jamas antes visto en el mundo.
    }
    name = name.replace("@", "");
    ban(name);
    
    
    // Funcion para ver baneados en pestaña de seguidos/seguidores
    var loc = window.location.pathname;
    var rgx = new RegExp('/' + name + '/siguiendo'); // Un Regex para poder ver mas de 10 paginas...
    var rgx2 = new RegExp('/' + name + '/seguidores');
    
    if (loc.match(rgx) || loc.match(rgx2)) { // Solo se ejecuta si estoy en la pestaña seguidos/seguidores
        var array = [];
        var nick = $('.txt a');
        nick.each(function(){
            nick = $(this).html().replace(/\s/g, "");// Elimino white spaces de mierda <3
            array.push(nick);
        });
        
        var states = [];
        var i = 0;
        var massiveBan = function() {
            var dfd = $.Deferred();
            $.ajax({
                url: 'https://api.taringa.net/user/nick/view/' + array[i],
                success: function(data) {
                    if (data.status === 5){
                        states.push('Baneado');
                        dfd.resolve();
                    }
                    else if (data.status === 10) {
                        states.push('Activo');
                        dfd.resolve();

                    }
                }
            });
            return dfd.promise();
        };

        $('.mesigue').css({"margin-right": "70px", "font-family": "Lato", "font-style": "normal"}); // Corro el "Te esta siguiendo" un poco a la izquierda, de paso le saco esa fuente asquerosa.
        var main = function(){
            massiveBan().then(
                function() { 
                    if (states.length === 26) {
                        return;
                    }
                    else {
                        var divs = $('.txt');
                        if (states[i] == "Activo") {
                            divs.eq(i).prepend('<span class="btn v noban" style="background-color: #5bd3af; cursor: default; float:right; margin-right: 20%; margin-top: 0; line-height: 1; height: 30px;">' + states[i] + '</span>');
                        }
                        else {
                            divs.eq(i).prepend('<span class="btn v noban" style="background-color: #e2364d; cursor: default; float:right; margin-right: 20%; margin-top: 0; line-height: 1; height: 30px;">' + states[i] + '</span>');
                        }
                        i +=1;
                        main();
                    }

                });
        };
        main();
             
    }
    
})();