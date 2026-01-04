// ==UserScript==
// @name         IMDB Video Player - 2embed (play streaming videos from IMDb)
// @name:fr      Lecture en Streaming de films et séries IMDb
// @namespace    https://greasyfork.org/fr/scripts/437200-imdb-video-player-2embed-play-streaming-videos-from-imdb
// @version      0.3
// @description  Add video player from 2embed.ru directly into IMDB movie/serie webpage.
// @description:fr  Lis le media en streaming directement sur IMDb.
// @author       Guillome91
// @license      MIT
// @match        https://www.imdb.com/title/*
// @icon         https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png
// @grant        GM_xmlhttpRequest
// @connect      imdb.com
// @connect      2embed.ru
// @connect      api.themoviedb.org
// @downloadURL https://update.greasyfork.org/scripts/437200/IMDB%20Video%20Player%20-%202embed%20%28play%20streaming%20videos%20from%20IMDb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437200/IMDB%20Video%20Player%20-%202embed%20%28play%20streaming%20videos%20from%20IMDb%29.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const currentUrl = document.URL;
    const api = currentUrl.split('/')[4];
    console.log(api);
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
                        console.log("tmbd_id= "+tmdb_id);
                        resolve(tmdb_id);
                }
            });
        });
    }

    function insertPlayerSerie(tmdb_id){
        return new Promise((resolve,reject)=>{
            location = document.querySelector('main');
            player_url = "https://www.2embed.ru/library/tv/"+tmdb_id;
            let div = document.createElement("div");
            div.setAttribute('style','overflow: hidden; margin: 15px auto; max-width: 762px;');
            let ifr = document.createElement("iframe");
            ifr.setAttribute('style',"border: 0px none; margin-left: -20px; height: 850px; margin-top: -150px; width: 800px;");
            ifr.setAttribute('scrolling','no');
            ifr.id = "2embed";
            ifr.src = player_url;
            ifr.allowFullscreen = "true";
            ifr.webkitallowfullscreen="true";
            ifr.mozallowfullscreen="true";
            div.appendChild(ifr);
            location.before(div);
            resolve();
        });
    }

    function insertPlayerMovie(){
            console.log("it's a movie");
            location = document.querySelector('main');
            player_url = "https://www.2embed.ru/embed/imdb/movie?id="+api;
            console.log(player_url);
            let ifr = document.createElement("iframe");
            ifr.setAttribute('style','height:800px; width:100%; margin-left: auto; margin-right: auto;');
            ifr.id = "2embed";
            ifr.allowFullscreen = "true";
            ifr.webkitallowfullscreen="true";
            ifr.mozallowfullscreen="true";
            ifr.src = player_url;
            location.before(ifr);
    }
})();

