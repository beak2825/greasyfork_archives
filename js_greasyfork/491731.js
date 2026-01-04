// ==UserScript==
// @name         Word Switcher for AO3 (site-wide; user-settable)
// @namespace    github.com/forceofcalm
// @version      0.1
// @description  Switches the a select word with a preferred word site-wide, across all AO3 works. User-settable.
// @author       calm
// @match        https://archiveofourown.org/works/*
// @icon         [later]
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491731/Word%20Switcher%20for%20AO3%20%28site-wide%3B%20user-settable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/491731/Word%20Switcher%20for%20AO3%20%28site-wide%3B%20user-settable%29.meta.js
// ==/UserScript==

// ADD YOUR WORD PREFERENCES HERE
// format: ['word to be replaced', 'preferred word'],
// the quotes and comma are important!
// also these are examples, you can replace them with whatever you want
const words = [
  ['oi', 'hey'],
  ['gray', 'grey'],
  ['roommates', 'flatmates'],
  ['one', 'two'],
];

(() => {
  const workText = document.querySelector('#workskin');

  words.forEach(([oldWord, newWord]) => {
      const regex = new RegExp(String.raw`\b${oldWord}\b`, 'gu');
      const regexCapitalized = new RegExp(String.raw`\b${oldWord[0].toUpperCase() + oldWord.toLowerCase().slice(1)}\b`, 'gu');
      const regexLower = new RegExp(String.raw`\b${oldWord}\b`, 'gu');
      const regexUpper = new RegExp(String.raw`\b${oldWord}\b`, 'gu');
      const regexIgnoreCase = new RegExp(String.raw`\b${oldWord}\b`, 'gui');

      const oldWordTest = regexIgnoreCase.test(workText.textContent);
      const newWordTest = regexIgnoreCase.test(workText.textContent);

      const hasBothWords = oldWordTest && newWordTest;

      // check that work only has one of the words
      if (hasBothWords) {
        alert(`Word Switcher: Work contains both ${oldWord} and ${newWord}. Please edit the work manually.`);
        return;
      }

      // work is already in preferred word
      if (newWordTest) {
        return;
      }

      function replaceWord(node, oldWord, newWord) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(oldWord, newWord);
        } else if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
              replaceWord(childNode, oldWord, newWord);
            });
        }
      }

      // normally cased word
      replaceWord(workText, regex, newWord);
      // capitalized word
      replaceWord(workText, regexCapitalized, newWord[0].toUpperCase() + newWord.slice(1).toLowerCase());
      // lowercased word
      replaceWord(workText, regexLower, newWord.toLowerCase());
      // uppercased word
      replaceWord(workText, regexUpper, newWord.toUpperCase());
    });
})();