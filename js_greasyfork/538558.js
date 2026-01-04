// ==UserScript==
// @name         Swinging Words
// @namespace    http://swing.words/
// @version      1.0
// @description  Random words swing like they're hanging from the page
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538558/Swinging%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/538558/Swinging%20Words.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CHANCE = 0.1; // 10% of words swing

  const style = document.createElement("style");
  style.textContent = `
    @keyframes swing {
      0%   { transform: rotate(0deg); }
      25%  { transform: rotate(105deg); }
      50%  { transform: rotate(0deg); }
      75%  { transform: rotate(75deg); }
      100% { transform: rotate(0deg); }
    }

    .swinging-word {
      display: inline-block;
      transform-origin: bottom left;
      animation: swing 2s ease-in-out infinite;
      margin: 2px;
    }
  `;
  document.head.appendChild(style);

  const paragraphs = document.querySelectorAll("p");
  paragraphs.forEach(p => {
    const text = p.textContent;
    const words = text.split(/(\s+)/); // preserve spaces
    const frag = document.createDocumentFragment();

    words.forEach(word => {
      if (/\S/.test(word) && Math.random() < CHANCE) {
        const span = document.createElement("span");
        span.className = "swinging-word";
        span.textContent = word;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(word));
      }
    });

    p.textContent = ""; // Clear original
    p.appendChild(frag);
  });

  console.log("🎯 Swinging words activated.");
})();
