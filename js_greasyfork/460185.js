// ==UserScript==
// @name Coursera layout optimization
// @namespace userstyles.world/user/happiness
// @version 20230218.06.30
// @description Move the transcript under the video to the right of the video.
// @author happiness
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.coursera.org/*
// @downloadURL https://update.greasyfork.org/scripts/460185/Coursera%20layout%20optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/460185/Coursera%20layout%20optimization.meta.js
// ==/UserScript==

(function() {
let css = `
/* Catalogue */
@media (min-width: 1023.95px) {
    .ItemPageLayout_content_navigation {
        position: fixed;
        top: 78px;
        left: 4px;
        max-height: 0;
        max-width: 0;
        border: 8px solid #1f55d0;
        border-radius: 8px;
        z-index: 999;
    }
    .ItemPageLayout_content_navigation:hover {
        max-height: unset;
        max-width: unset;
        background: white;
        border: 2px solid #1f55d0;
    }
}

/* content: video title + notes + video + transcript */
.ItemPageLayout_content_body {
    padding-bottom: 0;
}
#main {
    padding-bottom: 0;
}
.css-1fkgl1r .ItemPageLayout_scoped_max_width {
    max-width: unset;
}

/* navigation */
.ItemPageLayout_header.ItemPageLayout_scoped_max_width {
    padding: unset;
}

/* video title and notes */
.ItemLecture_Video_Title,
.ItemLecture_Video_Notes_Navigation {
    flex-basis: 100%;
    margin-top: 0;
}

/* video */
#main > div:first-child > div > div:nth-child(3) {
    flex-basis: 60%;
}

/* transcript */
#main > div:first-child > div > div:nth-child(4) {
    flex-basis: 39%;
}

/* feedback */
.rc-ItemFeedback,
.rc-ShareButtonWithModal {
    margin-top: 0 !important;
}

/* transcript */
/*
global header: 66px
navigation: 40px (被上方css去掉padding)
video title: 48px/51.188px (viewpoint宽度<=1439.95px时因.css-1pvuh2q字体大小导致高度为48px);
notes bar: 48px
feedback: 36px
item navigation: 48px (viewpoint宽度<=1024px出现，并被上方的CSS去掉8px bottom padding)
*/
div[data-testid="ItemLecture_Video_Transcript"] {
    margin-left: auto;
    overflow-y: scroll;
    padding: unset;
    --offset: calc(66px + 40px + 51.188px + 48px + 36px);
    max-height: calc(100vh - var(--offset));
}
@media (max-width: 1439.95px) {
    .css-cvrgnq .ItemPageLayout_navToggle {
        padding-bottom: 0;
    }
    div[data-testid="ItemLecture_Video_Transcript"] {
        --offset: calc(66px + 40px + 48px + 48px + 36px);
        max-height: calc(100vh - var(--offset));
    }
}
@media (max-width: 1024px) {
    .css-cvrgnq .ItemPageLayout_navToggle {
        padding-bottom: 0;
    }
    div[data-testid="ItemLecture_Video_Transcript"] {
        --offset: calc(66px + 40px + 48px + 48px + 36px + 48px);
        max-height: calc(100vh - var(--offset));
    }
}

/* within transcript */
.css-xl5mb3 .timestamp {
    margin-left: unset;
    padding: unset;
}
.rc-Phrase > span {
    font-size: 0.9rem;
}
.rc-Paragraph {
    padding: 0 0 0;
}

/* Hide pause button logo at the begining of the video */
.rc-PlayButton button {
    opacity: 0;
}

/* "Save note" button after clicking on the transcript */
.rc-TranscriptHighlightButton {
    left: 200px;
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
