// ==UserScript==
// @name        Microsoft MSDN in Inglese
// @description Microsoft MSDN from it-IT to en-US
// @match     https://*.microsoft.com/it-it/*
// @version     1.1
// @grant       none
// @run-at document-start
// @namespace https://msdn.microsoft.com/it-it/
// @downloadURL https://update.greasyfork.org/scripts/39417/Microsoft%20MSDN%20in%20Inglese.user.js
// @updateURL https://update.greasyfork.org/scripts/39417/Microsoft%20MSDN%20in%20Inglese.meta.js
// ==/UserScript==

var url_old, url_new;

url_old = window.location.href;
url_new = url_old.replace("/it-it", "/en-US");
url_new = url_new.replace("/it-IT", "/en-US");
window.location.replace(url_new);