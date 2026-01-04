// ==UserScript==
// @name         FicBook old design
// @namespace    ficbooknet
// @version      v1.2
// @description  Bring back the old book style of Ficbook.net
// @author       VinniTheP00h
// @match        https://ficbook.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ficbook.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526964/FicBook%20old%20design.user.js
// @updateURL https://update.greasyfork.org/scripts/526964/FicBook%20old%20design.meta.js
// ==/UserScript==

var cssStyle;
console.log('Starting script');
storeCSS();
addPages();
addStyle();
console.log('Script ended');

function addStyle() {
  var style = document.createElement('style');
      style.type = 'text/css';
      style.innerHTML = cssStyle;
    document.head.appendChild(style);
    console.log('Style');
};

function addPages() {
    // Create pages
    var pageLeft1 = document.createElement('div');
      pageLeft1.setAttribute('class', 'pages left-1');
    var pageLeft2 = document.createElement('div');
      pageLeft2.setAttribute('class', 'pages left-2');
    var pageRight1 = document.createElement('div');
      pageRight1.setAttribute('class', 'pages right-1');
    var pageRight2 = document.createElement('div');
      pageRight2.setAttribute('class', 'pages right-2');
    console.log('Pages created')
    // Get the parent div
    var parent = document.querySelector('.book-inner');
    parent.prepend(pageLeft1);
    parent.prepend(pageLeft2);
    parent.prepend(pageRight1);
    parent.prepend(pageRight2);
};

