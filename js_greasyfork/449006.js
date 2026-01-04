// ==UserScript==
// @name         EH移动优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  仅自用
// @author       HTT
// @license      MIT
// @match        https://e-hentai.org/
// @match        https://e-hentai.org/?page=*
// @match        https://e-hentai.org/?f_search=*
// @match        https://e-hentai.org/tag/*
// @match        https://e-hentai.org/uploader*
// @match        https://e-hentai.org/watched
// @match        https://e-hentai.org/popular
// @match        https://exhentai.org/
// @match        https://exhentai.org/?page=*
// @match        https://exhentai.org/?f_search=*
// @match        https://exhentai.org/tag/*
// @match        https://exhentai.org/uploader*
// @match        https://exhentai.org/watched
// @match        https://exhentai.org/popular
// @icon         https://www.google.com/s2/favicons?domain=exhentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449006/EH%E7%A7%BB%E5%8A%A8%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/449006/EH%E7%A7%BB%E5%8A%A8%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
for(var i = 0;i < 26;i++){
    document.getElementsByClassName("glhide").item(i).style.display = 'none';
}

for(var i = 0;i < 25;i++){
    document.getElementsByClassName("gl3c glname").item(i).height = 90;
    document.getElementsByClassName("glink").item(i).style.fontSize = "28px";
    document.getElementsByClassName("gl3c glname").item(0).children[0].target = "_blank";
}

for(var i = 0;i<document.getElementsByClassName("gt").length;i++){
    document.getElementsByClassName("gt").item(i).style.fontSize = "22px";
}
    // Your code here...
})();