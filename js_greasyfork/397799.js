// ==UserScript==
// @name AniList - Anti-Social
// @namespace github.com/krisu5/userstyles
// @version 1.0.6
// @description Mostly simple tweaks for removing most of the social features (like the feed on front page)
// @author krisu (https://github.com/krisu5)
// @homepageURL https://github.com/krisu5/userstyles/tree/master/AniList%20-%20Anti-Social
// @supportURL https://github.com/krisu5/userstyles/issues
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.anilist.co/*
// @downloadURL https://update.greasyfork.org/scripts/397799/AniList%20-%20Anti-Social.user.js
// @updateURL https://update.greasyfork.org/scripts/397799/AniList%20-%20Anti-Social.meta.js
// ==/UserScript==

(function() {
let css = `
/* ==================================
   ======== Blocked elements ========
   ================================== */

.activity-edit, .nav a[href$="social"], .home .activity-feed-wrap, .activity-entry:not(.activity-text) .actions,
.activity-feed [href^="/activity/"], .user .actions .nav-btn, .home .list-preview-wrap:nth-child(n+2) .size-toggle
{ display: none !important; }


/* ==================================
   ============ HOMEPAGE ============
   ================================== */

.home { grid-template-columns: inherit !important; }
    
@media (min-width: 1041px) {
    .home .list-preview-wrap:first-child .size-toggle { opacity: 1 !important; }
    
    .home.full-width .list-preview-wrap:first-child .section-header svg { margin-right: -53px; }
    .home .list-preview-wrap:first-child .section-header svg            { margin-right: -36px; }

    .home.full-width .list-preview-wrap:first-child .section-header:after { content: "Compress" !important; }

    .home .list-preview-wrap:first-child .section-header:after {
        content: "Expand";
        font-family: Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
        font-size: 13px;
        color: rgba(var(--color-text),.4);
        position: relative;
        right: 30px;
        top: -1px;
    }
}

.home .review-card .summary { width: 96% !important; }

.home div .sense { min-height: 0 !important; }

.home .review-card.no-banner:before {
    content: "";
    height: 80px;
    color: rgba(0,0,0,0);
    background: linear-gradient(rgb(var(--color-foreground)), rgba(var(--color-text),.1));
}

.site-theme-contrast .home .review-card.no-banner:before, .site-theme-dark .home .review-card.no-banner:before
{ background: linear-gradient(rgb(var(--color-foreground)), rgb(var(--color-foreground-blue))); }

.review-card.no-banner .content { justify-content: start !important; }

.home .review-card.no-banner:hover:before {
    content: "Read Full Review";
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(var(--color-overlay),.8) !important;
    color: rgb(var(--color-text-bright));
    height: 80px;
    transition: background .6s, color .2s;
    font-size: 1.4rem;
    font-weight: 500;
}

.site-theme-dark .home .review-card.no-banner:hover:before { background: rgba(255,255,255,.1) !important; }

@media (min-width: 1041px) {
    .home > div:not(.activity-feed-wrap) > div:not(.list-previews):not(.recent-threads):not(.recent-reviews) > div > 
    .media-preview {
        grid-gap: 20px 0px !important;
        grid-template-columns: repeat(auto-fill,425px) !important;
    }

    .home > div:not(.activity-feed-wrap) > div:not(.list-previews):not(.recent-threads):not(.recent-reviews) > div >
    .media-preview .small .content {
        width: 325px !important;
        z-index: 1 !important;
        opacity: 1 !important;
    }

    .home > div:not(.activity-feed-wrap) > div:not(.list-previews):not(.recent-threads):not(.recent-reviews) > div >
    .media-preview .media-preview-card
    { margin-left: 2.75% !important; }

    .home > div:not(.activity-feed-wrap) > div:not(.list-previews):not(.recent-threads):not(.recent-reviews) > div >
    .media-preview a.title {
        display: block !important;
        height: 100% !important;
    }
}

@media (max-width: 1540px) {
    .home > div:not(.activity-feed-wrap) > div:not(.list-previews):not(.recent-threads):not(.recent-reviews) > div >
    .media-preview .media-preview-card
    { margin-left: 0 !important; }
}


/* ==================================
   ============ PROFILE =============
   ================================== */

.activity-feed [label="Unsubscribe"], .activity-feed [label="Subscribe"] {
    position: relative !important;
    top: 19px !important;
    right: calc(-100% + 39px) !important;
}

.activity-feed .extras-dropdown {
    position: relative !important;
    top: 20px !important;
    right: calc(-100% + 37px) !important;
}

.activity-feed .activity-extras-dropdown { overflow: hidden !important; }

.activity-feed [label="Unsubscribe"]:hover:before,
.activity-feed [label="Subscribe"]:hover:before {
    top: -31px !important;
    left: inherit !important;
    right: calc(-100% - 8px) !important;
}


/* ===============================
   ============ MISC =============
   =============================== */

/* Review without banner: transition fix */
.review [style='background-image: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");']
{ opacity: 1 !important; }

/* Dropdown menu tweaks: UX fix attempt */
.el-popper .popper__arrow { display: none !important; }
    
.el-dropdown-menu {
    box-shadow: 0 1px 10px 0 rgba(49,54,68,.30) !important;
    border-radius: 10px !important;
    padding: 10px 0 !important;
}
    
.el-popper[x-placement^="bottom"] { margin-top: 8px !important; }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
