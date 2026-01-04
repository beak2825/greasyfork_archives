// ==UserScript==
// @name         MAL Random Anime Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a random anime button to the MAL website nav.
// @author       Haxorsnake
// @match        http*://myanimelist.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40235/MAL%20Random%20Anime%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/40235/MAL%20Random%20Anime%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var node = document.createElement("LI");
    var a = document.createElement("a");
    var text = document.createTextNode("Random");

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    function get_rmal() {
        let id = Math.floor(Math.random() * 37601) + 1;
        var rmals = JSON.parse(httpGet("https://api.jikan.me/anime/" + id));
        let count = Object.keys(rmals).length;
        while(count == 1){
            console.log("It happened");
            let id = Math.floor(Math.random() * 37601) + 1;
            let nrmals = JSON.parse(httpGet("https://api.jikan.me/anime/" + id));
            let ncount = Object.keys(nrmals).length;
            if (ncount > 1){
                rmals = nrmals;
                break;
            }
        }
        return rmals.link_canonical;
    }

    node.classList.add("small2");
    a.style.cursor = "pointer";
    a.onclick = function () {
        location.href = get_rmal();
    };
    a.appendChild(text);
    node.appendChild(a);
    document.getElementById("nav").appendChild(node);
})();