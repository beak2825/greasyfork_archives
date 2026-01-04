// ==UserScript==
// @name     Duolingo keyboard shortcuts
// @description Press Shift+Space to play sentence audio (plus adds number keys support for more word bank exercises)
// @version  1.1.8
// @match    https://www.duolingo.com/*
// @grant    none
// @author szupie szupie@gmail.com
// @namespace szupie
// @license Unlicense
// @downloadURL https://update.greasyfork.org/scripts/422207/Duolingo%20keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/422207/Duolingo%20keyboard%20shortcuts.meta.js
// ==/UserScript==
(function () {
  'use strict';
  
  const speakerButtonSelector = '[dir][lang] [dir="ltr"] > button, button._2iVKu, button.L2pR0, button._3MUaZ, button._2UR3y, button.hWH3-, button._3TlAm, button._29LnD, button._2sNVM, button._1oX8u, button._1KXUd, button._3nOBS, label.sgs9X button, [data-test="speaker-button"]';
  
  function handleKeyboard(e) {
    if (e.shiftKey === true && e.key === ' ') {
      const speakButton = document.querySelector(speakerButtonSelector);
      if (speakButton) {
        speakButton.click();
        e.preventDefault();
      }
    }
    
    // use number keys for sentence completion with word bank
    if (e.key >= "1" && e.key <= "9") {
      if (document.querySelector('[data-test="word-bank"]')) {
        const wordBankButtonSelector = `:nth-child(${e.key}) > [data-test="challenge-tap-token"]`;
        const wordBankButton = document.querySelector(`[data-test="word-bank"] ${wordBankButtonSelector}:not([aria-disabled])`);
        if (wordBankButton) {
          wordBankButton.click();
        } else {
          // remove word from sentence
          const disabledClass = '_2Hlc9';
          document.querySelectorAll(`._1gad7 :not(.${disabledClass})${wordBankButtonSelector}`).forEach(node => node.click());
        }
      }
    }
  }
  
  document.addEventListener('keypress', handleKeyboard, false);
  document.addEventListener('keyup', handleKeyboard, false);
})();
