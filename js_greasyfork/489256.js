// ==UserScript==
// @name        Login Only on web.de
// @namespace   Violentmonkey Scripts
// @match       https://web.de/*
// @grant       none
// @version     0.1
// @author      -
// @description displays only the login
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489256/Login%20Only%20on%20webde.user.js
// @updateURL https://update.greasyfork.org/scripts/489256/Login%20Only%20on%20webde.meta.js
// ==/UserScript==


(function() {

      document.querySelector('header').style.display = 'none';
      // Select all <section> elements
      const sections = document.getElementsByTagName('section');
      // Loop through each <section> element and set its display style to "none"
      for (let i = 0; i < sections.length; i++) {
        if (i === 1) {
          sections[i].style.height = "100vh";
        continue;
                  }
      sections[i].style.display = 'none';
      }
})();