// ==UserScript==
// @name         假装自己是三级
// @namespace    https://linux.do
// @version      0.0.1
// @description  三级用户的图标我也要
// @author       DengDai
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491066/%E5%81%87%E8%A3%85%E8%87%AA%E5%B7%B1%E6%98%AF%E4%B8%89%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/491066/%E5%81%87%E8%A3%85%E8%87%AA%E5%B7%B1%E6%98%AF%E4%B8%89%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let username = document.getElementsByClassName("header-dropdown-toggle current-user")[0].querySelector("button").getAttribute("href").replace("/u/","").toLowerCase();
    let divs = document.getElementsByClassName("post-avatar");
    var level3_div = document.createElement("div");
    level3_div.className = "avatar-flair avatar-flair-trust_level_3 rounded avatar-flair-image";
    level3_div.style.backgroundImage = "url(https://cdn.linux.do/uploads/default/original/3X/9/d/9d8a9be47928b3e1a35aaf632f9eeafa32600765.png)";
    level3_div.style.backgroundColor = "#2e303d";
    level3_div.style.color = "#fff";
    level3_div.setAttribute("title", "trust_level_3");
    for (var i = 0; i < divs.length; i++) {
        var link = divs[i].getElementsByTagName("a")[0];
        var hrefValue = link.getAttribute("href").toLowerCase();
        // 检查href属性是否包含特定值
        if (hrefValue.includes(username)) {
            divs[i].appendChild(level3_div);
            console.log(hrefValue);
        }
    }

})();