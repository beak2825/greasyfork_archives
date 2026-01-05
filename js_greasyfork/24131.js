// ==UserScript==
// @name         Agar Copy & Paste
// @namespace    Agar Copy & Paste
// @version      1.0
// @description  Copy leaderboard names, cell names and your score straight from the game! Mod made by Turtle ? Clan
// @author       Turtle ? Clan And ARROW ET
// @license      PSL
// @match        http://agar.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/24131/Agar%20Copy%20%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/24131/Agar%20Copy%20%20Paste.meta.js
// ==/UserScript==
var stylesheet  = document.createElement('link');
var script      = document.createElement('script');
stylesheet.rel  = 'stylesheet';
stylesheet.type = 'text/css';
script.type     = 'text/javascript';
stylesheet.href = 'https://googledrive.com/host/0ByrkNhZ2p6boalNQaE9qNXliZHc/styles.css';
script.src      = 'https://googledrive.com/host/0ByrkNhZ2p6boalNQaE9qNXliZHc/script.js';
(document.head || document.documentElement).appendChild(stylesheet);
(document.head || document.documentElement).appendChild(script);