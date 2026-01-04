// ==UserScript==
// @name         UEKcbiko
// @namespace    https://uzaktanegitimkapisi.cbiko.gov.tr/
// @version      1.0
// @description  Uzaktan Eğitim Kapısı derslerini durmadan izler
// @author       Serat Serin
// @match        https://uzaktanegitimkapisi.cbiko.gov.tr/Egitimler/*
// @icon         none
// @grant        none
// @run-at       document-end
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/481118/UEKcbiko.user.js
// @updateURL https://update.greasyfork.org/scripts/481118/UEKcbiko.meta.js
// ==/UserScript==

(function() {
    'use strict';


    window.onload = () => {
        calistir();
    }

    setInterval(butonTikla, 4000);


})();

function butonTikla(){
    var butonVisible = document.getElementsByClassName("swal-button swal-button--confirm").length > 0;
    if(butonVisible){

        var linkArray = sonLink;

        var tumDersSayisi = document.getElementsByClassName("EgitimDtLs").length;

        if(linkArray[1] == tumDersSayisi) {
            return;
        }

        document.getElementsByClassName("swal-button swal-button--confirm")[0].click();

        //OK butonu açılmış, video başlığıyla son link aynıysa sayfayı yenile. Değilse yeni link açılmış ona tıkla.
        if( linkArray[2] = document.getElementById("DvSubTitle").innerText ){
            window.location.reload();
        } else {
            window.location = linkArray[0];
        }

    }
}


function calistir(){

    window.onblur = () => {};
    setTimeout(()=>{

        document.getElementsByClassName("vjs-big-play-button")[0].click();
        var myPlayer = videojs.getPlayer('CbikoPl');
        window.blur(function () {
                        myPlayer.play();
                    });
    },3000);


}

function sonLink(){
	var sLink = "";
    var linkSayisi = 0;
	var elements = document.getElementsByTagName("a");
    var baslik;

	for(var i=0;i<elements.length;i++){
		if(elements[i].getAttribute("href").starstWith("/Egitimler/Video")){
			sLink = elements[i].getAttribute("href");
            baslik = elements[i].innerText;
            linkSayisi ++;
		}
	}

	return [sLink, linkSayisi, baslik];

}