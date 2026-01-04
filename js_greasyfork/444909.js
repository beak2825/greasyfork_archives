// ==UserScript==
// @name         菜鸟教程书签
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便记住每一次学习的位置
// @author       You
// @match        https://www.runoob.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=runoob.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444909/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444909/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

function setting(b) {
    b.style.backgroundColor = "#96b97d";
    b.style.borderColor = "#96b97d";
    b.style.borderRadius = "10px";
    b.style.color = "#FFFFFF";
    b.style.fontFamily = "Trebuchet MS, Helvetica, sans-serif";
    b.style.position = "relative";
    b.style.align = "center";
}
(function () {
    'use strict';

    if (!localStorage.runTo) {
        localStorage.setItem("runTo", "null");
    }
    if (!localStorage.name) {
        localStorage.setItem("name", "null");
    }

    var test = document.getElementsByTagName('h1')[0];
    var bookmark = document.createElement('button');
    var target = document.createElement('button');
    var list = document.getElementsByTagName('a');

    setting(bookmark);
    bookmark.style.width = "50px";
    bookmark.style.height = "30px";
    bookmark.style.left = "300px";
    bookmark.style.bottom = "30px";
    bookmark.textContent = "Save";
    setting(target);
    target.style.width = "200px";
    target.style.height = "30px";
    target.style.left = "320px";
    target.style.bottom = "30px";
    target.textContent = "RUN TO: " + localStorage.name;
    bookmark.onclick = function () {
        var href;

        for (var i = 0; i < list.length; i++) {
            if (list[i].target == "_top") {
                if (list[i].style.backgroundColor) {
                    href = list[i].href;
                    console.log(list[i])
                    target.setAttribute("href", href);
                    target.textContent = "RUN TO: " + list[i].innerText;
                    localStorage.setItem("runTo", href);
                    localStorage.setItem("name", list[i].innerText);
                    //console.log(target);
                }
            }
        }
    }
    target.onclick = function () {
        //console.log(target.getAttribute("href"));
        window.location.href = localStorage.runTo;
    }

    test.appendChild(bookmark);
    test.appendChild(target);
    //Your code here...
})();