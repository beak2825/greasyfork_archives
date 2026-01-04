// ==UserScript==
// @name         Uppercase Everything
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Forces all text on every website to be uppercase
// @author       YourName
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/527384/Uppercase%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/527384/Uppercase%20Everything.meta.js
// ==/UserScript==

GM_addStyle(`* { text-transform: uppercase !important; }`);
