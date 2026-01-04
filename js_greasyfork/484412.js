// ==UserScript==
// @name     驾校一点通
// @namespace    http://tampermonkey.net/
// @version  1.1.2
// @grant    none
// @description  通过按键作答
// @license MIT
// @match    https://mnks.jxedt.com/*
// @downloadURL https://update.greasyfork.org/scripts/484412/%E9%A9%BE%E6%A0%A1%E4%B8%80%E7%82%B9%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/484412/%E9%A9%BE%E6%A0%A1%E4%B8%80%E7%82%B9%E9%80%9A.meta.js
// ==/UserScript==

// 创建一个超链接
var link = document.createElement("a");
link.innerHTML = "下一项";

// 找到"div.crumbs"元素，并将超链接添加到它的内部
var crumbs = document.querySelector("div.crumbs");
crumbs.innerHTML += ' // ';
crumbs.appendChild(link);

// 定义一个处理函数，用于处理"+"键按下和超链接点击的事件
function nextExercise() {
    var url = window.location.href;
    var urlArray = url.split("/");
    var currentIndex = parseInt(urlArray[urlArray.length - 2]);
    if (!isNaN(currentIndex)) {
        var nextIndex = currentIndex + 1;
        urlArray[urlArray.length - 2] = nextIndex;
        var newUrl = urlArray.join("/");
        link.href = newUrl;
        link.click();
    }
}

// 为超链接添加超链接事件的处理函数
link.addEventListener('click', nextExercise);

window.addEventListener('keydown', function(e) {
    let options = document.querySelectorAll('.option');
    let submitButton = document.querySelector('.button');
    let prevButton = document.querySelector('.prev');
    let nextButton = document.querySelector('.next');

    switch(e.key) {
        case '1':
            options[0]?.click();
            break;
        case '2':
            options[1]?.click();
            break;
        case '3':
            options[2]?.click();
            break;
        case '4':
            options[3]?.click();
            break;
        case '5':
            options[4]?.click();
            break;
        case '0':
            submitButton?.click();
            break;
        case 'ArrowLeft':
            prevButton?.click();
            break;
        case 'ArrowRight':
            nextButton?.click();
            break;
        // 按下"+"键，自动触发超链接的点击事件
        case '+':
            nextExercise();
            break;
        default:
            break;
    }
});