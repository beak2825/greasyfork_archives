// ==UserScript==
// @name         Website Password Lock
// @version      1.0
// @description  Lock a website with a password
// @author       Tigertech
// @grant        none
// @include      https://*
// @include      http://*
// @greasyfork
// @updateURL
// @grant        none
// @namespace https://greasyfork.org/users/1228152
// @downloadURL https://update.greasyfork.org/scripts/501038/Website%20Password%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/501038/Website%20Password%20Lock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const correctPassword = 'Tigertech';
    let userPassword = prompt('Enter the password to access this site:');
    if (userPassword !== correctPassword) {
        document.body.innerHTML = '<h1>Access Denied. Check the userscripts home page to learn more.</h1>';
    } else {
        alert('Access Granted!');
    }
})();
