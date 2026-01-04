// ==UserScript==
// @name         Geekhub scrollTop
// @namespace    http://wenyi.me
// @version      0.4
// @description  Geekhub 返回顶部
// @author       SeaMonster
// @match        https://*.geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402306/Geekhub%20scrollTop.user.js
// @updateURL https://update.greasyfork.org/scripts/402306/Geekhub%20scrollTop.meta.js
// ==/UserScript==

try {
    var body = document.body;
    var div = document.createElement("div");
    div.id = "myBtn";
    div.setAttribute("style",
        "display: none;position: fixed;bottom: 160px;right: 50px;z-index: 99; outline: none;background-color: #fff;color: #333;cursor: pointer;border-radius: 10px;box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);"
    );
    div.innerHTML = '<button onclick="topFunction()" style="padding: 15px;" id="myBtn" title="回顶部">Top</button>';
    body.appendChild(div);
} catch (e) {
    console.log("scroll Error");
}
// 当网页向下滑动 300px 出现"返回顶部" 按钮
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    console.log(121);
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}
// 点击按钮，返回顶部
window.topFunction = function topFunction() {
    (function smoothscroll() {
        var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
        if (currentScroll > 0) {
            window.requestAnimationFrame(smoothscroll);
            window.scrollTo(0, currentScroll - (currentScroll / 5));
        }
    })();
}