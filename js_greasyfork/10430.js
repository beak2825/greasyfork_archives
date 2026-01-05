// ==UserScript==
// @name        Motherless gallery keyboard navigation
// @namespace   niceme.me
// @description Increases productivity when you're not being productive. Supports left and right handed browsing (arrow keys or A and D)
// @include     http://motherless.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10430/Motherless%20gallery%20keyboard%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/10430/Motherless%20gallery%20keyboard%20navigation.meta.js
// ==/UserScript==
if ($('.previous-link').attr('href') != 'undefined') {
  prevUrl = 'http://motherless.com' + $('.previous-link').attr('href');
  nextUrl = 'http://motherless.com' + $('.next-link').attr('href');
}

if (prevUrl != 'http://motherless.comundefined' || nextUrl != 'http://motherless.comundefined') {
  window.addEventListener('keydown', function (e) {
    if (((e.key == 'ArrowRight' || e.key == 'd') ||  // Firefox
         (e.keyCode == 39 || e.keyCode == 68)) && // Chrome
         nextUrl != 'http://motherless.comundefined') {
        document.location.href = nextUrl;
    } else if (((e.key == 'ArrowLeft' || e.key == 'a') || // Firefox
               (e.keyCode == 37 || e.keyCode == 65)) // Chrome
               && prevUrl != 'http://motherless.comundefined') {
      document.location.href = prevUrl;
    }
  });
}
