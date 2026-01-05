// ==UserScript==
// @name         ExHentai Bad Thumbnail Redirector
// @namespace    exhentai
// @include      http://exhentai.org/g/*
// @version      1
// @grant        none
// @run-at       document-end
// @author       Heika
// @description:zh-cn When fail to load thumbnails on exhentai, redirects it to somewhere else that makes you feel better.
// @description When fail to load thumbnails on exhentai, redirects it to somewhere else that makes you feel better.
// @downloadURL https://update.greasyfork.org/scripts/10616/ExHentai%20Bad%20Thumbnail%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/10616/ExHentai%20Bad%20Thumbnail%20Redirector.meta.js
// ==/UserScript==

var divs=document.getElementsByClassName("gdtm");
for(var i=0; i<divs.length; i++) {
    divs[i].firstChild.style.background=divs[i].firstChild.style.background.replace('85.17.73.31','ehgt.org/t')
}