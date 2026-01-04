// ==UserScript==
// @name         Autodarts Legs+Sets larger
// @namespace    http://tampermonkey.net/
// @version      2.32
// @description  Legs+Sets larger
// @author       benebelter
// @match        *://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487322/Autodarts%20Legs%2BSets%20larger.user.js
// @updateURL https://update.greasyfork.org/scripts/487322/Autodarts%20Legs%2BSets%20larger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.head.insertAdjacentHTML(
      "beforeend",
      /*html*/ `
          <style>
           /* Sets, Legs */
            .css-5i7dz4, .css-1djw0mw, .css-1hcjh09 {
             font-size: 64px !important;
            }
          /* Playername, Average*/
            span.css-g0ywsj > .css-0 , .css-1j0bqop {
            font-size: 2em !important;
            }
          </style>
           `
    );


})();