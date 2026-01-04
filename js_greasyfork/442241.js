// ==UserScript==
// @name        Remove Paywall - thelocal.de
// @namespace   Violentmonkey Scripts
// @match       https://www.thelocal.de/*
// @grant       none
// @version     1.0
// @author      
// @license MIT
// @description 3/28/2022, 11:13:17 AM
// @downloadURL https://update.greasyfork.org/scripts/442241/Remove%20Paywall%20-%20thelocalde.user.js
// @updateURL https://update.greasyfork.org/scripts/442241/Remove%20Paywall%20-%20thelocalde.meta.js
// ==/UserScript==

function removePaywall () {
  document.querySelector('body').classList.remove('tp-modal-open');
  document.querySelector('.tp-modal').remove();
  document.querySelector('.tp-backdrop').remove();
  console.log('RemovePaywall: done');
}

const body = document.querySelector('body');

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class' && body.className.includes('tp-modal')) {
      removePaywall();
      observer.disconnect();
    }
  }
});

observer.observe(body, { attributes: true })