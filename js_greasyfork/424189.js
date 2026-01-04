// ==UserScript==
// @name         MangaSee Customizations
// @namespace    https://greasyfork.org/en/users/748980
// @version      0.3
// @description  Dark mode, recolor background, etc
// @author       hotsno
// @match        https://mangasee123.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424189/MangaSee%20Customizations.user.js
// @updateURL https://update.greasyfork.org/scripts/424189/MangaSee%20Customizations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var navbar = document.getElementsByClassName("navbar-nav")[0];
    var subs = document.createElement("LI");
    subs.classList.add("nav-item");
    subs.innerHTML = '<a href="/user/subscription.php" class="nav-link"> <i class="fas fa-rss"></i> Subscriptions </a>'
    console.log(subs);
    navbar.appendChild(subs);

    // To change width, change the max-width value
    let css = `

/* Custom scrollbar */

/* Width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
background: #000000;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #1a1a1a;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #212121;
}

/* Recolor background */
body, html {
    background-color: #000000 !important;
}


/* Bottom of page thingy*/
.DesktopNav {
  background: #000;
}

body, html {
    background-color: rgb(32, 35, 36) !important;
}

[class="MainContainer"] {
    background-color: #000 !important;
}
`
    // I don't know what this does but this needs to be here lol
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(css);
    }
    else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();