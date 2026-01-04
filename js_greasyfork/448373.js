// ==UserScript==
// @name         alyy
// @namespace    https://www.oba.gov.tr/
// @license MIT
// @version      0.25
// @description  OBA derslerini durmadan izler
// @author       You
// @match        https://www.oba.gov.tr/*
// @icon         https://avatars.githubusercontent.com/u/2937359?v=4
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/448373/alyy.user.js
// @updateURL https://update.greasyfork.org/scripts/448373/alyy.meta.js
// ==/UserScript==

(function() {
    'use strict';

var basliklar
var link
var current_link
var baslik

$(document).ready(function(){

    basliklar = $(".course-player-object-list-item")
    $.each( basliklar, function( key, value ) {
        if($(value).find(".mdi-circle-slice-3").length){
            baslik = value
            link = $(baslik).find("a:first-child").attr("href")
            current_link = window.location.href
            if(!current_link.includes(link)){
                $(baslik).find("a")[0].click()
            }
        }
    });

    setTimeout(()=>{
        $('.vjs-big-play-button').click()
        window.onblur = () => {};
var video = document.getElementById("video_html5_api");
video.muted = true;
    },1000)

    setInterval(()=>{
        if($(baslik).find(".progress-check-icon").length){
            document.location.href = "https://www.oba.gov.tr/egitim/oynatma/uzman-ogretmenlik-egitim-programi-semineri-meb-personeli-286/3736";
        }

    },5000)


    setTimeout(()=>{
        document.location.href = "https://www.oba.gov.tr/egitim/oynatma/uzman-ogretmenlik-egitim-programi-semineri-meb-personeli-286/3736";
    },23*60*1000)

})

})();