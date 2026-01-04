// ==UserScript==
// @name         Friend Requests Fix - MAL
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      7
// @description  Shows a next page button on your friends requests history, and let's you see all friends requests you got up to 3 years ago.
// @author       hacker09
// @match        https://myanimelist.net/notification/friend_request*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446006/Friend%20Requests%20Fix%20-%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/446006/Friend%20Requests%20Fix%20-%20MAL.meta.js
// ==/UserScript==
(function() {
  'use strict';
  window.onload = setTimeout(() => {
    if (location.href.match('history') === null) //If the user is not on a next page already
    { //Starts the if condition
      document.querySelectorAll("div.notification-pagination")[1].insertAdjacentHTML('BeforeEnd', `<span><i class="fa-solid fa-chevron-left"></i> Prev</span> <a href="https://myanimelist.net/notification/friend_request/history?p=1">View more</a>`); //Add the next page button
    } //Finishes the if condition
    else //If the user is on a next page already
    { //Starts the else condition

      var link = `https://myanimelist.net/notification/friend_request/history?p=${parseInt(location.search.match(/\d+/)[0])-1}`; //Suppose the user is not on page 1
      if (location.href.match(/p=1$/) !== null) //If the user is on page 1
      { //Starts the if condition
        link = 'https://myanimelist.net/notification/friend_request'; //Change the link to the first page
      } //Finishes the if condition

      document.querySelector("div.notification-pagination").insertAdjacentHTML('AfterEnd', `<div class="notification-pagination"><a href="${link}"><i class="fa-solid fa-chevron-left"></i> Prev<a href="https://myanimelist.net/notification/friend_request/history?p=${parseInt(location.search.match(/\d+/)[0])+1}">Next <i class="fa-solid fa-chevron-right"></i></a></div>`); //Add the next page button
      document.querySelector("div.notification-pagination").remove(); //Remove the old page buttons
    } //Finishes the else condition
  }, "500");
})();