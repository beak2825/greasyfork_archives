// ==UserScript==
// @name         Ver banes
// @namespace    topu
// @version      1.2
// @description  Te muestra si un user esta ban o no.
// @author       topu
// @include      http*://www.taringa.net/*
// @include      http*://www.taringa.net/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17159/Ver%20banes.user.js
// @updateURL https://update.greasyfork.org/scripts/17159/Ver%20banes.meta.js
// ==/UserScript==

(function(){
    var ban = function(user){
        var state;
        $.get('https://api.taringa.net/user/nick/view/' + user, function(data){
            if (data.status === 10) {
                state = "Activo";
                $('.perfil-info').append('<span class="btn a" style="cursor: default;">' + state + '</span>');
            }
            else if (data.status === 5) {
                state = "Baneado";
                $('.perfil-info').append('<span class="btn r" style="cursor: default;">' + state + '</span>');
            }


        });
    };
    var name = $('.nickname').html();
    if (name == null) {
        name = $('.fn').html(); // Esto es para poder obtener el nick de los que la bugean como http://www.taringa.net/ElTopu
        if (name == null) return; // ??
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
            nick = $(this).html().replace(/\s/g, "");
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

        $('.mesigue').css({"margin-right": "70px", "font-family": "Lato", "font-style": "normal"}); // Corro el "Te esta siguiendo" un poco a la izquierda y de paso saco la fuente asquerosa.
        $('.grey.floatL').css('padding-top', '20px'); // Corro la descripcion un poco para abajo asi no choque con los botones de baneados
        var main = function(){
            massiveBan().then(
                function() { 
                    if (states.length === 26) {
                        return;
                    }
                    else {
                        var divs = $('#full-col .follow-buttons');
                        if (states[i] == "Activo") {
                            divs.eq(i).prepend('<span class="btn a" style=" cursor: default; width: 80px;">' + states[i] + '</span>');
                            console.log(divs.eq(i))
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