// ==UserScript==
// @name         Forced zh-TW for translate.google
// @namespace    https://greasyfork.org/zh-TW/scripts/399503-forced-setting-zh-tw-for-asian-languages-of-translate-google
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Force setting Traditional Chinese as the target language, reject Simplified Chinese
// @author       You
// @match        translate.google.com/*
// @match        translate.google.com.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399503/Forced%20zh-TW%20for%20translategoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/399503/Forced%20zh-TW%20for%20translategoogle.meta.js
// ==/UserScript==

chkLang()

window.onclick = function() {chkLang()}

function chkLang() {
    const cURL = new URL(window.location.href)
    if (cURL.href.search("tl=zh-CN") != -1) {
        cURL.href = cURL.href.replace(/tl=zh-CN/g,"tl=zh-TW")
        window.location.href = cURL.href
        //location.replace(cURL.href)
        location.reload()
    }
}