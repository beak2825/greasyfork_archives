// ==UserScript==
// @name Legacy Script Meta Block
// @namespace -
// @version 1.0.1
// @description returns old script meta block for Greasy Fork. (as close as possible to old one)
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.greasyfork.org/*
// @match *://*.sleazyfork.org/*
// @downloadURL https://update.greasyfork.org/scripts/464089/Legacy%20Script%20Meta%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/464089/Legacy%20Script%20Meta%20Block.meta.js
// ==/UserScript==

(function() {
let css = `
    /* disable default properties */

    .inline-script-stats {
        display: unset;
        margin: 0;
    }

    .script-meta-block {
        max-width: none;
    }

    /* return old properties */

    .inline-script-stats dt,
    .inline-script-stats dd {
        float: left;
        width: 50%;
    }

    /* make 600px max width for script meta block if this is script page */

    #script-content .script-meta-block {
        max-width: 600px;
    }

    /* to prevent style breaking, 18px is minimal height if element doesn't have any content (e.g. author link may not appear) */

    .inline-script-stats dd span:empty {
        display: block;
        height: 20px;
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
