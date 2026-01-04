// ==UserScript==
// @name        black
// @namespace   black
// @include      *://*
// @version     1.0
// @author      -
// @description 2020/9/1 上午11:16:40
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_openInTab
// @grant       GM_notification
// @grant       GM_getResourceURL
// @run-at      document-end
// @grant             GM_setValue
// @grant             GM_getValue




// @downloadURL https://update.greasyfork.org/scripts/418645/black.user.js
// @updateURL https://update.greasyfork.org/scripts/418645/black.meta.js
    // ==/UserScript==
GM_addStyle(`

html, img {
    filter: invert(0.889) hue-rotate(.5turn)
}
img {
    opacity: .75;    
}`)