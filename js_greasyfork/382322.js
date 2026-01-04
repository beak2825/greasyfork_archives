// ==UserScript==
// @name 把 Google 搜尋 偽裝成 百度
// @namespace linnil1
// @description 把 Google 搜尋 替換成 百度，讓看你螢幕的人知道 牆內的美好, Inspired by some reason.
// @author linnil1
// @license MIT
// @date 2018-04-29
// @version 2019.04.28
// @match *://www.google.com/*
// @match *://www.google.com.hk/*
// @match *://www.google.com.tw/*
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/382322/%E6%8A%8A%20Google%20%E6%90%9C%E5%B0%8B%20%E5%81%BD%E8%A3%9D%E6%88%90%20%E7%99%BE%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/382322/%E6%8A%8A%20Google%20%E6%90%9C%E5%B0%8B%20%E5%81%BD%E8%A3%9D%E6%88%90%20%E7%99%BE%E5%BA%A6.meta.js
// ==/UserScript==


(function () {
    const baidu_url = "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png";
    const baidu_word = "百度";
    const baidu_favicon = "https://www.baidu.com/favicon.ico";

    // Find logo element
    var logo = document.getElementById("hplogo") || document.getElementById("logo");
    if (logo.tagName.toLowerCase() !== "img") {
        logo = logo.querySelector("img");
    }

    // Fail
    if (logo === null) {
        console.log("偽裝失敗 QQ，請通知開發者更新");
        return;
    }

    // Change Image
    logo.src = logo.srcset = baidu_url;

    // Change Title and Bar
    document.title = document.title.replace("Google", baidu_word);
    document.querySelectorAll("*[value*='Google']").forEach( a => a.value = a.value.replace("Google", baidu_word));

    // Change Favicon
    var link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = baidu_favicon;
    document.getElementsByTagName('head')[0].appendChild(link);
})();