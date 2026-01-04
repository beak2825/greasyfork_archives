// ==UserScript==
// @name MB: make some headers sticky on edit release relationships
// @namespace rinsuki.net
// @version 1.0.0
// @description maybe useful for messing with multi-disc release
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://(?:[^/]+\.)?musicbrainz.org/release/(?:[0-9a-f-]+)/edit-relationships)$/
// @downloadURL https://update.greasyfork.org/scripts/525734/MB%3A%20make%20some%20headers%20sticky%20on%20edit%20release%20relationships.user.js
// @updateURL https://update.greasyfork.org/scripts/525734/MB%3A%20make%20some%20headers%20sticky%20on%20edit%20release%20relationships.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ここにコードを挿入... */
    #batch-tools {
        position: sticky;
        top: 0;
        background: white;
        border-bottom: 1px solid #888;
    }
    #tracklist > thead {
        position: sticky;
        top: calc(1.9em + 1px);
    }
    #tracklist > tbody:has(tr.subh)::before {
        /* fake border */
        position: absolute;
        background: #888;
        height: 1px;
        width: 100%;
        top: 0px;
        content: " ";
    }
    #tracklist > tbody:has(tr.subh)::after {
        /* fake border */
        position: absolute;
        background: #888;
        height: 1px;
        width: 100%;
        bottom: 0px;
        content: " ";
    }
    #tracklist > tbody:has(tr.subh) {
        position: sticky;
        top: calc(1.9em + 1px + 14px + 6px + 0.4em);
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
