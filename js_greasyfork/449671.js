// ==UserScript==
// @name         text aligner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  justify every page in web !
// @author       You
// @match        *://*/*
// @exclude      https://*hyperskill.org*
// @icon         https://www.google.com/s2/favicons?domain=oum.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449671/text%20aligner.user.js
// @updateURL https://update.greasyfork.org/scripts/449671/text%20aligner.meta.js
// ==/UserScript==

(function alignNow() {
    let bodyTag = document.getElementsByTagName("body");
    bodyTag[0].setAttribute("style","text-align:justify")
})();