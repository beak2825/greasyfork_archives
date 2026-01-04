// ==UserScript==
// @name         Yargs Docs Fix
// @namespace    http://kevinhill.codes
// @version      0.2
// @description  Fix the sidebar width
// @author       Kevin Hill
// @license      MIT
// @match        https://yargs.js.org/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=js.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446661/Yargs%20Docs%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/446661/Yargs%20Docs%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement("style");
    style.type = "text/css";
    style.innerText=String.raw`
    .content { max-width: 100% !important; }

    @media (min-width: 1200px) {
      .content-root { padding-left: 400px; }
      .menubar { width: 400px; }
    }
    `;

    document.getElementsByTagName("head")[0].appendChild(style);
})();