// ==UserScript==
// @name     _Override uol styles
// @description remove white space on homescreen
// @include  https://economia.uol.com.br/*
// @grant    GM_addStyle
// @run-at   document-start
// @version 0.0.2
// @namespace https://greasyfork.org/users/1115413
// @downloadURL https://update.greasyfork.org/scripts/469818/_Override%20uol%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/469818/_Override%20uol%20styles.meta.js
// ==/UserScript==
 
GM_addStyle ( `
 
.station,.economia {
   padding-top: 0px !important;
}
 
.tp-modal {
    display: none !important;
}
 
` );




