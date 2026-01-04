// ==UserScript==
// @name I don't wanna welcome new deviants.
// @namespace https://greasyfork.org/users/573136
// @version 1.0.0
// @description Maybe you just aren't a social butterfly.
// @author Valognir (https://www.deviantart.com/Valognir)
// @grant GM_addStyle
// @run-at document-start
// @match https://www.deviantart.com/*
// @downloadURL https://update.greasyfork.org/scripts/446580/I%20don%27t%20wanna%20welcome%20new%20deviants.user.js
// @updateURL https://update.greasyfork.org/scripts/446580/I%20don%27t%20wanna%20welcome%20new%20deviants.meta.js
// ==/UserScript==

(function() {
let css = `
    [data-nc="bucket.adom-class.other-nc.radom_recommendation"] {
        display: none;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
