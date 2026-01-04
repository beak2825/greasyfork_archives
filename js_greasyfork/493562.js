// ==UserScript==
// @name     Plötzblog paywall remover
// @description remove paywall on www.ploetzblog.de
// @version  1.1
// @include  http*://www.ploetzblog.de/*
// @grant    none
// @namespace https://greasyfork.org/users/5209
// @downloadURL https://update.greasyfork.org/scripts/493562/Pl%C3%B6tzblog%20paywall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/493562/Pl%C3%B6tzblog%20paywall%20remover.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
  const pageLoadObserver = new MutationObserver(async function() {
    const paywall = document.querySelector('.cleanslate');
    if(!paywall) return;

    pageLoadObserver.disconnect();
    paywall.remove();
  });

  const observerConfig = { childList: true, subtree: true };
  pageLoadObserver.observe(document.body, observerConfig);
});