// ==UserScript==
// @name            YouTube Download MP3 320 KBPS - Nov 2022
// @description     Generates a MP3 button on YouTube.com. Convert YouTube to mp3 and download the file to your device. Updated for Youtube November 2022.
// @icon            https://www.rcyoutube.com/userscript/icon.png
//
// @author          Addon Developer; Furdieur
//
// @license         MIT
// @copyright       2019, Addon Developer; 2022, Furdieur
//
// @include         http://www.youtube.com/*
// @include         https://www.youtube.com/*
//
// @version         1.3
//
// @run-at          document-end
// @unwrap
// @namespace https://greasyfork.org/users/831918
// @downloadURL https://update.greasyfork.org/scripts/455720/YouTube%20Download%20MP3%20320%20KBPS%20-%20Nov%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/455720/YouTube%20Download%20MP3%20320%20KBPS%20-%20Nov%202022.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("firefox-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("count") && document.getElementById("320youtube") === null) {
            Addytpolymer();
        }
    }, 100);
} else {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
       }
    }, 100);
}

function Addytpolymer() {
    var buttonDiv = document.createElement("span");
    buttonDiv.style.width = "100%";
    buttonDiv.id = "320youtube";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("MP3 ⇩"));
    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#CC0000";
    addButton.style.color = "white";
    addButton.style.textAlign = "center";
    addButton.style.padding = "2px 10px";
    addButton.style.margin = "0px 10px";
    addButton.style.fontSize = "13px";
    addButton.style.border = "0";
    addButton.style.cursor = "pointer";
    addButton.style.borderRadius = "2px";
    addButton.style.fontFamily = "Roboto, Arial, sans-serif";
    addButton.style.textDecoration = "none";
    addButton.href = "https://320yt.com/en18/download?type=ytmp3&url=" + window.location.href;
    addButton.target = "_blank";
    buttonDiv.appendChild(addButton);

    var targetElement;

    /* From original version -- I don't think this works anymore. */

    //targetElement = document.querySelectorAll("[id='count']");
    //for (var i = 0; i < targetElement.length; i++) {
    //    if (targetElement[i].className.indexOf("ytd-video-primary-info-renderer") > -1) {
    //        targetElement[i].appendChild(buttonDiv);
    //    }
    //}


    /* New method to attach to DOM: */
    targetElement = document.querySelector("div#title h1");
    targetElement.appendChild(buttonDiv);
}


})();