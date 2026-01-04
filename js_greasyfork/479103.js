// ==UserScript==
// @name         996dm广告去除
// @namespace    rm -sf /xx6-adv
// @version      1.1
// @description  去除996dm广告
// @author       Ceale
// @match        *://*.*dm.com/*
// @include      *://*.*dm.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=956dm.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479103/996dm%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/479103/996dm%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
divz {
display: none !important;
}
#hm_cpm_show {
display: none !important;
}
    `)
    window.onload = function(){
    document.querySelector(`divz`).remove()
    document.querySelector(`#hm_cpm_show`).remove()
    document.querySelector(`body>style`).remove()
    }
})();