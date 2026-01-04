// ==UserScript==
// @name         Gpop Download Level
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  adds download button to gpop levels
// @author       Commensalism
// @match        http*://gpop.io/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gpop.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530302/Gpop%20Download%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/530302/Gpop%20Download%20Level.meta.js
// ==/UserScript==

setTimeout(function() {
    let script = document.head.innerHTML.replace(/[\S\s]*"notes":(\[[\S\s]*\]),"minleaderboard"[\S\s]*/g, "$1")
    let link = document.createElement("a")
    document.querySelector(".playpage-left-date").after(link)
    link.outerHTML = `<a download="level.gpop" href="data:text/plain;charset=utf-8,${encodeURIComponent(script)}" class="gbutton playpage-comment-submit">DOWNLOAD</a>`
}, 1000);