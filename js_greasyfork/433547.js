// ==UserScript==
// @name         91porn视频直链获取，一键下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在91视频播放的下方添加m3u8下载直链
// @author       You
// @match        */view_video.php?viewkey**
// @icon         https://www.google.com/s2/favicons?domain=91porn.com
// @grant        none
// 借鉴:https://greasyfork.org/zh-CN/scripts/427514-91porn%E5%8E%BB%E5%B9%BF%E5%91%8A-%E6%94%AF%E6%8C%81%E5%BC%B9%E5%B9%95
// @downloadURL https://update.greasyfork.org/scripts/433547/91porn%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE%E8%8E%B7%E5%8F%96%EF%BC%8C%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433547/91porn%E8%A7%86%E9%A2%91%E7%9B%B4%E9%93%BE%E8%8E%B7%E5%8F%96%EF%BC%8C%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jm=strencode2(document.documentElement.outerHTML.split("document.write(strencode2(\"")[1].split("\"")[0]);
    var u = jm.split("<source src='")[1].split("'")[0];
    console.log(u)
    var a=document.createElement("a");
    a.text="m3u8文件下载链接："+u;
    a.setAttribute("href",u)
    document.getElementById("videodetails").appendChild(a);
})();