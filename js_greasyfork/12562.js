// ==UserScript==
// @name         Filtre anti-connerie sur CT
// @version      0.2
// @description  Très util
// @author       You
// @match        http://www.cybertown.fr/*
// @grant        none
// @namespace IG_CT
// @downloadURL https://update.greasyfork.org/scripts/12562/Filtre%20anti-connerie%20sur%20CT.user.js
// @updateURL https://update.greasyfork.org/scripts/12562/Filtre%20anti-connerie%20sur%20CT.meta.js
// ==/UserScript==

$(document).ajaxComplete( function() {
    if($('[id_perso_tchat=548]').is(':visible')) {
        $('[id_perso_tchat=548]').hide();
        console.log('Comique kické.');
    }
    if($('[id_perso_tchat=565]').is(':visible')) {
        $('[id_perso_tchat=565]').hide();
        console.log('Comique kické.');
    }
     if($('[id_perso_tchat=576]').is(':visible')) {
        $('[id_perso_tchat=576]').hide();
        console.log('Comique kické.');
    }
});