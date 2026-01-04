// ==UserScript==
// @name         KissAnime Remember Server
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Use your favorite server for all episodes
// @author       AnimeBro1
// @match        http://kissanime.ru/Anime/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30928/KissAnime%20Remember%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/30928/KissAnime%20Remember%20Server.meta.js
// ==/UserScript==

(function() {
    var server = window.location.href.split("&s=")[1];
    var selectable = document.getElementById("selectEpisode").getElementsByTagName("option");
    var prev = document.getElementById("btnPrevious").parentElement;
    var next = document.getElementById("btnNext").parentElement;
    prev.href += "&s="+server;
    next.href += "&s="+server;
    for(var i =0; i < selectable.length; i++){
        selectable[i].value += "&s="+server;
    }
})();