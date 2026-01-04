// ==UserScript==
// @name         TMDB Video Player
// @namespace    https://greasyfork.org/fr/scripts/437157-tmdb-video-player
// @version      0.3
// @description  Add video player from 2embed.ru directly into TheMovieDB movie/serie webpage.
// @author       Guillome91
// @license      MIT
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @icon         https://www.themoviedb.org/favicon.ico
// @connect      themoviedb.org
// @connect      2embed.ru
// @downloadURL https://update.greasyfork.org/scripts/437157/TMDB%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/437157/TMDB%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Retrieve api number
    const currentUrl = document.URL;
    const api = currentUrl.replace(/[^0-9]/g, "");
    const type = currentUrl.split('/')[3];
    var player_url,location;
    if(type == "movie"){
        player_url= "https://www.2embed.ru/embed/tmdb/"+type+"?id="+api;
        console.log(player_url);

        //add player
        location = document.querySelector("div.header");
        let ifr = document.createElement("iframe");
        ifr.id = "2embed";
        ifr.height = 800;
        ifr.allowFullscreen = "true";
        ifr.webkitallowfullscreen="true";
        ifr.mozallowfullscreen="true";
        ifr.src = player_url;

        location.after(ifr);
    }

    if(type == "tv"){
        location = document.querySelector("div.header");
        player_url = "https://www.2embed.ru/library/tv/"+api;
        console.log(player_url);
        let div = document.createElement("div");
        div.setAttribute('style','border-radius: 25px;overflow: hidden; margin: 15px auto; max-width: 762px;');
        let ifr = document.createElement("iframe");
        ifr.setAttribute('style',"border: 0px none; margin-left: -20px; height: 850px; margin-top: -150px; width: 800px;");
        ifr.setAttribute('scrolling','no');
        ifr.id = "2embed";
        ifr.src = player_url;
        ifr.allowFullscreen = "true";
        ifr.webkitallowfullscreen="true";
        ifr.mozallowfullscreen="true";
        div.appendChild(ifr);
        location.after(div);
    }
})();