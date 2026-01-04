// ==UserScript==
// @name         Gripsweat/BetterPlayer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  better audio players for gripsweat
// @author       denlekke
// @match        https://gripsweat.com/search*
// @match        https://gripsweat.com/item*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404920/GripsweatBetterPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/404920/GripsweatBetterPlayer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var audio_list = document.getElementsByTagName('audio');
    console.log(window.location.href);
    if(window.location.href.includes('search')){
        for (var i = 0; i < audio_list.length; i++){
            var temp_audio_element = audio_list[i];

            temp_audio_element.setAttribute('class', 'audio');
            temp_audio_element.setAttribute("controls", "controls");
            temp_audio_element.setAttribute("preload", "auto");
            temp_audio_element.setAttribute('style', 'height:40px;width:100%;align:left;');

            var temp_parent = temp_audio_element.parentNode;
            var new_parent = temp_audio_element.parentNode.parentNode;
            new_parent.appendChild(temp_audio_element);
            new_parent.removeChild(temp_parent);


        }
    }
    else if(window.location.href.includes('item')){
        var before = document.getElementsByTagName('p')[1];
        var before_parent = document.getElementsByTagName('p')[1].parentNode;
        var audio_elements = document.createElement('div');
        console.log(before);
        for ( i = 0; i < audio_list.length; i++){
            temp_audio_element = audio_list[i].cloneNode();

            temp_audio_element.setAttribute('class', 'audio');
            temp_audio_element.setAttribute('id', "audio_"+i);
            temp_audio_element.setAttribute("controls", "controls");
            temp_audio_element.setAttribute("preload", "auto");
            temp_audio_element.setAttribute('style', 'height:40px;width:100%;align:left;');

            audio_elements.appendChild(temp_audio_element);
            console.log(temp_audio_element);
            temp_audio_element = null;

        }

        before_parent.insertBefore(audio_elements,before);
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