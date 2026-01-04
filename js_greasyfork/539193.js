// ==UserScript==
// @name         Replace Blacket Header with Hover-Grow Letters
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace #big-name with static glowing Titan One letters that grow on hover
// @match        https://blacket.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539193/Replace%20Blacket%20Header%20with%20Hover-Grow%20Letters.user.js
// @updateURL https://update.greasyfork.org/scripts/539193/Replace%20Blacket%20Header%20with%20Hover-Grow%20Letters.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const waitForElement = (selector, callback) => {
    const check = () => {
      const el = document.querySelector(selector);
      if (el) callback(el);
      else requestAnimationFrame(check);
    };
    check();
  };

  waitForElement('#big-name', (originalEl) => {
    const newLink = document.createElement('a');
    newLink.href = 'https://blacket.org';
    newLink.id = 'blacket-custom';
    newLink.style.cssText = `
      display: flex;
      justify-content: center;
      font-size: 2.5rem;
      font-family: 'Titan One', cursive;
      cursor: pointer;
      text-decoration: none;
    `;

    newLink.innerHTML = `
      <span class="letter">B</span>
      <span class="letter">l</span>
      <span class="letter">a</span>
      <span class="letter">c</span>
      <span class="letter">k</span>
      <span class="letter">e</span>
      <span class="letter">t</span>
    `;

    originalEl.parentElement.insertBefore(newLink, originalEl);
    originalEl.remove();

    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Titan+One&display=swap');

      #blacket-custom .letter {
        display: inline-block;
        color: white;
        font-family: 'Titan One', cursive;
        text-shadow:
          0 0 5px white,
          0 0 10px white,
          0 0 15px white,
          0 0 20px white;
        transition: transform 0.2s ease;
      }

      #blacket-custom .letter:hover {
        transform: scale(1.3);
      }
    `;
    document.head.appendChild(style);
  });
})();
