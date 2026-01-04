// ==UserScript==
// @name        Dictionary.com fullscreen crossword
// @namespace   Violentmonkey Scripts
// @match       https://www.dictionary.com/e/crossword/*
// @grant       none
// @version     1.0.1
// @author      popular-software
// @license MIT
// @description 3/24/2024, 12:07:21 PM
// @downloadURL https://update.greasyfork.org/scripts/490739/Dictionarycom%20fullscreen%20crossword.user.js
// @updateURL https://update.greasyfork.org/scripts/490739/Dictionarycom%20fullscreen%20crossword.meta.js
// ==/UserScript==

(() => {
  console.log('running userscript: fullscreen crossword');
  const element = document.querySelector('main iframe');
  element.style = `
   position: absolute;
   left: 0;
   top: 0;
   z-index: 7001;
   width: 100vw;
   height: 100vh;
  `;
  element.parentElement.style = `
   z-index: auto;
  `;
})()