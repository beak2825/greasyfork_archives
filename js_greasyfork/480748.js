// ==UserScript==
// @name         RoyalRoad Extra Upload Date Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bring the upload date to the top of the screen since I always forget to check it before loading the next one
// @author       You
// @match        https://www.royalroad.com/fiction/*/chapter/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=royalroad.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480748/RoyalRoad%20Extra%20Upload%20Date%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/480748/RoyalRoad%20Extra%20Upload%20Date%20Info.meta.js
// ==/UserScript==


    var timestamp = document.querySelector('.profile-info ul li').innerHTML;
    var navBar = document.querySelector('.nav-buttons');

    navBar.outerHTML += "<div style='text-align: center; margin-top: 10px;'>" + timestamp + "</div>";