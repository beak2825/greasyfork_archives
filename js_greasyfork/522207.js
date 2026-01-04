// ==UserScript==
// @name         Aboo 2024 BÖ
// @namespace    https://www.oba.gov.tr/
// @version      2024-12-29
// @description  try to take over the world!try to take over the world!try to take over the world!try to take over the world!
// @author       You
// @license MIT
// @match        https://www.oba.gov.tr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/522207/Aboo%202024%20B%C3%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522207/Aboo%202024%20B%C3%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var acilmis_linkler
    var guncel_link

    $(document).ready(function(){
        $('#video_html5_api').prop("muted",true);
        setInterval(()=>{
            kontrol()
        },1000)

        $('#video_html5_api').on('ended',function(){
            kontrol()
        });


     })




   function kontrol(){
       acilmis_linkler    = $(".course-player-object-item ").not(".isDisabled")
        guncel_link        = acilmis_linkler.slice(-1)[0].attributes.href.nodeValue
        //var siradaki_linkler   = $(".isDisabled")
        //var siradaki_link      = siradaki_linkler[0].attributes.href.nodeValue
        if(window.location.href.includes(guncel_link)){
            $('.vjs-big-play-button')[0].click()
            $('#video_html5_api').trigger('play');
            window.onblur = () => {};
        }else{
            acilmis_linkler.slice(-1)[0].click()
            guncel_link.click()
        }
   }



})();
