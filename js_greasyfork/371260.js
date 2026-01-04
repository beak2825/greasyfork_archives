// ==UserScript==
// @name     Quick YouTube Fix for /watch page
// @version  2
// @match https://www.youtube.com/*
// @description:en Fixes the new YouTube bug from today that messed up the /watch page.
// @namespace https://greasyfork.org/users/205394
// @description Fixes the new YouTube bug from today that messed up the /watch page.
// @downloadURL https://update.greasyfork.org/scripts/371260/Quick%20YouTube%20Fix%20for%20watch%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/371260/Quick%20YouTube%20Fix%20for%20watch%20page.meta.js
// ==/UserScript==


setInterval(function(){
        document.getElementById('content').setAttribute("class","content-alignment");
    }, 100);


