// ==UserScript==
// @name         Agar.io custom skins
// @namespace    Custom Skins
// @version      1.0
// @description  Custom Skins for Agar.io
// @author       ArcadeGamer
// @match        *.agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500462/Agario%20custom%20skins.user.js
// @updateURL https://update.greasyfork.org/scripts/500462/Agario%20custom%20skins.meta.js
// ==/UserScript==
 //edit the main ads block

var element = document.getElementById("mainui-ads");
element.innerHTML = '';
//change css style
element.style.height = "115px";

//inject the skin input

window.onload = document.getElementById('instructions').innerHTML += '<br><br>Custom Skins<br><br><input placeholder="Paste your image link here" id="skin" class="form-control" style="width:275px" <div id="h2u"><font size="2" color="#FF0000"><br><center style="margin-bottom: -5px;"><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 2,null);" id="ss"></a><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 3, null);" id="hh"></div>';

//set skin when play is pressed

document.getElementById('play').onclick = function() {
        if (skin.value == '' || skin.value == skin.defaultValue) {
        }
   else {
        core.registerSkin(document.getElementById('nick').value, null, document.getElementById('skin').value, 2,null);
   }
        setTimeout(function(){
        }, 1000);
    };