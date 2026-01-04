// ==UserScript==
// @name         test-script
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  just private test script that uses module
// @author       You
// @match        https://example.com/
// @grant        none
// @run-at       document-start
// @require      https://update.greasyfork.org/scripts/490056/1344275/test-module.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490057/test-script.user.js
// @updateURL https://update.greasyfork.org/scripts/490057/test-script.meta.js
// ==/UserScript==

await (async function() {
        console.log("Done");
})();