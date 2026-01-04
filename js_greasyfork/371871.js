// ==UserScript==
// @name thu.mb图转大图
// @namespace thumb2org
// @version 0.5
// @description 打开某些图库的缩略图时自动转换成大图
// @author eggfree
// @runat document-start
// @grant none
// @match *://img599.com/*/*.th.jpg
// @match *://img599.net/*/*.th.jpg
// @match *://dioimg.net/*/*.th.jpg
// @match *://kccdk.com/*/*.md.jpg
// @match *://i3.imagexport.com/th/*/*.jpg
// @match *://i3.imagetwist.com/th/*/*.jpg

// @changelog 0.1 - 首发版，支持img599.com 图库
// @changelog 0.2 - 添加 dioimg.net 支持
// @changelog 0.3 - 添加判断和对 kccdk.com 支持
// @changelog 0.4 - 添加对 imagexport.com 和 imagetwist.com 支持
// @changelog 0.5 - 发现部分图库有不同的后缀，对此作出修改
// @downloadURL https://update.greasyfork.org/scripts/371871/thumb%E5%9B%BE%E8%BD%AC%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/371871/thumb%E5%9B%BE%E8%BD%AC%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==

'use strict';

var localURL = window.location.href;
var newURL = "";

if ((localURL.indexOf("img599.") >= 0) || (localURL.indexOf("dioimg.net") >= 0)) {
    var newURL = localURL.replace(".th.jpg", ".jpg");
}
if (localURL.indexOf("kccdk.com") >= 0) {
    var newURL = localURL.replace("thumbs/", "").replace(".md.jpg", ".jpeg");
}
if ((localURL.indexOf("imagexport.com") >= 0) || (localURL.indexOf("imagetwist.com") >= 0)) {
    var newURL = localURL.replace("/th/", "/i/") + "/l.jpg"
}
window.location.href = newURL;