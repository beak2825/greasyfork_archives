// ==UserScript==
// @name         Show course name - Canvas Instructure
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      5
// @description  Shows the full course name and course code of your class on any page.
// @author       hacker09
// @match        https://*.instructure.com/*
// @icon         https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438453/Show%20course%20name%20-%20Canvas%20Instructure.user.js
// @updateURL https://update.greasyfork.org/scripts/438453/Show%20course%20name%20-%20Canvas%20Instructure.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  if (location.pathname.split('/').length > 3) //If the user is not on the Home page of the course
  { //Starts the if condition
    const response = await (await fetch(location.origin + '/courses/' + location.pathname.split('/')[2])).text(); //Fetch
    const newDocument = new DOMParser().parseFromString(response, 'text/html'); //Parses the fetch response
    document.querySelectorAll('span.ellipsible')[1].innerText.match(newDocument.title) ? document.querySelectorAll('span.ellipsible')[1].innerText += ' ' + newDocument.title : document.querySelectorAll('span.ellipsible')[1].innerText = newDocument.title; //Add the full course title after the course code
    document.querySelectorAll('span.ellipsible')[1].title = document.querySelectorAll('span.ellipsible')[1].innerText; //Show the full course title and course code on mouse hover
    setTimeout( () => { document.querySelectorAll('span.ellipsible')[1].style.maxWidth = 'unset' }, 1500); //Set CSS max-width property for proper formatting
  } //Finishes the if condition
})();