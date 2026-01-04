// ==UserScript==
// @name         Dailymail remove video ad
// @namespace    http://www.dailymail.co.uk/
// @version      0.1
// @description  Remove video ad
// @author       Foliovision
// @match        https://www.dailymail.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461813/Dailymail%20remove%20video%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/461813/Dailymail%20remove%20video%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        document.getElementById('chromelessPlayer').outerHTML = "";
    },500);
})();