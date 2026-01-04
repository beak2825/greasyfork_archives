// ==UserScript==
// @name BBC News Dark Mode
// @namespace git.arun.cloud/arun/userstyles
// @version 1.0.3
// @description A dark mode for BBC News.
// @author Arun Sunner
// @grant GM_addStyle
// @run-at document-start
// @match https://www.bbc.co.uk/news*
// @downloadURL https://update.greasyfork.org/scripts/427021/BBC%20News%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/427021/BBC%20News%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
body,
    #page,
    [class*="MenuContainer-SecondaryNavBarContainer"],
    [class*="MenuContainer-SecondaryNavBarContainer"] [class*="MenuListContainer"] {
        background-color: #121212 !important;
    }
    
    .nw-c-watch-listen__body,
    [class*="-PromoContent"],
    aside[data-component="mostRead"] [class*="PromoItem"] [class*="Container"],
    .nw-p-oat .nw-c-maxim-wrap {
        background-color: #2a2a2a !important;
    }
    
    .gs-c-promo-heading,
    .gs-c-promo-heading h3:not(.gs-c-live-pulse),
    .nw-o-link,
    .nw-o-link span,
    .nw-c-nav__wide-secondary__title a span,
    .story-body__h1,
    .vxp-recommended__headline,
    .vxp-carousel__headline,
    [class*="StyledHeading"],
    aside a[class*="Headline"] {
        color: #ffffff !important;
    }
    
    .gs-c-promo-heading:visited h3,
    .story-body__inner *,
    [class*="RichTextContainer"] {
        color: #eeeeee !important;
    }
    
    .gs-c-promo-summary,
    .gs-c-timestamp {
        color: #e8e8e8;
    }
    
    .nw-c-promo-meta a,
    [class*="nw-o-bullet_"] *,
    .nw-c-local__add-location,
    .gs-c-comment-count *,
    #main-content [class*="Link"],
    [class*="LinkTextContainer"],
    [class*="Contributor"] strong {
        color: #d9d9d9 !important;
    }
    
    [class*="nw-c-slice-heading__"],
    .vxp-recommended__title span, 
    .vxp-mostpop__title span {
        background-color: #121212 !important;
        color: white;
    }
    
    [class*="social-secondary-component"] .ws-o-social-secondary-icon {
        filter: invert(100);
    }

    div[aria-labelledby="latest-updates"], 
    div[aria-labelledby="latest-updates"] .lx-stream-post__header-text {
      color: #ffffff !important;
    }

    .nw-p-oat .gs-c-media-indicator {
      background: transparent !important;
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
