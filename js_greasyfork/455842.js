// ==UserScript==
// @name         Color
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除灰色，恢复彩色
// @author       Joye-bot
// @license      GPL-3.0 License
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455842/Color.user.js
// @updateURL https://update.greasyfork.org/scripts/455842/Color.meta.js
// ==/UserScript==

(function () {
    'use strict';


    // Your code here...
    let style = document.createElement("style");
    style.innerHTML = "* {filter: none !important;}";
    document.head.appendChild(style);

    let url = window.location.href;

    // 去百度
    function remove_class(name) {
        let index = document.getElementsByClassName(name);
        for (let i = 0; i < index.length; i++) {
            index[i].classList.remove(name);
        }
    }

    remove_class('gray');
    remove_class('big-event-gray');

    if (url.match(/https:\/\/www.baidu.com\/$/)) {
        document.getElementById("s_lg_img").setAttribute("src", "https://www.baidu.com/img/flexible/logo/pc/index.png");
        document.getElementById("s_lg_img_new").setAttribute("src", "https://www.baidu.com/img/flexible/logo/pc/index.png");
        document.getElementById("su").style.setProperty("background-color", "#4e6ef2", "important");

        if (document.getElementsByClassName("index-logo-src").length === 1) {
            document.getElementsByClassName("index-logo-src")[0].setAttribute("src", "https://www.baidu.com/img/flexible/logo/pc/result.png");
            document.getElementsByClassName("index-logo-peak")[0].setAttribute("src", "https://www.baidu.com/img/flexible/logo/pc/result.png");
            document.getElementsByClassName("index-logo-srcnew")[0].setAttribute("src", "https://www.baidu.com/img/flexible/logo/pc/result.png");
        }
        if (document.getElementById("logo")) {
            document.getElementById("logo").getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src", "https://www.baidu.com/img/flexible/logo/logo_web.png");
        }
    }

    if (url.match(/https:\/\/m.baidu.com\/$/)) {
        document.getElementById("logo").getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src", "https://www.baidu.com/img/flexible/logo/logo_web.png");
    }

})();
