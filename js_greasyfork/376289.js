// ==UserScript==
// @name        Clean Tumblr
// @version     2019.01.04
// @description Full-width tumblrs on your dashboard because hidden tumblrs are marginalized.
// @author      Livadas
// @include	    http://www.tumblr.com/dashboard*
// @include	    http://tumblr.com/dashboard*
// @include	    https://www.tumblr.com/dashboard*
// @include	    https://tumblr.com/dashboard*
// @grant       none
// @run-at      document-idle
// @namespace   https://greasyfork.org/en/users/237051-livadas
// @downloadURL https://update.greasyfork.org/scripts/376289/Clean%20Tumblr.user.js
// @updateURL https://update.greasyfork.org/scripts/376289/Clean%20Tumblr.meta.js
// ==/UserScript==

(function () {
      
function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}
  
  addGlobalStyle(
    ".peepr-drawer-container { width:100%; }"
  );
  
})();