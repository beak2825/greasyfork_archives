// ==UserScript==
// @name         Click on track name to google it
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google searches for a track and artist when you click it on RYM
// @author       Jermrellum
// @match        https://rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?domain=rateyourmusic.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459144/Click%20on%20track%20name%20to%20google%20it.user.js
// @updateURL https://update.greasyfork.org/scripts/459144/Click%20on%20track%20name%20to%20google%20it.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function encodeURIAmp(str)
    {
        var eStr = encodeURI(str);
        eStr = eStr.replaceAll("&amp;","%26");
        return eStr;
    }

    var artistname = '';
    var artE = document.getElementsByClassName("artist")[0];
    if(artE.children.length > 0)
    {
        var spanA = artE.children[0].innerHTML;
        artistname = spanA.substring(1, spanA.length - 1);
    }
    else
    {
        artistname = artE.innerHTML;
    }
    var tracks = document.getElementById("tracks").children;
    var numToUse = 1;
    if(tracks[tracks.length-1].children[0].children[1] == undefined || tracks[tracks.length-1].children[0].children[1].children[0] == undefined)
    {
        numToUse = 2;
    }
    var lenToUse = tracks.length;
    if(tracks[tracks.length-1] == undefined || tracks[tracks.length-1].children[0].children[numToUse] == undefined)
    {
        lenToUse = tracks.length - 1;
    }
    for(var i=0; i<lenToUse; i++)
    {
        numToUse = 1;
        if(tracks[i].children[0].children[1] == undefined || tracks[i].children[0].children[1].children[0] == undefined)
        {
            numToUse = 2;
        }
        var trackname = tracks[i].children[0].children[numToUse].children[0].children[0].innerHTML;
        var link = "https://google.com/search?q=" + encodeURIAmp(artistname) + "+" + encodeURIAmp(trackname);
        tracks[i].children[0].children[numToUse].children[0].children[0].innerHTML = "<a href=\"" + link + "\" target=\"_blank\">" + trackname + "</a>";
    }


})();