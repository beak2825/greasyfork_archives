// ==UserScript==
// @name        中国知网自动导出EndNote引用文件
// @namespace   https://www.baishujun.com
// @author      YUE Long
// @description   自动导出endnote格式引用文件，并关闭引用页面
// @include     https://*.cnki.net/KNS8/manage/export.html?*
// @version     1.0.1
// @grant       none
// @supportURL  https://www.baishujun.com/archives/7500.html
// @downloadURL https://update.greasyfork.org/scripts/417069/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%87%BAEndNote%E5%BC%95%E7%94%A8%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/417069/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E8%87%AA%E5%8A%A8%E5%AF%BC%E5%87%BAEndNote%E5%BC%95%E7%94%A8%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==



var myurl = window.location.href;
if (myurl.indexOf("kns.cnki.net") !== -1) {
        $("#litotxt").trigger("click");
    }
if (myurl.indexOf("epub.cnki.net") !== -1) {
        $(".save.txt").trigger("click");
    }
if (myurl.indexOf("search.cnki.net") !== -1) {
        $("#exportTxt").trigger("click");
    }

window.close();
