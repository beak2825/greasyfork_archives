// ==UserScript==
// @name        Hide Alex
// @author      Hunter
// @description Hides 0.06 Alex Instructions
// @include     *
// @version 1
// @namespace https://greasyfork.org/en/users/443592-kai-meyer
// @match https://worker.mturk.com/projects/32SRECFMGC8OI0AKX9OR28K9RG6UT2/tasks/
// @downloadURL https://update.greasyfork.org/scripts/396296/Hide%20Alex.user.js
// @updateURL https://update.greasyfork.org/scripts/396296/Hide%20Alex.meta.js
// ==/UserScript==

document.getElementsByClassName('card')[0].style.display='none';