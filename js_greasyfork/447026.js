// ==UserScript==
// @license MIT
// @name         GraphicAudio search ABB backup
// @namespace    -
// @version      24
// @description  Add "ABB" button to GraphicAudio
// @author       Acaelus / Varsel
// @include      https://www.graphicaudiointernational.*/*
// @include      https://www.graphicaudio.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447026/GraphicAudio%20search%20ABB%20backup.user.js
// @updateURL https://update.greasyfork.org/scripts/447026/GraphicAudio%20search%20ABB%20backup.meta.js
// ==/UserScript==

const baseUrl = "https://audiobookbay.lu/?s=";

//Book Series
var series = (document.getElementsByClassName("series-name")[0].textContent).trim();

//Book Title
var episode = (document.getElementsByClassName("episode-name")[0].textContent).trim();

try
{
    // Remove the '<index_in_series>:' if present
    episode = (episode.split(':')[1]).trim();
}
catch
{
    episode = episode.trim();
}

var searchTerm = (series + " " + episode);
searchTerm = searchTerm.replace(/\s+/g, '+');

// Create floating button
let searchABB = document.createElement("button");
searchABB.innerHTML = "Search on ABB";
searchABB.onclick = function ()
{
    window.location.href = (baseUrl + searchTerm);
};
searchABB.style = "background-color:#d92027; padding: 15px 25px; font-size: 21px;top:0;right:1;position:fixed;z-index: 9999;color:#ffffff";
document.body.appendChild(searchABB);


