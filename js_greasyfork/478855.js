// ==UserScript==
// @name         Plint change header between testing and production
// @description  Plint header color based on development
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @author       Paul Egell-Johnsen
// @match        https://*.plint.dev/*
// @match        https://*.plint.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plint.dev
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478855/Plint%20change%20header%20between%20testing%20and%20production.user.js
// @updateURL https://update.greasyfork.org/scripts/478855/Plint%20change%20header%20between%20testing%20and%20production.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mainNavbar = document.getElementById('main-navbar');
    const div = document.createElement('div');
    div.style.setProperty('font-size','2em');

    if (location.href.match(/nrk-1-core.test.plint.dev/gi)) {
        div.innerText = 'Testing';

        GM_addStyle ( `
      #main-navbar {
          background-color: #66ff66;
      }
    ` );

    }

    if (location.href.match(/nrk.plint.app/gi)) {
        div.innerText = 'Production';
        GM_addStyle ( `
      #main-navbar {
          background-color: #ff6666;
      }
    ` );
    }
    mainNavbar.appendChild( div );

})();