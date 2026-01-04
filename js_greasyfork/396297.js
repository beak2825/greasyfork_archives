// ==UserScript==
// @name        Hide Alex
// @author      Hunter
// @description Hides 0.06 Alex Instructions
// @include     *
// @namespace http://bomb.com
// @version 1
// @match https://worker.mturk.com/projects/32SRECFMGC8OI0AKX9OR28K9RG6UT2/tasks/
// @downloadURL https://update.greasyfork.org/scripts/396297/Hide%20Alex.user.js
// @updateURL https://update.greasyfork.org/scripts/396297/Hide%20Alex.meta.js
// ==/UserScript==

document.getElementsByClassName('card')[0].style.display='none';

document.getElementsByClassName('card')[1].style.display='none';

document.getElementsByClassName('card')[2].style.display='none';