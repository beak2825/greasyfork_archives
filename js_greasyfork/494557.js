// ==UserScript==
// @name         SourceForge加速
// @namespace    https://greasyfork.org/zh-CN/scripts/494557
// @version      1.0
// @description  在sourceforge.net替换为国内镜像进行加速
// @author       木槿之
// @supportURL   https://github.com/JunHao2021/SourceForge-hasten
// @match        http*://sourceforge.net/*/files/*
// @icon         https://a.fsdn.com/allura/p/forge/icon?w=180&1515522845
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/494557/SourceForge%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/494557/SourceForge%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

var href, links = document.querySelectorAll('a[href$="/download"]');
var mirrorHost = 'liquidtelecom.dl.sourceforge.net/project/';

for (var i = 0, l = links.length; i < l; i++) {
    href = links[i].getAttribute("href").replace("sourceforge.net/projects/", mirrorHost).replace("/files/", "/").replace(/\/download$/, "");
    links[i].setAttribute("href", href);
}