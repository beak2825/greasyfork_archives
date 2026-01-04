// ==UserScript==
// @name         Remove It
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  lock mouse and remove body & change html to black
// @author       HaMm3r_MaN
// @match        *://*/*
// @icon         https://i.pinimg.com/originals/25/9c/83/259c83f98ee97497c014b3be5bfd29ed.gif
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450483/Remove%20It.user.js
// @updateURL https://update.greasyfork.org/scripts/450483/Remove%20It.meta.js
// ==/UserScript==

(function() {
    'use strict';
   document.querySelector("body").remove();
    document.querySelector("head > title").innerHTML = ' "w" استغفر الله العظيم'
    var html = document.querySelector("html");
    html.style.backgroundColor = 'Black'
    window.onload = function() {
    html.requestFullscreen()
    html.requestPointerLock();
};

})();
