// ==UserScript==
// @name         Glowfic Max-Width
// @version      1
// @description  Constrain the width of Glowfic posts to a constant value

// @author       Nexidava
// @namespace    https://greasyfork.org/en/users/725254

// @match        *://glowfic.com/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/446327/Glowfic%20Max-Width.user.js
// @updateURL https://update.greasyfork.org/scripts/446327/Glowfic%20Max-Width.meta.js
// ==/UserScript==

(function() {
    var content = document.getElementById("content");
    content.style.maxWidth = "1000px";
    content.style.margin = "0 auto";
})();