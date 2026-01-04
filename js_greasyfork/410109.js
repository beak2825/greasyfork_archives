// ==UserScript==
// @name         Kareem hagag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove the login restriction in wuxiaworld novel chapters
// @author       You
// @match        https://www.wuxiaworld.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410109/Kareem%20hagag.user.js
// @updateURL https://update.greasyfork.org/scripts/410109/Kareem%20hagag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById('quotalimitmodal').remove();
    document.getElementsByClassName('modal-backdrop fade in').forEach((x)=>{x.remove()});
    document.getElementsByClassName('text-disabled').forEach((x)=>{x.style.filter = 'none'});
    document.getElementsByClassName('modal-open').forEach((x)=>{x.classList.remove('modal-open')});
})();