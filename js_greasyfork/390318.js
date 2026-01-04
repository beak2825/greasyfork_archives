// ==UserScript==
// @name         time.is font size
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match        https://time.is/just
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390318/timeis%20font%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/390318/timeis%20font%20size.meta.js
// ==/UserScript==

GM_addStyle(`
#twd {
  font-size: 150px !important;
}
`)