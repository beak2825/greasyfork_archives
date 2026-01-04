// ==UserScript==
// @name         Cloudflare BuckBreaker 5000
// @version      1.0
// @description  Fixes soyjak.st going to Kiwi IRC in most cases
// @author       Semicolon
// @match        http://soyjak.st/*
// @match        https://soyjak.st/*
// @match        http://soyjak.party/*
// @match        https://soyjak.party/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1463799
// @downloadURL https://update.greasyfork.org/scripts/534454/Cloudflare%20BuckBreaker%205000.user.js
// @updateURL https://update.greasyfork.org/scripts/534454/Cloudflare%20BuckBreaker%205000.meta.js
// ==/UserScript==

// made in 2 minutes lol
(function() {
    'use strict';
    if (location.hostname === 'soyjak.st') {
        location.href = location.href.replace('://soyjak.st', '://www.soyjak.st');
    }
})();