// ==UserScript==
// @name Block Amazon Xray
// @namespace https://github.com/kerfufflev2
// @author Kerfuffle
// @description Hide the Amazon Xray elements when playing Prime video.
// @include https://*.amazon.tld/gp/video/detail/*
// @include http://*.amazon.tld/gp/video/detail/*
// @grant GM_addStyle
// @version 0.0.1.20190415143722
// @downloadURL https://update.greasyfork.org/scripts/381853/Block%20Amazon%20Xray.user.js
// @updateURL https://update.greasyfork.org/scripts/381853/Block%20Amazon%20Xray.meta.js
// ==/UserScript==

GM_addStyle('.webPlayer .xrayQuickView { display: none !important; }')