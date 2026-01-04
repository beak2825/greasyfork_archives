// ==UserScript==
// @name        腾讯课堂去水印,支持历史回放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  上课直播去水印，看历史回放也要去水印
// @author       kaka
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400399/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%8E%BB%E6%B0%B4%E5%8D%B0%2C%E6%94%AF%E6%8C%81%E5%8E%86%E5%8F%B2%E5%9B%9E%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/400399/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%8E%BB%E6%B0%B4%E5%8D%B0%2C%E6%94%AF%E6%8C%81%E5%8E%86%E5%8F%B2%E5%9B%9E%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
  var head = document.head
    var style = document.createElement("style")
    style.type = "text/css"
    var css = [
        "a[class*='marquee animation'],txpdiv[class*='player-inject'] {",
        "    display: none!important;",
        "}",
        "#x-tcp-container > txpdiv {",
        "    display: none!important;",
        "}",
         ].join("\n")
    var text = document.createTextNode(css)
    style.appendChild(text)
    head.appendChild(style)
    // Your code here...
})();