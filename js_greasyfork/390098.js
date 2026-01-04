// ==UserScript==
// @name         NoResize
// @namespace    ezse.pl
// @version      1.0.1
// @description  Opis.
// @author       ZSE
// @match        http://zse-kielce.edu.pl/plan/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390098/NoResize.user.js
// @updateURL https://update.greasyfork.org/scripts/390098/NoResize.meta.js
// ==/UserScript==

(function() {
document.getElementsByName("list")[0].setAttribute("noresize", "noresize");
document.getElementsByTagName("frameset")[0].setAttribute("cols", "240,*");
})();