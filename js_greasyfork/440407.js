// ==UserScript==
// @name        Fantia Unblur Previews
// @description Remove blur from paid content thumbnails.
// @namespace   puic
// @include     https://fantia.jp/*
// @version     1.02
// @license     MIT
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440407/Fantia%20Unblur%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/440407/Fantia%20Unblur%20Previews.meta.js
// ==/UserScript==

GM_addStyle (`
    .overlay{
        display: none !important;
    }`);

GM_addStyle (`
    .img-blurred{
        filter: unset !important;
        -webkit-box-sizing: unset !important;
        -moz-box-sizing: unset !important;
        -o-filter: unset !important;
        -ms-filter: unset !important;
    }`);