// ==UserScript==
// @name Can I Leave Now
// @description	Stop That Annoying Pop-Up Message To Leave Pages!!!
// @include *
// @version 1.0
// @namespace https://greasyfork.org/users/13772
// @downloadURL https://update.greasyfork.org/scripts/11310/Can%20I%20Leave%20Now.user.js
// @updateURL https://update.greasyfork.org/scripts/11310/Can%20I%20Leave%20Now.meta.js
// ==/UserScript==

location.href = "javascript:(" + function() {
  window.onbeforeunload = null;
  window.onunload = null;
  window.beforeunload = null;
} + ")()";