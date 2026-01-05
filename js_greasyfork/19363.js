// ==UserScript==
// @name         kurwy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://karachan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19363/kurwy.user.js
// @updateURL https://update.greasyfork.org/scripts/19363/kurwy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.innerHTML = document.body.innerHTML.replace(/kobiet/g, 'kurw');
    document.body.innerHTML = document.body.innerHTML.replace(/kobiecy/g, 'kurwi');
    document.body.innerHTML = document.body.innerHTML.replace(/kobiec/g, 'kurw');
    // Your code here...
})();