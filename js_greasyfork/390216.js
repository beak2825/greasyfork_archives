// ==UserScript==
// @name         琉璃神社自动生成链接
// @namespace    https://greasyfork.org/zh-CN/users/12293-wcx19911123
// @version      1.0
// @description  try to take over the world!
// @author       wcx19911123
// @include      *www.liuli.*/wp/*
// @include      *www.hacg.*/wp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/390216/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/390216/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    var body = document.getElementsByTagName("body")[0];
    var strList = new Set([...(body.innerHTML.match(/(?<![0-9a-z])[0-9a-z]{32,40}(?![0-9a-z])/ig) || [])]);
    for(var i of strList){
        body.innerHTML = body.innerHTML.replace(i, "<a href='magnet:?xt=urn:btih:"+i+"'>下载链接</a>")
    }
})();