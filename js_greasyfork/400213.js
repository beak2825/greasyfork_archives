// ==UserScript==
// @name         百一测评
// @namespace    https://www.101test.com/
// @version      0.1
// @description  try to take over the world!
// @author       menma
// @match        https://www.101test.com/*
// @match        https://kaoba.101test.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400213/%E7%99%BE%E4%B8%80%E6%B5%8B%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/400213/%E7%99%BE%E4%B8%80%E6%B5%8B%E8%AF%84.meta.js
// ==/UserScript==

(function() {
   setInterval(function(){
   $(window).unbind("blur");
   $(window).unbind("focus");
   },500);
})();