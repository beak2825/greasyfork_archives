// ==UserScript==
// @name GitHub Repo View Tweaks
// @namespace https://udf.github.io
// @version 1.0.5
// @description Makes the GitHub repo redesign look less bad by reducing padding. Also adds back separators to the file list.
// @author udf (https://github.com/udf)
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/405993/GitHub%20Repo%20View%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/405993/GitHub%20Repo%20View%20Tweaks.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


@document domain("github.com") {
    /* Header bottom padding */
    .pagehead {
        margin-bottom: 16px !important;
    }

    /* Navigation tabs */
    .UnderlineNav-item {
        padding: 4px 16px;
    }

    .Box-header {
        padding: 8px 16px;
    }

    /* File view header */
    .Box-header.py-2 {
        padding: 6px 16px !important;
    }

    .Box-body {
        padding: 8px 16px;
    }
    
    /* Make links to files in list blue */
    .Box-row .link-gray-dark {
        color: #0366d6 !important;
    }

    /* Add back file list separators */
    .Box-row + .Box-row {
        border-top: 1px solid #eaecef !important;
    }

    /* Fix list icon right padding */
    .Box-row > div:first-child {
        margin-right: 6px !important;
    }`;
if ((location.hostname === "github.com" || location.hostname.endsWith(".github.com"))) {
  css += `
      /* Header bottom padding */
      .pagehead {
          margin-bottom: 16px !important;
      }

      /* Navigation tabs */
      .UnderlineNav-item {
          padding: 4px 16px;
      }

      .Box-header {
          padding: 8px 16px;
      }

      /* File view header */
      .Box-header.py-2 {
          padding: 6px 16px !important;
      }

      .Box-body {
          padding: 8px 16px;
      }
      
      /* Make links to files in list blue */
      .Box-row .link-gray-dark {
          color: #0366d6 !important;
      }

      /* Add back file list separators */
      .Box-row + .Box-row {
          border-top: 1px solid #eaecef !important;
      }

      /* Fix list icon right padding */
      .Box-row > div:first-child {
          margin-right: 6px !important;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
