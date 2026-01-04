// ==UserScript==
// @license      MIT
// @name         Udemy course sidebar to the left
// @namespace    https://greasyfork.org/en/users/1124342-rur
// @version      1.0
// @description  Moves the course content sidebar to the left of the screen
// @author       Rur
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/471692/Udemy%20course%20sidebar%20to%20the%20left.user.js
// @updateURL https://update.greasyfork.org/scripts/471692/Udemy%20course%20sidebar%20to%20the%20left.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('load', () => {
    const interval = setInterval(function () {
      const main = document.querySelector('#udemy main');
      const sidebar = document.querySelector('#udemy main > div:first-child > div:nth-child(2)');
      const footer = document.querySelector('div.ud-footer-container');

      if (!main || !sidebar || !footer) {
        return false;
      }

      clearInterval(interval);

      main.style.flexDirection = 'row-reverse';

      sidebar.style.right = 'unset';
      sidebar.style.left = 0;

      footer.style.marginLeft = '25%';
    }, 1000);
  }, false);
})();
