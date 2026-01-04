// ==UserScript==
// @name        X Twitter Old Icon Darkmode
// @namespace   https://drtaru.xyz/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @connect     https://i.imgur.com/yOg646V.png
// @version     1.0
// @author      DrTaru
// @license     MIT
// @description Changes the new dumb X icon back to the old twitter icon.
// @downloadURL https://update.greasyfork.org/scripts/471600/X%20Twitter%20Old%20Icon%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/471600/X%20Twitter%20Old%20Icon%20Darkmode.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
  url: `https://i.imgur.com/yOg646V.png`,
  responseType: "blob",
  onload: response => {
    console.log(response)
    GM_addStyle(`header h1 > a[href="/home"] > div { background-size: 30px; background-position: center; background-repeat: no-repeat; background-image: url(${URL.createObjectURL(response.response)}) }`)
  }
})

GM_addStyle(`
header h1 > a[href="/home"] > div > svg { opacity: 0; }
`)