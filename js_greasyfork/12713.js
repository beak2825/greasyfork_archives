// ==UserScript==
// @name        Godziny na planie polsl
// @description Dodaje godziny rozpoczecia zajec na planie
// @version     1.1.0
// @author      peXu
// @namespace   https://greasyfork.org/pl/users/10243-pexu
// @include     http://plan.polsl.pl/*
// @include     https://plan.polsl.pl/*
// @run-at      document-end
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/12713/Godziny%20na%20planie%20polsl.user.js
// @updateURL https://update.greasyfork.org/scripts/12713/Godziny%20na%20planie%20polsl.meta.js
// ==/UserScript==

// funkcja konwertujaca czas z postaci liczbowej na tekstowa ( 5.5 -> 05:30)
function timeToString(time) {
    var godz = Math.floor(time);
    var min = Math.round((time%1)*60);
    
    if (godz<10) godz = '0' + godz;
    if (min<10) min = '0' + min;
    
    return String(godz+':'+min);
}

// funkcja konwertujaca czas z postaci tekstowej na liczbowa ( 05:30 -> 5.5)
function stringToTime(string) {
    string = string.split(":");
    return Number(string[0])+Number(string[1])/60;
}


poczatek = Number(jQuery("div.cd:contains('Tydzień'):eq(1)+div.cd").css('top').slice(0,-2))+1;      // pozycja top pierwszego wiersza planu z zajeciami (slice odcina "px" ze stringu), +1 ze wzgledu na ramke
startZajec = Number(jQuery("div.cd:contains('Tydzień'):eq(1)+div.cd").text().substr(0,2));          // godzina rozpoczecia pierwszych zajec na planie

// wywolanie funkcji dodajacej czas dla wszystkich zajec na planie
jQuery('.coursediv').each( function() {
    var self = jQuery(this);
    var top = Number(self.css('top').slice(0, -2));                   // pozycja top danego zajecia
    var min = ((top-poczatek)%45)/11*15;                              // wyliczamy minuty zajec, 45 - wysokosc godziny, 11 - wysokosc 15 minut, 15 - 15 minut ;p
    var godz = startZajec + Math.floor((top-poczatek)/45);            // dodajemy ilosc godzin poprzedzajacych zajecia do startu pierwszych zajec
    
    if (godz<10) godz = '0' + godz;                                   // upiekaszanie
    if (min<10) min = '0' + min;                                      // upiekszanie
    
    var rozpoczecie = godz+':'+min;
    
    var wys = Number(self.css('height').slice(0, -2));
    var dlugoscZajec = Math.floor((wys+11)/11)*15/60;
    var zakonczenie = timeToString(stringToTime(rozpoczecie)+dlugoscZajec);
    
    self.html('<p class="js-czas" style="position:absolute;font-weight:bold;text-align:right;text-shadow: 0px 1px 0px #EEE;color:#111;font-size:9px;right: 2px; background-color: rgba(255, 255, 255, 0.5); border-radius: 5px; padding: 1px; border: 1px solid rgba(0, 0, 0, 0.5);top:-7px;">' + rozpoczecie + '</p>'+self.html());
    self.html(self.html()+'<p class="js-czas" style="position:absolute;font-weight:bold;text-align:right;text-shadow: 0px 1px 0px #EEE;color:#111;font-size:9px;right: 2px; background-color: rgba(255, 255, 255, 0.5); border-radius: 5px; padding: 1px; border: 1px solid rgba(0, 0, 0, 0.5); bottom:-7px;">' + zakonczenie + '</p>');
});

jQuery('.coursediv').hover(function() {                               // ukrywanie godzin po najechaniu myszka na div
    jQuery(this).children('p.js-czas').fadeOut(122).dequeue();
}, function() {
    jQuery(this).children('p.js-czas').fadeIn(122).dequeue();
});