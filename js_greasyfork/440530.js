// @license MIT
// ==UserScript==
// @name        sourceforge.net 下载加速（中国）
// @description 在sourceforge.net直接显示下载连接并替换为国内镜像进行加速
// @namespace   czyt
// @include     http*://sourceforge.net/*/files/*
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/440530/sourceforgenet%20%E4%B8%8B%E8%BD%BD%E5%8A%A0%E9%80%9F%EF%BC%88%E4%B8%AD%E5%9B%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/440530/sourceforgenet%20%E4%B8%8B%E8%BD%BD%E5%8A%A0%E9%80%9F%EF%BC%88%E4%B8%AD%E5%9B%BD%EF%BC%89.meta.js
// ==/UserScript==

var href, links = document.querySelectorAll('a[href$="/download"]');
var mirrorHost = 'hole.czyt.tech/magic/https/udomain.dl.sourceforge.net/sourceforge/';

for (var i = 0, l = links.length; i < l; i++) {
    href = links[i].getAttribute("href").replace("sourceforge.net/projects/", mirrorHost).replace("/files/", "/").replace(/\/download$/, "");
    links[i].setAttribute("href", href);
}