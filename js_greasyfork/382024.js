// ==UserScript==
// @name Firefox local auto-redirection fix
// @namespace Local
// @description A script for fixing the auto-redirection defined in local files in firefox
// @match file:///*
// @grant none
// @author SinTan
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/385244/Firefox%20local%20auto-redirection%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/385244/Firefox%20local%20auto-redirection%20fix.meta.js
// ==/UserScript==
window.location.href=document.getElementsByTagName("a")[0].href