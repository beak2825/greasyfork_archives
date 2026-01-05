// ==UserScript==
// @name        Floating Menu Bar (GitHub)
// @namespace   chriskim06
// @description Makes the menu bar in GitHub stay at the top of the page when scrolling
// @include     https://github.com/*/*
// @version     1.0.6
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/16665/Floating%20Menu%20Bar%20%28GitHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16665/Floating%20Menu%20Bar%20%28GitHub%29.meta.js
// ==/UserScript==

(function() {
  var content = document.querySelector('div.header.header-logged-in.true');
  if (content !== null) {
    content.style.position = 'fixed';
    content.style.zIndex = '10000';
    content.style.width = '100%';
    content = document.querySelector('#js-flash-container');
    if (content !== null) {
      content.style.position = 'relative';
      content.style.top = '50px';
    }
    content = document.querySelector('div[role="main"]');
    if (content !== null) {
      content.style.position = 'relative';
      content.style.top = '50px';
    }
    content = document.querySelector('div.container.site-footer-container');
    if (content !== null) {
      content.style.position = 'relative';
      content.style.top = '50px';
    }
  }
})();
