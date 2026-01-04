// ==UserScript==
// @name         martinefyer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *
// @match        https://google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370411/martinefyer.user.js
// @updateURL https://update.greasyfork.org/scripts/370411/martinefyer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){var imgs = document.getElementsByTagName("img");for(var i=0, l=imgs.length;i<l;i++){imgs[i].src = "https://cdn.discordapp.com/avatars/280070266116243456/c7929989fdf0d0e09faccff63c498a91.png";}}, 1000)
    // Your code here...
})();