// ==UserScript==
// @name         MyAnimeList Search Anime/MangaList from Profile
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.2
// @description  Allows you to search a users anime/manga list without opening their list first.
// @author       PurplePinapples
// @match        https://myanimelist.net/profile/*
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/382286/MyAnimeList%20Search%20AnimeMangaList%20from%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/382286/MyAnimeList%20Search%20AnimeMangaList%20from%20Profile.meta.js
// ==/UserScript==

function urlOpener(urlToOpen, events) {
   if (events.ctrlKey || events.metaKey || events.which == 2) {
      events.preventDefault(); // prevent middle click from opening tab, so it doesnt open twice.
      window.open(urlToOpen, "_blank"); // new tab
  } else {
      document.location.href = urlToOpen;
  }
}

(function () {
    "use strict";
  
    // grab username
    let username = $("h1 span").first().text().trim().split(" ")[0].slice(0, -2);
  
    // add CSS
    $('head').append('<style>#search_container input {margin: 2px;margin-bottom: 5px;}#search_container button {padding: 1px;} #search_container {text-align: center; }</style>');
     
    // add input/search buttons
    $(".user-button").after('<div id="search_container"><div><input id="animesearch_input" placeholder="AnimeList Search" size=23 /><button id="animesearch_button">🔍</button></div><div><input id="mangasearch_input" placeholder="MangaList Search" size=23 /><button id="mangasearch_button">🔍</button></div></div>');

    let animebaseurl = `https://myanimelist.net/animelist/${username}?status=7&s=`;
    let mangabaseurl = `https://myanimelist.net/mangalist/${username}?status=7&s=`;
  
    // attach events

    // anime search button
    $("#animesearch_button").mouseup(function(e) {
      var anime_url = animebaseurl + encodeURIComponent($("#animesearch_input").first().val().trim());
      urlOpener(anime_url, e);
    });

    // manga search button
    $("#mangasearch_button").mouseup(function(e) {
      var manga_url = mangabaseurl + encodeURIComponent($("#mangasearch_input").first().val().trim());
      urlOpener(manga_url, e);
    });
      
    // if user hits enter key, click the button
    
    $("#animesearch_input").on("enterKey", function(e) {
      var anime_url = animebaseurl + encodeURIComponent($("#animesearch_input").first().val().trim());
      urlOpener(anime_url, e);
    });

    $("#mangasearch_input").on("enterKey", function(e) {
      var manga_url = mangabaseurl + encodeURIComponent($("#mangasearch_input").first().val().trim());
      urlOpener(manga_url, e);      
    });
     
    // anime input - map key code to enter event

    $("#animesearch_input").keyup(function(e) {
      if (e.keyCode == 13) {
        $(this).trigger("enterKey");
      }
    });
      
    // manga input - may key code to enter event

    $("#mangasearch_input").keyup(function(e) {
      if (e.keyCode == 13) {
        $(this).trigger("enterKey");
      }
    });
  
})();