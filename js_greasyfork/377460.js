// ==UserScript==
// @name           Mailto to Outlook.com
// @version        1.0
// @namespace      https://www.reddit.com/user/Luke-Baker/
// @author         Luke Baker
// @description    Makes mailto: links work with Outlook.com
// @include        http*://*
// @grant          none
// @license        http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/377460/Mailto%20to%20Outlookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/377460/Mailto%20to%20Outlookcom.meta.js
// ==/UserScript==

var mailtos = document.querySelectorAll('a[href^="mailto:"]');
if (mailtos) {
    for (i = 0, j = mailtos.length; i < j; i++) {
    var adr = mailtos[i].href.slice(7);
    mailtos[i].href = "https://outlook.live.com/default.aspx?rru=compose&to="+adr;
    }
}