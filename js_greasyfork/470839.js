// ==UserScript==
// @name         RunDebugger
// @namespace    http://microblock.cc/
// @version      0.1
// @description  Trigger debugger when pressed "`"
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/470839/RunDebugger.user.js
// @updateURL https://update.greasyfork.org/scripts/470839/RunDebugger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', ({key})=>{
        if (key === '`')
            debugger;
    });
    // Your code here...
})();