// ==UserScript==
// @name         Gmail Darkify
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make the background of gmail  bit darker
// @author       You
// @match        https://mail.google.com/mail/u/0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455451/Gmail%20Darkify.user.js
// @updateURL https://update.greasyfork.org/scripts/455451/Gmail%20Darkify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        document.getElementById(':4').style.background = '#7b89a3';
        document.getElementById(':3').style.background = '#7b89a3';
        document.querySelector('div#\\:1 > div').style.background = '#ccc';
    }, 1000)
  }
)();