// ==UserScript==
// @name         清华大学网络学堂挂机免重登
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  网络学堂后台挂着也不会被让重登了
// @author       ImaginingFog
// @match        https://learn.tsinghua.edu.cn/f/wlxt/*
// @exclude      https://learn.tsinghua.edu.cn/f/wlxt/index/course/student/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsinghua.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444728/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E6%8C%82%E6%9C%BA%E5%85%8D%E9%87%8D%E7%99%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/444728/%E6%B8%85%E5%8D%8E%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E5%AD%A6%E5%A0%82%E6%8C%82%E6%9C%BA%E5%85%8D%E9%87%8D%E7%99%BB.meta.js
// ==/UserScript==
function repeat() {
    location.reload();
    //alert('已刷新！');
}

(function () {
    'use strict';
    if (!localStorage.Open) {
        localStorage.setItem("Open", "0");
    }
    var button = document.createElement("button");
    button.id = "reload";
    if (parseInt(localStorage.Open)) {
        button.textContent = "已开启免重登";
        button.style.backgroundColor = "#48CA70";
    } else {
        button.textContent = "未开启免重登";
        button.style.backgroundColor = "#F4C300";
    }
    button.style.width = "110px";
    button.style.height = "30px";
    button.style.align = "center";
    button.style.borderColor = "#FFFFFF";
    button.style.color = "#FFFFFF";
    button.style.position = "relative";
    if (!document.getElementsByClassName("fa webicon-en")[0]) {
        button.style.left = "250px";
        button.style.top = "20px";
    } else {
        button.style.left = "400px";
        button.style.top = "20px";
    }
    button.onclick = function () {
        var Open = parseInt(localStorage.Open);//获取之前的状态
        if (!Open) {
            localStorage.setItem("Open", "1");
            button.textContent = "请手动刷新一下";
            button.style.backgroundColor = "#1393F1";
            button.disabled = "disabled";
        } else {
            localStorage.setItem("Open", "0");
            button.textContent = "请手动刷新一下";
            button.style.backgroundColor = "#1393F1";
            button.disabled = "disabled";
        }
    }
    button.onmouseover = function () {
        button.style.cursor = "pointer";
        if (parseInt(localStorage.Open)) {
            button.style.backgroundColor = "#459548";
        } else {
            button.style.backgroundColor = "#F39C00";
        }
    }
    button.onmouseout = function () {
        if (parseInt(localStorage.Open)) {
            button.style.backgroundColor = "#48CA70";
        } else {
            button.style.backgroundColor = "#F4C300";
        }
    }
    var newOpen = parseInt(localStorage.Open);
    if (newOpen) setTimeout(function () { repeat() }, 840000);//修改刷新间隔时间，毫秒为单位,14min（改小了一分钟，因为好像是15min就检测长时间未登录）
    var location = document.getElementsByClassName("w")[0];
    location.appendChild(button);
    //console.log(location);
})();