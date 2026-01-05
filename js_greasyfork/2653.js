// ==UserScript==
// @name        Prevent a tab from popping up dialogs when closing the tab
// @namespace   *
// @include     https://support.mozilla.org/en-US/questions/760727
// @version     1
// @author      unknown
// @description Prevent a tab from popping up dialogs when closing the tab.  Copied from UserScripts.org
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2653/Prevent%20a%20tab%20from%20popping%20up%20dialogs%20when%20closing%20the%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/2653/Prevent%20a%20tab%20from%20popping%20up%20dialogs%20when%20closing%20the%20tab.meta.js
// ==/UserScript==

window.onbeforeunload=null;