// ==UserScript==
// @name        pastebin helper
// @namespace   userscript1
// @match       https://paste.passtheheadphones.me/*
// @match       https://gerty.orpheus.network/*
// @match       https://zerobin.net/*
// @match       https://paste.nebulance.io/*
// @grant       none
// @version     0.1.6
// @author      -
// @description enters password for encrypt/decrypt. set default expiry.
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/479208/pastebin%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/479208/pastebin%20helper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // put password here:
  const password = '';



  // util functions
  const  $ = document.querySelector.bind(document);
  const $$ = document.querySelectorAll.bind(document);

  // insert password
  insertPassword();
  $('#newbutton').addEventListener('click', insertPassword);

  function insertPassword() {
      var waitForPassword = setInterval(function() {
         if ($('#passwordinput')) {
            $('#passwordinput').value   = password;
            $('#passworddecrypt').value = password;
            clearInterval(waitForPassword);
         }
        }, 100);
  }


  // click decrypt when ready
  const form = $('#passwordmodal');
  const decryptButton = form.querySelector('button');
  var waitUntilReady = setInterval(function() {
   if (form.style.display == 'flex') {
      decryptButton.click();
      clearInterval(waitUntilReady);
   }
  }, 100);

  // set default expiry to 1 week
  window.setInterval(function() {
    if ($('#expiration')?.textContent.includes('Never') ) {
      $$('#expiration + ul li a')[4].click();
    }
  }, 1000);

})();