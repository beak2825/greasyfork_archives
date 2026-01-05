// ==UserScript==
// @name         foxebook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动更改foxebook（免费电子书下载站）的下载链接，去掉广告跳转，直接到网盘页
// @author       tl
// @match        http://www.foxebook.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26393/foxebook.user.js
// @updateURL https://update.greasyfork.org/scripts/26393/foxebook.meta.js
// ==/UserScript==

var dl = $('.table-hover a');
var i;
for (i = 0; i < dl.length; i++) {
    var s = dl[i].href;
    dl[i].href = 'http' + s.split('http')[2];
}
