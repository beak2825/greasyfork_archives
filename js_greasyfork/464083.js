// ==UserScript==
// @name         crow thurification
// @namespace    https://blog.krahsu.top/
// @version      0.1
// @description  earthquake!
// @author       hiacia
// @match        https://*/*
// @icon         https://cdn.krahsu.top/pic/blog202302030251122.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464083/crow%20thurification.user.js
// @updateURL https://update.greasyfork.org/scripts/464083/crow%20thurification.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const crow = document.createElement("img");
    crow.innerHTML = '<img src="https://i2.hdslb.com/bfs/face/f30b0c87d50422f9446ffa1040e822b19f013f97.jpg@240w_240h_1c_1s.webp" alt="crow.png"/>'
    document.querySelectorAll('a,span').forEach(
        e=>{
            e.addEventListener('click',(event)=>{
            event.preventDefault();
            e.innerHTML = '<img src="https://i2.hdslb.com/bfs/face/f30b0c87d50422f9446ffa1040e822b19f013f97.jpg@240w_240h_1c_1s.webp" alt="crow.png"/>';
            });})
})();