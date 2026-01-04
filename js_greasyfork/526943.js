// ==UserScript==
// @name Meduza.io – Dark [Ath]
// @namespace athari
// @version 1.0.1
// @description Dark theme for Meduza.io (Медуза.io). Supports all types of articles.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.meduza.io/*
// @downloadURL https://update.greasyfork.org/scripts/526943/Meduzaio%20%E2%80%93%20Dark%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/526943/Meduzaio%20%E2%80%93%20Dark%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    color-scheme: dark;
  }

  /* Promo */
  .Layout-module-banner {
    display: none;
  }

  /* Main: News */
  .Grid-module-container {
    background: #111;
  }
  .SimpleBlock-module-root,
  .EpisodeBlock-module-root,
  .TopicBlock-module-root,
  .RichBlock-module-root {
    background: #222;
    color: #eee;
    box-shadow: inset 0 0 0 1px #000;
  }
  .TopicBlockItem-module-footer,
  .RichBlock-module-meta {
    color: #999;
  }
  .RichBlock-module-withTheme {
    background: #222 !important;
    --bgColor: #222 !important;
    --textColor: #eee !important;
    --metaColor: #999 !important;
  }

  .Modal-module-isAuth .Modal-module-container {
    background: #333;
  }
  .Header-module-itemAuth,
  .Header-module-itemSearch {
    filter: drop-shadow(0 0 1px #fff);
  }

  /* Main: Chronology */
  .Chronology-module-footer,
  .Chronology-module-container {
    background: #111;
  }
  .ChronologyItem-module-root {
    background: #222;
    color: #eee;
    box-shadow: inset 0 0 0 1px #000;
  }
  .Chronology-module-timestamp {
    color: #eee;
  }
  .ChronologyItem-module-footer {
    color: #999;
  }
  .ChronologyItem-module-figure {
    margin: 1px; /* border fix */
  }

  /* Main: Loading skeleton */
  .Skeleton-module-root.Skeleton-module-root:before {
    background: #111;
  }
  .Skeleton-module-layout.Skeleton-module-layout,
  .Skeleton-module-section.Skeleton-module-section:after {
    background: #111;
    border-color: #000;
  }
  .Skeleton-module-wrapper {
    background: #777;
  }
  .Skeleton-module-wrapper:before {
    background: #555;
  }
  .Skeleton-module-card:not(#\\0) {
    box-shadow: inset 0 0 0 1px #000;
    border: none;
    &:before {
      background-color: #333;
    }
  }
  .Skeleton-module-animation {
    border-color: #222;
    span:nth-child(2n+1)::before,
    span:nth-child(2n) {
      background: #222;
    }
    span:nth-child(2n+1)::after {
      box-shadow: 0 0 0 10px #222;
    }
  }

  /* Material */
  .GeneralMaterial-module-root {
    background: #111;
  }
  [class^='Meta-module_root__'] {
    color: #999;
  }
  [class^='RelatedBlock-module_root__'] {
    background: #222;
    color: #eee;
    a {
      color: #eee;
    }
  }
  .TopBar-module-stuck .TopBar-module-container {
    background: #111;
    box-shadow: 0 1px #000;
  }

  /* Material: Card */
  .CardMaterial-module-root,
  .CardMaterial-module-head {
    background: #111;
  }
  .CardMaterial-module-header {
    color: #eee;
  }
  .CardMaterial-module-card {
    background: #181818;
    box-shadow: inset 0 0 0 1px #080808;
  }
  [class^='CardTitle-module_title__'] {
    color: #eee;
  }
  .ChaptersModalWindow-module-modalContent {
    background: #111;
  }
  .ChaptersModalWindow-module-itemChapterFirst,
  .ChaptersModalWindow-module-itemChapterSecond {
    color: #eee;
  }

  /* Material: Slide */
  .SlidesMaterial-module-root,
  .SlidesMaterial-module-bg {
    background: #181818 !important;
  }
  .Slide-module-slide {
    background: #222;
    color: #eee;
  }

  /* Material: Audio */
  .AudioPanel-module-root {
    background: #222;
  }
  [class^='Dropdown-module_root__Wv7S-'] ul {
    background: #222;
    a {
      color: #eee;
    }
  }

  /* Material: Content */
  [class^='SimpleBlock-module_blockquote__'] {
    background: #330;
  }
  [class^='Image-module_root__'] {
    background: #0000;
  }
  span[data-body] { /* footnote text */
    background: #333;
    &:hover {
      background: #555;
    }
  }
  [class^='Footnote-module_root__'] {
    background: #222;
  }
  mark {
    background: #440;
    color: #eee;
  }

  /* Inverted images */
  button,
  .SupportPanel-module-root,
  .SupportBlock-module-richPromoImage {
    filter: hue-rotate(180deg) invert() hue-rotate(180deg);
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
