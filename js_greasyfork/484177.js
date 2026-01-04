// ==UserScript==
// @name         Embed Shellshock.io Game
// @namespace    https://your-website.com
// @version      1.0
// @description  Embeds Shell Shockers into Google Classroom
// @author       Your Name
// @match        https://classroom.google.com/u/1/calendar/this-week/course/all
// @match        https://classroom.google.com/u/0/calendar/this-week/course/all
// @match        https://classroom.google.com/u/calendar/this-week/course/all
// @match        https://classroom.google.com/u/1/
// @match        https://classroom.google.com/u/0/
// @match        https://classroom.google.com
// @match        https://classroom.google.com/h

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484177/Embed%20Shellshockio%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/484177/Embed%20Shellshockio%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an iframe element to embed the Algebra Game
    var iframe = document.createElement('iframe');
    iframe.src = 'https://algebra.best/?showAd=18b64894dc1&scriptVersion=0.2.1'; // URL of the game
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.marginLeft = '100px';

    // Append the iframe to the target page
    document.body.appendChild(iframe);
})();
