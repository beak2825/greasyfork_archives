// ==UserScript==
// @name         Yunus_11
// @namespace    https://www.oba.gov.tr/
// @version      0.5
// @description  ÖBA videolarını durmadan izler
// @author       Yunus
// @match        https://www.oba.gov.tr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536004/Yunus_11.user.js
// @updateURL https://update.greasyfork.org/scripts/536004/Yunus_11.meta.js
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
            document.title = "Yunus ;)"
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