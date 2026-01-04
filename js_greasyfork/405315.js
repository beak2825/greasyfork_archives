// ==UserScript==
// @name         Discogs/Listings/EmbedSamples
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Denlekke
// @match        https://www.discogs.com/seller/*
// @match        https://www.discogs.com/sell/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405315/DiscogsListingsEmbedSamples.user.js
// @updateURL https://update.greasyfork.org/scripts/405315/DiscogsListingsEmbedSamples.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var samples_list = document.getElementsByClassName("sound_preview");

    for( var i=0; i<samples_list.length;i++){
        var temp_audio_container = document.createElement("td");
        temp_audio_container.setAttribute("class","audio");
        var temp_audio_element = document.createElement("audio");
        temp_audio_element.src = samples_list[i].href;
        temp_audio_element.setAttribute('class', 'audio');
        temp_audio_element.setAttribute("controls", "controls");
        temp_audio_element.setAttribute("preload", "auto");
        temp_audio_element.setAttribute('style', 'height:20px;width:100%;align:left;');

        temp_audio_container.appendChild(temp_audio_element);

        var temp_parent = samples_list[i].parentNode.parentNode.childNodes[3];
        console.log(temp_parent);
        temp_parent.appendChild(temp_audio_element);
    }
    console.log("sameples length"+samples_list.length);

    document.addEventListener('seeking', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
            if(audios[i] === e.target){
                audios[i].play();
            }
        }
    }, true);
    document.addEventListener('play', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
            }
        }
    }, true);
    // Your code here...
})();