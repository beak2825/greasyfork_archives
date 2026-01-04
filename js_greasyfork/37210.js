// ==UserScript==
// @name         Zeit Newsticker Autoupdate
// @namespace    graphen
// @version      1.0.3
// @description  Dieses Skript ist zum filtern und hervorheben von Schlagzeilen des Zeit.de Newstickers (zeit.de/news/index)
// @author       Graphen
// @match        https://www.zeit.de/news/index*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/37210/Zeit%20Newsticker%20Autoupdate.user.js
// @updateURL https://update.greasyfork.org/scripts/37210/Zeit%20Newsticker%20Autoupdate.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function() {
    'use strict';

    var filter = [
        "Sport","sport",
        "Biathlon",
        "Hockey","hockey",
        "ball",
        "Ski",
        "Schwimmen",
        "athletik",
        //"Film",
        "Rodeln",
        "Golf",
        "Freizeit",
        "Tennis","tennis",
        "French Open",
        "Segeln",
        "Börsen",
        "Olympia",
        "Paralympics",
        "Weltcup",
        "meisterschaft",
        "Bundesliga",
        "League",
        "Playoff",
        "Formel 1",
        "Kültür",
        "Türkye",
        "Turnier",
        "Spieltag",
        "Abstiegskandidat",
        "FC Schalke 04",
        "Saisonsieg",
        "holt Bronze",
        "holt Silber",
        "holt Gold",
        "2. Liga",
        "WM-Gesichter",
        "Trainer",
        "trainer"
        ];
    var highlightRed = [
        'International',
        'Konflikte',
        'Verteidigung',
        'UNO',
        'Regierung',
        'Verfassung',
        'Terrorismus',
        'Migration'
        ];
    var highlightBlue = [
        'EU',
        'USA','Trump',
        'Russland',
        'China',
        'Nordkorea',
        'Iran',
        'Irak',
        'Israel',
        'Frankreich',
        'Katalonien',
        'Ägypten',
        'Syrien',
        'Türkei'
        ];
    var highlightGreen = [
        'Deutschland',
        'Parteien',
        'Polizei',
        'Extremismus','Kriminalität',
        'Wahlen'
        ];
    var articles = document.querySelectorAll('article');
    var kicker = '';
    var intervall = 10; //Minuten

    for (var x of articles) {
        kicker = '';
        if (x.querySelector('.newsteaser__kicker')) {
            kicker = x.querySelector('.newsteaser__kicker').innerText;
            }
        for (var y1 of filter) {
            if( kicker.includes(y1) || kicker === ''){
                x.style.display = "none";
                break;
            }
        }
        for (var y2 of highlightRed) {
            if( kicker.includes(y2) ){
                x.getElementsByTagName('a')[0].setAttribute('style','display:block;background-color:#f006');
                break;
            }
        }
        for (var y3 of highlightBlue) {
            if( kicker.includes(y3) ){
                x.getElementsByTagName('a')[0].setAttribute('style','display:block;background-color:#00f3');
                break;
            }
        }
        for (var y4 of highlightGreen) {
            if( kicker.includes(y4) ){
                x.getElementsByTagName('a')[0].setAttribute('style','display:block;background-color:#0f03');
                break;
            }
        }
    }

    //setTimeout(function(){ location.reload(); },intervall*60*1000);
})();
