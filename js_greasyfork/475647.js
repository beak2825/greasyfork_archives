// ==UserScript==
// @name         Facebook Alert Icon
// @namespace    UserScript
// @version      1.1
// @description  Adds an alert icon to the page based on Facebook notifications and messages.
// @match        https://www.facebook.com/*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475647/Facebook%20Alert%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/475647/Facebook%20Alert%20Icon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let isAlertIconShown = false;

  let myRevertedIcon = '';
  const myAlertIcon = 'https://media0.giphy.com/media/6tFe2NtvrwMDVuztDI/giphy.gif?cid=ecf05e47u7c53icg252rj6wvfanbfktxkkzrth6wbm3eu642&ep=v1_gifs_search&rid=giphy.gif&ct=g';


  function replacePageIcon(iconUrl) {
    var link = document.querySelector("link[rel~='icon']");

    if (link) {
      if (!isAlertIconShown && !myRevertedIcon) myRevertedIcon = link.href;
      link.href = iconUrl;
    } else {
      link = document.createElement("link");
      link.rel = "icon";
      link.href = iconUrl;
      document.head.appendChild(link);
    }
  }



  // Function to check if notifications or messages have empty content
  function checkEmptyContent() {
    let allEmpty = !document.title.startsWith('(');

    // Revert icon if all content is empty
    if (allEmpty && isAlertIconShown) {
      replacePageIcon(myRevertedIcon);
      isAlertIconShown = false;
    }
  }

  // Function to check if notifications or messages have unread content
  function checkUnreadContent() {

    let anyNonEmpty = document.title.startsWith('(') && /\(\d+\)\s\S/.test(document.title);

    // Replace icon if any content is non-empty
    if (anyNonEmpty && !isAlertIconShown) {
      replacePageIcon(myAlertIcon);
      isAlertIconShown = true;
    }
  }

  let oldTitle = '';

  // Function to handle the onReady event
  function onReady() {

    let currentMutationId = 0;
    let p = function (mutationsList) {

      if (oldTitle !== document.title) {

        oldTitle = document.title;

        setTimeout(() => {
          if (isAlertIconShown) {
            checkEmptyContent();
          } else {
            checkUnreadContent();
          }
        }, 100)


      }

    }
    const observer = new MutationObserver(p);

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    p();
  }

  // Check document ready state and add event listener if necessary
  Promise.resolve().then(() => {
    if (document.readyState !== 'loading') {
      onReady();
    } else {
      window.addEventListener("DOMContentLoaded", onReady, false);
    }
  });

})();