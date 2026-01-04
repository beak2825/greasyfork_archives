// ==UserScript==
// @name         Mots flêchés RCI Jeux - Afficher force
// @description  Afficher la force d'une grille de mots flêchés 20Minutes, LCI, Telestar, ...
// @namespace    http://taoufix.com/20min-motsfleches-afficher-force
// @version      1.3.4
// @author       taoufix
// @match        http*://rcijeux.fr/game/*/mfleches?id=*
// @match        http*://www.rcijeux.fr/game/*/mfleches?id=*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/369237/Mots%20fl%C3%AAch%C3%A9s%20RCI%20Jeux%20-%20Afficher%20force.user.js
// @updateURL https://update.greasyfork.org/scripts/369237/Mots%20fl%C3%AAch%C3%A9s%20RCI%20Jeux%20-%20Afficher%20force.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function id() {
        return window.location.href.split('=')[1];
    }


    // ------------------------------------------------------------------------------------------------
    // Add force and MF source
    // ------------------------------------------------------------------------------------------------

    var IMG_URL = "https://raw.githubusercontent.com/taoufix/user-scripts/master/permalink/mfleches/";

    var CONF = {
        "20minutes": { mfjPath: "/grids/"},
    };
    function source() {
        return window.location.pathname.split('/')[2];
    }

    function stars(force) {
        var s = "";
        for (var i = 0; i < force; i++) {
            s += "★";
        }
        for (var j = force; j < 4; j++) {
            s += "☆";
        }
        return s;
    }

    function mfjUrl() {
        var src = source();
        var path = CONF[src]? CONF[src].mfjPath : "/mfleches/grids/";
        return window.location.origin + "/drupal_game/" + src + path + id() + ".mfj";
    }

    $.get(mfjUrl())
     .done(function( data ) {
        var force = data.split("\n")[3].split('"')[1];
        var src = source();
        $("#game-name").html("<img style='vertical-align:middle;' src='"+IMG_URL+src+".png'> Force : " + stars(force));
        $("title").html(src.toUpperCase());
     })
     .fail(function(err) {
        console.log("---- ERROR ----");
        console.log(err);
     });

    // ------------------------------------------------------------------------------------------------
    // Post game loading
    // ------------------------------------------------------------------------------------------------

    // TODO: find a better way to do this, instead of timeout
    setTimeout(function(){
        // Fix padding (LCI)
        $(".app").css("max-width", "880px");
        $(".game").css("padding", "15px !important");

        // Remove image click (LCI)
        $('image[data-linkto]').removeAttr('data-linkto');
    }, 10000);

    // ------------------------------------------------------------------------------------------------
    // Add definition box
    // ------------------------------------------------------------------------------------------------

    $('body').append('<div id="def-box" style=position:absolute;top:0;right:0;color:white;'+
                     'font-family:sans-serif;height:106px;width:110px;font-size:16px;text-align:center;'+
                     'display:flex;flex-direction:column;justify-content:center;align-items:center;"></div>');

    $("#def-box").click(function(){
        $("#def-box").hide();
    });
    var originalHighlightNode = window.rci.Cells.Definition.prototype.highlightNode;
    window.rci.Cells.Definition.prototype.highlightNode = function() {
        // Execute the original method
        var result = originalHighlightNode.apply( this, arguments );

        var def = this;
        $("#def-box").html(def.lines.join("<br>"));
        if (def.concours) {
            $("#def-box").css("background-color", "RoyalBlue");
        } else {
            $("#def-box").css("background-color", "black");
        }
        $("#def-box").show();


        // return the original result
        return result;
    };


    // ------------------------------------------------------------------------------------------------
    // Add piano button
    // ------------------------------------------------------------------------------------------------

    $('body').append('<div id="piano" style=position:absolute;top:5px;left:0;'+
                   'font-size:24px;text-align:center;cursor:pointer;'+
                     'display:flex;flex-direction:column;justify-content:center;align-items:center;">🎹</div>');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var ALPHABET = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    $("#piano").click(async function(){
        var gm = window.rci.gameInstances.get('gameManager');
        for (var i in ALPHABET) {
            await sleep(50);
            gm.inputValue(ALPHABET[i]);
        }
    });


})();
