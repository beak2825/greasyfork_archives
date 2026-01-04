// ==UserScript==
// @name         自动避开核心区
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  躲开垃圾的核心区，直入主题
// @author       Uncle
// @match        https://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404939/%E8%87%AA%E5%8A%A8%E9%81%BF%E5%BC%80%E6%A0%B8%E5%BF%83%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404939/%E8%87%AA%E5%8A%A8%E9%81%BF%E5%BC%80%E6%A0%B8%E5%BF%83%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = document.location.toString();
　　var arrUrl = url.split("&");
    if(document.getElementsByClassName("focus j_tbnav_tab")[0].innerText == "核心区"){
        //alert(arrUrl[0]+"&"+arrUrl[1]+"&" + "tab=main")
        self.location.href=arrUrl[0]+"&"+arrUrl[1]+"&" + "tab=main"
    }
    // Your code here...
})();