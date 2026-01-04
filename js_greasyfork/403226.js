// ==UserScript==
// @name         Vocabulary.com Listen Button Shortcut 'x'
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http*://www.vocabulary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403226/Vocabularycom%20Listen%20Button%20Shortcut%20%27x%27.user.js
// @updateURL https://update.greasyfork.org/scripts/403226/Vocabularycom%20Listen%20Button%20Shortcut%20%27x%27.meta.js
// ==/UserScript==
function getAudioUrl(host){
    var elements;
    elements = document.getElementsByClassName('audio');//getDictionaryClass
    if (elements.length===0){
    elements = document.getElementsByClassName('button listen');//getClass
    }
    elements = elements[0].getAttribute('data-audio');//getAttribute
    return elements;
}
(function() {
    //keycode of 'x':88
    window.addEventListener('keydown',function(event){
       if (event.keyCode == 88) {
           var url = "https://audio.vocab.com/1.0/us/"+getAudioUrl(window.location.href)+".mp3";
           var audio = new Audio(url);
           audio.play();
       }
    })
})()