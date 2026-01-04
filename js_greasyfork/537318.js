// ==UserScript==
// @name         Open in Itch App Floating Button
// @namespace    https://itch.io/
// @version      2025-05-26
// @description  Add an extra floating button that hopefully leads to  the same page in Itch App
// @author       Dimava
// @match        https://*.itch.io/*
// @match        https://itch.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itch.io
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/537318/Open%20in%20Itch%20App%20Floating%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/537318/Open%20in%20Itch%20App%20Floating%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector('#user_tools').insertAdjacentHTML(
    'beforeEnd',
    `
    <li>
      <a class="action_btn"
         href="itch:${document.querySelector('[name="itch:path"]').content}"
      >
        <span class="icon icon-download"></span>
        Open in Itch App
      </a>
    </li>
    `
)

})();