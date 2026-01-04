// ==UserScript==
// @name Plain text youtube subscription list
// @namespace https://greasyfork.org/users/40252
// @version 0.0.1.20200720184433
// @description Greatly compacts list view layout, hides thumbnails and noise. Only works in subscriptions -> list view!
// @license public domain
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/feed/subscriptions?flow=2
// @downloadURL https://update.greasyfork.org/scripts/407461/Plain%20text%20youtube%20subscription%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/407461/Plain%20text%20youtube%20subscription%20list.meta.js
// ==/UserScript==

(function() {
let css = `
/* Hide uploader picture */
.grid-subheader.ytd-shelf-renderer {
    display: none;
}

/* Hide video thumbnail */
ytd-thumbnail {
    display: none;
}

/* Hide description - it's usually noise */
#description-text {
    display: none !important;
}

/* Hide view count */
#metadata > :nth-child(2) span:nth-child(1) {
    display: none !important;
}

/* Hide verification emblem */
.badge-style-type-verified {
    display: none !important;
}

/* Compact list */
#contents.ytd-shelf-renderer {
    margin-top: .5rem;
}
ytd-expanded-shelf-contents-renderer {
    margin-bottom: .5rem;
}

.ytd-video-renderer {
    max-width: none !important;
}

ytd-item-section-renderer.ytd-section-list-renderer {
    padding-left: 1rem;
}

ytd-item-section-renderer.ytd-section-list-renderer:nth-child(even) {
    background: #333 !important;
}

ytd-item-section-renderer.ytd-section-list-renderer:hover {
    background: #555 !important;
}

/* All video titles lowercase - anti clickbait */
#video-title.ytd-video-renderer {
    text-transform: lowercase;
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
