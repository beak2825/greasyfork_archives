// ==UserScript==
// @name        Bypass Reddit Age Verification
// @namespace   https://gist.github.com/fidele007/3ff4a2d8bcd722d12bf2bbb9330a64e1
// @description Bypass 18+ age verification on all subreddits
// @include     *://*reddit.com/over18*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35067/Bypass%20Reddit%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/35067/Bypass%20Reddit%20Age%20Verification.meta.js
// ==/UserScript==
(function(){
  "use strict";
  document.getElementsByName('over18').forEach(function (button) {
    if (button.value == "yes") {
      button.click();
      throw BreakException;
    }
  });
})();