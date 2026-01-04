// ==UserScript==
// @name         Youtube Videos Publishing Date
// @namespace    https://tampermonkey.net/
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @version      1.2
// @description  Fix Youtube video's publishing date
// @author       AlejandroT97
// @include       *://*youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/423791/Youtube%20Videos%20Publishing%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/423791/Youtube%20Videos%20Publishing%20Date.meta.js
// ==/UserScript==

/* eslint-disable */

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector('#info-strings')) {
        observer.disconnect();
        $("[id=info-strings]").remove().insertAfter($("[id=owner-sub-count]"));
        $("[id=info-strings]").find("span").remove();
        $("[id=info-strings]").css('font-size','-=2')
    }
}