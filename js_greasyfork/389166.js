// ==UserScript==
// @name         SJ ACIX
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Rende ACIX compatibile con Google Chrome (e probabilmente con tutti i browser che supportano Tampermonkey)
// @author       Mihai Olaru
// @match        http://posta.softjam.it/acix/*
// @match        https://posta.softjam.it/acix/*
// @grant        none
// @require http://code.jquery.com/jquery-3.0.0.slim.min.js
// @todo         convert all JavaScript to jQuery
// @downloadURL https://update.greasyfork.org/scripts/389166/SJ%20ACIX.user.js
// @updateURL https://update.greasyfork.org/scripts/389166/SJ%20ACIX.meta.js
// ==/UserScript==
function isFunction(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
}

(function() {
    'use strict';
    jQuery.noConflict();
    //
    // Chiamate > Diario
    if (jQuery(document).find("title").text() == "Inserimento Nuovo Diario" ||
        jQuery(document).find("title").text().substr(0,22) == "Duplicazione Diario Id") {
        jQuery("#DivDatiDiario").css("height","292px");
        jQuery("#Oggetto").css("width","500px");
        jQuery("#Descrizione").css("width","500px");
    }


    if ( jQuery(document).find("title").text() == "Gestione Chiamate" ) {
        jQuery("<style type='text/css'> .button-CD{ cursor:pointer;color:#000;border:#003399 1px solid;background-color:#99CCFF;width:22px;height:20px;font-size:11px;font-weight:bold;margin-left:-2px;margin-right:-1px;font-family:Verdana,Arial;} </style>").appendTo("head");
        jQuery('span.CD').each(function( index ) {
            var attr_onclick = jQuery(this).attr("onclick");
            var attr_text    = jQuery(this).text();
            var attr_title   = jQuery(this).attr("title");
            jQuery(this).replaceWith('<button class="button-CD" onclick="'+attr_onclick+'" title="'+attr_title+'">'+attr_text+'</button>');
        });
        jQuery('div.CDI').css("padding-left","8px");
    }

    // comune a tutte le pagine con errori JS
    var defineParentFramesAsFunction = false;

    // turni
    if ( typeof InserisciTurno === "function" ) {
        defineParentFramesAsFunction = true;
    }
    // reperibilità
    if ( typeof InserisciReperibilita === "function" ) {
        defineParentFramesAsFunction = true;
    }
    // nota spese
    var comandiNotaSpese = document.getElementById("InserisciN");
    if ( comandiNotaSpese ) {
        defineParentFramesAsFunction = true;
    }


    // sovrascrivo parent.frames come function
    if ( defineParentFramesAsFunction ) {
        if (parent.frames && !isFunction(parent.frames)) {
            var originParentFrames = parent.frames;
            parent.frames = function(name) { return originParentFrames[name]; };
        }
    }

})();