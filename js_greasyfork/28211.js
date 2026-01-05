// ==UserScript==
// @name        Duolingo flashcards speaker
// @description Add speaker to duolingo feature "review flashcards"
// @namespace   vokracko
// @author      Lukáš Vokráčko
// @include     https://www.duolingo.com/*
// @version     1.0
// @grant       none
// @encoding    utf-8
// @downloadURL https://update.greasyfork.org/scripts/28211/Duolingo%20flashcards%20speaker.user.js
// @updateURL https://update.greasyfork.org/scripts/28211/Duolingo%20flashcards%20speaker.meta.js
// ==/UserScript==

var target = document.querySelector('body');
var config = { attributes: false, childList: true, characterData: false, subtree: true};
var counter = 1;

var play = function(counter, lang, word) { // play word
  soundManager2015.createSound(
  {
    id: counter, 
    url: 'https://d7mj4aqfscim2.cloudfront.net/tts/' + lang + '/token/' + word, 
    autoPlay: true
  });
}
 
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {

    if($(mutation.addedNodes).find(".flashcard-word")) // when flashcards are shown
    {
      var lang = $(".language-choice.active").data('value');
      var wordNode = $(mutation.addedNodes).find("#current-container").find(".flashcard-word");

      if(wordNode.length)
      {
          var word = $(wordNode).first().text();
          setTimeout(function() {play(counter, lang, word);}, 80); // wait until word is visible
          counter++;  
      } 
    }   
  });    
});

observer.observe(target, config);
