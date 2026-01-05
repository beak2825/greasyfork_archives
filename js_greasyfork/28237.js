// ==UserScript==
// @name        Hide Instructions Hybrid
// @namespace   localhost
// @author      Hunter
// @description hides instructions for Hybrid
// @include     *
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/28237/Hide%20Instructions%20Hybrid.user.js
// @updateURL https://update.greasyfork.org/scripts/28237/Hide%20Instructions%20Hybrid.meta.js
// ==/UserScript==

document.getElementsByClassName('instructions')[0].style.display='none';