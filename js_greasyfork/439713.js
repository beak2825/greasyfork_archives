// ==UserScript==
// @name         Youtube
// @namespace    https://github.com/Shelicus
// @version      1.0
// @description  Remove youtube videos
// @author       Shelicus
// @match        https://www.youtube.com/*
// @exclude      *://*.youtube.com/channel/*
// @exclude      *://*.youtube.com/c/*
// @license      CC
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/439713/Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/439713/Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var intvl, intvl2, intvl3, startToAppend = 4000, loop = 5000, loopse = 500;
    //startToAppend -> Time for wait till YouTube classes load;
   
    //legt neues Element an im Script
    setTimeout(appendElement, startToAppend);
    
    //Aufruf der Funktion 1
    intvl = setInterval(function(){
        removeEndScreens("ytp-ce-element");
    },loop);

    //Aufruf der Funktion 2
    intvl2 = setInterval(function(){
        removevideos("div#items.style-scope.ytd-watch-next-secondary-results-renderer");
    },loopse);

    //Aufruf der Funktion 3
    intvl3 = setInterval(function(){
        removevideosstartseite("contents");
    },loopse);
    //loop = check interval for new End-Screens;

    //Anlegen eines Neuen Elements -> Eigentlich nicht mehr von nöten
    function appendElement() {
        var el = document.createElement("span");
        el.id = "removed_ess";
        el.style.textAlign = "center";
        document.getElementsByClassName("style-scope ytd-video-secondary-info-renderer")[1].appendChild(el);
    }

    //Funktion zu löschung der Verlinkten Videos am Ende des Video
    function removeEndScreens(className){
        var elements = document.getElementsByClassName(className);
        while(elements.length > 0){
            if(elements[0].parentNode.removeChild(elements[0])){
                console.log("Found ES");
                 }
            else{
                console.log("Not found ES yet");
            }
        }
    }

    //Funktion zu löscung der Videos Unterhalb des Videos
    function removevideos(Name){
        var elemento;
        elemento = document.querySelectorAll(Name)
        if(elemento.length > 0){
             elemento[0].remove();
        }
     }

    //Funktion zur löscung der Videos auf der Startseite
    function removevideosstartseite(ClassName){
        var elementozwe;
        elementozwe = document.querySelectorAll('div#contents[class="style-scope ytd-rich-grid-renderer"]')
        if(elementozwe.length > 0){
            elementozwe[0].remove();
         }
    }
})();