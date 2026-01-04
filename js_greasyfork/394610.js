// ==UserScript==
// @name         Pandanese Auto Play Reading
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto plays reading after answer is entered
// @author       Crihak
// @match        https://www.pandanese.com/review
// @match        https://www.pandanese.com/learn/quiz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394610/Pandanese%20Auto%20Play%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/394610/Pandanese%20Auto%20Play%20Reading.meta.js
// ==/UserScript==

function bindPlaySound() {
    var answer = document.querySelector('#answer');
    var answerEnteredObserver = new MutationObserver(m => m.forEach(handleAnswerMutation));
	answerEnteredObserver.observe(answer, {attributes: true, attributeFilter: ["readonly"]});
}

function handleAnswerMutation(mutation) {
    if (mutation.type === 'attributes') {
        handleAnswerEntered()
    }
}

function handleAnswerEntered() {
    // Check if this is a reading question
    var flashcard = document.querySelector('.card-flashcard');
    if (flashcard.classList.contains('-reading')) {
        document.querySelector('.card-flashcard_back_content audio').play()
    }
}

var nodeAddedObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (!mutation.addedNodes) return

    for (var i = 0; i < mutation.addedNodes.length; i++) {
      // do things to your newly added nodes here
      var node = mutation.addedNodes[i]
      if (node.getAttribute('data-bind') == 'question') {
          bindPlaySound();
      }
    }
  })
})

nodeAddedObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
})