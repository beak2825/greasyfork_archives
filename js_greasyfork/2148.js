// ==UserScript==
// @name           TODOIST anywhere for Gmail
// @author         >>YoGuRt<<
// @description    Starts Todoist anywhere in gmail
// @include        *mail.google.com/mail/u/0/*
// @include        *mail.google.com/mail/u/0/?pli=1*
// @grant          none
// @version        1.2
// @namespace https://greasyfork.org/users/2500
// @downloadURL https://update.greasyfork.org/scripts/2148/TODOIST%20anywhere%20for%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/2148/TODOIST%20anywhere%20for%20Gmail.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    javascript: (function() { var doc = top.document; if(top.js && top.js.document) doc = top.js.document; var script = doc.createElement('script'); doc.todoist_script = script; script.type = 'text/javascript'; script.src = 'https://todoist.com/anywhere/getJavaScript'; doc.getElementsByTagName('head')[0].appendChild(script); })(); void(0);
}, false);