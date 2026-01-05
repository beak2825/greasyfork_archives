// ==UserScript==
// @name         Permalink a comentarios en shouts
// @version      0.1
// @description  Script que agrega un permalink al hacer clic en el horario en que se publicó un comentario dentro de un shout. No funciona para posts.
// @author       Rodro (http://www.taringa.net/rodroetienne   /_Rodro_)
// @namespace    Rodro
// @include      http*://www.taringa.net/*
// @include      http*://www.taringa.net/*/*
// @downloadURL https://update.greasyfork.org/scripts/25401/Permalink%20a%20comentarios%20en%20shouts.user.js
// @updateURL https://update.greasyfork.org/scripts/25401/Permalink%20a%20comentarios%20en%20shouts.meta.js
// ==/UserScript==

(function() {
    for (var i = 0; i < $(".comment-time").length; i++) {
        $(".comment-time")[i].setAttribute("href",$(".comment-time")[i].baseURI+"?notification#comment-"+$(".comment-time")[i].parentElement.parentElement.parentElement.parentElement.parentElement.attributes[2].value);
        var a = document.createElement('a');
        a.href = $(".comment-time")[i].baseURI+"?notification#comment-"+$(".comment-time")[i].parentElement.parentElement.parentElement.parentElement.parentElement.attributes[2].value;
        a.style = 'color:#adadae';

        $(".comment-time")[i].parentNode.insertBefore(a, $(".comment-time")[i]);
        a.appendChild($(".comment-time")[i]);
    }
})();