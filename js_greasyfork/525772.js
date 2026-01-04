// ==UserScript==
// @name         meow >:3 [BETA RELEASE 1.0.0]
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This is beta release of the script, expect bugs. Use at your own risk!
// @author       Aquti!
// @match        https://starve.io/
// @icon         https://raw.githubusercontent.com/Aquti/Meow/refs/heads/main/meow.ico
// @run-at       document-start
// @license      MIT
// @grant        GM_addElement
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/525772/meow%20%3E%3A3%20%5BBETA%20RELEASE%20100%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/525772/meow%20%3E%3A3%20%5BBETA%20RELEASE%20100%5D.meta.js
// ==/UserScript==

(function() {
    GM_addElement('script', {
        src: 'https://raw.githubusercontent.com/Aquti/Meow/refs/heads/main/releases/beta.js',
        type: 'text/javascript'
    });
})();
