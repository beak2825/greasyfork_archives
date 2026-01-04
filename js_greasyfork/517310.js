// ==UserScript==
// @namespace Chef
// @name     Restore Console
// @version  1.0.0
// @description  Restore the Console that has been blocked by some websites
// @match    *
// @grant    none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/517310/Restore%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/517310/Restore%20Console.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;
    // iframe.contentWindow.console.log('Console Fixes');
})();
