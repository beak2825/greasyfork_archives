// ==UserScript==
// @name         PH! User comment hider
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Hides comments posted by or replied to the specified users
// @author       You
// @match        https://itcafe.hu/tema/*
// @match        https://prohardver.hu/tema/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itcafe.hu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470823/PH%21%20User%20comment%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/470823/PH%21%20User%20comment%20hider.meta.js
// ==/UserScript==

const usersToHide = ['user1', 'user2'];

(() => {
  'use strict';

  const deleteCards = () => {

    const comments = document.querySelectorAll('.card');

    comments.forEach((card) => {
      const authorTitle = card.querySelector('.msg-head-author .user-title a');
      const repliedTitle = card.querySelector('.msg-head-replied .user-title a');

      if (
        (authorTitle && usersToHide.includes(authorTitle.textContent.trim())) ||
        (repliedTitle && usersToHide.includes(repliedTitle.textContent.trim()))
      ) {
        // Delete the card element
        card.remove();
      }
    });
  };

  deleteCards();
})();