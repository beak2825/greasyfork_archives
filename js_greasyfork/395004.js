// ==UserScript==
// @name         CSDN论坛屏蔽天下第二的帖子以及回复
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       大西瓜一块五一斤
// @match        https://bbs.csdn.net*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395004/CSDN%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E5%A4%A9%E4%B8%8B%E7%AC%AC%E4%BA%8C%E7%9A%84%E5%B8%96%E5%AD%90%E4%BB%A5%E5%8F%8A%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395004/CSDN%E8%AE%BA%E5%9D%9B%E5%B1%8F%E8%94%BD%E5%A4%A9%E4%B8%8B%E7%AC%AC%E4%BA%8C%E7%9A%84%E5%B8%96%E5%AD%90%E4%BB%A5%E5%8F%8A%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    var authors = document.getElementsByClassName("forums_author");
    var worldSecond = 'https://my.csdn.net/BlueGuy__';
    for (var j = 0; j < authors.length; j++) {
        if (authors[j].children[0].href == worldSecond) {
            authors[j].parentElement.style.display = "none";
        }
    }
    //增加论坛首页热帖屏蔽
    authors = document.getElementsByClassName("questioner");
    for (j = 0; j < authors.length; j++) {
        if (authors[j].href == worldSecond) {
            authors[j].parentElement.style.display = "none";
        }
    }
    //增加帖子回复屏蔽
    var answerers = document.getElementsByClassName("topic_r");
    for (j = 0; j < answerers.length; j++) {
        if (answerers[j].getAttribute("data-username") == 'BlueGuy__') {
            answerers[j].parentElement.style.display = "none";
        }
    }

    //增加我回复的帖子里的屏蔽
    authors = document.getElementsByTagName("tr");
    for (j = 0; j < authors.length; j++) {
        if (authors[j].children[2].innerHTML.indexOf("my.csdn.net/BlueGuy__") > -1) {
            authors[j].children[2].parentElement.style.display = "none";
        }
    }

})();