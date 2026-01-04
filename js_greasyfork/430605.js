// ==UserScript==
// @name         Classroom broker
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Make your fathers think that classroom is broken
// @author       UnknownUser
// @match        https://classroom.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430605/Classroom%20broker.user.js
// @updateURL https://update.greasyfork.org/scripts/430605/Classroom%20broker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        document.write(`
    <title>Uh...</title>
    <center>
    <h1 id="h1-text"></h1>
    </center>
    `);
        var h1t = document.getElementById('h1-text');
        var num = 10;
        var interval = setInterval(function() {
            h1t.innerHTML = 'The page is not available, retrying in '+num+' seconds...';
            num = num - 1;
        }, 1000);
        setTimeout(function() {
            clearInterval(interval);
            h1t.innerHTML = 'Retrying...';
            setTimeout(function() {
                window.location.reload();
            }, 1500);
        }, 11000);
    });
})();