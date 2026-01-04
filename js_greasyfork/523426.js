// ==UserScript==
// @name         CE remove expedition images
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove the annoying images on the CE expeditions page
// @author       Velthir
// @match        https://cartelempire.online/Expedition
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523426/CE%20remove%20expedition%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/523426/CE%20remove%20expedition%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var images = document.getElementsByClassName("img-fluid px-4 rounded");
     for(var i=0; i<images.length; i++) {
         images[i].src = "";
     }
})();