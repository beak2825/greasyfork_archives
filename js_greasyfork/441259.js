// ==UserScript==
// @name         开发助手-添加边框
// @namespace    http://tampermonkey.net/SRworks
// @version      0.1.4
// @description  开发时。给网页元素添加阴影。看到div的宽高。
// @author       侠客s
// @match        http://localhost/*
// @match        http://localhost*
// @match        http://127.0.0.1*
// @match        http://127.0.0.1/*
// @icon         https://img1.baidu.com/it/u=3500124600,200769604&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441259/%E5%BC%80%E5%8F%91%E5%8A%A9%E6%89%8B-%E6%B7%BB%E5%8A%A0%E8%BE%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/441259/%E5%BC%80%E5%8F%91%E5%8A%A9%E6%89%8B-%E6%B7%BB%E5%8A%A0%E8%BE%B9%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
const style = document.createElement("style");
style.type = "text/css";
const text = document.createTextNode("div { box-shadow: 2px 4px 8px gray; }");
style.appendChild(text);
const head = document.getElementsByTagName("head")[0];
head.appendChild(style);

function pressShow() {
    head.appendChild(style);
    div.innerText = "隐藏";

    Switch++;
}
function pressHidden() {
    head.removeChild(style)
    div.innerText = "显示";

    Switch++;
}
const div = document.createElement("button");
div.innerText = "显示";
document.body.appendChild(div);
div.style.width = "5rem";
div.style.height = "2rem";
div.style.cursor = "pointer";
div.style.background = "rgba(255, 99, 71)";
div.style.opacity = .4;
div.style.borderRadius = "10%";
div.style.position = "absolute";
div.style.top = "0";
div.style.fontSize = "1rem";
div.style.fontWeight = "800";
div.style.color = "#fff";
let Switch = 0;
div.addEventListener("click", (el) => {
  if (Switch % 2 == 0) {
    pressShow()
  } else {
    pressHidden()
  }
});

window.onload = () => {
    pressShow()
}
})();