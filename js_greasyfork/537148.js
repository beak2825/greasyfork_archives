// ==UserScript==
// @name MusicBrainz: Condensed user tags view (MBS-11763)
// @namespace https://musicbrainz.org/user/chaban
// @version 1.1
// @description Arranges tag lists into multiple columns for better space utilization on MusicBrainz user tag pages.
// @author chaban
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:https?://(?:beta\.|test\.)?musicbrainz\.org/user/[^/]+/tags.*)$/
// @downloadURL https://update.greasyfork.org/scripts/537148/MusicBrainz%3A%20Condensed%20user%20tags%20view%20%28MBS-11763%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537148/MusicBrainz%3A%20Condensed%20user%20tags%20view%20%28MBS-11763%29.meta.js
// ==/UserScript==

(function() {
let css = `
    @media (min-width: 600px) {
        #genres ul.genre-list,
        #tags ul.tag-list {
            column-width: 350px;
            column-gap: 20px;
            list-style: none;
            padding: 0;
            margin: 0;
        }

        #genres ul.genre-list li,
        #tags ul.tag-list li {
            break-inside: avoid-column;
            padding-bottom: 5px;
        }
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
