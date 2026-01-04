// ==UserScript==
// @name         Wintergreen Market
// @match        *://krunker.io/social.html*
// @grant        GM_addStyle
// @version      0.0.1
// @description  none
// @grant        GM_xmlhttpRequest
// @connect      githubusercontent.com
// @run-at       document-start
// @namespace https://greasyfork.org/users/729337
// @downloadURL https://update.greasyfork.org/scripts/421612/Wintergreen%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/421612/Wintergreen%20Market.meta.js
// ==/UserScript==

const customCssLink = "https://raw.githubusercontent.com/LostDino/loldino.github.io/master/css/social/Wintergreen.css" // LINK HERE

GM_xmlhttpRequest({
    method: "GET",
    url: customCssLink,
    onload: (res) => {
        GM_addStyle(res.responseText)
    }
})