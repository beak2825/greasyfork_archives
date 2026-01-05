// ==UserScript==
// @name         IMDb Pirate Downloads
// @namespace    http://r3bify.info
// @version      1.0
// @description  Find IMDb Movies and TV Shows on The Pirate Bay and RARBG
// @author       R3bify
// @icon	 http://r3bify.info/favicon.ico
// @match        *://www.imdb.com/title/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16022/IMDb%20Pirate%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/16022/IMDb%20Pirate%20Downloads.meta.js
// ==/UserScript==

var href = window.location.href.split('/');
var imdbtt = href[href.length-2];
var imdbLink = "http://www.omdbapi.com/?i=" + imdbtt + "&plot=short&r=json";
var xhr = new XMLHttpRequest();

xhr.open('GET', imdbLink);
xhr.onload = function ()
{
    var imdbJSON = window.JSON.parse(xhr.responseText);
    var urls = '<br />Search RARBG: <a href="https://rarbg.to/torrents.php?imdb=' +
        imdbJSON.imdbID +
        '" target="_blank">By IMDb Link</a><span class="ghost">|</span>' +
        '<a href="https://rarbg.to/torrents.php?search=' +
        imdbJSON.Title +
        '" target="_blank">By Title</a><span class="ghost">|</span>' +
        '<a href="https://rarbg.to/torrents.php?search=' +
        imdbJSON.Title +
        ' ' +
        imdbJSON.Year +
        '" target="_blank">By Title and Year</a>' +
        '<br />Search on The Pirate Bay: ' +
        '<a href="http://thepiratebay.org/search/' +
        imdbJSON.Title +
        '" target="_blank">By Title</a><span class="ghost">|</span>' +
        '<a href="http://thepiratebay.org/search/' +
        imdbJSON.Title +
        ' ' +
        imdbJSON.Year +
        '" target="_blank">By Title and Year</a>';

        document.getElementsByClassName("subtext")[0].innerHTML += urls;
};
xhr.send();