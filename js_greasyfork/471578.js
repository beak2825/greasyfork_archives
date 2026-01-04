// ==UserScript==
// @name        niconico (X)
// @namespace   https://rinsuki.net/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @connect     https://nicovideo.cdn.nimg.jp/web/img/base/head/icon/nico/*.gif
// @version     1.0
// @author      rinsuki
// @license     MIT
// @description https://www.nicovideo.jp/video_top
// @downloadURL https://update.greasyfork.org/scripts/471578/niconico%20%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471578/niconico%20%28X%29.meta.js
// ==/UserScript==

GM_xmlhttpRequest({
  url: `https://nicovideo.cdn.nimg.jp/web/img/base/head/icon/nico/${Math.floor(Math.random() * 1000).toString(10).padStart(3, "0")}.gif`,
  responseType: "blob",
  onload: response => {
    console.log(response)
    GM_addStyle(`header h1 > a[href="/home"] > div { background-size: 30px; background-position: center; background-repeat: no-repeat; background-image: url(${URL.createObjectURL(response.response)}) }`)
  }
})

GM_addStyle(`
header h1 > a[href="/home"] > div > svg { opacity: 0; }
`)