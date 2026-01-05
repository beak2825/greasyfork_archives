// ==UserScript==
// @name         Agar Copy i Paste
// @namespace    Agar Copy i Paste
// @version      1.0
// @description  Kopirajte imena igrača u Agaru,trollujte ih kada ih teammate slučajno pojede.
// @author       Dzemo Dzinic
// @license      PSL
// @match        http://agar.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/22251/Agar%20Copy%20i%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/22251/Agar%20Copy%20i%20Paste.meta.js
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