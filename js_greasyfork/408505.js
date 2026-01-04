// ==UserScript==
// @name     Mangakakalot Image Max Width/Height
// @description Reduces the max width and height of pictures on mangakakalot
// @author   xav0989
// @version  1.1
// @include  /^https?:\/\/(?:www\.)?(mangakakalot\.com|manganelo\.com)\/chapter\/(?:.*)\/(?:.*)$/
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require  https://code.jquery.com/jquery-3.3.1.js
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/674818
// @downloadURL https://update.greasyfork.org/scripts/408505/Mangakakalot%20Image%20Max%20WidthHeight.user.js
// @updateURL https://update.greasyfork.org/scripts/408505/Mangakakalot%20Image%20Max%20WidthHeight.meta.js
// ==/UserScript==

GM_addStyle(`
.vung-doc {
  margin: auto;
  max-width: 980px;
}

.vung-doc img {
  max-height: 900px;
}
`);