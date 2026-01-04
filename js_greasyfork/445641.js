// ==UserScript==
// @name         StandardUnMusk
// @namespace    https://derstandard.at/
// @version      0.6.1
// @description  Avoid everything Musk on derStandard
// @author       dersansard
// @match        *://*.derstandard.at/*
// @match        *://*.derstandard.de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445641/StandardUnMusk.user.js
// @updateURL https://update.greasyfork.org/scripts/445641/StandardUnMusk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var articles, art;
    // var replacementPic = 'https://place-puppy.com/270x151';
    var replacementPic = 'https://placekitten.com/270/151';
    var replacementCredits = 'placekitten.com';
    var teasers = [
        'Keine Panik',
        'Nicht aufregen',
        'Intermission',
        'Pause zur Mitte der Webseite',
        'Wirklich!',
        'Es ist nichts passiert'
    ];
    var subtitles = [
        'Hier gibt es nichts zu lesen',
        'Bitte scrollen Sie weiter',
        'Genießen Sie diese Auszeit',
        'Unterstützen Sie gute Haustierbilder',
        'Es gibt keinen guten Feed für Traktorenbilder',
        'Können diese Augen lügen?',
        '(apa)',
        'Foto: ' + replacementCredits + ', vermutlich nicht Cremer',
        'Foto: Vielleicht doch Cremer?',
        'Wir kennen den Artikel nicht. Claudia kennt ihn auch nicht.'
    ];
    if (!(articles = document.getElementsByTagName('article'))) return;
    for (const art of articles) {
        if(art.innerText.match(/(Elon)? Musk[\.\s,\:-]/) || art.innerHTML.match(/[\-\/]musks?[\-\'\"]/)) {
            var loopRand = Math.random();
            art.innerHTML =
                '<div><figure><picture>' +
                    '<img src="' + replacementPic + '?' + loopRand + '" title="" alt="' + replacementCredits + '"/>' +
                '</picture></figure>' +
                '<header>' +
                    '<div class="teaser-postingcount">' + Math.floor(loopRand*9000) + ' <span>Postings</span></div>' +
                    '<p class="teaser-kicker">Alles wird gut</p>' +
                    '<h1 class="teaser-title">' + teasers[Math.floor(loopRand*teasers.length)] + '</h1>' +
                    '<p class="teaser-subtitle">'+ subtitles[Math.floor(Math.random()*subtitles.length)] + '</p>'
                '</header></div>';
        }
    }
})();