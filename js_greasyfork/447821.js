// ==UserScript==
// @name         CFDD
// @namespace    LucXas
// @version      1.0
// @description  CurseForge Direct Download
// @author       LucXas
// @match        https://www.curseforge.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=curseforge.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447821/CFDD.user.js
// @updateURL https://update.greasyfork.org/scripts/447821/CFDD.meta.js
// ==/UserScript==
var l = location.href;
var b = document.getElementsByClassName('button');
if (l.match(/https:\/\/www\.curseforge\.com\/.*?\/download/g)) location.href = document.getElementsByClassName('alink underline')[0];
if (l.match(/https:\/\/www\.curseforge\.com\/.*?\/files/g)){
    for (var i = 1; i < b.length; i++) if (b[i].href.match(/.*?\/download\/[0-9]+/g)) b[i].href += "/file";
}