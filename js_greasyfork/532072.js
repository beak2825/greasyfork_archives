// ==UserScript==
// @name www.dreadcast.net/Forum/
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description pas signature
// @author Laïn
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/532072/wwwdreadcastnetForum.user.js
// @updateURL https://update.greasyfork.org/scripts/532072/wwwdreadcastnetForum.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document domain("dreadcast.net") {

  /* Bloque les éléments de signature */
  .signature {
    display: none !important;
  }

}


@-moz-document url-prefix("https://www.dreadcast.net/Forum/") {
    /* Insert code here... */
}`;
if ((location.hostname === "dreadcast.net" || location.hostname.endsWith(".dreadcast.net"))) {
  css += `

    /* Bloque les éléments de signature */
    .signature {
      display: none !important;
    }

  `;
}
if (location.href.startsWith("https://www.dreadcast.net/Forum/")) {
  css += `
      /* Insert code here... */
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
