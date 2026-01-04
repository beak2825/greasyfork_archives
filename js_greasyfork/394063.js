// ==UserScript==
// @name         ScoreSaber OneClick install button
// @namespace    https://github.com/Invertex/
// @version      1.4
// @description  Add OneClick Install for BeatSaber songs on ScoreSaber
// @author       Invertex
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @match        *://scoresaber.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM.xmlHttpRequest
// @connect      beatsaver.com
// @downloadURL https://update.greasyfork.org/scripts/394063/ScoreSaber%20OneClick%20install%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/394063/ScoreSaber%20OneClick%20install%20button.meta.js
// ==/UserScript==

const ocLabel = "OneClick™ Install";

let styles = `
.ocListButton {
  height: 3.1em;
  font-size: 0.6em;
  font-weight: 500;
  padding-top: 0px;
  padding-bottom: 0px;
  vertical-align: top;
}

.ocLoader {
  border: 0.4em solid #f3f3f3; /* Light grey */
  border-top: 0.4em solid #ffde1a; /* ScoreSaber Yellow */
  border-radius: 50%;
  width: 1.6em;
  height: 1.6em;
  animation: ocLoaderSpin 1s linear infinite;
  margin: auto;
}

@keyframes ocLoaderSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet);

(function() {
    'use strict';

    let location = window.location.href;

    if(location.includes("leaderboard"))
    {
        let songInfoElem = document.querySelector("html body div.section div.container div.content div.columns.is-desktop.is-flex-reverse div.column.is-one-third-desktop div.box.has-shadow");
        let boldElems = songInfoElem.getElementsByTagName("B");

        if(boldElems.length > 0)
        {
            let songIDElem = boldElems[boldElems.length - 1];
            GetOneClickLink(songIDElem.innerText, songIDElem, SetupOneClickButton);
        }
    }
    else //Not leaderboard, check if song listings and if so add download buttons on each
    {
        let songList = document.querySelector("div.ranking.songs table.ranking.songs tbody");
        if(songList != null)
        {
            let songs = songList.getElementsByTagName("tr");
            for(var i = 0; i < songs.length; i++)
            {
                ProcessSongListEntry(songs[i]);
            }
        }
    }
})();

function DownloadSong(songUrl)
{
    window.location = songUrl;
}

function SwapElementVisibility(elem1, elem2)
{
    let vis1 = elem1.style.display;
    elem1.style.display = elem2.style.display;
    elem2.style.display = vis1;
}

function ProcessSongListEntry(songElem)
{
    let songID = songElem.querySelector("td.song img").src;
    songID = songID.substr(songID.lastIndexOf('/') + 1, 40);
    let starElem = songElem.querySelector("td.stars");

    let column = document.createElement("td");
    let button = document.createElement("button");
    let loader = document.createElement("div");
    button.innerText = ocLabel;
    button.className = "ocListButton";
    loader.className = "ocLoader";
    loader.style.display = "none";
    column.appendChild(button);
    column.appendChild(loader);
    songElem.appendChild(column);

    button.addEventListener("click",
                            function()
                            {
                                GetOneClickLink(songID,
                                                starElem,
                                                DownloadSong,
                                                function() { SwapElementVisibility(button, loader); },
                                                function() { SwapElementVisibility(button, loader); },
                                               )
                            }, false);
}

function GetOneClickLink(songID, modifyElement, onLoadResponse, onStartFunction, onFinishFunction)
{
    if(onStartFunction != null) { onStartFunction();}

    GM.xmlHttpRequest({
        method: "GET",
        url: "https://beatsaver.com/api/search/text/0?q=" + songID,
        responseType: "json",
        headers: { "Content-type" : "application/json" },

        onload: function(e)
        {
            let results = e.response;

            if(results.totalDocs > 0)
            {
                var key = results.docs[0].key;
                onLoadResponse("beatsaver://" + key, modifyElement, key);
                if(onFinishFunction != null) { onFinishFunction() };
            }
        },
        onerror:  function(e) { if(onFinishFunction) { onFinishFunction();} },
        onabort:  function(e) { if(onFinishFunction) { onFinishFunction();} },
        ontimeout:  function(e) { if(onFinishFunction) { onFinishFunction();} }
    });
}

function SetupOneClickButton(clickUrl, idElem, key)
{
    var button = document.createElement("button");
    button.innerText = ocLabel;
    button.addEventListener("click", function() { DownloadSong(clickUrl) }, false);
    idElem.parentNode.appendChild(button);
    $(idElem).wrap("<a href='http://beatsaver.com/beatmap/" + key + "'></a>");
}
