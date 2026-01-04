// ==UserScript==
// @name         KollaFilm
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This is the first script
// @author       D3lta
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://kollafilm.com/*
// @icon         https://www.google.com/s2/favicons?domain=kollafilm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433952/KollaFilm.user.js
// @updateURL https://update.greasyfork.org/scripts/433952/KollaFilm.meta.js
// ==/UserScript==

$(document).ready(function() {
    setTimeout(function(){
        var video = $('iframe')[0].src;
        var url = $('iframe')[0].baseURI;
        window.location.href = video+'?url4='+url;
    }, 500);
});;