// ==UserScript==
// @name         恢复灰色网页原始色彩
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  恢复灰色网页原始色彩。
// @author       周怡
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license 周怡
// @downloadURL https://update.greasyfork.org/scripts/455846/%E6%81%A2%E5%A4%8D%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E5%8E%9F%E5%A7%8B%E8%89%B2%E5%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/455846/%E6%81%A2%E5%A4%8D%E7%81%B0%E8%89%B2%E7%BD%91%E9%A1%B5%E5%8E%9F%E5%A7%8B%E8%89%B2%E5%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("去除灰色")
    //通用去除灰色"
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = "html{filter: none!important;}";
    window.document.head.appendChild(style);


    //去除百度灰色
    let c = document.body.getAttribute("class")
    if (c) {
        c = c.replaceAll("big-event-gray", " ")
        document.body.removeAttribute("class")
        document.body.setAttribute("class", c) 
    }
    let c2 = document.documentElement.getAttribute("class")
    if (c2) {
        c2 = c2.replaceAll("big-event-gray", " ")
        document.documentElement.removeAttribute("class")
        document.documentElement.setAttribute("class", c2) 
    }

})();