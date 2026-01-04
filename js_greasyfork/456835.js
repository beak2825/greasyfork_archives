// ==UserScript==
// @name         bitmaggie auto claim
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto claim My channel is on Telegram https://t.me/Browsers_script
// @author       Wagner
// @match        https://bitmagge.com/*
// @icon         https://bitcaps.io/files/logo/logo_1662456428.png
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @grant        GM_openInTab
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/456835/bitmaggie%20auto%20claim.user.js
// @updateURL https://update.greasyfork.org/scripts/456835/bitmaggie%20auto%20claim.meta.js
// ==/UserScript==

var username = "xxxxxx"
var password = "xxxxxx" 
setTimeout (() => {
    if ( document.URL =="https://bitmagge.com/")
    { document.querySelector('a.nav-link.btn.btn-info.text-white').click()
    }},5000)
setInterval (() => {
    if ( document.querySelector('input[type="text"]') && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0)
    {document.querySelector('input[type="text"]').value = username
     document.querySelector('input[type="password"]').value = password
     document.querySelector('button.btn.btn-primary.btn-block.btn-lg').click()
    }},5000)
setInterval (() => {
if ( document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0)
{ document.querySelector('button.btn.btn-danger.btn-md.w-100.mt-2').click()
}},5000)
setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 60000);