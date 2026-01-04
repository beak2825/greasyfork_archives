// ==UserScript==
// @name         abooo
// @namespace    https://www.oba.gov.tr/
// @version      0.266778
// @description  OBA derslerini durmadan izler
// @author       You
// @match        https://www.oba.gov.tr/*
// @icon         https://avatars.githubusercontent.com/u/2937359?v=4
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/454855/abooo.user.js
// @updateURL https://update.greasyfork.org/scripts/454855/abooo.meta.js
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
            document.location.href = "https://www.oba.gov.tr/egitim/oynatma/zor-durumlarin-yonetimi-mesleki-doyum-bilgelik-psikolojisi-bilimsel-liderlik-degisen-dunya-ve-egitimi-semineri-kasim-2022-mesleki-calisma-448/6582";
        }
 
    },5000)
 
 
    setTimeout(()=>{
        document.location.href = "https://www.oba.gov.tr/egitim/oynatma/zor-durumlarin-yonetimi-mesleki-doyum-bilgelik-psikolojisi-bilimsel-liderlik-degisen-dunya-ve-egitimi-semineri-kasim-2022-mesleki-calisma-448/6586";
    },23*60*1000)
 
})
 
})();