// ==UserScript==
// @name        BC: tags to top
// @namespace   userscript1
// @match       https://*.bandcamp.com/*
// @match       https://*.bandcamp.com/
// @grant       none
// @version     0.1.2
// @description copy taglist to top of page
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456274/BC%3A%20tags%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/456274/BC%3A%20tags%20to%20top.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.querySelector('div.middleColumn')?.insertAdjacentHTML('afterBegin',
    `<div id="tagscopy" style="margin-bottom: 1em;"></div>`
  );

  var target = document.querySelector('#tagscopy');
  document.querySelectorAll('.tralbum-tags a.tag').forEach(a => {
    let copy = a.cloneNode(true);
    copy.style.cssText = 'margin-right: 5px;';
    target.appendChild(copy);
    target.innerHTML += ' ';
  });

})();