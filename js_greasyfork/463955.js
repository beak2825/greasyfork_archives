// ==UserScript==
// @name         NikeTV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       晚枫QQ237832960
// @description  一键复制影评全文
// @license      Creative Commons
// @match        https://www.ajeee.com/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463955/NikeTV.user.js
// @updateURL https://update.greasyfork.org/scripts/463955/NikeTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // z-index:1 防止全屏下显示按钮，

    var div = document.createElement("a")
    div.innerHTML = "解析"
    div.style.cssText="color: white;\n" +
        "    text-decoration: none;\n" +
        "    width: 150px;\n" +
        "    height: 40px;\n" +
        "    line-height: 40px;\n" +
        "    text-align: center;\n" +
        "    background: transparent;\n" +
        "    border: 1px solid #d2691e;\n" +
        "    font-family: Microsoft soft;\n" +
        "    border-radius: 3px;\n" +
        "    color:#ff7f50;\n" +
        "    position: fixed;\n" +
        "    top: 50%;\n" +
        "    z-index:999;\n" +
        "    left: 13%;\n" +
        "    cursor: pointer;"
    div.setAttribute("href",document.getElementsByTagName('iframe')[2].src,"target","_blank")
    div.setAttribute("target","_blank")
    document.body.appendChild(div)

    })();