// ==UserScript==
// @name         IMDB Video Player - vidsrc.me (play streaming videos from IMDb)
// @name:fr      Lecture en Streaming de films et séries IMDb
// @namespace    https://greasyfork.org/en/scripts/485149-imdb-video-player-vidsrc-to-play-streaming-videos-from-imdb
// @version      0.3.2
// @description  Add video player from vidsrc.to directly into IMDB movie/serie webpage.
// @description:fr  Lis le media en streaming directement sur IMDb.
// @author       Guillome91 & Tommy0412
// @license      MIT
// @match        https://www.imdb.com/title/*
// @match        https://m.imdb.com/title/*
// @icon         https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png
// @grant        GM_xmlhttpRequest
// @connect      imdb.com
// @connect      m.imdb.com
// @connect      vidsrc.me
// @connect      api.themoviedb.org
// @downloadURL https://update.greasyfork.org/scripts/485149/IMDB%20Video%20Player%20-%20vidsrcme%20%28play%20streaming%20videos%20from%20IMDb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/485149/IMDB%20Video%20Player%20-%20vidsrcme%20%28play%20streaming%20videos%20from%20IMDb%29.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const currentUrl = document.URL;
    const api = currentUrl.split('/')[4];
    //console.log(api);
    var location, player_url;

    if (document.title.includes('Series')) {
        getTmdbIDSerie()
        .then(insertPlayerSerie)
        .catch(e => console.log(e.message));

    } else {
        insertPlayerMovie();
    }

    function getTmdbIDSerie(){
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.themoviedb.org/3/find/"+api+"?api_key=8d6d91941230817f7807d643736e8a49&language=en-US&external_source=imdb_id",
                onload: function(response) {
                        let tmdb_id = JSON.parse(response.responseText).tv_results[0].id;
                        //console.log("tmbd_id= "+tmdb_id);
                        resolve(tmdb_id);
                }
            });
        });
    }

    function insertPlayerSerie(tmdb_id){
        return new Promise((resolve,reject)=>{
            location = document.querySelector('main');
            player_url = "https://vidsrc.me/embed/tv/"+tmdb_id;
            let ifr = document.createElement("iframe");
            ifr.setAttribute('style','height:800px; width:100%; margin-left: auto; margin-right: auto;');
            ifr.id = "vidsrc";
            ifr.src = player_url;
            ifr.allowFullscreen = "true";
            ifr.webkitallowfullscreen="true";
            ifr.mozallowfullscreen="true";
            location.before(ifr);
            resolve();
        });
    }

    function insertPlayerMovie(){
            console.log("it's a movie");
            location = document.querySelector('main');
            player_url = "https://vidsrc.me/embed/movie/"+api;
            let ifr = document.createElement("iframe");
            ifr.setAttribute('style','height:800px; width:100%; margin-left: auto; margin-right: auto;');
            ifr.id = "vidsrc";
            ifr.allowFullscreen = "true";
            ifr.webkitallowfullscreen="true";
            ifr.mozallowfullscreen="true";
            ifr.src = player_url;
            location.before(ifr);
    }
})();
