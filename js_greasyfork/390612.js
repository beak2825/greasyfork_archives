// ==UserScript==
// @name         Mac-Torrent-Download Auto Torrent Downloader
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  mtd auto accept
// @match        https://mac-torrent-download.net/*
// @author       eren aksoy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390612/Mac-Torrent-Download%20Auto%20Torrent%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/390612/Mac-Torrent-Download%20Auto%20Torrent%20Downloader.meta.js
// ==/UserScript==

var link = document.querySelector('[href*="/download/"]');
link.click();
document.getElementById("dlbt").onclick();