// ==UserScript==
// @name         FirstTimeScripter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button next to the channel name to run the invert script.
// @author       EliteSoba
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507665/FirstTimeScripter.user.js
// @updateURL https://update.greasyfork.org/scripts/507665/FirstTimeScripter.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SCRIPT_ID = 'the-invert-script';

  const addButtonIfNecessary = () => {
    if (document.getElementById(SCRIPT_ID)) {
        return;
    }
    const links = document.querySelector('[data-a-target="stream-title"]');
    if (links) {
      const parent = links.parentElement;
      parent.style.display = 'flex';
      parent.style.alignItems = 'center';

      const scriptButton = document.createElement('button');
      scriptButton.style.padding = '1px 6px';
      scriptButton.style.borderRadius = '5px';
      scriptButton.style.border = '1px solid #cccccc';
      scriptButton.style.background = '#77777780';
      scriptButton.style.color = 'var(--color-text-base)';
      scriptButton.style.marginLeft = '10px';
      scriptButton.id = SCRIPT_ID;
      scriptButton.innerText = 'Invert Script';
      scriptButton.onclick = () => {
        const vid = document.getElementsByTagName('video')[0];
        if (vid) {
          vid.style.transform = 'rotate(180deg)';
          vid.style.filter = 'invert(1)';
        }
      }
      parent.appendChild(scriptButton);
    }
  }

  setInterval(addButtonIfNecessary, 1000);
})();