// ==UserScript==
// @name         every links lead to rickroll
// @namespace    http://tampermonkey.net/
// @version      1337
// @description  you click = you get rickrolled
// @author       rick ashlee's biggest fan
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431448/every%20links%20lead%20to%20rickroll.user.js
// @updateURL https://update.greasyfork.org/scripts/431448/every%20links%20lead%20to%20rickroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var p = document.getElementsByTagName('a');
    for (let i = 0; i<p.length; i++) {
        p[i].href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    }
})();