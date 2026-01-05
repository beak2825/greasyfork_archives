// ==UserScript==
// @name        Webs Image Filter (safe version)
// @author      Cristo
// @namespace   mturkgrind
// @description Pre-set all Webs Image Filter images to OK/clean.
// @version     0.2.1c
// @grant       none
// @require     http://code.jquery.com/jquery-latest.min.js
// @match       https://imagefilter.heroku.com/*
// @match       https://imagefilter.herokuapp.com/*
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/4854/Webs%20Image%20Filter%20%28safe%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4854/Webs%20Image%20Filter%20%28safe%20version%29.meta.js
// ==/UserScript==

// modified by clickhappier to add requester-specific URL match

var elements = document.getElementsByTagName("input");
for (i = 0; i < elements.length; i++) {
    if (elements[i].value == "clean") {
        elements[i].click();
    }
}