// ==UserScript==
// @name           Auto Redirect to minecraft.wiki (NO FANDOM PAGE!)
// @name:zh        自动重定向到 minecraft.wiki（不要 FANDOM 页面！）
// @namespace      net.myitian.js.autoRedirect2MCWiki
// @version        0
// @license        Unlicensed
// @description    Redirect from minecraft.fandom.com to minecraft.wiki
// @description:zh 从 minecraft.fandom.com 重定向到 minecraft.wiki
// @author         Myitian
// @match          https://minecraft.fandom.com/*
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/487321/Auto%20Redirect%20to%20minecraftwiki%20%28NO%20FANDOM%20PAGE%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487321/Auto%20Redirect%20to%20minecraftwiki%20%28NO%20FANDOM%20PAGE%21%29.meta.js
// ==/UserScript==

var pathname = window.location.pathname;
var url_status = 0;
if (pathname.startsWith("/wiki/")) {
    url_status = 1;
} else {
    for (var i of ["/de/", "/es/", "/fr/", "/ko/", "/pt/", "/ru/", "/uk/", "/zh/"]) {
        if (pathname.startsWith(i)) {
            url_status = 2;
            break;
        }
    }
}
if (url_status) {
    var url = window.location.href.replace("minecraft.fandom.com/", "");
    switch (url_status) {
        case 1:
            url = url.replace("/wiki/", "/minecraft.wiki/w/");
            break;
        case 2:
            url = url.replace("/wiki/", ".minecraft.wiki/w/");
            break;
    }
    window.location = url;
}