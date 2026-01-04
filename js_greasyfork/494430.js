// ==UserScript==
// @name        Dark Mode For QQ
// @namespace   Violentmonkey Scripts
// @match       https://*.questionablequesting.com/*
// @match       https://questionablequesting.com/*
// @grant       GM_addStyle
// @version     2.0
// @author      Jaoheah
// @description 5/10/2024, 8:55 PM ET
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/494430/Dark%20Mode%20For%20QQ.user.js
// @updateURL https://update.greasyfork.org/scripts/494430/Dark%20Mode%20For%20QQ.meta.js
// ==/UserScript==

(function() {
  let css = "";
  if (location.href.startsWith("https://forum.questionablequesting.com")) {
    css += `

html.style-dark .block--messages .message,
html.style-dark .block--messages .block-row,
html.style-dark .block-container {
    color: #E6E6E6 !important;
}

html.style-dark article.message-body a.link:is(:link, :visited, :hover, :active) {
    color: lightblue;
}

html.style-dark article.message-body a.link.link--external:visited {
    color: blueviolet;
}

html.style-dark article.message-body a.username {
    color: dodgerblue;
}

.p-nav-smallLogo img {
    max-height: unset;
}


.menu.menu--medium {
    width: 500px;
}


html.style-dark #top {
    background-color: #000000;
}

html.style-dark .block--messages article.message {
    background-color: #000000;
}

html.style-dark .block--messages article.message .bbCodeBlock {
    background-color: #000000;
}

html.style-dark .message-cell.message-cell--user {
    background-color: #000000;
}

html.style-dark .message-header .message-attribution {
    background-color: #000000;
    border-top-color: #000000;
}

html.style-dark .message .reactionsBar {
     background-color: #000000;
}

html.style-dark .bbCodeBlock-title {
    background-color: #000000;
}

.p-nav {
    background-color: #000000;
}

html.style-dark .menu-header {
    background-color: #000000;
}

html.style-dark .menu-content .js-alertsMenuBody .alert.is-unread, .alert-list .alert.is-unread  {
    background-color: #000000;
}

html.style-dark .menu-footer.menu-footer--split .menu-footer-main {
    background-color: #000000;
}

html.style-dark .block-container {
    background-color: #000000;
}

html.style-dark .block-filterBar {
    background-color: #000000;
    border-top-color: #000000;
}

.p-body-pageContent .block .block-minorHeader {
    background-color: #000000;
    border-top-color: #000000;
}

html.style-dark .block--category .block-header-wrapper .block-header {
    background-color: #000000;
    border-top-color: #000000;
}

.p-body-sidebar .block .block-minorHeader {
    background-color: #000000;
    border-top-color: #000000;
}

.p-body-sidebar .block .block-container {
    background-color: #000000;
}

html.style-dark .block-footer {
    background-color: #000000;
}

html.style-dark .block-header {
    background-color: #000000;
    border-top-color: #000000;
}

html.style-dark .tabs--standalone {
    background-color: #000000;
}

html.style-dark .message-responseRow {
    background-color: #000000;
}

html.style-dark .block-minorHeader {
    background-color: #000000;
}

.p-body-sidebar .block .block-minorHeader, .p-body-sideNavContent .block .block-minorHeader {
    background-color: #000000;
    border-top-color: #000000;
}

html.style-dark .block-body {
    background-color: #000000;
}

html.style-dark .block--messages .message-cell--threadmark-footer {
    background-color: #000000;
}

html.style-dark .block--messages .message-cell--threadmark-header {
    background-color: #000000;
}

html.style-dark .block-tabHeader {
    background-color: #000000;
}

.p-header {
    background-color: #000000;
}

.p-sectionLinks {
    background-color: #000000;
    border-top-color: #000000;
    border-bottom-color: #000000;
}

html.style-dark .menu-footer {
    background-color: #000000;
    
}
    `;
  }
  GM_addStyle(css);

})();
