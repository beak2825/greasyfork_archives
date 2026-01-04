// ==UserScript==
// @name        Pepper Dark Mode
// @namespace   Violentmonkey Scripts
// @match        https://www.pepper.pl/*
// @exclude      https://www.pepper.pl/dyskusji*
// @exclude      https://www.pepper.pl/grupa
// @exclude      https://www.pepper.pl/kupony*
// @exclude      https://www.pepper.pl/profile*
// @exclude      https://www.pepper.pl/submission*
// @grant       none
// @version     1.0
// @author      me__
// @license MIT
// @description 21.10.2022, 00:02:38
// @downloadURL https://update.greasyfork.org/scripts/453438/Pepper%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/453438/Pepper%20Dark%20Mode.meta.js
// ==/UserScript==

let css;
// const invertColor = color => '#' + (Number(`0x1${ color.replace('#', '') }`) ^ 0xFFFFFF).toString(16).substr(1);
const darkBorderColor = '#121212';
const lightBorderColor = '#5c5c5c';
const darkBackgroundColor = '#242424';
const veryDarkBackgroundColor = '#1d1f20';
const darkestBackgroundColor = '#050c13';
const lightBackgroundColor = '#35373b';
const textColor = '#bfbfbf';
const secondaryTextColor = '#8f949b';
const orangeColor = '#ff7900';
// const greyButtonColor = '#8f949b';
// const orangeColor = '#d1d5db';

