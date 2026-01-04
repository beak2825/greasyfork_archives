// ==UserScript==
// @name         zhihu 知乎、知乎专栏 gif 自动加载
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  just for fun！
// @author       You
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394848/zhihu%20%E7%9F%A5%E4%B9%8E%E3%80%81%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%20gif%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/394848/zhihu%20%E7%9F%A5%E4%B9%8E%E3%80%81%E7%9F%A5%E4%B9%8E%E4%B8%93%E6%A0%8F%20gif%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

function players() {
    let gif = document.querySelectorAll(".ztext-gif");
    gif.forEach((i) => {
        i.src = i.src.replace(/jpg/g, "webp");
        i.parentNode.classList.add("isPlaying");
    });
}
window.onload = players();
window.onscroll = () => {
    players();
};