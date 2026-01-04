// ==UserScript==
// @name         Where in fortnite In google classroom
// @namespace    https://your-website.com
// @version      1.0
// @description  Embeds Where in fortnite into Google Classroom
// @author       BaconDude117
// @match        https://classroom.google.com/u/1/calendar/this-week/course/all
// @match        https://classroom.google.com/u/0/calendar/this-week/course/all
// @match        https://classroom.google.com/u/calendar/this-week/course/all
// @match        https://classroom.google.com/u/1/
// @match        https://classroom.google.com/u/0/
// @match        https://classroom.google.com
// @match        https://classroom.google.com/h

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509088/Where%20in%20fortnite%20In%20google%20classroom.user.js
// @updateURL https://update.greasyfork.org/scripts/509088/Where%20in%20fortnite%20In%20google%20classroom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an iframe element to embed the Algebra Game
    var iframe = document.createElement('iframe');
    iframe.src = 'https://whereinfortnite.com/'; // URL of the game
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.marginLeft = '100px';

    // Append the iframe to the target page
    document.body.appendChild(iframe);
})();
