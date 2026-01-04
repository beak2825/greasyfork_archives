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
// @downloadURL https://update.greasyfork.org/scripts/516962/webbull_oba.user.js
// @updateURL https://update.greasyfork.org/scripts/516962/webbull_oba.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $(document).ready(function(){
        window.onblur = () => {};
        $('.vjs-big-play-button').click()
        var myPlayer = videojs.getPlayer('video');

        $(window).blur(function () {
            myPlayer.play();
            document.title = "Can YILMAZ ;)"
        });
        setInterval(()=>{
            var sonVideo = $(".course-player-object-item")

            var confirmButton = $(".swal-button--confirm")

            if(confirmButton.length){
                confirmButton[0].click()
            }
        },1000)

    })

})();