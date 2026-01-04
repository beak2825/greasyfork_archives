// ==UserScript==
// @name         missav timetcontroler adjustment for mobile
// @namespace    http://tampermonkey.net/
// @version      2023-12-15
// @description  On the mobile end, adapt and optimize missav's time control to facilitate interaction.
// @author       CCC
// @match        https://missav.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530030/missav%20timetcontroler%20adjustment%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/530030/missav%20timetcontroler%20adjustment%20for%20mobile.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
 
    let container = document.querySelector('.order-first >div > div:nth-child(2)');
    let spans = container.querySelectorAll('span');
 
    container.classList.add('flex-col')
    for (let i = 0; i < spans.length; i++) {
  // 对每个 span 元素进行操作，比如添加类名或修改样式
        spans[i].classList.add('pt-4');
    }
})();