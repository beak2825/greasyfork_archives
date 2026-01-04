// ==UserScript==
// @name         test-module
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  just private test module
// @author       You
// @match        https://example.com/
// @grant        none
// @run-at       document-start
// @license      MIT
// ==/UserScript==

await (async function() {
        console.log(GM_info.script.version);
})();