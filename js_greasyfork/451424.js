// ==UserScript==
// @name         Ya YouTube search
// @name:en      Ya YouTube search
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Поиск видео в YouTube со страницы Яндекса.
// @description:en  Search videos on YouTube from Yandex page.
// @author       E11ipS0iD
// @match        https://yandex.ru/*
// @match        https://ya.ru/*
// @icon         https://www.ellipse-arts.ru/temp/fav.jpg
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451424/Ya%20YouTube%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/451424/Ya%20YouTube%20search.meta.js
// ==/UserScript==

(function () {
  'use strict';

    setTimeout(function(){testPlayerData(1);}, 1000);

    function testPlayerData(iteration) {

        console.log('Ya YouTube: waiting ('+iteration+')');
        var btn = document.querySelectorAll('.HeaderDesktopNavigation-Cutted .HeaderDesktopNavigation-Tab')[2];
        if (btn!==undefined) {
            btn.id = 'ytFromYa';
            btn.innerHTML = 'YouTube';
            var link = document.querySelectorAll('.HeaderDesktopForm-Input')[0].value;
            link = encodeURI(link);
            btn.href = 'https://www.youtube.com/results?search_query=' + link;
            console.log('Ya YouTube: YouTube link updated');
            return true;
        }

        var video = document.getElementsByClassName("VideoPlayerMetaInfo-SourceTextLine")[0];
        if (video === undefined) {
            video = document.getElementsByClassName("HostWithChannel-Host")[0];
        }
        if (video!==undefined && video.innerText == 'YouTube') {
            if (video.href===undefined) {
                video.href = document.getElementsByClassName("LinkWrapper")[0].href;
            }
            console.log('Ya YouTube: Link founded ('+video.href+')');
            document.location.replace(video.href);
        }
        iteration++;
        if (iteration<31) {
            setTimeout(function(){testPlayerData(iteration);}, 1000);
        }
    }

})();