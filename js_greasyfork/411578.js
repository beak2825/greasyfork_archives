// ==UserScript==
// @name FullWall 666
// @namespace https://greasyfork.org/fr/scripts/411578-fullwall
// @author Odul (original code), MJay (refactoring)
// @date 19/09/2020
// @version 1.666
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Main
// @compat Firefox, Chrome
// @description Change la carte des batiments dans DC
// @downloadURL https://update.greasyfork.org/scripts/411578/FullWall%20666.user.js
// @updateURL https://update.greasyfork.org/scripts/411578/FullWall%20666.meta.js
// ==/UserScript==

//Dictionnaires
let maps = [];
let backgrounds = [];
let youtubeSounds = [];
let youtubeNbrInList = [];
let mp3Sounds = [];

//Icônes de son
const imgUnmute = 'url(https://i.imgur.com/uvIB44X.png)';
const imgMute = 'url(https://i.imgur.com/8oV9IrJ.png)';

function loadArrays() //Chargement initial de la BDD dans les dictionnaires
{
    $.ajax({
        type: 'GET',
        url: "https://docs.google.com/uc?export=download&id=" + "0B5SS13RZj6nZbTNHVFVUeGVVRXc", //L'URL de la BDD
        async: false,
        jsonpCallback: 'jsonCallback' + "0_1", //Nécessaire pour pouvoir convertir directement la BDD en json
        contentType: "application/json",
        dataType: 'jsonp',
        success: function(json) {
            //Enregistrement de la BDD dans les dictionnaires
            for (let bat of json.batiment) {
                if(!bat) continue; // Skip si itération bugguée
                let id = bat[0];
                maps[id] = bat[1];
                backgrounds[id] = bat[2];
                youtubeSounds[id] = bat[3];
                youtubeNbrInList[id] = parseInt(bat[4]) || 1;
                mp3Sounds[id] = bat[5];
            }

            loadMap();
        },
        error: function(e) {
            console.log(e.message);
        }
    });
}


function loadMap() //Récupère l'ID du bâtiment pour savoir si les dictionnaires contiennent un FW pour celui-ci, et l'afficher le cas échant.
{
    let url = $('#carte_fond').css("background-image");
    let id = url.substring(url.lastIndexOf("_") + 1, url.lastIndexOf("\."));



    if(maps[id]) {
        let img = new Image();

        img.onload = function() {
            $('#carte_fond').css('background-image', 'url(' + (maps[id].match(/^http(s*)\:\/\//) ? maps[id] : 'https://bit.ly/' + maps[id]) + ')'); //Le boolean détermine si maps[id] est une URL complète ou un suffixe bitly
        }
        img.onerror = function() {
            console.log("Erreur: le lien " + img.src + " est invalide.");
        }

        img.src = maps[id].match(/^http(s*)\:\/\//) ? maps[id] : 'https://bit.ly/' + maps[id];
    }

    if(backgrounds[id])
        $('#divFullWallBackground').css("display","block").css('background-image', 'url(' + (backgrounds[id].match(/^http(s*)\:\/\//) ? backgrounds[id] : 'https://bit.ly/' + backgrounds[id]) + ')'); //Le boolean détermine si backgrounds[id] est une URL complète ou un suffixe bitly

    if(youtubeSounds[id])
    {
        if(youtubeNbrInList[id] > 1)
        {
            let milliseconds = ((new Date).getTime()) % (90000 * youtubeNbrInList[id]);
            let index = Math.floor(milliseconds / 90000);
            $('#iframeyoutube').attr("src", "https://www.youtube.com/embed/" + youtubeSounds[id] + "&autoplay=1&loop=1&index=" + index);
        }
        else
            $('#iframeyoutube').attr("src", "https://www.youtube.com/embed/" + youtubeSounds[id] + "&autoplay=1&loop=1");

        if($('#fullsound').attr("volume") == 0)
            $('#endAudioFullSound').css("background-image", imgUnmute);
    }
    else if (mp3Sounds[id])
    {
        $("#fullsound").attr("src", (mp3Sounds[id].match(/^http(s*)\:\/\//) ? mp3Sounds[id] : 'https://bit.ly/' + mp3Sounds[id])); //Le boolean détermine si mp3Sounds[id] est une URL complète ou un suffixe bitly
        $('#fullsound')[0].load();
        $('#fullsound')[0].play();
        if($('#fullsound').attr("volume") == 0)
            $('#endAudioFullSound').css("background-image", imgUnmute);
    }
    else if ($('#fullsound').attr("volume") == 0)
        $('#endAudioFullSound').css("background-image", imgMute);
}

//Override pour enlever tout FW à la sortie d'un bâtiment
Carte.prototype.useReturnMoveSave = Carte.prototype.useReturnMove;

Carte.prototype.useReturnMove = function (xml, reload, theMap) {
    if ($(xml).find('sortie').length) {
        $('#divFullWallBackground').css("display","none");
        $('#iframeyoutube').attr("src","");
        $('#fullsound')[0].pause();
    }
    this.useReturnMoveSave(xml,reload, theMap);
}

//Override pour ajouter loadmap()
Carte.prototype.displayMapSave = Carte.prototype.displayMap;

Carte.prototype.displayMap = function (a, b, c) {
    $.ajaxSetup({async: false});
    this.displayMapSave(a, b, c);
    loadMap();
    $.ajaxSetup({async: true});
}

// ---------------- MAIN FUNCTION ----------------
// Création des éléments HTML avec jQuery, puis appel de loadArrays()
$(document).ready(function() {

    $("<div id=divFullWallBackground>")
        .prependTo($("#ingame"))
        .css({"display": "none",
              "position": "absolute",
              "width": "100%",
              "height": "100%",
              "background": "none no-repeat scroll center 0px transparent",
              "z-index": "21"});

    $("<audio id=fullsound>")
        .appendTo($("body"))
        .css("display: none");
    $("#fullsound>").attr("volume", "0");

    $('<li class="separator"></li>').prependTo($('#bandeau ul.menus'));
    $("<li id=endAudioFullSound>")
        .prependTo($('#bandeau ul.menus'))
        .css({"height": "30px",
              "top": "0px",
              "left": "5px",
              "background-image": imgMute,
              "background-repeat": "no-repeat",
              "background-size": "29px 15px",
              "background-position-y": "4px",
              "z-index": "999999",
              "color": "#999"})
        .addClass('link')
        .text("FW")
        .click(function() {
            let vol = $("#fullsound").attr("volume") == 1 ? 0 : 1;
            $("#fullsound").attr("volume", vol);
            $("#endAudioFullSound").css("background-image", vol ? imgUnmute : imgMute);
            $("#liiframe").css("display", vol ? "block" : "none");
        });

    $("<li id=liiframe>")
        .prependTo($('#bandeau ul.menus'))
        .css('display','none');

    $("<li id=diviframe1>")
        .appendTo($('#liiframe'))
        .css({"position": "relative",
              "width": "267px",
              "height": "25px",
              "overflow": "hidden"});

    $("<li id=diviframe2>")
        .appendTo($('#diviframe1'))
        .css({"position": "absolute",
              "top": "-276px",
              "left": "-5px"});

    $("<iframe id=iframeyoutube>")
        .appendTo($('#diviframe2'))
        .css({"width": "300px",
              "height": "300px"});

    $.ajaxSetup({async: false});
    loadArrays();
    $.ajaxSetup({async: true});
})