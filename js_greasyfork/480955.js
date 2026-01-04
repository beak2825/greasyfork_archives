// ==UserScript==
// @name         Uzaktan Eğitim Kapısı videolarını otomatik arkaplanda izle
// @namespace    https://uzaktanegitimkapisi.cbiko.gov.tr/
// @version      v2.4
// @description  Uzaktan Eğitim Kapısı Videolarını, Bilgisayara Dokunmadan, Arka Arkaya, Arkaplanda İzlemenizi Sağlar
// @author       BoomBookTR
// @homepage     https://greasyfork.org/tr/scripts/480955
// @supportURL   https://greasyfork.org/tr/scripts/480955/feedback
// @match        https://uzaktanegitimkapisi.cbiko.gov.tr/Egitimler/video*
// @match        https://uzaktanegitimkapisi.cbiko.gov.tr/Egitimler/Video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.tr
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/480955/Uzaktan%20E%C4%9Fitim%20Kap%C4%B1s%C4%B1%20videolar%C4%B1n%C4%B1%20otomatik%20arkaplanda%20izle.user.js
// @updateURL https://update.greasyfork.org/scripts/480955/Uzaktan%20E%C4%9Fitim%20Kap%C4%B1s%C4%B1%20videolar%C4%B1n%C4%B1%20otomatik%20arkaplanda%20izle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        // Sekme değiştiğinde
        //window.onblur = () => {};
        // Sekme odaklandığında
        // window.onfocus = () => {};

        var myPlayer = videojs.getPlayer('CbikoPl');

        $(window).blur(function () {
            myPlayer.play();
            document.title = "Uzaktan Eğitim Kapısı"
        });
        $(window).focus(function () {
          myPlayer.play();
          document.title = "Uzaktan Eğitim Kapısı"
        });

        var muteButton = $(".vjs-mute-control")
        if(muteButton.length){
            muteButton.click()
//			muteButton[0].click()}
        }

        setInterval(() => {
            var AutoPlayButton = $('.vjs-big-play-button')
            if(AutoPlayButton.length){
                AutoPlayButton.click()
//			AutoPlayButton[0].click()}
            }

            var confirmButton = $(".swal-button--confirm")
            if(confirmButton.length){
//                confirmButton[0].click()
//               setTimeout(() => {
                // Sayfayı yönlendirme işlemi
                var currentURL = window.location.href;
                var videoUniq = currentURL.match(/Uniq=([^&]*)/)[1];
                var redirectURL = "https://uzaktanegitimkapisi.cbiko.gov.tr/Egitimler/video?Uniq=" + videoUniq;
                window.location.href = redirectURL;
//                }, 5000); // 5 saniye sonra sayfayı yenile
            }
        }, 1000);
        //10 dakikada bir sayfayı yenile. Videonun yüklenmemesi veya ilerlememesi durumunda sorunu giderir.
        setInterval(function() {
            window.location.reload(true);
        }, 300000); // 600000 milisaniye = 10 dakika

    })
})();