// ==UserScript==
// @name         ColorTchat
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Colore au choix le texte placé entre '&'
// @author       DarKobalt
// @match        https://www.dreadcast.net/Main
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21042/ColorTchat.user.js
// @updateURL https://update.greasyfork.org/scripts/21042/ColorTchat.meta.js
// ==/UserScript==

//Création de l'input de couleur
var strColorBox = '<div style="z-index:999999; position: relative; top:55px; left:0px;"><input type="color" id="colorBox" class="DC_color"><p id="colorBoxP" class="DC_color" style="top:-22px; left:50px; width:60px; text-align:center; background-color:rgba(0, 0, 0, 0.35);"></p></div>';
$("#zone_chat").append(strColorBox);

var color = document.getElementById("colorBox").value;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

var dcct = getCookie("dcct_color");
if (dcct === "") {
    setCookie("dcct_color", color, 30);
} else {
    document.getElementById("colorBox").value = dcct;
    $("p#colorBoxP").text(dcct);
}

$("#colorBox").change(function() {
    setCookie("dcct_color", document.getElementById("colorBox").value, 30);
    $("p#colorBoxP").text(document.getElementById("colorBox").value);
});

var colorText = function(e) {
    if (e.keyCode==13) {
        color = document.getElementById("colorBox").value;
        $("#chatForm .text_chat").val($("#chatForm .text_chat").val().replace(/\&([^\&]+)\&/gi, "[couleur=" + color.slice(1) + "]$1[/couleur]"));
        $("#chatForm .text_chat").val($("#chatForm .text_chat").val().replace(/\(\(([^\)]+)\)\)/gi, "[couleur=BBBBBB](($1))[/couleur]"));
    }
};

document.addEventListener('keypress', colorText, false);

