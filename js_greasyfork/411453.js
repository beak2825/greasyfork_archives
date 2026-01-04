// ==UserScript==
// @name         Yahoo Answers Trash Filter
// @version      0.1
// @description  Hide Yahoo Answers questions matching a list of words
// @include      http://answers.yahoo.com/*
// @include      https://answers.yahoo.com/*
// @author       tlacuache
// @namespace https://greasyfork.org/users/688118
// @downloadURL https://update.greasyfork.org/scripts/411453/Yahoo%20Answers%20Trash%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/411453/Yahoo%20Answers%20Trash%20Filter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function getDivsByRegex(regex) {
    var divs = document.getElementsByTagName('div'),
        matches = [],
        index,
        div;
    for (index = 0; index < divs.length; index += 1) {
      div = divs[index];
      if (regex.test(div.className)) {
        matches.push(div);
      }
    }
    return matches;
  }

  function cleanIt() {
    var questionCards = getDivsByRegex(/^QuestionCard__/),
      i, j, k,
      card, child, grandChild,
      hideme, questionText,
      hideCount = 0,
      skipRegex = /\b(trump|kamala|harris|pelosi|donald|blm|obama|clinton|biden|corona|coronavirus|covid\d*|conservatives?|liberals?|libtards?|dems?|democrats?|republicans?|coronavirus)\b/i;

    for (i = 0; i < questionCards.length; i += 1) {
      card = questionCards[i];
        if (card.parentNode.style.display != 'none') {
        hideme = false;
        for (j = 0; j < card.childNodes.length; j += 1) {
          child = card.childNodes[j];
          for (k = 0; k < child.childNodes.length; k += 1) {
            grandChild = child.childNodes[k];
            if (/^QuestionCard__title__/.test(grandChild.className)) {
              questionText = grandChild.textContent;
              if (skipRegex.test(questionText)) {
                hideme = true;
                break;
              }
            }
            if (hideme) break;
          }
          if (hideme) break;
        }
        if (hideme) {
          card.parentNode.style.display = 'none';
          hideCount++;
        }
      }
    }
    // if (hideCount > 0) console.log('hid', hideCount, 'garbage questions');
  }

  document.addEventListener('DOMNodeInserted', cleanIt, false);

  cleanIt();

})();