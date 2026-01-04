// ==UserScript==
// @name        FANDOM Trimmer
// @description Remove pointless widgets from FANDOM Wikia sites.
// @version     1.0.1
// @grant       none
// @namespace   Sm3's Fandom Trimmer
// @include     https://*.fandom.com/*
// @downloadURL https://update.greasyfork.org/scripts/432967/FANDOM%20Trimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/432967/FANDOM%20Trimmer.meta.js
// ==/UserScript==

function removeId(name) {
	var elem = document.getElementById(name);
      if (elem !== null) {
        elem.remove();
  }
}

removeId("mixed-content-footer");