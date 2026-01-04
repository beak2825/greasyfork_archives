// ==UserScript==
// @name     _Override saocarlosagora styles
// @description Remove Ads from saocarlosagora
// @include  https://www.saocarlosagora.com.br/*
// @grant    GM_addStyle
// @run-at   document-start
// @version 0.0.1.20230630033015
// @namespace https://greasyfork.org/users/1115413
// @downloadURL https://update.greasyfork.org/scripts/469808/_Override%20saocarlosagora%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/469808/_Override%20saocarlosagora%20styles.meta.js
// ==/UserScript==

GM_addStyle ( `

.barraazul,.billboard,.colunaBanners,.apenasMobile,.mobileNao,.squareBanner,.squareBanner336,.supperBanner,.shareAreas,.shareAreas2,.dvBanner250,.grid_4.bannerDireita {
   display: none !important;
}

` );