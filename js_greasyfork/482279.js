// ==UserScript==
// @name         HideStreetViewGoogleMapsInterface
// @namespace    http://tampermonkey.net/
// @version      2023-12-15_1
// @description  Hide the google interface on google maps
// @author       You
// @include      *google.com/maps/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482279/HideStreetViewGoogleMapsInterface.user.js
// @updateURL https://update.greasyfork.org/scripts/482279/HideStreetViewGoogleMapsInterface.meta.js
// ==/UserScript==


var isToggle = false;
function Inject() {
    let titlecard = document.getElementById("titlecard")
    if (!titlecard) { return; }
    const style = "background-image: none;position: absolute;top: -10px;right: 10px;width: 100%;height: 48px;color: #fff;font-size: .5em;cursor: pointer;";
    titlecard.insertAdjacentHTML('afterend', '<div class="SioGabx" id="SioCleanMaps"><button aria-label="Quitter" style="' + style + '"></button></div>')
    document.getElementById("SioCleanMaps").onclick = toggle;
}

function toggle(){
     hideRunWay();
    if (isToggle){
        show();
        isToggle = false;
    }else{
        isToggle = true;
        hide();
    }
}

Inject();show();

function hide(){
    document.querySelector("#SioCleanMaps button").innerText = "Afficher l'interface";
    document.getElementById("watermark").style.display = "none";
    document.getElementById("image-header").style.display = "none";
    document.getElementById("titlecard").style.display = "none";
    document.getElementById("minimap").style.display = "none";
    document.getElementById("runway-expand-button").style.display = "none";
    document.getElementById("zoom").style.display = "none";
    document.getElementById("compass").style.display = "none";
    document.querySelector(".scene-footer").style.display = "none";
    document.getElementById("bottom-pane").style.display = "none";
    document.getElementById("play").style.display = "none";
    document.getElementById("searchbox").style.display = "none";
    document.getElementById("runway").style.display = "none";
}

function show(){
    document.querySelector("#SioCleanMaps button").innerText = "Masquer l'interface";
    document.getElementById("watermark").style.display = "";
    document.getElementById("image-header").style.display = "";
    document.getElementById("titlecard").style.display = "";
    document.getElementById("minimap").style.display = "";
    document.getElementById("runway-expand-button").style.display = "";
    document.getElementById("zoom").style.display = "";
    document.getElementById("compass").style.display = "";
    document.querySelector(".scene-footer").style.display = "";
    document.getElementById("bottom-pane").style.display = "";
    document.getElementById("play").style.display = "";
    document.getElementById("searchbox").style.display = "";
    document.getElementById("runway").style.display = "";
}

function hideRunWay(){
    if (document.getElementById("runway").getBoundingClientRect().height != 0){
        document.querySelector("#runway-expand-button label").click()
    }

}