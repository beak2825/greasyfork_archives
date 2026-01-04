// ==UserScript==
// @name Apple Music Lyrics Panel Left-Aligned
// @namespace page.loupe.amlplas
// @version 1.1.0
// @description Custom style to left-align lyrics in Apple Music for improved readability.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.music.apple.com/*
// @downloadURL https://update.greasyfork.org/scripts/476261/Apple%20Music%20Lyrics%20Panel%20Left-Aligned.user.js
// @updateURL https://update.greasyfork.org/scripts/476261/Apple%20Music%20Lyrics%20Panel%20Left-Aligned.meta.js
// ==/UserScript==

(function() {
let css = `
    @media only screen and (min-width: 1000px) {
        /* 歌詞パネルを左に移動 */
        .side-panel {
            left: 0px !important;
            top: 0px !important;
            height: 100% !important;
            border-left: initial !important;
            border-right: .5px solid var(--systemQuaternary) !important;
            animation: none !important;
        }
        .app-container:not(.is-drawer-open) .side-panel {
            display: none !important;
        }
        .side-panel amp-lyrics {
            height: 100vh !important;
        }
        /* 歌詞パネルがあった場所の余白を削除 */
        .app-container.is-drawer-open .scrollable-page {
            margin-right: 0px !important;
            width: 100% !important;
        }
        /* メインパネルを右に押し出す */
        .app-container.is-drawer-open {
            margin-left: 300px !important;
        }
        .app-container.is-drawer-open .player-bar {
            width: calc(100vw - var(--web-navigation-width) - 300px) !important;
        }
        .lyrics__container:not(.is-lyrics-off) {
            grid-template-areas: "lyrics controls" !important;
            grid-template-columns: 40vw 32vw !important;
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
