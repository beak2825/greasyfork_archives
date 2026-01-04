// ==UserScript==
// @name     1DK iBH Notificaties
// @version  1
// @author   rctgamer3
// @description Laat notificaties zien bij nieuwe deals
// @include  https://iboodhunt.1dagskoopjes.nl/*
// @match    https://iboodhunt.1dagskoopjes.nl/*
// @namespace 1dkibhnotificaties
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/368614/1DK%20iBH%20Notificaties.user.js
// @updateURL https://update.greasyfork.org/scripts/368614/1DK%20iBH%20Notificaties.meta.js
// ==/UserScript==
Notification.requestPermission().then(function (result) {
  if (result === 'denied') {
    console.log('Permission wasn\'t granted. Allow a retry.');
    return;
  }
  if (result === 'default') {
    console.log('The permission request was dismissed.');
    return;
  }
});
var target = document.querySelector('ibood-deal:nth-of-type(1) .col1 h2');
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    var iboodnotification = new Notification('NIEUWE DEAL', {
      body: (document.querySelector('ibood-deal:nth-of-type(1) .col1 .priceNow').textContent + ' - ' + document.querySelector('ibood-deal:nth-of-type(1) .col1 h2').textContent),
      dir: 'auto',
      lang: 'NL',
      tag: 'notificationPopupDeal1',
      icon: document.querySelector('ibood-deal:nth-of-type(1) .dealImage img').getAttribute('src')
    }
    );
    iboodnotification.onclick = function (event) {
      document.querySelector('.koopdanform .iboodurl').click();
    };
  });
});
observer.observe(target, {
  characterData: true,
  subtree: true
});