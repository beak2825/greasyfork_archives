// ==UserScript==
// @name        Browse mutualart.com without login
// @namespace   https://github.com/AbdurazaaqMohammed
// @description Browse mutualart.com without login nag
// @match       https://www.mutualart.com/*
// @grant       none
// @version     1.0
// @author      Abdurazaaq Mohammed
// @homepage    https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL  https://github.com/AbdurazaaqMohammed/userscripts/issues
// @license     The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/540510/Browse%20mutualartcom%20without%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/540510/Browse%20mutualartcom%20without%20login.meta.js
// ==/UserScript==
(function() {
  const hideElements = () => {
    const signupDialog = document.querySelector('#signup_dialog');
    const defaultAdplace = document.querySelector('#default_adplace');
    const modalBackdrop = document.querySelector('.modal-backdrop.fade.in');
    const artistArtworks = document.querySelector('div.page-content.Artist\\Artworks');

    if (signupDialog) signupDialog.remove();
    if (defaultAdplace) defaultAdplace.remove();
    if (modalBackdrop) modalBackdrop.remove();
    if (artistArtworks) artistArtworks.style.filter = 'none';
    document.documentElement.style.overflow = 'auto';
  };

  new MutationObserver((m,o)=>hideElements()).observe(document.body,{childList:!0,subtree:!0});

  hideElements();
})();