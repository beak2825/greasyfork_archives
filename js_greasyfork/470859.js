// ==UserScript==
// @name         User Agent Changer
// @namespace    http://your-namespace-here/
// @version      1
// @description  Changes the user agent to Windows 10 x64 and Edge
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470859/User%20Agent%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/470859/User%20Agent%20Changer.meta.js
// ==/UserScript==

Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
    writable: false,
    configurable: false,
    enumerable: true
});