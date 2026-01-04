// ==UserScript==
// @name         canyilmazuek
// @namespace    https://uzaktanegitimkapisi.cbiko.gov.tr/
// @version      0.5
// @description  Uzaktan Eğitim Kapısı videolarını durmadan izler. Tasarruf Tedbirleri İçin Uyumludur
// @author       You
// @match        https://*.cbiko.gov.tr/*
// @icon         https://www.webbull.net/assets/img/logo.png
// @grant        none
// @run-at       document-end
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/480638/canyilmazuek.user.js
// @updateURL https://update.greasyfork.org/scripts/480638/canyilmazuek.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log('runned');
$(document).ready(function(){
    if ($('iframe#ScoFrame').length > 0) {
        $('body').append( $('<div><h1>Videolar Yeni Sekmede Açılacak, Tüm videolar tamamlanınca bu sayfayı elle yenilemeniz gerekiyor</h1><h2>Videolar otomatik olarak sona gelecektir. Arkaplanda çalıştırmayınız</h2><a style="display: block;font-size: 16px;background: #333;border-radius: 5px;color: #fff;font-weight: bold;padding: 10px;" href="'+$('iframe#ScoFrame').attr('src')+'" target="cnylmzUEK">Yeni Sekmede Aç</a></div>').attr('style', 'background: #fff;width: 80%;position:fixed;top:30%;left: 10%;z-index:1090;border: 2px solid #000;padding: 20px;text-align: center;'));
    } else {
        window.onblur = () => {};
 		try {
            $('.vjs-big-play-button').click()
		    var myPlayer = videojs.getPlayer('CbikoPl');
		    $(window).blur(function () {
                myPlayer.play();
                 document.title = "Can YILMAZ ;)"
            });
            } catch(err) {
                console.log(err.message);
            }
        setInterval(()=>{
          $("video").each(function(index) {
              if($(this)[0].playing == true) {
                  console.log($(this));
                  $(this)[0].currentTime=($(this)[0].duration - 1);
              }
          });

		  var confirmButton = $(".swal-button--confirm")

          if(confirmButton.length){
              confirmButton[0].click()
          }
        },5000)
    }
})

})();