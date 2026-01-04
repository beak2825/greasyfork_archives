// ==UserScript==
// @name         self
// @namespace    https://www.null.com/
// @version      0.1
// @description  null
// @author       You
// @match        https://www.null.com/*
// @icon         https://avatars.githubusercontent.com/u/2937359?v=4
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/458525/self.user.js
// @updateURL https://update.greasyfork.org/scripts/458525/self.meta.js
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
    },1000)
 
    setInterval(()=>{
        if($(baslik).find(".progress-check-icon").length){
            document.location.href = "https://www.oba.gov.tr/egitim/oynatma/bagimlilikla-mucadele-semineri-1-tum-ogretmenler-ve-okul-kurum-yoneticileri-icin-638/9801";
        }
 
    },5000)
 
 
    setTimeout(()=>{
        document.location.href = "https://www.oba.gov.tr/egitim/oynatma/bagimlilikla-mucadele-semineri-1-tum-ogretmenler-ve-okul-kurum-yoneticileri-icin-638/9807";
    },23*60*1000)
 
})
 
})();