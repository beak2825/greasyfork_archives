// ==UserScript==
// @name        	DC - Popup Alerte
// @namespace   	DreadCast
// @include     	https://www.dreadcast.net/Main
// @grant       	none
// @author 			Ianouf (original), Uriel
// @date 			17/04/2020
// @version 		1.0
// @description 	Alerte sonore a la reception d'une popup
// @compat 			Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/417301/DC%20-%20Popup%20Alerte.user.js
// @updateURL https://update.greasyfork.org/scripts/417301/DC%20-%20Popup%20Alerte.meta.js
// ==/UserScript==

var sourceSoundPopupAlerte = 'https://bigsoundbank.com/UPLOAD/mp3/0268.mp3';
var soundPopupAlerte = $('#soundPopupAlerte');

var text1 = "Vous avez touché une prime !";
var text2 = "Vous êtes attaqué !";

function getSoundPopupAlerte(){
	if(!soundPopupAlerte.length){
		$("<audio></audio>").attr({'src':sourceSoundPopupAlerte, 'id':'soundPopupAlerte'}).css({'display':'none'}).appendTo("body");
		soundPopupAlerte = $('#soundPopupAlerte');
	}
	return soundPopupAlerte[0];
}

function playSoundPopupAlerte(){
   console.log($("#zone_evilBox .evilBox").text());
   if( $("#zone_evilBox .evilBox").text().indexOf(text2) >= 0) {
        soundPopupAlerte = getSoundPopupAlerte();
        soundPopupAlerte.load();
        soundPopupAlerte.play();
        $("#zone_evilBox .evilBox").click(function(){
            soundPopupAlerte = getSoundPopupAlerte();
            soundPopupAlerte.pause();
        });
    }
}

Engine.prototype.activeEvilBoxSave = Engine.prototype.activeEvilBox;
Engine.prototype.activeEvilBox = function(){
    this.activeEvilBoxSave();
    playSoundPopupAlerte();
}