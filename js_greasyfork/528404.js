// ==UserScript==
// @name         Moonbounce Dyslexia Theme
// @namespace    https://github.com/diary001/lunebounce
// @supportURL   https://discord.gg/pixel
// @license      MIT
// @version      1.0.1
// @description  Makes the Moonbounce extension components dyslexia friendly
// @author       lune / linktr.ee/moon
// @match        *://*/*
// @icon         https://framerusercontent.com/images/iuVZmsE2sifPExZXNrETQrDkU.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528404/Moonbounce%20Dyslexia%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/528404/Moonbounce%20Dyslexia%20Theme.meta.js
// ==/UserScript==
(function () {
    "use strict";

    const docStyle = document.createElement('style');
    docStyle.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
    `;
    document.head.appendChild(docStyle);

    function checkPresence() {
      return (
        document.getElementById(
          "moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem"
        )?.shadowRoot != null
      );
    }

    function injectCSS() {
      const shadowRoot = document.querySelector(
        "div#moonbounce-ext-container-mbheeaapbjpckahhciogfdodofjjldem"
      )?.shadowRoot;

      if (!shadowRoot) {
        setTimeout(injectCSS, 500);
        return;
      }

      const moonbouncePortal = shadowRoot.querySelector("#MOONBOUNCE\\.PORTAL");
      if (!moonbouncePortal) {
        setTimeout(injectCSS, 500);
        return;
      }

      const styleElement = document.createElement("style");
      styleElement.textContent = `
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        /* Apply to all elements in the shadow DOM */
        * {
          font-family: 'OpenDyslexic' !important;
        }
      `;

      shadowRoot.appendChild(styleElement);
      console.log("%cDyslexia font applied to Moonbounce extension", "background: #44515a; color: #aef0ff; font-size: medium");
    }

    async function runner() {
      const timeStart = performance.now();
      let exists = checkPresence();
      if (!exists) return setTimeout(runner, 500);
      const timeEnd = performance.now();
      injectCSS();
      setTimeout(() => console.log("%c((made with <3 by lune))", "background: #44515a; color: #aef0ff; font-size: x-large; font-style: italic"), 1200);
    }

    runner();
})();
