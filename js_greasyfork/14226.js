// ==UserScript==
// @name        soundcloud autoplay
// @author      erm3nda at gmail.com
// @author-www  http://tronko.es
// @namespace   souncloud-autoplay
// @icon        http://files.softicons.com/download/social-media-icons/simple-icons-by-dan-leech/png/32x32/soundcloud.png
// @description Does autoplay first track of given category
// @include     https://soundcloud.com/
// @include     https://soundcloud.com/explore/*
// @version     1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/14226/soundcloud%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/14226/soundcloud%20autoplay.meta.js
// ==/UserScript==


//~ var category = "" // set blank for trending-music
var category="electronic"
// var category="alternative+rock"

$( document ).ready(function() {
    console.log( "ready!" );
    if (document.URL == "https://soundcloud.com/") {
        window.location.href = "https://soundcloud.com/explore/" + category
        }
    
    if (document.URL == "https://soundcloud.com/explore/" + category) {
        setTimeout(function() {
            buttons = document.getElementsByClassName("sc-button-play")
            play = buttons[0]
            play.click()
            console.log("Playing ...")
            }, 5000)
        }    

});
