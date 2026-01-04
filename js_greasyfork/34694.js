// ==UserScript==
// @name ReviewBoard Navigation Links
// @description Adds "To Me" and "Outgoing" links to the navigation bar.
// @namespace andschwa
// @version 0.3
// @match https://reviews.apache.org/*
// @license https://www.gnu.org/licenses/agpl-3.0.txt
// @supportURL https://github.com/andschwa/ReviewBoardNavigationLinks
// @downloadURL https://update.greasyfork.org/scripts/34694/ReviewBoard%20Navigation%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/34694/ReviewBoard%20Navigation%20Links.meta.js
// ==/UserScript==

var ul = document.querySelector('#navbar');

var toMe = document.createElement('li');
toMe.innerHTML = '<a href="/dashboard/?view=to-me">To Me</a>';
ul.appendChild(toMe);

var outgoing = document.createElement('li');
outgoing.innerHTML= '<a href="/dashboard/?view=outgoing">Outgoing</a>';
ul.appendChild(outgoing);
