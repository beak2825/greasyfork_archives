// ==UserScript==
// @name         Dark Theme Pepper
// @description  Dark Theme for Pepper
// @match        https://www.pepper.pl/*
// @version      0.2
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/697301
// @downloadURL https://update.greasyfork.org/scripts/414200/Dark%20Theme%20Pepper.user.js
// @updateURL https://update.greasyfork.org/scripts/414200/Dark%20Theme%20Pepper.meta.js
// ==/UserScript==

(function () {
    let css = '';
    const darkBorderColor = '#121212';
    const lightBorderColor = '#121212';
    const darkBackgroundColor = '#171717';
    const veryDarkBackgroundColor = 'black';
    const darkestBackgroundColor = '#050c13';
    const lightBackgroundColor = '#080808';
    const textColor = '#bfbfbf';
    const tempColor = '#c60034';
    const NavbarColor = '#151515';
    const orangeColor = '#ff7917';
    const CloudColor = "#1d1d1d"
    const TextCloudColor = "#848484";
    const navcolor = "black";

    css += `
      .subNav .bg--color-greyPanel {
        display: none;
      }
      .nav {
        background-color: ${navcolor};
      }
      .conversation-content.mute--text2, .linkGrey, .thread-userOptionLink, .cept-nav-subheadline, .user:not(.thread-user), .tabbedInterface-tab, .subNavMenu, .subNavMenu-btn, .tag, .page-label, .page-subTitle, .userProfile-title--sub, .bg--color-inverted .text--color-white, .comments-pagination--header .pagination-next, .comments-pagination--header .pagination-page, .comments-pagination--header .pagination-previous, .conversationList-msgPreview, .thread-title, .mute--text, .text--color-charcoal, .text--color-charcoalTint, .cept-tt, .cept-description-container, .thread-username, .voucher input, .hide--bigCards1, .hide--toBigCards1 {
        color: ${textColor};
      }
      .speechBubble {
        background-color: ${darkBackgroundColor};
        color: ${textColor};
      }
      .thread--type-card, .thread--type-list, .conversationList-msg--read:not(.conversationList-msg--active), .card, .threadCardLayout--card article, .threadCardLayout--card article span .threadCardLayout--card article span, .vote-box, .cept-comments-link, .subNavMenu-btn {
        background-color: ${darkBackgroundColor} !important;
        border-color: ${darkBorderColor};
      }
      .thread--deal, .thread--discussion {
        background-color: ${darkBackgroundColor};
        border-color: ${darkBorderColor};
        border-top: none;
        border-radius: 5px;
      }
      .input, .inputBox, .secretCode-codeBox, .toolbar, .voucher-code {
        background-color: ${darkBackgroundColor};
        border-color: ${lightBorderColor};
      }
      .input-caretLeft {
        border-right-color: ${lightBorderColor};
      }
      .input-caretLeft:before {
        border-right-color: ${darkBackgroundColor};
      }
      .popover--layout-s > .popover-arrow:after, .inputBox:after {
        border-bottom-color: ${darkBackgroundColor};
      }
      .popover--layout-n > .popover-arrow:after {
        border-top-color: ${darkBackgroundColor};
      }
      .popover--layout-w > .popover-arrow:after {
        border-left-color: ${darkBackgroundColor};
      }
      .popover--layout-e > .popover-arrow:after {
        border-right-color: ${darkBackgroundColor};
      }
      .overflow--fade-b-r--l:after, .overflow--fade-b-r--s:after, .overflow--fade-b-r:after, .overflow--fromW3-fade-b-r--l:after, .overflow--fromW3-fade-r--l:after, .thread-title--card:after, .thread-title--list--merchant:after, .thread-title--list:after {
        background: -webkit-linear-gradient(left,hsla(0,0%,100%,0),${darkBackgroundColor} 50%,${darkBackgroundColor});
        background: linear-gradient(90deg,hsla(0,0%,100%,0),${darkBackgroundColor} 50%,${darkBackgroundColor});
      }
      .fadeEdge--r:after, .overflow--fade:after {
        background: -webkit-linear-gradient(left,hsla(0,0%,100%,0),${darkBackgroundColor} 80%);
        background: linear-gradient(90deg,hsla(0,0%,100%,0) 0,${darkBackgroundColor} 80%);
        filter: brightness(100%) !important;
      }
      .text--overlay:before {
        background-image: -webkit-linear-gradient(left,hsla(0,0%,100%,0),${darkBackgroundColor} 90%);
        background-image: linear-gradient(90deg,hsla(0,0%,100%,0),${darkBackgroundColor} 90%);
        filter: brightness(100%) !important;
      }
      .btn--border, .bg--off, .boxSec--fromW3:not(.thread-infos), .boxSec, .voucher-codeCopyButton, .search input, .img, .userHtml-placeholder, .userHtml img, .popover--subNavMenu .popover-content {
        border: 1px solid ${darkBorderColor} !important;  /* need full border definition for .bg--off */
      }
      .tabbedInterface-tab--selected, .bg--main, .tabbedInterface-tab--horizontal, .tabbedInterface-tab--selected, .comments-item--in-moderation, .comments-item-inner--active, .comments-item-inner--edit, .vote-btn, .notification-item:not(.notification-item--read), .search div, .search input, .text--overlay, .popover--brandAccent .popover-content, .popover--brandPrimary .popover-content, .popover--default .popover-content, .popover--menu .popover-content, .popover--red .popover-content {
        background-color: ${darkBackgroundColor} !important;
      }
      .notification-item:hover, .notification-item--read:hover {
        filter: brightness(75%);
      }
      .speechBubble:before, .speechBubble:after, .text--color-white.threadTempBadge--card, .text--color-white.threadTempBadge {
        color: ${darkBackgroundColor};
      }
      .bg--off, .js-pagi-bottom, .js-sticky-pagi--on, .bg--color-grey, .notification-item--read, #main, .subNavMenu--menu .subNavMenu-list {
        background-color: ${lightBackgroundColor} !important;
        color: ${textColor};
border: 0px !important;
      }
      .tabbedInterface-tab--transparent {
        background-color: ${lightBackgroundColor};
      }
      .page-divider, .popover-item, .boxSec-divB, .boxSec--fromW3, .cept-comment-link, .border--color-borderGrey, .border--color-greyTint, .staticPageHtml table, .staticPageHtml td, .staticPageHtml th {
        border-color: ${lightBorderColor};
      }
      .listingProfile, .tabbedInterface-tab--primary:not(.tabbedInterface-tab--selected):hover, .navMenu-trigger, .navMenu-trigger--active, .navMenu-trigger--active:focus, .navMenu-trigger--active:hover, .navDropDown-link:focus, .navDropDown-link:hover {
        background-color: ${veryDarkBackgroundColor} !important;
      }
      .softMessages-item, .popover--modal .popover-content, .bg--color-white, .listingProfile-header, .profileHeader, .bg--em, nav.comments-pagination {
        background-color: ${veryDarkBackgroundColor};
        color: ${textColor} !important;
      }
      .bg--color-greyPanel {
        background-color: ${darkestBackgroundColor};
      }
      .bg--color-greyTint, .thread-divider, .btn--mode-filter {
        background-color: ${textColor};
      }
      img.avatar[src*="placeholder"] {
        filter: brightness(75%);
      }
      .btn--mode-dark-transparent, .btn--mode-dark-transparent:active, .btn--mode-dark-transparent:focus, button:active .btn--mode-dark-transparent, button:focus .btn--mode-dark-transparent {
        background-color: inherit;
      }
      .boxSec-div, .boxSec-div--toW2 {
        border-top: 1px solid ${darkBorderColor};
      }
      .profileHeader, .nav, .navDropDown-item, .navDropDown-link, .navDropDown-pItem, .subNavMenu--menu .subNavMenu-item--separator {
border-bottom: 0px solid ${darkBorderColor};
      }
      .footer, .subNav, .voteBar, .comment-item {
background-color: ${NavbarColor};
border: 0px solid ${darkBorderColor};
      }
      .comments-list--top .comments-item:target .comments-item-inner, .comments-list .comments-item, .comments-list .comments-list-item:target .comments-item-inner {
        border-bottom: 1px solid ${darkBorderColor};
      }
      .fadeOuterEdge--l {
        box-shadow: -20px 0 17px -3px ${darkBackgroundColor};
      }
      .vote-box {
        box-shadow: 10px 0 10px -3px ${darkBackgroundColor};
      }
      .btn--mode-boxSec, .btn--mode-boxSec:active, .btn--mode-boxSec:focus, .btn--mode-boxSec:hover, button:active .btn--mode-boxSec, button:focus .btn--mode-boxSec, button:hover .btn--mode-boxSec {
background-color: ${CloudColor};
color: ${TextCloudColor};
      }
      .overflow--fade:after {
        background-color: linear-gradient(90deg,hsla(0,0%,100%,0) 0,#242424 80%) !important;
      }
      img, .badge, .btn--mode-primary-inverted, .btn--mode-primary-inverted--no-state, .btn--mode-primary-inverted--no-state:active, .btn--mode-primary-inverted--no-state:focus, .btn--mode-primary-inverted--no-state:hover, .btn--mode-primary-inverted:active, .btn--mode-primary-inverted:focus, button:active .btn--mode-primary-inverted, button:active .btn--mode-primary-inverted--no-state, button:focus .btn--mode-primary-inverted, button:focus .btn--mode-primary-inverted--no-state, button:hover .btn--mode-primary-inverted--no-state {
        filter: invert(5%) brightness(90%);
      }
      .thread--expired > * {
        filter: opacity(40%) brightness(90%);
      }
      .icon--overflow {
        color: ${textColor};
      }
      .input {
        line-height: 1.1rem;
      }
    `;
        css += `
          .js-sticky-pagi--on {
            background-color: transparent !important;
            border-top: none !important;
          }
          .js-sticky-pagi--on .tGrid-cell:not(:first-child):not(:last-child) {
            background-color: ${lightBackgroundColor} !important;
            border-top: 1px solid ${darkBorderColor};
            border-bottom: 1px solid ${darkBorderColor};
            padding-top: 0.7em;
            padding-bottom: 0.6em;
          }
          .js-sticky-pagi--on .tGrid-cell:first-child .hide--toW3, .js-sticky-pagi--on .tGrid-cell:last-child .hide--toW3 {
            visibility: hidden;
          }
          .js-sticky-pagi--on .tGrid-cell:first-child .hide--toW3 svg, .js-sticky-pagi--on .tGrid-cell:last-child .hide--toW3 svg {
            background-color: ${lightBackgroundColor} !important;
            height: 3em !important;
            width: 3em !important;
            padding: 1em !important;
            margin: 0 !important;
            border: 1px solid ${darkBorderColor};
            border-radius: 5px;
            visibility: visible;
          }
          .js-sticky-pagi--on .tGrid-cell:nth-child(2) {
            padding-left: 1em !important;
            border-left: 1px solid ${darkBorderColor};
            border-radius: 5px 0 0 5px;
          }
          .js-sticky-pagi--on .tGrid-cell:nth-last-child(2) {
            padding-right: 1em !important;
            border-right: 1px solid ${darkBorderColor};
            border-radius: 0 5px 5px 0;
          }
        `;
    if (css.length > 0) {
        (document.head || document.documentElement).insertAdjacentHTML('afterend', `<style id="pepper-dark-theme">${css}</style>`);
    }

    const pepperDarkThemeStyleNode = document.getElementById('pepper-dark-theme');
    if (pepperDarkThemeStyleNode) {
        document.head.appendChild(pepperDarkThemeStyleNode);
    }
})();