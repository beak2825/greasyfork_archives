// ==UserScript==
// @name KBin Extra Compact Dark Blue Theme
// @namespace https://greasyfork.org/en/users/160017-timebomb
// @version 0.1.5
// @description KBin dark blue theme that also makes Compact mode even more compact
// @author TimeBomb
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*.kbin.social/*
// @downloadURL https://update.greasyfork.org/scripts/468706/KBin%20Extra%20Compact%20Dark%20Blue%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/468706/KBin%20Extra%20Compact%20Dark%20Blue%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
/* BEGIN COMPACTER COMPACT MODE */
.view-compact .entry header {
    margin-bottom: 0;
}


@media (min-width: 690px) {
    .view-compact .entry .vote {
        margin-right: 0.7rem !important;
    }
}

.view-compact .entry footer menu {
    column-gap: 0.85rem;
}

.view-compact .section menu > li {
    padding: 0;
}

.view-compact .entry {
    padding: 0.5rem;
}
/* END COMPACTER COMPACT MODE */
/* BEGIN DARK BLUE THEME */
#header,#middle,#footer,#topbar,#popover,#scroll-top {
    --kbin-link-color: #ddddee;
    --kbin-link-hover-color: #bbccff;
    --kbin-options-link-hover-color: #ededfc;
    --kbin-options-link-color: #ddddee;
    --kbin-section-link-color: #0088cc;
    --kbin-section-title-link-color: #eef;
    --kbin-entry-link-visited-color: #aab;
    --kbin-meta-link-color: #ccd;
    --kbin-meta-link-hover-color: #dde;
    --kbin-meta-text-color: #d0d0e0;
    --kbin-text-color: #d0d0e0;
    --kbin-section-text-color: #d0d0e0;
    --kbin-bg: #1f1d2c;
    --kbin-header-bg: #1f1d2c;
    --kbin-primary-color: #1f1d2c;
    --kbin-input-bg: #1f1d2c;
    --kbin-button-primary-bg: #1f1d2c;
    --kbin-button-secondary-bg: #1f1d2c;
    --kbin-footer-bg: #1f1d2c;
    --kbin-input-bg: #1f1d2c;
    --kbin-meta-bg:  #1f1d2c;
    --kbin-section-bg: #262837;
    --custom-blue-theme-dark-bg: #262837;
    --kbin-options-bg: #262837;
    --kbin-header-link-active-bg: #262837;
    --kbin-sidebar-header-text-color: #d0d0d0;
    --custom-blue-theme-darker-bg: #1e2130;
    --custom-blue-theme-darkest-bg: #1a1827;
    --kbin-alert-info-bg: #E6E6D5;
    --kbin-alert-info-border: #eee;
    --kbin-alert-info-text-color: #333;
    --kbin-vote-text-hover-color: #fff;
    --custom-blue-theme-icon-color: #fff;
    --kbin-input-text-color: #d0d0e0;
    --kbin-button-secondary-text-color: #d0d0e0;
}

.ts-control input {
    color: var(--kbin-input-text-color);
}

#scroll-top i {
    color: var(--custom-blue-theme-icon-color);
}

#middle {
    background: var(--kbin-bg) !important;
}

#footer .lang-switch select {
    border-style: solid;
}

table tbody tr:nth-of-type(2n) {
    background-color: var(--custom-blue-theme-dark-bg);
}

.section {
    border: 0;
}


/* TODO figure out how to convert dotted lines in comments to solid */
#comments .section,
#comments .subject,
.btn__secondary,
#entry_comment_lang,
.params .ts-wrapper.single .ts-control,
#post_lang,
.params .ts-wrapper .ts-dropdown.single {
    border-style: solid !important;
}

.comment-level--2,
.comment-level--4,
.comment-level--6,
.comment-level--8,
.comment-level--10 {
    background: var(--custom-blue-theme-darker-bg);
}

.vote button {
    background: #1a1827;
    height: 1.7rem !important;
    width: 4rem !important;
}

.vote button:active,
.btn__secondary:active,
#entry_comment_submit:active,
#post_submit:active, .btn__primary:active {
    position: relative;
    top: 1px;
}

.btn__secondary,
#entry_comment_submit,
#footer .lang-switch select,
#post_submit, .btn__primary {
    cursor: pointer;
}

.btn__secondary:hover,
#entry_comment_submit:hover,
#footer .lang-switch select,
#post_submit:hover,
.theme--dark .ts-dropdown .active,
.dropdown__menu a:hover,
.dropdown__menu button:hover, .btn__primary {
    background: var(--custom-blue-theme-darkest-bg) !important;
}

form .btn__primary[type="submit"] {
    min-width: 38px;
    min-height: 38px;
    padding: 0 10px;
    margin-left: 4px;
}
/* END DARK BLUE THEME */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
