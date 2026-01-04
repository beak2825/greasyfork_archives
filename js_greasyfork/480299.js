// ==UserScript==
// @name         知乎暗色
// @namespace    net.myitian.js.DarkZhihu
// @version      0.1
// @description  添加一个用于切换知乎暗色模式的按钮
// @author       Myitian
// @license      Unlicensed
// @match        *://*.zhihu.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480299/%E7%9F%A5%E4%B9%8E%E6%9A%97%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/480299/%E7%9F%A5%E4%B9%8E%E6%9A%97%E8%89%B2.meta.js
// ==/UserScript==

function switchMode() {
    var s = new URLSearchParams(window.location.search);
    var mode = document.documentElement.dataset.theme;
    s.delete("theme");
    if (mode == "dark") {
        s.append("theme", "light");
    } else {
        s.append("theme", "dark");
    }
    window.location.search = s.toString();
}

function main() {
    DarkZhihuSwitch.id = "myt-darkzhihu-root";
    DarkZhihuSwitch.innerHTML = `
<button id="myt-darkzhihu-btn">切换模式</button>
<style>
    #myt-darkzhihu-root {
        position: fixed;
        top: 5em;
        right: 0;
    }
    #myt-darkzhihu-btn {
        padding: 0.5em 1em;
        font-size: 14px;
        cursor: pointer;
        border-radius: 4px;
        background: #fff;
        color: rgb(132, 147, 165);
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px;
    }
    [data-theme="dark"] #myt-darkzhihu-btn {
        background: rgb(18, 18, 18);
    }
    #myt-darkzhihu-btn:hover {
        background: rgb(209, 209, 209);
        color: #75869a;
    }
    [data-theme="dark"] #myt-darkzhihu-btn:hover {
        background: #000;
    }
</style>
`;
    DarkZhihuSwitch.querySelector("#myt-darkzhihu-btn").addEventListener("click", switchMode);
    document.body.appendChild(DarkZhihuSwitch);
}

const DarkZhihuSwitch = document.createElement("div");
main();