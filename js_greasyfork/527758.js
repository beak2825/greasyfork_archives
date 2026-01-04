// ==UserScript==
// @name        Tae Kim's fix
// @namespace   Violentmonkey Scripts
// @grant       GM_addStyle
// @version     1.03
// @author      Oreo
// @description 2/22/2025, 5:23:26 PM
// @match        *://*guidetojapanese.org/*
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527758/Tae%20Kim%27s%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/527758/Tae%20Kim%27s%20fix.meta.js
// ==/UserScript==

// Highlight current link
GM_addStyle(`
    a[href="${window.location.href}"] {
        background-color: yellow !important;
        color: black !important;
        font-weight: bold !important;
        outline: 2px solid orange !important;
    }
`);

// Fix spoilers
var dom_observer = new MutationObserver(function(mutation) {
    // Monitor darkmode switch
    const darkModeSwitch = document.querySelector('.wp-dark-mode-switch-2');
    if (!darkModeSwitch) {
      return false;
    }

    const isDarkMode = darkModeSwitch.className.includes("active");
    if (isDarkMode) {
              console.log('fixing dark mode');
        // Fix the styles for the spoilers in black
        GM_addStyle(`
          .spoiler {
              background-color: rgb(189, 181, 170) !important;
          }

          .spoiler:hover, .reveal {
            background-color: transparent !important;
          }
        `);
    } else {
      console.log('back to normal mode');
        GM_addStyle(`
          .spoiler {
             background-color: #444 !important;
          }

          .spoiler:hover, .reveal {
            background-color: transparent !important;
          }
        `);
    }
});

var container = document.documentElement || document.body;
console.log(container);
var config = { attributes: true, childList: true, characterData: true };
dom_observer.observe(container, config);