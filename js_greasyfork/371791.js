// ==UserScript==
// @name         DuckDuckGo Meaningless Things Remover
// @name:zh-CN         清爽的DuckDuckGo
// @namespace    https://roderickqiu.scris.top/
// @version      1.1.1.2
// @description  As we all know, there are things like "The search engine that doesn't track you" on DuckDuckGo, and I want to remove these things.
// @description:zh-CN         这个脚本可以删除DuckDuckGo上的那些烦人内容。
// @author       Roderick Qiu
// @match       *://*.duckduckgo.com/*
// @match       duckduckgo.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371791/DuckDuckGo%20Meaningless%20Things%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/371791/DuckDuckGo%20Meaningless%20Things%20Remover.meta.js
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

})();