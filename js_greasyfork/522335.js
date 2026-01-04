// ==UserScript==
// @name        BC: record label link visible
// @namespace   userscript1
// @match       https://*.bandcamp.com/*
// @match       https://*.bandcamp.com/
// @grant       none
// @version     0.1.1
// @description copy the "← record label" link above the album art so it's visible without resizing the browser window
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522335/BC%3A%20record%20label%20link%20visible.user.js
// @updateURL https://update.greasyfork.org/scripts/522335/BC%3A%20record%20label%20link%20visible.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.querySelector('div.middleColumn')?.insertAdjacentHTML('afterBegin',
    `<div id="labelcopy" style="margin-bottom: 1em;"></div>`
  );

  var target = document.querySelector('#labelcopy');
  document.querySelectorAll('a.back-to-label-link').forEach(a => {
    var text = a.firstElementChild.innerHTML.split('<br>').join(' '); // innerText strips thelinebreak??
    var href = a.href;
    target.innerHTML = `<a href=${href}>← ${text}</a>`;
  });

})();