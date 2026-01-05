// ==UserScript==
// @name        Absolute Dates on FP
// @author      lavacano - Reagy
// @namespace   https://greasyfork.org/users/8353
// @description because hover is stupid and I'm a lazy fuck who wants to see both
// @include     http://facepunch.com/showthread.php?*
// @include     https://facepunch.com/showthread.php?*
// @include     http://www.facepunch.com/showthread.php?*
// @include     https://www.facepunch.com/showthread.php?*
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10067/Absolute%20Dates%20on%20FP.user.js
// @updateURL https://update.greasyfork.org/scripts/10067/Absolute%20Dates%20on%20FP.meta.js
// ==/UserScript==


var elems = document.getElementsByTagName('span'), i;
for (i in elems) {
    if (elems[i].className == "date") {
        var relTime = elems[i].innerHTML;
        elems[i].innerHTML = elems[i].title + " - " + relTime;
    }
}