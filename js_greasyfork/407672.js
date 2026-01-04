// ==UserScript==
// @name Messagerie fix
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description A new userstyle
// @author MockingJay
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/407672/Messagerie%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/407672/Messagerie%20fix.meta.js
// ==/UserScript==

(function() {
let css = `
    div[id^="db_message_"] {
        width: 40% !important;
        max-width: 40% !important;
        min-width: 40% !important;
    }

    .dataBox .message .contenu .avatar {
        width: 70px;
        height: 70px;
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
