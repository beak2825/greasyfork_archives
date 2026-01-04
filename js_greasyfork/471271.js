// ==UserScript==
// @name        not even close
// @namespace   Violentmonkey Scripts
// @match       https://garlic-bread.reddit.com/embed*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant       none
// @version     2.1.3
// @author      Luckanio, credits to r/Osuplace and r/Titanfolk
// @description NOT EVEN CLOSE BABY TECHNOBLADE NEVER DIES
// @downloadURL https://update.greasyfork.org/scripts/471271/not%20even%20close.user.js
// @updateURL https://update.greasyfork.org/scripts/471271/not%20even%20close.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {
      document
        .getElementsByTagName("garlic-bread-embed")[0]
        .shadowRoot
        .children[0]
        .getElementsByTagName("garlic-bread-share-container")[0]
        .getElementsByTagName("garlic-bread-camera")[0]
        .getElementsByTagName("garlic-bread-canvas")[0]
        .shadowRoot
        .children[0]
        .appendChild(
          (function () {
              const img = document.createElement("img");
              img.src = "https://cdn.discordapp.com/attachments/771449670320914462/1131623074282876928/dotted_test5.png";
              img.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
              console.log(img);
              return img;
          })())
  }, false);
}