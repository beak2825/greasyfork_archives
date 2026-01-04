// ==UserScript==
// @name         Blur Bunpro English examples
// @namespace    http://tampermonkey.net/
// @version      2024-03-11
// @description  Blurs English example sentences on Bunpro without mouse hover
// @author       You
// @match        https://bunpro.jp/learn*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunpro.jp
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488897/Blur%20Bunpro%20English%20examples.user.js
// @updateURL https://update.greasyfork.org/scripts/488897/Blur%20Bunpro%20English%20examples.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle ( `
      .writeup-example--english {
        filter: blur(5px);
      }
      .writeup-example--english:hover {
        filter: none;
      }
    ` );
})();