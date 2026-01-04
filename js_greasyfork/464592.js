// ==UserScript==
// @name Remove Twitter Blue and Verified Organizations buttons
// @author Biast12 (Tobias)#0001
// @description Remove the Twitter Blue and Verified Organizations buttons from everywhere
// @version 1.0.2
// @namespace https://twitter.com/Biast12
// @supportURL https://github.com/biast12/Remove-Twitter-Blue-and-Verified-Organizations-buttons
// @contributionURL https://www.paypal.com/donate/?hosted_button_id=RWB2QFK7CKUM2
// @license CC-BY-SA 4.0
// @grant GM_addStyle
// @run-at document-start
// @include https://twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/464592/Remove%20Twitter%20Blue%20and%20Verified%20Organizations%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/464592/Remove%20Twitter%20Blue%20and%20Verified%20Organizations%20buttons.meta.js
// ==/UserScript==

(function() {
let css = `
a[href="/i/verified-choose"] {
  display: none !important;
}
a[href="/i/verified-orgs-signup"] {
  display: none !important;
}
[aria-label="Get Verified"] {
  display: none !important;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();