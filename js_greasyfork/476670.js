// ==UserScript==
// @name         BeletFilm title fixer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  HorjunTV sahypasynyň sözbaşyny şu wagty seredip oturan kinoň, wideoň adyna çalyşýar.
// @description:en Change title of HorjunTV to current watching video title.
// @description:ru Измените название HorjunTV на текущее название просматриваемого видео.
// @author       @BetterCallSoul
// @match        https://film.belet.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476670/BeletFilm%20title%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/476670/BeletFilm%20title%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentPage = window.location
    if(currentPage.hostname == "film.belet.me")
    {
        if (currentPage.href.indexOf("view_channel") > -1)
        {
            var channelElement = document.getElementsByClassName('font-size-36 text-white mb-4 pb-1')[0];
            var channelTitle = channelElement.innerHTML;
            window.onload = document.title = channelTitle + "- BeletFilm";
        }else if(currentPage.href.indexOf("watch") > -1)
        {
            var v = document.getElementsByClassName('font-size-21 font-weight-medium text-white')[0];
            var t = v.innerHTML;
            window.onload = document.title = t + "- BeletFilm";
            console.log("Video Title: "+t);
        }
    }
    // Your code here...
})();