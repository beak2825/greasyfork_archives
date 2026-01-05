// ==UserScript==
// @name        soundcloud autoplay
// @author      erm3nda at gmail.com
// @author-www  http://tronko.es
// @namespace   souncloud-autoplay
// @icon        http://files.softicons.com/download/social-media-icons/simple-icons-by-dan-leech/png/32x32/soundcloud.png
// @description Does autoplay first track of given category
// @include     https://soundcloud.com/*
// @include     https://soundcloud.com/charts/top/*
// @version     1.0.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/17004/soundcloud%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/17004/soundcloud%20autoplay.meta.js
// ==/UserScript==

//~ var category = "" // set blank for trending-music
var category="electronic"
var url_cat="?genre=" + category
// var category="alternative+rock"

$( document ).ready(function() {
    console.log( "ready!" );
    if (document.URL == "https://soundcloud.com/stream") {
        window.location.href = "https://soundcloud.com/charts/top" + url_cat
        }
    
    if (document.URL == "https://soundcloud.com/charts/top" + url_cat) {
        setTimeout(function() {
            buttons = document.getElementsByClassName("sc-button-play")
            play = buttons[0]
            play.click()
            console.log("Playing ...")
            }, 5000)
        }    

});
