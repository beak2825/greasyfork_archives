// ==UserScript==
// @name         Blacket Moving Background Diagonal
// @version      1.0.0
// @description  Makes background.webp slowly move diagonally to top left on Blacket blooks background
// @match        https://*.blacket.org/*
// @grant        none
// @namespace https://greasyfork.org/users/1479014
// @downloadURL https://update.greasyfork.org/scripts/538496/Blacket%20Moving%20Background%20Diagonal.user.js
// @updateURL https://update.greasyfork.org/scripts/538496/Blacket%20Moving%20Background%20Diagonal.meta.js
// ==/UserScript==

(() => {
  const css = `
    @keyframes animatedBackground {
      0% {
        background-position: 0 0;
      }
      100% {
        background-position: -100px -100px;
      }
    }

    .styles__blooksBackground___3oQ7Y-camelCase {
      background-image: url('/content/background.webp') !important;
      background-repeat: repeat;
      background-size: auto;
      animation: animatedBackground 9s linear infinite;
      -moz-animation: animatedBackground 9s linear infinite;
      -webkit-animation: animatedBackground 9s linear infinite;
      -ms-animation: animatedBackground 9s linear infinite;
      -o-animation: animatedBackground 9s linear infinite;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

