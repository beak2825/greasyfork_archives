// ==UserScript==
// @name         Bigger Thumbnails For Naver News Search
// @version      0.3
// @description  Bigger Thumbnails For Naver News Search.
// @author       Sungmin KIM
// @match        https://search.naver.com/search.naver
// @match        https://m.search.naver.com/search.naver
// @grant        GM_addStyle
// @run-at       document-start
// @namespace https://greasyfork.org/users/397149
// @downloadURL https://update.greasyfork.org/scripts/435667/Bigger%20Thumbnails%20For%20Naver%20News%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/435667/Bigger%20Thumbnails%20For%20Naver%20News%20Search.meta.js
// ==/UserScript==

GM_addStyle(`
.sp_nnews .news_wrap .dsc_thumb {
  width: unset !important;
  height: unset !important;
}

img.thumb {
  width: unset !important;
  height: unset !important;
}

img.thumb.api_get {
  width: unset !important;
  height: unset !important;
}
`);