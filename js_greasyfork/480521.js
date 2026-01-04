// ==UserScript==
// @name         canyilmazuek
// @namespace    https://uzaktanegitimkapisi.cbiko.gov.tr/
// @version      0.3
// @description  Uzaktan Eğitim Kapısı videolarını durmadan izler
// @author       You
// @match        https://uzaktanegitimkapisi.cbiko.gov.tr/*
// @icon         https://www.webbull.net/assets/img/logo.png
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/480521/canyilmazuek.user.js
// @updateURL https://update.greasyfork.org/scripts/480521/canyilmazuek.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
     window.onblur = () => {};
		  $('.vjs-big-play-button').click()
		var myPlayer = videojs.getPlayer('CbikoPl');

                    $(window).blur(function () {
                        myPlayer.play();
                        document.title = "Can YILMAZ ;)"
                    });
    setInterval(()=>{
		var confirmButton = $(".swal-button--confirm")

        if(confirmButton.length){
            confirmButton[0].click()
        }
    },1000)

})

})();