// ==UserScript==
// @name         TMDB Video Player
// @namespace    https://greasyfork.org/en/scripts/485265-tmdb-video-player
// @version      0.3.2
// @description  Add video player from vidsrc.me directly into TheMovieDB movie/serie webpage.
// @author       Guillome91 & Tommy0412
// @license      MIT
// @match        https://www.themoviedb.org/movie/*
// @match        https://www.themoviedb.org/tv/*
// @icon         https://www.themoviedb.org/favicon.ico
// @connect      themoviedb.org
// @connect      vidsrc.me
// @downloadURL https://update.greasyfork.org/scripts/485265/TMDB%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/485265/TMDB%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = document.URL;
    const api = currentUrl.replace(/[^0-9]/g, "");
    const type = currentUrl.split('/')[3];
    var player_url,location;
    if(type == "movie"){
        player_url= "https://vidsrc.me/embed/movie/"+api;
        //console.log(player_url);

        location = document.querySelector("div.header");
        let ifr = document.createElement("iframe");
        ifr.id = "vidsrc.me";
        ifr.height = 800;
        ifr.allowFullscreen = "true";
        ifr.webkitallowfullscreen="true";
        ifr.mozallowfullscreen="true";
        ifr.src = player_url;

        location.after(ifr);
    }

    if(type == "tv"){
        location = document.querySelector("div.header");
        player_url = "https://vidsrc.me/embed/tv/"+api;
        let div = document.createElement("div");
        let ifr = document.createElement("iframe");
        ifr.id = "vidsrc.me";
        ifr.height = 400;
        ifr.width = 400;
        ifr.src = player_url;
        ifr.allowFullscreen = "true";
        ifr.webkitallowfullscreen="true";
        ifr.mozallowfullscreen="true";
        div.appendChild(ifr);
        location.after(ifr);
    }
})();