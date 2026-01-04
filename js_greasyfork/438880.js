// ==UserScript==
// @name         Revert Dashboard Post Footer
// @namespace    https://greasyfork.org/users/65414
// @description  Makes dashboard post footers more like they used to be.
// @version      0.91
// @match        https://www.tumblr.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/438880/Revert%20Dashboard%20Post%20Footer.user.js
// @updateURL https://update.greasyfork.org/scripts/438880/Revert%20Dashboard%20Post%20Footer.meta.js
// ==/UserScript==

(function() {

  GM_addStyle (`
    #tumblr [aria-label="Post Footer"] > .m5KTc {
      justify-content: end;
    }
    #tumblr [aria-label="Post Footer"],
    #tumblr [aria-label="Post Footer"] > .m5KTc > .MCavR > .sfGru {
      margin: 0;
    }
    #tumblr [aria-label="Post Footer"] > .m5KTc > .gstmW {
      flex-grow: 1;
    }
    #tumblr [aria-label="Post Footer"] > .m5KTc > .MCavR {
      gap: 16px;
    }
    #tumblr [aria-label="Post Footer"] > .m5KTc > .MCavR .ybmTG {
      display: none;
    }
    #tumblr [aria-label="Post Footer"] > .m5KTc > .MCavR.r3vIz button {
      margin-right: 10px;
    }
    #tumblr [aria-label="Post Footer"] > .m5KTc > .MCavR.r3vIz button > span > :not(svg) {
      display: none;
    }
  `);

})();