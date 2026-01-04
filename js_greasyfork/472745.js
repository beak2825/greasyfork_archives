// ==UserScript==
// @name            Gappy's Google Search
// @description     Context menu to let Gappy search Google
// @version         0.1
// @author          floppycopier
// @include         *
// @grant           GM_openInTab
// @run-at          context-menu
// @license         MIT
// @namespace https://greasyfork.org/users/1147279
// @downloadURL https://update.greasyfork.org/scripts/472745/Gappy%27s%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/472745/Gappy%27s%20Google%20Search.meta.js
// ==/UserScript==]]]

(() => {
  const highlighted = window.getSelection().toString();
  window.open(`https://google.com/search?q=${highlighted}`, '_blank');
})();