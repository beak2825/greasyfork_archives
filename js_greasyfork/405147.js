// ==UserScript==
// @name         RARBG size sorting override
// @description  default RARBG sorting by size to descending order
// @match        *://rarbg.to/torrents.php?search=*
// @version 0.0.1.20200702093924
// @namespace https://greasyfork.org/users/40027
// @downloadURL https://update.greasyfork.org/scripts/405147/RARBG%20size%20sorting%20override.user.js
// @updateURL https://update.greasyfork.org/scripts/405147/RARBG%20size%20sorting%20override.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const links = document.getElementsByTagName("a");
    for(var i = 0; i < links.length; i++) {
      if( links[i].href.includes("order=size") ) {
          links[i].setAttribute("href", links[i].href.replace("ASC", "DESC"));
          break;
      }
    }
})();