// ==UserScript==
// @name         webbull_oba
// @namespace    https://www.oba.gov.tr/
// @version      0.5
// @description  ÖBA videolarını durmadan izler
// @author       Gündüz Can YILMAZ
// @match        https://www.oba.gov.tr/*
// @icon         https://www.webbull.net/assets/img/logo.png
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517070/webbull_oba.user.js
// @updateURL https://update.greasyfork.org/scripts/517070/webbull_oba.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $(document).ready(function(){
        var myPlayer = videojs.getPlayer('video');
        window.onblur = () => {};
        $('.vjs-big-play-button').click()
        myPlayer.play();
        $(window).blur(function () {
            myPlayer.muted( true );
            myPlayer.play();
            document.title = "Can YILMAZ ;)"
        });
        setInterval(()=>{
            var sonVideo;
            myPlayer.play();
            $(".course-player-object-item").each(function (i){
                 if(! $(this).hasClass("isDisabled"))
                {
                    sonVideo = $(this);
                }
            })
            if( ('https://www.oba.gov.tr' + sonVideo.attr('href')) != window.location.href) {
                window.location.href = sonVideo.attr('href')
            }


        },1000)

    })

})();