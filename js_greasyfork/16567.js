// ==UserScript==
// @name        Wanikani Random Font
// @namespace   mempo
// @description Randomize between Japanese fonts on Wanikani.
// @include     https://wanikani.com/review/*
// @include     https://www.wanikani.com/review/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/16567/Wanikani%20Random%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/16567/Wanikani%20Random%20Font.meta.js
// ==/UserScript==

console.log('Start of Wanikani Random Font script');
console.log('////////');

$(function() {
    // Modify here --------------------------------------------------------
    var fonts = [
        "Takao Mincho", "Takao P Mincho", "Takao Ex Mincho", "TakaoGothic", 
        "Takao PGothic","TakaoMincho","Takao PMincho","TakaoExGothic","TakaoExMincho"
    ];
    var good = 'Meiryo';
    var interval = 30; // Seconds
    // No more touchie past this point ------------------------------------

        var randomFont = function() {
        var chosen = fonts[Math.floor(Math.random() * fonts.length)];
        $('[lang="ja"], #user-response').css('font-family', chosen).hover(function() {
            $(this).css('font-family', good);
        }, function() {
            $(this).css('font-family', chosen);
        });
    };
    randomFont();
    setInterval(randomFont, interval * 1000);
}); 