function storeCSS() {
    // This function is only needed to store the pretty lengthy CSS file *after* the functional part
    cssStyle = `
body {
  -webkit-text-size-adjust:none;
  -moz-text-size-adjust:none;
  text-size-adjust:none;
  background:#2b1812 url(https://web.archive.org/web/20240712111022/https://fbassets.teinon.net/assets/dist/images/bg-pattern.e19bb1033abaf457954f.jpg);
  min-width:320px
}
@media (max-width:767px) {
  body {
    background:0 0
  }
}
body:after {
  content:url(https://web.archive.org/web/20240712111022/https://fbassets.teinon.net/assets/dist/images/bg-pattern.e19bb1033abaf457954f.jpg) url(https://web.archive.org/web/20240712111022/https://fbassets.teinon.net/assets/dist/images/corner-lt.c3ea5e603ad595db0f22.png) url(https://web.archive.org/web/20240712111022/https://fbassets.teinon.net/assets/dist/images/pattern.7769d569e87602d7336b.jpg);
  display:none
}
@media (max-width:767px) {
  body:after {
    content:none
  }
}

.book-container {
  background:url(https://web.archive.org/web/20240712111022/https://fbassets.teinon.net/assets/dist/images/pattern.7769d569e87602d7336b.jpg) repeat;
  border-radius:10px;
  padding:15px 60px;
  position:relative;
}
@media (max-width:1309px) {
  .book-container {
    padding:15px 40px
  }
}
@media (max-width:991px) {
  .book-container {
    padding:15px 30px
  }
}
@media (max-width:767px) {
  .book-container {
    background-image:none;
    border-radius:0
  }
}

.book-container .book-corner-bottom:after,
.book-container .book-corner-bottom:before,
.book-container .book-corner-top:after,
.book-container .book-corner-top:before {
  content:"";
  background:url(https://web.archive.org/web/20240712111022/https://fbassets.teinon.net/assets/dist/images/corner-lt.c3ea5e603ad595db0f22.png) 0 0 no-repeat;
  width:62px;
  height:63px;
  position:absolute
}
@media (max-width:767px) {
  .book-container .book-corner-bottom:after,
  .book-container .book-corner-bottom:before,
  .book-container .book-corner-top:after,
  .book-container .book-corner-top:before {
    background:0 0
  }
}
.book-container .book-corner-top:before {
  top:-2px;
  left:-2px
}
.book-container .book-corner-top:after {
  top:-2px;
  right:-2px;
  transform:scaleX(-1)
}
.book-container .book-corner-bottom:before {
  bottom:-2px;
  left:-2px;
  transform:scaleY(-1)
}
.book-container .book-corner-bottom:after {
  bottom:-2px;
  right:-2px;
  transform:scale(-1)
}
.book-container .book-stiches-horizontal:before,
.book-container .book-stiches-horizontal:after {
  content:"";
  background-image:linear-gradient(90deg,#c69e6b50,#c69e6b50 70%,#0000 70% 100%);
  background-size:7px 1px;
  width:100%;
  height:1px;
  position:absolute;
  left:0
}
.book-container .book-stiches-horizontal:before {
  top:5px
}
.book-container .book-stiches-horizontal:after {
  bottom:5px
}
.book-container .book-stiches-vertical:before,
.book-container .book-stiches-vertical:after {
  content:"";
  background-image:linear-gradient(#0000 0% 30%,#c69e6b50 30%,#c69e6b50);
  background-size:1px 7px;
  width:1px;
  height:100%;
  position:absolute;
  top:0
}
.book-container .book-stiches-vertical:before {
  left:5px
}
.book-container .book-stiches-vertical:after {
  right:5px
}
.book-container .book-inner {
  background-color:#f6ecda;
  position:relative
}
.book-container .book-inner .pages {
  position:absolute;
  top:0;
  bottom:0
}
@media (max-width:767px) {
  .book-container .book-inner .pages {
    display:none
  }
}
.book-container .book-inner .pages:before,
.book-container .book-inner .pages:after {
  content:"";
  width:3px;
  position:absolute
}
.book-container .book-inner .pages.left-1,
.book-container .book-inner .pages.right-1 {
  background-color:#e7d6b6;
  top:3px;
  bottom:3px
}
.book-container .book-inner .pages.left-1:before,
.book-container .book-inner .pages.right-1:before {
  background-color:#d3be97;
  top:3px;
  bottom:3px
}
.book-container .book-inner .pages.left-1:after,
.book-container .book-inner .pages.right-1:after {
  background-color:#baa47d;
  top:6px;
  bottom:6px
}
.book-container .book-inner .pages.left-2:before,
.book-container .book-inner .pages.right-2:before {
  background-color:#a98d5b;
  top:12px;
  bottom:12px
}
.book-container .book-inner .pages.left-2:after,
.book-container .book-inner .pages.right-2:after {
  background-color:#897248;
  top:15px;
  bottom:15px
}
.book-container .book-inner .pages.left-1 {
  width:3px;
  left:-3px
}
.book-container .book-inner .pages.left-1:before {
  bottom:3px;
  left:-3px
}
.book-container .book-inner .pages.left-1:after {
  bottom:6px;
  left:-6px
}
.book-container .book-inner .pages.right-1 {
  width:3px;
  left:100%
}
.book-container .book-inner .pages.right-1:before {
  left:100%
}
.book-container .book-inner .pages.right-1:after {
  left:calc(100% + 3px)
}
.book-container .book-inner .pages.left-2:before {
  left:-12px
}
.book-container .book-inner .pages.left-2:after {
  left:-15px
}
.book-container .book-inner .pages.right-2 {
  left:calc(100% + 3px)
}
.book-container .book-inner .pages.right-2:before {
  left:calc(100% + 6px)
}
.book-container .book-inner .pages.right-2:after {
  left:calc(100% + 9px)
}
@media (max-width:767px) {
  .book-container {
    padding:0
  }
}

.book-container .book-inner {
  border-radius: 0
}

.dark-theme .content-box .row-lines {
  border-color:#2d2d2f!important
}
.dark-theme .content-box {
  --content-box-background:#3e3e3f
}
.btn-small {
  padding:2px 5px;
  font-size:12px
}
.dark-theme {
  background-color:#2d2d2f
}
.dark-theme .book-container {
  background-blend-mode:luminosity;
  background-color:#2d2d2f
}
.dark-theme .navbar-default .navbar-nav>li>a,
.dark-theme .navbar-default .navbar-nav>li>a svg,
.dark-theme .navbar-default .navbar-nav .dark-theme-switcher,
.dark-theme .request-area .title svg,
.dark-theme .listing .ic_book,
.dark-theme .header-mobile .sub-nav ul li a,
.dark-theme .beta-date,
.dark-theme .params-legend,
.dark-theme .premium-account-proposal .proposal-item .proposal-price,
.dark-theme .premium-account-proposal .proposal-item .coins-description,
.dark-theme .premium-account-proposal .proposal-item .proposal-description,
.dark-theme .btn.btn-success,
.dark-theme .choose-dialog,
.dark-theme .request-content .header-container span,
.dark-theme .request-content .flex-box .avatar-container i,
.dark-theme .btn-link,
.dark-theme .as-link,
.dark-theme .support-thumb .message-date,
.dark-theme svg[class^=ic_]:not(.icon-direction,
.icon-bell,
.common-select .vs__open-indicator,
.next-part-arrow,
.remove-fandom,
.premium-icon),
.dark-theme .news-area .news-subheader svg,
.dark-theme .sortable-list .sortable-element .ic_move,
.dark-theme .messaging-container .back-to-threads-button {
  color:inherit
}
.dark-theme .modal-content:not(.new-fandom-modal),
.dark-theme .premium-account-proposal .proposal-item .text-danger,
.dark-theme textarea:not(.ds-form-control),
.dark-theme input[type=search]:not(.ds-form-control,
.common-select .vs__search,
.search-field-input,
.header-search-input),
.dark-theme input[type=text]:not(.ds-form-control,
.date-pickers input),
.dark-theme input[type=number]:not(.ds-form-control) {
  color:initial
}
.dark-theme .header-holder,
.dark-theme .navbar-default,
.dark-theme .book-inner,
.dark-theme .selectBox .valueTag,
.dark-theme .selectBox .selectMenuBox,
.dark-theme .well,
.dark-theme .cover-mock-title,
.dark-theme .cover-mock-body {
  color:#ededed;
  background-color:#2d2d2f
}
.dark-theme .table-striped>tbody>tr:nth-of-type(odd),
.dark-theme .present-thumb,
.dark-theme .if-you-were-premium,
.dark-theme .data-table .data-table-row:nth-child(odd),
.dark-theme .request-content,
.dark-theme .news-area li,
.dark-theme .news-area .well,
.dark-theme .login-dropdown,
.dark-theme .selectBox .selectMenuBox .option.active,
.dark-theme .support-thumb,
.dark-theme .label-adult,
.dark-theme .new-bg,
.dark-theme .useractivities .dropdown.open,
.dark-theme .sortable-list .sortable-element .ic_move,
.dark-theme .fanfic-download-option .fanfic-download-container,
.dark-theme .cover-preview-desktop,
.dark-theme .cover-preview-mobile,
.dark-theme .not-published-link,
.dark-theme .discount-modal .modal-content,
.dark-theme .profile-header .profile-cover,
.dark-theme .premium-descriptions {
  background-color:#3e3e3f!important
}
.dark-theme .container-counter span,
.dark-theme #footer .dark-theme-switcher,
.dark-theme .categories-block h2,
.dark-theme .categories-block-box,
.dark-theme .discount-modal .modal-content {
  color:#ededed
}
.dark-theme .sortable-list .recommendation-block,
.dark-theme .block-separator,
.dark-theme .navbar-default .navbar-nav,
.dark-theme .navbar-default,
.dark-theme .bottom-line,
.dark-theme .well,
.dark-theme .categories-list,
.dark-theme .part-comment-bottom,
.dark-theme .part-comment-top,
.dark-theme .premium-descriptions {
  border-color:#696969
}
.dark-theme .help,
.dark-theme .js-span-link,
.dark-theme .icon-clickable span {
  color:#ededed;
  border-bottom-color:#ededed
}
.dark-theme .block .direction:before,
.dark-theme .direction .icon-direction,
.dark-theme .notice,
.dark-theme .modal-content:not(.new-fandom-modal),
.dark-theme input:not([type=button],
[type=submit],
[type=reset],
.ds-form-control,
.common-select .vs__search,
.date-pickers input,
.header-search-input),
.dark-theme textarea:not(.ds-form-control),
.dark-theme select,
.dark-theme .v-select:not(.common-select),
.dark-theme .present_thumb_small,
.dark-theme .present-thumb-picture,
.dark-theme .present-thumb-description,
.dark-theme .new-message-form,
.dark-theme .message-threads,
.dark-theme .data-table .data-table-row select,
.dark-theme #toast-container .toast {
  filter:brightness(.7)
}
.dark-theme .v-select:not(.common-select).vs--disabled {
  filter:brightness(.5)
}
.dark-theme .v-select:not(.common-select).vs--disabled input.vs__search:disabled {
  filter:initial
}
.dark-theme .v-select:not(.common-select) .vs__dropdown-menu {
  filter:brightness(.7)
}
.dark-theme .v-select:not(.common-select).vs--open {
  z-index:4
}
.dark-theme .container-counter:hover svg,
.dark-theme .container-counter:hover span,
.dark-theme .help-block:not(.form-error) {
  color:#d8d4ca
}
.dark-theme .read-notification .read-decoration-text {
  color:initial;
  background-color:#ededed;
  border-color:#d8d4ca
}
.dark-theme .navbar-default .navbar-nav>.active>a,
.dark-theme .navbar-default .navbar-nav>.active>a:hover,
.dark-theme .navbar-default .navbar-nav>.active>a:focus,
.dark-theme .navbar-default .navbar-nav>li>a:hover,
.dark-theme .navbar-default .navbar-nav>li>a:focus {
  color:#fff
}
.dark-theme .book-corner-left-top,
.dark-theme .book-corner-right-top,
.dark-theme .book-corner-right-bottom,
.dark-theme .book-corner-left-bottom,
.dark-theme .book-stiches-top,
.dark-theme .book-stiches-bottom,
.dark-theme .book-stiches-left,
.dark-theme .book-stiches-right {
  filter:grayscale()
}
.dark-theme .navbar-default .navbar-nav>li>a:hover,
.dark-theme .navbar-default .navbar-nav>li>a:focus,
.dark-theme .navbar-default .navbar-nav>li.active>a {
  background-color:#851d1d
}
.dark-theme .book-inner .pages {
  background-color:#2d2d2f!important
}
.dark-theme .book-inner .pages:before,
.dark-theme .book-inner .pages:after {
  background-color:inherit!important
}
.dark-theme .text-danger {
  color:#d87f7c
}
.dark-theme .find-form .form-group .sub-category {
  background-color:#3e3e3f;
  border-color:#696969
}
.dark-theme .panel {
  background-color:#2d2d2f
}
.dark-theme .dropdown-menu {
  background-color:#3e3e3f
}
.dark-theme .dropdown-menu .dropdown-menu-element {
  color:#ededed!important
}
.dark-theme .header-top .dropdown.profile-holder.open button[data-toggle=dropdown],
.dark-theme .header-top .dropdown.profile-holder button[data-toggle=dropdown]:hover {
  background-color:#69696980
}
.dark-theme .navigation-to-fanfic-parts-container .navigation-button,
.dark-theme .chapter-info .start-reading,
.dark-theme .kb-articles-list li a {
  color:inherit;
  background-color:#696969
}
.dark-theme .navigation-to-fanfic-parts-container .navigation-button:hover,
.dark-theme .chapter-info .start-reading:hover,
.dark-theme .kb-articles-list li a:hover {
  background-color:#3e3e3f
}
.dark-theme .navbar-default .navbar-nav>li>a:before {
  border-left-color:#460f0f
}
.dark-theme .navbar-default .navbar-nav>li>a:after {
  filter:brightness(.6)
}
.dark-theme .card-light,
.dark-theme article.block.fanfic-block-read,
.dark-theme .fanfic-inline,
.dark-theme .sortable-list .recommendation-block {
  background-color:#3e3e3f
}
.dark-theme .fanfic-inline.fanfic-block-read,
.dark-theme .profile-header {
  background-color:#525252
}
.dark-theme .payment-options {
  columns:initial
}
.dark-theme .payment-options a[href]:not(.btn),
.dark-theme .payment-options svg {
  color:inherit!important
}
.dark-theme .count,
.dark-theme .icon-show-collection-list-color,
.dark-theme .badge-secondary.badge-green {
  color:#589d61!important
}
.dark-theme a[href]:not(.btn,
.ds-btn,
.myfic-toolbar-btn,
.series-fic) {
  color:#d8d4ca
}
.dark-theme a[href]:not(.btn,
.ds-btn,
.myfic-toolbar-btn,
.series-fic):hover {
  color:#ededed
}
.dark-theme a[href].text-danger {
  color:#d87f7c
}
.dark-theme .visit-link:visited,
.dark-theme .fanfic-inline-title.visit-link:visited h3 {
  color:#a29881!important
}
.dark-theme .btn-default,
.dark-theme a.btn-default {
  color:#ededed;
  background-color:#2d2d2f;
  border-color:#ededed
}
.dark-theme .btn-default:hover,
.dark-theme .btn-default:focus,
.dark-theme .btn-default.active,
.dark-theme a.btn-default:hover,
.dark-theme a.btn-default:focus,
.dark-theme a.btn-default.active {
  color:#2d2d2f;
  background-color:#ededed;
  border-color:#2d2d2f
}
.dark-theme .btn-default:hover svg,
.dark-theme .btn-default:focus svg,
.dark-theme .btn-default.active svg,
.dark-theme a.btn-default:hover svg,
.dark-theme a.btn-default:focus svg,
.dark-theme a.btn-default.active svg {
  color:#2d2d2f
}
.dark-theme .request-content .flex-box .cell-of-row-container-request:hover {
  color:#d8d4ca
}
.dark-theme .premium-notice {
  filter:grayscale(.6)
}
.dark-theme .premium-notice i {
  color:#000
}
.dark-theme .btn-primary,
.dark-theme a.btn-primary {
  color:#2d2d2f;
  background-color:#ededed;
  border-color:#3e3e3f
}
.dark-theme .btn-primary:hover,
.dark-theme .btn-primary:focus,
.dark-theme .btn-primary.active,
.dark-theme a.btn-primary:hover,
.dark-theme a.btn-primary:focus,
.dark-theme a.btn-primary.active {
  color:#ededed;
  background-color:#696969;
  border-color:#ededed
}
.dark-theme .btn-primary:hover .badge,
.dark-theme .btn-primary:focus .badge,
.dark-theme .btn-primary.active .badge,
.dark-theme a.btn-primary:hover .badge,
.dark-theme a.btn-primary:focus .badge,
.dark-theme a.btn-primary.active .badge {
  color:#2d2d2f;
  background-color:#ededed
}
.dark-theme .btn-primary svg,
.dark-theme a.btn-primary svg {
  color:inherit
}
.dark-theme .btn-primary .badge,
.dark-theme a.btn-primary .badge {
  color:#ededed;
  background-color:#2d2d2f
}
.dark-theme .categories-block-box {
  background-color:#3e3e3f
}
@media (max-width:767px) {
  .dark-theme .categories-block-box.categories-list h3 {
    background-color:#2d2d2f;
    border-color:#ededed
  }
  .dark-theme .categories-block-box.categories-list h3:before {
    background-color:#2d2d2f
  }
  .dark-theme .categories-block-box.categories-list h3:after {
    border-top-color:#ededed
  }
  .dark-theme .categories-block-box.categories-list h3 .opener {
    color:#ededed
  }
  .dark-theme .categories-block-box.categories-list ul {
    background-color:#3e3e3f;
    border-color:#ededed
  }
  .dark-theme .categories-block-box.categories-list ul a {
    color:#ededed
  }
  .dark-theme .categories-block-box.categories-list ul a:hover {
    color:#2d2d2f;
    background-color:#ededed
  }
}
.dark-theme .nav-info ul a {
  color:#ededed;
  background-color:#3e3e3f
}
.dark-theme .nav-info ul a:hover,
.dark-theme .nav-info ul li.active a {
  color:initial;
  background-color:#c69e6b
}
.dark-theme .nav-info ul .counter {
  color:inherit
}
.dark-theme #searchDiv {
  color:initial
}
.dark-theme #searchDiv .icon-close-overlay {
  color:#d8d4ca
}
.dark-theme #searchDiv .search-input {
  background-color:#d8d4ca;
  border-color:#ededed
}
.dark-theme #searchDiv .common-search .show-all-button {
  color:#ededed;
  background-color:#2d2d2f;
  border-color:#ededed
}
.dark-theme #searchDiv .common-search .show-all-button:before {
  border-left-color:#ededed
}
.dark-theme #searchDiv .common-search .show-all-button:after {
  border-left-color:#2d2d2f
}
.dark-theme .form-search input {
  color:#ededed;
  background-color:#2d2d2f
}
.dark-theme .form-search .btn-search {
  background-color:#696969
}
.dark-theme .header-bottom .logo img {
  filter:invert(.7)grayscale()
}
.dark-theme .header-top .logo svg {
  filter:grayscale()
}
.dark-theme .btn-success,
.dark-theme .btn-danger,
.dark-theme .btn-warning,
.dark-theme .btn-info,
.dark-theme .fanfic-main-info .badge,
.dark-theme .chapter-info .fanfic-hat-premium-notice {
  filter:grayscale(.5)
}
.dark-theme .help-box a[href]:not(.btn) {
  color:inherit
}
.dark-theme .rkl-block .rkl-block-head {
  color:#696969
}
.dark-theme .rkl-block .rkl-block-head .rkl-block-link a:after {
  filter:grayscale()invert()
}
.dark-theme .rkl-block .rkl-block-head .rkl-block-link a:hover {
  color:#696969
}
.dark-theme .faq_highlighted,
.dark-theme .rules_highlighted {
  background-color:#3e3e3f;
  animation-name:night-highlighted-flash
}
@keyframes night-highlighted-flash {
  0%,
  50%,
  to {
    background-color:#3e3e3f
  }
  25%,
  75% {
    background-color:#696969
  }
}
.dark-theme .message-text-container {
  background-color:#3e3e3f!important
}
.dark-theme .message-text-container .message-date {
  color:#b0b0b0!important
}
.dark-theme .fanfic-inline .badge-with-icon {
  opacity:.8
}
.dark-theme .fanfic-inline .hot-fanfic {
  filter:grayscale(.5)
}
.dark-theme .fanfic-inline .hot-fanfic a {
  color:#000
}
.dark-theme .fanfic-inline .hot-fanfic a:hover {
  color:inherit
}
.dark-theme .fanfic-inline .fanfic-more-actions {
  filter:brightness(.7)
}
.dark-theme .request-area .request-thumb {
  background-color:#3e3e3f
}
.dark-theme .request-area a.hot-request {
  filter:grayscale(.5);
  color:#000
}
.dark-theme .recommendation-section {
  background:#0003
}
.dark-theme .popular-top-list .top-item-rating {
  background-color:#3e3e3f
}
@media (max-width:767px) {
  .dark-theme .popular-top-list .top-item-rating {
    background-color:unset
  }
}
.dark-theme .popular-top-list .top-item-rating .rating-info {
  color:#b0b0b0
}
.dark-theme .ProseMirror .footnote-tooltip,
.dark-theme .part_text .footnote-tooltip {
  background:#3e3e3f
}
.dark-theme .present_thumb_small {
  background:unset
}
`;
};