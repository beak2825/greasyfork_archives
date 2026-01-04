// ==UserScript==
// @name         YouTube Home Button Logo Change
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I took it upon myself to "improvise" the current BHM logo to a more humorous, classic style logo.
// @author       Big Beans
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421006/YouTube%20Home%20Button%20Logo%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/421006/YouTube%20Home%20Button%20Logo%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("ytd-yoodle-renderer")[0].src="https://media.discordapp.net/attachments/690422558616715288/805893284726833172/image.png";
    //image can be replaced with logo you create by changing src="img"
    //this works on the top left yt logo shown, when pressed redirects to home page
})();