css += `


        .comments-pagi--header .comments-pagi-pages:not(:disabled),
        .page2-center .mute--text2, .page2-subTitle2.mute--text2, .conversation-content.mute--text2, .linkGrey, .thread-userOptionLink, .cept-nav-subheadline, .user:not(.thread-user), .tabbedInterface-tab, .subNavMenu, .subNavMenu-btn, .tag, .page-label, .page-subTitle, .page2-secTitle, .userProfile-title--sub, .bg--color-inverted .text--color-white, .comments-pagination--header .pagination-next, .comments-pagination--header .pagination-page, .comments-pagination--header .pagination-previous, .conversationList-msgPreview, .thread-title, .mute--text, .text--color-charcoal, .text--color-charcoalTint, .cept-tt, .cept-description-container, /*.cept-tp,*/ .thread-username, .voucher input, .hide--bigCards1, .hide--toBigCards1 {
          color: ${textColor};
        }
        .vote-temp--inert {
          color: ${secondaryTextColor}
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
          border-top: none; /* there is some problem with the top border => whole article goes up */
          border-radius: 5px;
        }
        .input, .inputBox, .secretCode-codeBox, .toolbar, .voucher-code {
          background-color: ${darkBackgroundColor};
          border-color: ${lightBorderColor};
        }
        /* Arrows */
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
        /* END: Arrows */
        /* Faders */
        .overflow--fade-b-r--l:after, .overflow--fade-b-r--s:after, .overflow--fade-b-r:after, .overflow--fromW3-fade-b-r--l:after, .overflow--fromW3-fade-r--l:after, .thread-title--card:after, .thread-title--list--merchant:after, .thread-title--list:after {
          background: -webkit-linear-gradient(left,hsla(0,0%,100%,0),${darkBackgroundColor} 50%,${darkBackgroundColor});
          background: linear-gradient(90deg,hsla(0,0%,100%,0),${darkBackgroundColor} 50%,${darkBackgroundColor});
          /* filter: brightness(100%) !important; */
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
        .no-touch .carousel-list--air.carousel--isPrev:before {
          background: linear-gradient(-270deg, rgba(36, 36, 36, .98) 10%, hsla(0, 0%, 100%, 0));
        }
        .no-touch .carousel-list--air.carousel--isNext:after {
          background: linear-gradient(270deg, rgba(36, 36, 36, .98) 10%, hsla(0, 0%, 100%, 0));
        }
        /* END: Faders */
        .btn--border, .bg--off, .boxSec--fromW3:not(.thread-infos), .boxSec, .voucher-codeCopyButton, .search input, .img, .userHtml-placeholder, .userHtml img, .popover--subNavMenu .popover-content {
          border: 1px solid ${darkBorderColor} !important;  /* need full border definition for .bg--off */
        }
        .carousel-list--air, .tabbedInterface-tab--selected, .bg--main, .tabbedInterface-tab--horizontal, .tabbedInterface-tab--selected, .comment--selected, .comments-item--in-moderation, .comments-item-inner--active, .comments-item-inner--edit, /*.thread.cept-sale-event-thread.thread--deal,*/ .vote-btn, .notification-item:not(.notification-item--read), .search div, .search input, .text--overlay, .popover--brandAccent .popover-content, .popover--brandPrimary .popover-content, .popover--default .popover-content, .popover--menu .popover-content, .popover--red .popover-content {
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
        .softMessages-item, .popover--modal .popover-content, .bg--color-white, .bg--fromW3-color-white, .listingProfile-header, .profileHeader, .bg--em, nav.comments-pagination {
          background-color: ${veryDarkBackgroundColor};
          color: ${textColor} !important;
        }
        .bg--color-greyPanel {
          background-color: ${veryDarkBackgroundColor};
        }
        .bg--color-greyTint, .thread-divider, .btn--mode-filter {
          background-color: ${textColor};
        }
        img.avatar[src*="placeholder"] {
          filter: brightness(75%);
        }
        .btn--mode-primary, .btn--mode-highlight, .bg--color-brandPrimary {  /* Orange Buttons/Backgrounds */
          filter: brightness(90%);
        }
        .btn--mode-dark-transparent, .btn--mode-dark-transparent:active, .btn--mode-dark-transparent:focus, button:active .btn--mode-dark-transparent, button:focus .btn--mode-dark-transparent {
          background-color: inherit;
        }
        .boxSec-div, .boxSec-div--toW2 {
          border-top: 1px solid ${darkBorderColor};
        }
        .profileHeader, .nav, .navDropDown-item, .navDropDown-link, .navDropDown-pItem, .subNavMenu--menu .subNavMenu-item--separator {
          border-bottom: 1px solid ${darkBorderColor};
        }
        .footer, .subNav, .voteBar, .comment-item {
          background-color: ${darkBackgroundColor};
          border-bottom: 1px solid ${darkBorderColor};
        }
        .commentList-item:not(:last-child),  /* New comment list class */
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
          background-color: ${textColor};
        }
        .overflow--fade:after {
          background-color: linear-gradient(90deg,hsla(0,0%,100%,0) 0,#242424 80%) !important;
        }
        img, .badge, .btn--mode-primary-inverted, .btn--mode-primary-inverted--no-state, .btn--mode-primary-inverted--no-state:active, .btn--mode-primary-inverted--no-state:focus, .btn--mode-primary-inverted--no-state:hover, .btn--mode-primary-inverted:active, .btn--mode-primary-inverted:focus, button:active .btn--mode-primary-inverted, button:active .btn--mode-primary-inverted--no-state, button:focus .btn--mode-primary-inverted, button:focus .btn--mode-primary-inverted--no-state, button:hover .btn--mode-primary-inverted--no-state {
          filter: invert(5%) brightness(90%);
        }
        .thread--expired > * {
          filter: opacity(50%) brightness(95%);
        }
        .icon--overflow {
          color: ${textColor};
        }
        .input {
          line-height: 1.1rem;
        }
        /* White Covers/Seals etc. */
        .progress--cover, .seal--cover:after {
          opacity: 0.8;
          background-color: ${veryDarkBackgroundColor} !important;
        }
        @-webkit-keyframes pulseBgColor {
          0%  { background-color: transparent; filter: contrast(100%); }
          15% { background-color: ${veryDarkBackgroundColor}; filter: contrast(105%); }
          85% { background-color: ${veryDarkBackgroundColor}; filter: contrast(105%); }
          to  { background-color: transparent; filter: contrast(100%); }
        }
        @keyframes pulseBgColor {
          0%  { background-color: transparent; filter: contrast(100%); }
          15% { background-color: ${veryDarkBackgroundColor}; filter: contrast(105%); }
          85% { background-color: ${veryDarkBackgroundColor}; filter: contrast(105%); }
          to  { background-color: transparent; filter: contrast(100%); }
        }
        /* END */
        /* Reactions */
        .popover--reactions .popover-content {
          background-color: ${veryDarkBackgroundColor};
          border: 1px solid ${lightBorderColor};
        }
        /* END */
        /* Buttons: coupons, comments, alerts */
        .btn--mode-boxSec,
        .btn--mode-primary-inverted,
        .btn--mode-primary-inverted--no-state {
          /* color: ${secondaryTextColor}; */
          background-color: ${darkBackgroundColor} !important;
          border: 1px solid ${lightBorderColor} !important;
        }
        .footerMeta-actionSlot .btn--mode-boxSec { /* comment buttons in the grid list */
          color: ${secondaryTextColor};
          padding-left: 0.57143em !important;
          padding-right: 0.57143em !important;
        }
        .btn--mode-boxSec:hover,
        .btn--mode-primary-inverted:hover,
        .btn--mode-primary-inverted--no-state:hover,
        .btn--mode-boxSec:active,
        .btn--mode-primary-inverted:active,
        .btn--mode-primary-inverted--no-state:active,
        .btn--mode-boxSec:focus,
        .btn--mode-primary-inverted:focus,
        .btn--mode-primary-inverted--no-state:focus {
          background-color: ${veryDarkBackgroundColor} !important;
          border: 1px solid ${lightBorderColor} !important;
        }
        .btn--mode-white--dark,
        .btn--mode-white--dark:hover,
        .btn--mode-white--dark:active,
        .btn--mode-white--dark:focus {
          background-color: ${veryDarkBackgroundColor} !important;
        }
        .btn--mode-white--dark:hover,
        .btn--mode-white--dark:active,
        .btn--mode-white--dark:focus {
          color: ${orangeColor} !important;
        }
        /* END */
      `;



/* END: Dark Theme Style */


/* Check What Browser */
const isFirefoxBrowser = typeof InstallTrigger !== 'undefined';
const isOperaBrowser = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Apply CSS
if (css.length > 0) {
    if (isFirefoxBrowser && (document.hidden || !document.hasFocus())) {
        const appendStyle = () => {
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
            console.log('yes')
        };
        document.addEventListener('DOMContentLoaded', appendStyle);
    } else {
        const appendStyle = () => {
            if (document.head !== null || document.documentElement !== null) {
                (document.head || document.documentElement).insertAdjacentHTML('afterend', `<style id="pepper-tweaker-style">${css}</style>`);  // cannot be 'beforeend' => <link> elements with CSS can be loaded after the style and override it!
            } else {
                setTimeout(appendStyle, 10);
            }
        }
        appendStyle();
    }
}