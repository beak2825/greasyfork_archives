// ==UserScript==
// @name         Brazzers force trailer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  forces brazzers trailer
// @author       You
// @match        http://www.brazzers.com/scenes/view/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24949/Brazzers%20force%20trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/24949/Brazzers%20force%20trailer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    window.onload = function () { 
        document.getElementById("purchase-panel").remove();

        var trailer = document.createElement('div');
        trailer.innerHTML= '<iframe src="http://www.brazzers.com/embed/'+window.location.href.match(/[0-9][0-9][0-9][0-9]?[0-9]?/g)[0]+'/" width="645" height="430" scrolling="no" frameborder="0">Ride It Out</iframe>';
        document.getElementsByClassName("player-video")[0].replaceWith(trailer);

        var titleHTML = document.getElementsByClassName("scene-title")[0].innerHTML;
        var title = titleHTML.substring(0,titleHTML.indexOf("<"));
        var tpbLink = "https://thepiratebay.org/search/"+title.split(" ").join("%20")+"/0/99/500";
        document.getElementById("embed-video").innerHTML = '<a href='+tpbLink+' class="button-embed">Thepiratebay search</a>';
    };
})();