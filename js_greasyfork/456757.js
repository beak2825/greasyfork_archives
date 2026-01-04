// ==UserScript==
// @name         HorjunTV title fixer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  HorjunTV sahypasynyň sözbaşyny şu wagty seredip oturan kinoň, wideoň adyna çalyşýar.
// @description:en Change title of HorjunTV to current watching video title.
// @description:ru Измените название HorjunTV на текущее название просматриваемого видео.
// @author       @BetterCallSoul
// @match        https://horjuntv.com.tm/*
// @match        https://m.horjuntv.com.tm/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456757/HorjunTV%20title%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/456757/HorjunTV%20title%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentPage = window.location
    if(currentPage.hostname == "horjuntv.com.tm")
    {
        if (currentPage.href.indexOf("view_channel") > -1)
        {
            var channelElement = document.getElementsByClassName('font-size-36 text-white mb-4 pb-1')[0];
            var channelTitle = channelElement.innerHTML;
            window.onload = document.title = channelTitle + "- HorjunTV";
        }else if(currentPage.href.indexOf("watch") > -1)
        {
            var v = document.getElementsByClassName('font-size-21 font-weight-medium text-white')[0];
            var t = v.innerHTML;
            window.onload = document.title = t + "- HorjunTV";
            console.log("Video Title: "+t);
        }
    }else if(currentPage.hostname == "m.horjuntv.com.tm")
    {
        if(currentPage.href.indexOf("view_channel") > -1)
        {
            var c = document.getElementsByClassName('channel-brand')[0];
            var ct = c.innerText;
            window.onload = document.title = ct + "- HorjunTV";
            console.log("Mobile title: "+ct);
        }else if(currentPage.href.indexOf("watch") > -1)
        {
            var m = document.getElementsByClassName('col-md-12 single-video-title box mb-1')[0].getElementsByTagName('h2')[0];
            var mt = m.innerHTML;
            window.onload = document.title = mt + "- HorjunTV";
            console.log("Mobile title: "+mt);
        }
    }
    // Your code here...
})();