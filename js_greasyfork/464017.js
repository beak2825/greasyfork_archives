// ==UserScript==
// @name         earthquake
// @namespace    https://blog.krahsu.top/
// @version      0.1
// @description  earthquake!
// @author       hiacia
// @match        https://*/*
// @icon         https://cdn.krahsu.top/pic/blog202302030251122.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464017/earthquake.user.js
// @updateURL https://update.greasyfork.org/scripts/464017/earthquake.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('*').forEach(e=>{e.addEventListener('mouseenter',()=>{e.style.position='absolute';e.style.top=Math.random*100})});
})();