// ==UserScript==
// @name 🔥【就是爽】某度盘视频跳转(自动跳转)-不需安装UA agent....看网课专用！
// @namespace http://tampermonkey.net/
// @match https://pan.baidu.com/
// @match https://pan.baidu.com/*
// @exclude       *://pan.baidu.com/disk/*
// @version 0.2
// @description 直接上效果图,见下面........(2020122修改-适应了新链接)自动将百度网盘视频链接从play转换为pfile，方便下载。支持新的视频链接格式。(比如https://pan.baidu.com/play/video?_at_=1705936554287#/video?path=xxxxx.mp4&t=-1)
// @author   Yolanda Morgan
// @license  Yolanda Morgan
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/491514/%F0%9F%94%A5%E3%80%90%E5%B0%B1%E6%98%AF%E7%88%BD%E3%80%91%E6%9F%90%E5%BA%A6%E7%9B%98%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC%28%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%29-%E4%B8%8D%E9%9C%80%E5%AE%89%E8%A3%85UA%20agent%E7%9C%8B%E7%BD%91%E8%AF%BE%E4%B8%93%E7%94%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/491514/%F0%9F%94%A5%E3%80%90%E5%B0%B1%E6%98%AF%E7%88%BD%E3%80%91%E6%9F%90%E5%BA%A6%E7%9B%98%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BD%AC%28%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%29-%E4%B8%8D%E9%9C%80%E5%AE%89%E8%A3%85UA%20agent%E7%9C%8B%E7%BD%91%E8%AF%BE%E4%B8%93%E7%94%A8%EF%BC%81.meta.js
// ==/UserScript==

(function() {
'use strict';

//如果是play，跳转到pfile
if (window.location.href.startsWith("https://pan.baidu.com/play/video#/video?path")) {
var url = window.location.href;
var newUrl = url.replace("/play/video#", "/pfile");
window.location.href = newUrl;
} else if (window.location.href.startsWith("https://pan.baidu.com/play")) { // 新的视频链接格式
    var urla = window.location.href;
    var pathIndex = urla.indexOf("path=") + 5;
    var tIndex = urla.indexOf("t=") + 2;

    var path = urla.substring(pathIndex, urla.indexOf("&", pathIndex));
    var t = urla.substring(tIndex, urla.length);

    var newUrla = "https://pan.baidu.com/pfile/video?path=" + path + "&t=" + t;

    window.location.href = newUrla;
}
})();