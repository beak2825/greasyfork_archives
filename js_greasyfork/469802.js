// ==UserScript==
// @name     _Override saocarlosemrede styles
// @description remove white space on homescreen
// @include  https://saocarlosemrede.com.br/*
// @grant    GM_addStyle
// @run-at   document-start
// @version 0.0.1.20230630035103
// @namespace https://greasyfork.org/users/1115413
// @downloadURL https://update.greasyfork.org/scripts/469802/_Override%20saocarlosemrede%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/469802/_Override%20saocarlosemrede%20styles.meta.js
// ==/UserScript==

GM_addStyle ( `

.td-main-page-wrap {
   padding-top: 0px !important;
}

.td-a-rec,.td-a-rec-id-content_inline,.widget,.widget_block,.td-post-sharing-top {
    display: none !important;
}

` );