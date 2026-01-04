// ==UserScript==
// @name        ShowUp.TV Tools
// @author	    Fapka
// @namespace	  sut
// @description Zmienia nieco stronę SU - wygląd i funkcje.
// @include     https://showup.tv/*
// @exclude     
// @homepage    https://github.com/fapkamaster/SUT/
// @version     0.2.0.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/33440/ShowUpTV%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/33440/ShowUpTV%20Tools.meta.js
// ==/UserScript==
// Kontakt: fapkamaster@gmail.com

//Ostrzeżenie przed opuszczeniem własnej transmisji przy klikaniu przycisku wiadomości.
if (window.location.pathname == "/site/start_transmission")
  {
$(".blue-btn").on("click", function(event){
    if(confirm("Potwierdź opuszczenie transmisji."))
    {
       return true;
    }
    else
    {
        event.preventDefault();
        return false;
    }
});
  }

//Ostrzeżenie przed opuszczeniem własnej transmisji (dowolny link lub zamknięcie strony - również wyświetla się przy akceptowaniu priva).
// if (window.location.pathname == "/site/start_transmission")
// {   window.onbeforeunload = function(evt) {
//     var message = 'Opuszczenie strony wyłączy transmisję! Kontynuować?';
//     if (typeof evt == 'undefined') {
//         evt = window.event;}
//     if (evt) {
//         evt.returnValue = message;     }
//     return message;};}

//Zmiana globalnej czcionki.
$("*").css("font-family","DejaVu Serif");
//Zmiana rozmiaru globalnego czcionki (zmiany zauważane co 100)
$("*").css("font-weight","500");

// Wyświetla obrazek przed załadowaniem streama oraz przy odświeżaniu, zachęcający do otworzenia showsu.pl
// Oryginalny zamiar: Podmienia obrazek z "Kup żetony" na link do Showsu.pl
$('#cameraWindow').attr("onclick","return false;");
$("#cameraWindow").css("background-image","url('http://i.imgur.com/CgNT6A3.png')");

//////Dźwięk
//// Adresy dźwięków
// Dźwięk żetona na transmisji (dla transmitującej)
mSoundTip = new Audio("https://dl.dropbox.com/s/vi9fv75cei3glqc/Super%20Mario%20Bros%20-%20Coin%20Sound%20Effect%20Loud.mp3");
//Dźwięk wołania na priv
//mPrivInvite = new Audio("https://dl.dropbox.com/s/5ndqj79p5hzufb7/SU%20D%C5%BAwi%C4%99k%20Priva.mp3?dl=0");
//Dźwięk wiadomości PW
//mMSGSoundPriv = new Audio("https://dl.dropbox.com/s/4ckxd4bs4fp82i5/d%C5%BAwi%C4%99k%20wiadomo%C5%9Bci%20na%20pw.MP3");
//mMSGSoundPriv2 = new Audio("https://showup.tv/sounds/newMessage.mp3");

// Odczyt wartości żetona
mTokenNumber = parseInt(document.getElementById("tokensCountContainer").innerText);

// Osobny dźwięk otrzymania żetonów oraz prywatnej wiadomości (jeżeli dostajesz za nią żetony).
// Warunek strony (transmitująca)
if (window.location.pathname == "/site/start_transmission")
{ setInterval(getTokenNumber, 1);
function getTokenNumber(){
    var count = parseInt(document.getElementById("tokensCountContainer").innerText);
      if(count > mTokenNumber +9)
    { 
        mSoundTip.play();
        mTokenNumber = count;
    }
  }
}
// Warunek działa na privkach.
if (window.location.pathname.match(/^\/prv/))
{ setInterval(getTokenNumber, 1);
function getTokenNumber(){
    var count = parseInt(document.getElementById("tokensCountContainer").innerText);
      if(count > mTokenNumber +9)
    { 
        mSoundTip.play();
        mTokenNumber = count;
    }
  }
}

// Usuwa "puste przestrzenie", by ShowUp.tv było bardziej kompaktowe, w tym clearfixy.
// document.getElementsByClassName('footer-info-text')[0].remove()
document.getElementsByClassName('pink-bar')[0].remove();
document.getElementsByClassName('footer-info-text')[0].remove();
document.getElementsByClassName('footer-nav-bg')[0].remove();
document.getElementsByClassName('footer-shadow')[0].remove();

$(".clearfix").hide();

// Usuwa (zamienia na puste) elementy ze strony.
////// Też coś nie działa.
$('.footer-info-text').html('');
$('.pink-bar').html('');
$('.copyright').html('');
$('.createdby').html('');

// Odrabowanie (czyli usunięcie slashy) pozwala na usunięcie przycisku transmisji z dołu strony i zaoszczędzenie więcej miejsca.
// document.getElementsByClassName('bugcontainer')[0].remove()
// document.getElementsByClassName('bottom-banner')[0].remove()

// Przyciski na dole strony.
// //////// Obecnie nie działa.
var input = document.createElement('input');
    input.type = 'button';
    input.value = 'Kontakt z twórcą skryptu';
    input.onclick = showAlert;
    document.body.appendChild(input);
    function showAlert()
    {  alert('fapkamaster@gmail.com');
    }

var input = document.createElement('input');
    input.type = 'button';
    input.value = 'Kontakt z BOK Szołapa';
    input.onclick = showAlert2;
    document.body.appendChild(input);
    function showAlert2()
    {  alert('bok@showup.tv');
    }
