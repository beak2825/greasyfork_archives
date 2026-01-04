// ==UserScript==
// @name        Modo Undercover
// @author      Snizzle
// @version     1.0
// @supportURL  http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=Snizzle;Snitchzzle
// @copyright   2018, Snizzle
// @licence     MIT
// @description Affiche les modos qui postent en noir, en vert. Plus de surprises maintenant.
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match       *://www.jeuxvideo.com/forums/*
// @match       *://www.jeuxvideo.com/recherche/*
// @run-at      document-end
// @namespace https://greasyfork.org/users/23327
// @downloadURL https://update.greasyfork.org/scripts/374795/Modo%20Undercover.user.js
// @updateURL https://update.greasyfork.org/scripts/374795/Modo%20Undercover.meta.js
// ==/UserScript==

$(function($) {
    var listeModos = $(".liste-modo-fofo").text().trim();
    var color = "#3a9d23";
    $(".bloc-header").each(function(){
        var pseu = $(this).children(".text-user");
        if (listeModos.includes(pseu.html().trim())) {pseu.css("color",color);}
    })

    $(".topic-list-admin li:gt(0)").each(function(){
        var pseu = $(this).children(".topic-author");
        if (listeModos.includes(pseu.html().trim())) {pseu.css("color",color);}
    })
})