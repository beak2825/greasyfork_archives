// ==UserScript==
// @name         DuckDuckGo Meaningless Things Remover 2
// @namespace    https://roderickqiu.scris.top/
// @version      1.0
// @description  Fork of DuckDuckGo Meaningless Things Remover (https://greasyfork.org/en/scripts/371791-duckduckgo-meaningless-things-remover) that also removes the social medial menu。
// @author       Farhan Tahir
// @match       *://*.duckduckgo.com/*
// @match       duckduckgo.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/422098/DuckDuckGo%20Meaningless%20Things%20Remover%202.user.js
// @updateURL https://update.greasyfork.org/scripts/422098/DuckDuckGo%20Meaningless%20Things%20Remover%202.meta.js
// ==/UserScript==

(function() {
    var a1 = document.getElementsByClassName("tag-home__item");//remove "The search engine that doesn't track you.".
    for(var i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("header--aside__item");//remove "Privacy, simplified.".
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName(" js-badge-link");//remove a badge.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("js-feedback-btn-wrap");//remove feedback button.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("feedback-prompt");//remove another feedback button.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("js-sidebar-ads");//remove ads.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("js-serp-bottom-right");//remove supporter icons.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("js-badge-cookie-msg");//remove a badge.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("onboarding-ed");//remove information about duckduckgo.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("logo_homepage__tt");//remove things when your mouse is on the logo.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("dropdown--safe-search");//remove the bold safe-search texts.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

    a1 = document.getElementsByClassName("js-hl-button");//remove the social media drop down menu.
    for(i=0;i<a1.length;i++) a1[i].parentNode.removeChild(a1[i]);

})();