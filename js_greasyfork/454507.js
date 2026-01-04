// ==UserScript==
// @name         csdn文章无需关注即可阅读
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不用关注就可以阅读剩下的文章
// @author       WQ
// @match        *://*.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454507/csdn%E6%96%87%E7%AB%A0%E6%97%A0%E9%9C%80%E5%85%B3%E6%B3%A8%E5%8D%B3%E5%8F%AF%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/454507/csdn%E6%96%87%E7%AB%A0%E6%97%A0%E9%9C%80%E5%85%B3%E6%B3%A8%E5%8D%B3%E5%8F%AF%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let hidetitle = document.getElementsByClassName("hide-article-box")[0];
    let dispalyContent = document.getElementById("toolBarBox")
    let article_content = document.getElementById("article_content")

    //hidetitle.setAttribute("style","display:none;");
    hidetitle.style.display = "none"
    console.log(hidetitle)

    dispalyContent.classList.add("more-toolbox-active")
    console.log(dispalyContent)
    dispalyContent.style.position = "fixed"
    dispalyContent.style.zIndex = 996
    dispalyContent.style.left = " 450.5px"
    dispalyContent.style. bottom = "0px"
    dispalyContent.style. width = "1010px"
    article_content.style.removeProperty("height")
    article_content.style.removeProperty("overflow")

})();