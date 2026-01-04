// ==UserScript==
// @name         去转盘网百度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于去除去转盘网需要登录才能查看下载链接，直接进行下载。
// @author       ZLOE
// @match        http://www.quzhuanpan.com/download*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372728/%E5%8E%BB%E8%BD%AC%E7%9B%98%E7%BD%91%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/372728/%E5%8E%BB%E8%BD%AC%E7%9B%98%E7%BD%91%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    var downurl = $(".btn-primary").attr("data-downloadurl");
    console.log(downurl);
    $(".btn-primary").after('<button style="border-radius: .25em;background-color: rgb(242, 246, 250);color:black;"><a class="btn btn-dark" href="'+downurl+'">下载</a></button>');
    $(".btn-primary").remove()

    // Your code here...
})();