// ==UserScript==
// @name         Spark Standalone Master App Proxy Fix
// @name:zh-CN   Spark Standalone Master 反向代理链接修复
// @namespace    https://rabit.pw/
// @version      0.2
// @description  Fix links to Spark jobs descriptions and nav bar in Spark Standalone Master when spark.ui.reverseProxy=true.
// @description:zh-CN 修复Spark Standalone模式中，启用了`spark.ui.reverseProxy=true`之后，在任务详情页面，任意链接点击后跳转回首页的问题。
// @author       ttimasdf
// @match        http://*/proxy/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392079/Spark%20Standalone%20Master%20App%20Proxy%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/392079/Spark%20Standalone%20Master%20App%20Proxy%20Fix.meta.js
// ==/UserScript==

// ref: https://stackoverflow.com/a/17599814/1043209
(function() {
    'use strict';

    var imgs = document.getElementsByTagName("img");//"/static/spark-logo-77x50px-hd.png"

    // Check whether this is Spark Master page
    for (var i = 0, found = false; i < imgs.length && i < 3; i++) {
        if (imgs[i].getAttribute("src") == "/static/spark-logo-77x50px-hd.png") {
            found = true;
        }
    }
    if (!found) return;

    // Extract links
    var links = Array.from(document.links);
    links.push.apply(links, document.getElementsByTagName("a"));
    // get link to current page and extract http://xxxx/proxy/app-xxxx part
    var root = /^.*proxy\/[^\/]*/.exec(window.location.href)[0];
    // console.log(links);

    var i;
    for (i = 0; i < links.length; i++ ) {
        var link = links[i].getAttribute('href');
        if (/^\/(?!proxy).+/.test(link)) {
            console.log(link, "=>", root + link);
            links[i].setAttribute("href", root + link);
        }
    }
})();
