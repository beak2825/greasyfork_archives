// ==UserScript==
// @name         Git-SCM Background Color Changer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dynamically replace the background color of Git-SCM pages based on the system theme
// @author       mcwindy
// @match        https://git-scm.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527437/Git-SCM%20Background%20Color%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/527437/Git-SCM%20Background%20Color%20Changer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const darkModeBg = '#1B1B1B'; // for dark mode
  const lightModeBg = '#fff'; // for light mode

  // Detection system theme
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const bgColor = isDarkMode ? darkModeBg : lightModeBg;

  const bodyElement = document.querySelector('body');
  if (bodyElement) {
    bodyElement.style.background = bgColor;
  }

  // Replace the background attribute in all style sheets
  const styleSheets = document.styleSheets;
  for (let i = 0; i < styleSheets.length; i++) {
    const styleSheet = styleSheets[i];
    try {
      const cssRules = styleSheet.cssRules || styleSheet.rules;
      for (let j = 0; j < cssRules.length; j++) {
        const rule = cssRules[j];
        if (rule.selectorText === 'body' && rule.style.background) {
          rule.style.background = bgColor;
        }
      }
    } catch (e) {
      // Cross-domain style sheet cannot be accessed, ignored
    }
  }
})();