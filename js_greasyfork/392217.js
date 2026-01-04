// ==UserScript==
// @name Popurls Classic Black Style 2019 css
// @namespace https://greasyfork.org/en/users/10118-drhouse
// @version 1.0
// @description for use with Popurls Classic Black Style 2019 - link colors stylesheet
// @author drhouse
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/392217/Popurls%20Classic%20Black%20Style%202019%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/392217/Popurls%20Classic%20Black%20Style%202019%20css.meta.js
// ==/UserScript==

(function() {
let css = `a {
    &:link {
        color: #84bbd0 !important;
    }
    &:visited {
        color: #545454 !important;
    }
    &:hover {
        color: #ffffff !important;
    }
    &:active {
        color: #545454 !important;
    }
}

a.staticlinkblack,
a.staticlinkblack:link,
a.staticlinkblack:visited {
    color: orange !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
