// ==UserScript==
// @name           Download sound from dictionaries (lingvolive.ru, dictionary.cambridge.org)
// @name:ru        Скачивание звука из словарей (lingvolive.ru, dictionary.cambridge.org)
// @namespace      http://tampermonkey.net/
// @version        0.0.2
// @description    Add "download" button for online dictionaries: lingvolive.ru, dictionary.cambridge.org
// @description:ru Добавляет кнопку загрузки для онлайн словарей: lingvolive.ru, dictionary.cambridge.org
// @author         kolchan11
// @match          http://lingvolive.ru/*
// @match          http://dictionary.cambridge.org/*
// @match          https://lingvolive.ru/*
// @match          https://dictionary.cambridge.org/*
// @grant          none
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20603/Download%20sound%20from%20dictionaries%20%28lingvoliveru%2C%20dictionarycambridgeorg%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20603/Download%20sound%20from%20dictionaries%20%28lingvoliveru%2C%20dictionarycambridgeorg%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Button
    function button(link, word, width, height) {
      return "\
        <a href='"+link+"' download='"+word+"' class='EVJNb' style='display: inline-block; border: none; height: "+height+"; margin: 0; padding: 0 0 0 0; width: "+width+"; vertical-align: middle; padding: 2px;''>\
          <svg class='WQDy7' style='width: 100%; height: 100%;' version='1.1'>\
            <path d='M2.5,10H6V3h8v7h3.5L10,17.5L2.5,10z'></path>\
          </svg>\
        </a>\
      ";
    }

    // Styles
    $("head").append("\
      <style>\
        .WQDy7 {\
          fill: #51545B;\
        }\
        .WQDy7:hover {\
          fill: #DF5453;\
        }\
      </style>\
      ");

    // For lingvolive.ru
    if(document.domain == "lingvolive.ru"){
      var lingvo_word = $("h1 span").html();

      function getLingvoLiveLinks() {
        $("div[name='#dictionary'] p:first a").each(function(){
          var link = $(this).attr("href");
          $(this).after(button(link, lingvo_word, "25px", "25px"));
        });
      }

      getLingvoLiveLinks();

      $("body").on("click", "form[action='/translate/'] button, form div div div:first div div", function(){
        $(".EVJNb").remove();

        setTimeout(getLingvoLiveLinks, 3000);
      });
    }

    // For dictionary.cambridge.org
    if(document.domain == "dictionary.cambridge.org"){
      var cambridge_word = $("h2").html();
      $("span.audio_play_button").each(function(){
        var link = $(this).attr("data-src-mp3");
        $(this).after(button(link, cambridge_word, "20px", "20px"));
      });
    }
})();