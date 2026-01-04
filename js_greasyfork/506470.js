// ==UserScript==
// @name         javlibrary to javbus
// @namespace    http://tampermonkey.net/
// @version      2024-09-04
// @description  javlibrary跳转javbus
// @author       You
// @match        https://www.javlibrary.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javlibrary.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506470/javlibrary%20to%20javbus.user.js
// @updateURL https://update.greasyfork.org/scripts/506470/javlibrary%20to%20javbus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

let docment=document.getElementById('video_id')
let textDocment=docment?.querySelectorAll('.text')[0]
let newLink = document.createElement('a');
newLink.textContent = '>>JavBus<<'; 
newLink.target = '_blank'; 
newLink.href = `https://www.javbus.com/search/${textDocment?.innerHTML}`; 
textDocment?.appendChild(newLink)
})();