// ==UserScript==
// @name        Classic Online-Stopwatch
// @namespace   feifeihang.info
// @description Return to classic Online-Stopwatch
// @include     http://www.online-stopwatch.com*
// @include     https://www.online-stopwatch.com*
// @version     1
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/12415/Classic%20Online-Stopwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/12415/Classic%20Online-Stopwatch.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var FULLSCREEN = 'http://www.online-stopwatch.com/full-screen-stopwatch/';
  var pathname = window.location.pathname;
  // if it's homepage, go to fullscreen mode.
  if (pathname === '' || pathname === '/') {
    window.location.href = FULLSCREEN;
    return;
  }
  //  if it's fullscreen mode page, remove the top and bottom back links.

  if (pathname === '/full-screen-stopwatch/' || pathname === '/full-screen-stopwatch') {
    var divs = document.querySelectorAll('div.coad, div.bback');
    console.log(divs);
    divs = Array.prototype.slice.apply(divs);
    divs.map(function (div) {
      div.remove();
      return null;
    });
    // now, make the stopwatch really fullscreen.
    unsafeWindow.adSize = 0;
    unsafeWindow.fully();
  }
}) (this, this.document);
