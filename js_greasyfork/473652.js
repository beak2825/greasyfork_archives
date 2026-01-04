// ==UserScript==
// @name         白鸽烧烤
// @namespace    https://www.baidu.com/
// @version      1.2.4
// @description  中式烤乳鸽，缺材Q一下
// @author       莫语
// @match        https://campus.chinaunicom.cn/training/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @run-at document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473652/%E7%99%BD%E9%B8%BD%E7%83%A7%E7%83%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/473652/%E7%99%BD%E9%B8%BD%E7%83%A7%E7%83%A4.meta.js
// ==/UserScript==


let oldadd = EventTarget.prototype.addEventListener
EventTarget.prototype.addEventListener = function (...args) {
    if (window.onblur !== null) {
        window.onblur = null;
    }
    if (args.length !== 0 && args[0] === 'visibilitychange') {
        return;
    }
    if (args.length !== 0 && args[0] === 'fullscreenchange') {
        return;
    }
    if (args.length !== 0 && args[0] === 'pageshow') {
        return;
    }
    if (args.length !== 0 && args[0] === 'pagehide') {
        return;
    }
    if (args.length !== 0 && args[0] === 'orientationchange') {
        return;
    }
    if (args.length !== 0 && args[0] === 'focus') {
        return;
    }
    if (args.length !== 0 && args[0] === 'contextmenu') {
        return;
    }
    if (args.length !== 0 && args[0] === 'popstate') {
        return;
    }
    oldadd.call(this, ...args)
}

function init() {
    var blank = document.createElement("div");
    var root = document.getElementById("in-wrap")
    var btn = document.createElement("el-button");
    var refresh_btn = document.createElement("el-button");
    var blank_ul = document.createElement("ul");
    document.body.contentEditable = "true"

    btn.onclick = function () {
        Vision()
    }
    btn.style.marginRight = "10px";
    btn.style.position = "fixed";
    btn.style.height = "30px";
    btn.style.width = "30px";
    btn.style.right = 0;
    btn.style.bottom = 0;
    btn.style.fontSize = "1.5rem";
    btn.style.textAlign = "center"
    btn.innerText = "🤖";

    refresh_btn.onclick = function () {
        Refresh()
    }
    refresh_btn.style.marginRight = "10px";
    refresh_btn.style.position = "fixed";
    refresh_btn.style.height = "30px";
    refresh_btn.style.width = "30px";
    refresh_btn.style.right = "30px";
    refresh_btn.style.bottom = 0;
    refresh_btn.style.fontSize = "1.5rem";
    refresh_btn.style.textAlign = "center"
    refresh_btn.innerText = "👻";

    blank.id = "answer"
    blank.style.marginRight = "10px";
    blank.style.position = "fixed";
    blank.style.right = 0;
    blank.style.bottom = "25px";
    blank.style.height = "70vh"
    blank.style.width = "17vw"
    blank.style.visibility = 'hidden';

    blank_ul.id = 'answer_ul';
    blank_ul.style.overflow = 'auto';
    blank_ul.style.height = "70vh"
    blank_ul.style.width = "17vw"

    root.appendChild(blank)
    root.appendChild(btn)
    root.appendChild(refresh_btn)
    blank.appendChild(blank_ul)

    document.exitFullscreen();

}

window.onload = function () {
    window.addEventListener("keydown", function (e) {
        if (e.key === 'm') {
            init();
        }
    }, false)
}


function Vision() {
    let blank = document.getElementById("answer")
    if (blank.style.visibility === 'visible') {
        blank.style.visibility = 'hidden';
    } else {
        blank.style.visibility = 'visible';
        Refresh()

    }
}

function Refresh() {
    var Title = document.getElementsByClassName("Examination_item_title");
    let blank_ul = document.getElementById("answer_ul")
    RemoveChildren("answer_ul")
    Title.forEach(
        function (element) {
            let blank_li = document.createElement("li");
            let text = element.innerText.split("题 ")
            blank_li.innerText = text[text.length - 1]
            blank_li.style.border = '1px solid black'
            blank_li.onclick = function () {
                window.open("https://www.baidu.com/s?wd=" + this.innerText)
                this.innerText += "✅"
            }
            blank_ul.appendChild(blank_li)
        }
    )
}


function RemoveChildren(t) {
    let blank_ul = document.getElementById(t)
    let child = blank_ul.lastElementChild;
    while (child) {
        blank_ul.removeChild(child)
        child = blank_ul.lastElementChild
    }
}

