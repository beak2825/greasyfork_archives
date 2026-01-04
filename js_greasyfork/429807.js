// ==UserScript==
// @name         spotify autoplay
// @version      0.1
// @namespace    Juritobi
// @description  le da autamticamente al play del primer resultado de una busqueda de spotify.
// @author       Juritobi
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @match        https://open.spotify.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429807/spotify%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/429807/spotify%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playbtn = [];
    let ChatGetInterval = setInterval(() => {
        playbtn = $("#searchPage button");
        if(playbtn.length > 0)
        {
            console.log(playbtn[0]);
            playbtn[0].click();
            clearInterval(ChatGetInterval);
        }
    }, 50);
})();