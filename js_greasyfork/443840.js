// ==UserScript==
// @name BYPASS COUNTDOWN 2023 (+AD BLOCK)
// @namespace -
// @version 0.2.2
// @description bypass 5 second "loading" to access files. (also has ad block)
// @author NotYou
// @include *saveporn.net/*
// @include *xvideosdownloader.net/*
// @include *xnxxvideodownload.com/*
// @include *youporndownload.net/*
// @include *redtubedownload.com/*
// @include *tube8download.net/*
// @include *yesdownloader.com/*
// @include *pornhubmate.net/*
// @include *onlineporndownload.com/*
// @run-at document-idle
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/443840/BYPASS%20COUNTDOWN%202023%20%28%2BAD%20BLOCK%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443840/BYPASS%20COUNTDOWN%202023%20%28%2BAD%20BLOCK%29.meta.js
// ==/UserScript==

function addStyle (css) {
    var head = document.documentElement.children[0]
    head.insertAdjacentHTML('beforeend', '<style>' + css + '<style>')
}

addStyle('[href*="/itubego"], .itbrstk, .hint, #itfloater_wd, .itfloater, .error-msg { display: none !important; } .dlbtn { display: block !important; }')

if(location.pathname.indexOf('/sdownload/') !== -1) {
    location.replace(sAklj1)
}
