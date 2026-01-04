// ==UserScript==
// @name         URL to lowercase and remove space
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Turn URL to lowercase and remove space
// @author       You
// @match        https://thestringharmony.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427425/URL%20to%20lowercase%20and%20remove%20space.user.js
// @updateURL https://update.greasyfork.org/scripts/427425/URL%20to%20lowercase%20and%20remove%20space.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href, newurl = url.toLowerCase().replaceAll("%20", "")
    if(url!=newurl && document.body.innerText=="404 Not Found."){
        window.location.href = newurl
    }
    // Your code here...
})();