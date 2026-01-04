// ==UserScript==
// @name         FreeBuf FreeView
// @namespace    http://tampermonkey.net/
// @version      2024-05-24
// @description  View Articles Freely!
// @author       FFE4
// @match        https://www.freebuf.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freebuf.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495927/FreeBuf%20FreeView.user.js
// @updateURL https://update.greasyfork.org/scripts/495927/FreeBuf%20FreeView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function SetFree()
    {
        document.querySelectorAll(".un-login-view").forEach(node=>{node.setAttribute("class",".login-view")})
    }
   setInterval(SetFree,1000);
})();