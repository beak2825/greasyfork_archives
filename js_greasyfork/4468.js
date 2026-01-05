// ==UserScript==
// @name        Hide Venue Quality Instructions
// @namespace   localhost
// @author      zingy
// @description disable instructions by default
// @include     *
// @version     0.343
// @downloadURL https://update.greasyfork.org/scripts/4468/Hide%20Venue%20Quality%20Instructions.user.js
// @updateURL https://update.greasyfork.org/scripts/4468/Hide%20Venue%20Quality%20Instructions.meta.js
// ==/UserScript==

document.getElementsByClassName('overview-wrapper')[0].style.display='none';
