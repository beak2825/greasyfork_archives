// ==UserScript==
// @name         Shouts en Perfil
// @namespace    http://taringa.net/rata__7
// @version      0.1
// @description  Te muestra cantidad de shouts en el perfil y saca esos comentarios de la mugrosa home
// @author       Nezumi basado en el coso para ver baneados de Wixie y Aryoamgames
// @match        *://www.taringa.net/*
// @downloadURL https://update.greasyfork.org/scripts/25739/Shouts%20en%20Perfil.user.js
// @updateURL https://update.greasyfork.org/scripts/25739/Shouts%20en%20Perfil.meta.js
// ==/UserScript==

var formatear_miles = function(x){
    x = x.toString();
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

var shouts = function(user){
    $.get('https://api.taringa.net/user/nick/view/' + nick, function(data){
        $.get('https://api.taringa.net/user/stats/view/' + data.id, function(stats){
            var li = $('#user-metadata-profile ul li').eq(3);
            li.replaceWith('<li><strong><a href="/' + nick + '/mi">' + formatear_miles(stats.shouts) + '</a></strong><span>Shouts</span></li>');
        });
    });
};
var nick = $('.nickname').html();
if (nick == null) {
    nick = $('.fn').html(); // Esto es para poder obtener el nick de los que la bugean como http://www.taringa.net/OverJT
}
nick = nick.replace("@", "");
shouts(nick);