// ==UserScript==
// @name        MAM Request Page Re-title
// @description  Re-title MAM request tab and use arrows to indicate filled status
// @namespace   yyyzzz999
// @author yyyzzz999
// @include     https://www.myanonamouse.net/tor/viewRequest.php/*
// @version     1.2
// @grant       none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418992/MAM%20Request%20Page%20Re-title.user.js
// @updateURL https://update.greasyfork.org/scripts/418992/MAM%20Request%20Page%20Re-title.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.title=document.title.replace('Req: ', '↑'); // unfilled request hoping for upload
document.title=document.title.replace('&#039;', "'"); // Remove HTMl that has crept into titles
if (document.querySelector(".altlink")) document.title=document.title.replace('↑','⬇'); // Filled request ready for download
/* If they change the download link class, this still makes a nicer title.  */
})();