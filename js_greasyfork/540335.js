// ==UserScript==
// @name         Drawaria Rainbow theme by 𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @namespace    https://greasyfork.org/ru/users/1485055-%D0%BC%D1%83%D1%80%D1%87%D0%B8%D0%BA-%D0%BC%D1%83%D1%80%D1%87%D0%B8%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9
// @version      0.8
// @description  none
// @author       𝘣𝘢𝘳𝘴𝘪𝘬 𝘴𝘯𝘰𝘴𝘦𝘳
// @match        https://drawaria.online/*
// @grant        none
// @license      𝘣𝘢𝘳𝘴𝘪𝘬
// @downloadURL https://update.greasyfork.org/scripts/540335/Drawaria%20Rainbow%20theme%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/540335/Drawaria%20Rainbow%20theme%20by%20%F0%9D%98%A3%F0%9D%98%A2%F0%9D%98%B3%F0%9D%98%B4%F0%9D%98%AA%F0%9D%98%AC%20%F0%9D%98%B4%F0%9D%98%AF%F0%9D%98%B0%F0%9D%98%B4%F0%9D%98%A6%F0%9D%98%B3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      position: relative;
      z-index: 0;
    }

    body::after {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(45deg,
        #003366,
        #0055aa,
        #0099cc,
        #00cc99,
        #66ff66,
        #ffff00,
        #ff9900,
        #ff0066,
        #9900cc
      );
      background-size: 400% 400%;
      animation: rainbowShiftForward 30s linear infinite;
      z-index: -100;
      pointer-events: none;
    }

    @keyframes rainbowShiftForward {
      0%   { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  `;
  document.head.appendChild(style);
})();
