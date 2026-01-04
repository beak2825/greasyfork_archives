// ==UserScript==
// @name         Reggaefever/EmbedSamples
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Denlekke
// @match        https://www.reggaefever.ch/articleDetails*
// @match        https://www.reggaefever.ch/catalog*
// @match        https://www.reggaefever.ch/articleList*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405333/ReggaefeverEmbedSamples.user.js
// @updateURL https://update.greasyfork.org/scripts/405333/ReggaefeverEmbedSamples.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    if(url.includes("articleDetails")){
        var samples_list = document.querySelectorAll('a[title="MP3 sample"]');;
        var artist = document.querySelector('a[href*="articleList?artist="]').textContent.split('+')[0].split(', ')[0].split('/')[0].split('&')[0].split(' and ')[0].split(' ft')[0].trim();
        var title = document.querySelector('a[href*="articleList?title="]').textContent.split('/')[0].trim();
        var discogs_url = 'https://www.discogs.com/search/?q='+artist+'+'+title+'&type=all&type=all';
        var discogs_link = document.createElement('a');
        discogs_link.href = discogs_url;
        discogs_link.textContent = "Search Discogs";
        discogs_link.setAttribute('target', '_blank');

        var image_element = document.getElementsByClassName("articleDetailsImageFrame")[0];
        image_element.appendChild(discogs_link);
        console.log(artist);
        console.log(title);
        for( var i=0; i<samples_list.length;i++){
            var temp_audio_container = document.createElement("div");
            var col_group = document.querySelectorAll("colgroup")[0];
            var temp_audio_element = document.createElement("audio");
            temp_audio_element.src = samples_list[i].href;
            temp_audio_element.setAttribute('class', 'audio');
            temp_audio_element.setAttribute("controls", "controls");
            temp_audio_element.setAttribute("preload", "auto");
            temp_audio_element.setAttribute('style', 'height:20px;width:700px;align:left;');

            var temp_parent = samples_list[i].parentNode.parentNode;
            temp_parent.after(temp_audio_container);
            temp_audio_container.appendChild(temp_audio_element);
        }
    }
    else{
        var mains_list = document.querySelectorAll('.articleListInfo');;
        for( i=0; i<mains_list.length;i++){
            var num_rows = mains_list[i].rowSpan;
            var element_to_check = mains_list[i].parentNode;
            var parent = mains_list[i].parentNode;
            var class_name = element_to_check.className;
            var number_of_samples = 0;
            for(var j = 0;j<num_rows;j++){
                var sample = element_to_check.querySelector('a[title="MP3 sample"]');
                element_to_check = element_to_check.nextElementSibling;
                if (sample != null){
                    number_of_samples += 1;
                    temp_audio_container = document.createElement("tr");
                    temp_audio_container.setAttribute('class', class_name);
                    col_group = document.querySelectorAll("colgroup")[0];
                    temp_audio_element = document.createElement("audio");
                    temp_audio_element.src = sample.href;
                    temp_audio_element.setAttribute('class', 'audio '+class_name);
                    temp_audio_element.setAttribute("controls", "controls");
                    temp_audio_element.setAttribute("preload", "auto");
                    temp_audio_element.setAttribute('style', 'height:20px;width:783px;align:left;');

                    temp_parent = sample.parentNode.parentNode;
                    temp_parent.after(temp_audio_container);
                    temp_audio_container.appendChild(temp_audio_element);

                    for (var k = 0; k<3 ; k++){
                        temp_audio_container.appendChild(document.createElement("td"));
                    }
                }
            }
            mains_list[i].rowSpan = mains_list[i].rowSpan + number_of_samples;
            parent.getElementsByClassName("label")[0].rowSpan += number_of_samples;
            parent.getElementsByClassName("country")[0].rowSpan += number_of_samples;
            parent.getElementsByClassName("year")[0].rowSpan += number_of_samples;
            parent.getElementsByClassName("quality")[0].rowSpan += number_of_samples;
            parent.getElementsByClassName("articleFormat")[0].rowSpan += number_of_samples;
            parent.getElementsByClassName("price")[0].rowSpan += number_of_samples;
            parent.getElementsByClassName("cart")[0].rowSpan += number_of_samples;
        }
    }

    document.addEventListener('seeking', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
                audios[i].setAttribute("style",'height:20px;width:783px;align:left;');
            }
            if(audios[i] === e.target){
                audios[i].play();
                audios[i].setAttribute("style",'height:20px;width:783px;align:left;'+"border: dashed red;");
            }
        }
    }, true);
    document.addEventListener('play', function(e){
        var audios = document.getElementsByTagName('audio');
        for(var i = 0, len = audios.length; i < len;i++){
            if(audios[i] != e.target){
                audios[i].pause();
                audios[i].setAttribute("style",'height:20px;width:783px;align:left;');
            }
            if(audios[i] === e.target){
                audios[i].play();
                audios[i].setAttribute("style",'height:20px;width:783px;align:left;'+"border: dashed red;");
            }
        }
    }, true);
})();