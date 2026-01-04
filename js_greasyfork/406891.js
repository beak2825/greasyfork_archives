// ==UserScript==
// @name         GroovyRecords/Embedder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://groovyrecord.ecrater.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406891/GroovyRecordsEmbedder.user.js
// @updateURL https://update.greasyfork.org/scripts/406891/GroovyRecordsEmbedder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var desc_text = document.body.innerText;

    if (desc_text.includes('http') && desc_text.includes('.mp3')){
        var link = desc_text.split(".mp3")[0].split("http")[1];
        if (link[0]=='s'){
            link = "http"+link+".mp3";
        }
        else{
            link = "https"+link+".mp3";
        }
        console.log(link);

        var temp_audio_element = document.createElement('audio');
        temp_audio_element.setAttribute('class', 'audio');
        temp_audio_element.setAttribute('style', 'height:"20px";width:75%;align:left;');
        temp_audio_element.setAttribute("controls", "controls");

        temp_audio_element.setAttribute('id', 'audio_sample');
        temp_audio_element.src = link;
        var description_element = document.getElementsByClassName("content")[4];
        description_element.append(temp_audio_element);
    }

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
})();