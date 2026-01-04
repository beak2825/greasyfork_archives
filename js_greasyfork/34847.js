// ==UserScript==
// @name         AutoOpener SteamGifts
// @namespace    https://greasyfork.org/es/users/158251-danala-danazo
// @version      0.4
// @description  Abre todos los sorteos de la pagina SteamGifts (usar junto con AutoJoin SteamGifts)
// @author       DanalaDanazo
// @include https://www.steamgifts.com/
// @include https://www.steamgifts.com/giveaways/search?type=wishlist
// @downloadURL https://update.greasyfork.org/scripts/34847/AutoOpener%20SteamGifts.user.js
// @updateURL https://update.greasyfork.org/scripts/34847/AutoOpener%20SteamGifts.meta.js
// ==/UserScript==

(function() {
    if (confirm("¿Abrir los sorteos?") === true) {
        var obj = $('a[class="giveaway_image_thumbnail"]').nextAll('href');
        var puntos = $('span[class="giveaway__heading__thin"]');
        var puntosJugador = $('span[class="nav__points"]');
        var lista = $('div[class="giveaway__row-outer-wrap"]').nextAll('href');
        var i = 0;
        myLoop(obj, puntos, 0, puntosJugador[0].textContent, lista, i);
    }
})();

function myLoop(obj, puntos, puntosTotal, puntosJugador, lista, i) {
    setTimeout(function(obj, puntos, puntosTotal, puntosJugador, lista, i) {
        i++;
        var puntosReform = comprobarPuntos(puntos[i].textContent, puntosTotal, puntosJugador);
        if (puntosReform != "Invalido") {
            if (lista.prevObject[i].children[0].className != "giveaway__row-inner-wrap is-faded") {
                puntosTotal += parseInt(puntosReform);
                var link = obj.prevObject[i].href;
                window.open(link, '_blank');
            }
        }
        if (i < obj.prevObject.length && puntosTotal <= puntosJugador) {
            myLoop(obj, puntos, puntosTotal, puntosJugador, lista, i);
        } else {
            alert("Finalizado");
        }
    }, 1000, obj, puntos, puntosTotal, puntosJugador, lista, i);
}

function comprobarPuntos(puntos, puntosTotal, puntosJugador) {
    var puntosReform = "";
    if (puntos.length < 6) {
        puntosReform = puntos.substring(1, puntos.length-2);
    } else {
        puntosReform = "Invalido";
    }
    if ((puntosTotal + parseInt(puntosReform)) <= puntosJugador) {
        return puntosReform;
    } else {
        return "Invalido";
    }
}