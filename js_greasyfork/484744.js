// ==UserScript==
// @name         Studocu Premium Banner Bypass
// @namespace    https://github.com/DemonDucky
// @version      1.0,1
// @description  Remove premium banner & blur of Studocu document
// @author       DemonDucky
// @match        https://www.studocu.com/*/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=studocu.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484744/Studocu%20Premium%20Banner%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/484744/Studocu%20Premium%20Banner%20Bypass.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    .removefilter {
      filter: none !important;
      user-select: auto !important;
    }
  `;

  function loadHandler() {
    GM_addStyle(css);
    removeBlur();
    removeBanner();
  }

  function removeBlur() {
    const pageContainerChilds =
      document.querySelector('#page-container').childNodes;
    const pagesContent = document.querySelectorAll('.page-content');

    pageContainerChilds.forEach(element => {
      element.childNodes[1]?.remove();
    });

    pagesContent.forEach(element => {
      element.classList.add('removefilter');
    });
  }

  function removeBanner() {
    const previewPopUp = document.querySelector('#document-wrapper');
    const bannerWrapper = document.querySelectorAll('.banner-wrapper');
    if (previewPopUp.childNodes.length >= 2) {
      previewPopUp.childNodes[1].childNodes[0].remove();
    }

    bannerWrapper.forEach(element => {
      element.remove();
    });
  }

  window.addEventListener('load', loadHandler);
})();
