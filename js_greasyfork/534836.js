// ==UserScript==
// @name        Sainsbury's no scroll
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/sainsburys-no-scroll
// @include     https://www.sainsburys.co.uk/gol-ui/*
// @exclude     none
// @version     1.0.1
// @description:en	Prevents the page from scrolling after you add an item to your basket
// @grant    		none
// @description	Prevents the page from scrolling after you add an item to your basket
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534836/Sainsbury%27s%20no%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/534836/Sainsbury%27s%20no%20scroll.meta.js
// ==/UserScript==

function worker() {
  try {
    Element.prototype.scrollIntoView = () =>
      console.log('scrollIntoView is disabled');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

worker();
