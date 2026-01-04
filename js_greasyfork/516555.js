// ==UserScript==
// @name         组卷网助手
// @namespace    http://tampermonkey.net/
// @version      2024-11-13
// @description  本插件可以拓展组卷网的功能。
// @author       fyc09
// @license      MIT
// @match        https://zujuan.xkw.com/usertk/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516555/%E7%BB%84%E5%8D%B7%E7%BD%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/516555/%E7%BB%84%E5%8D%B7%E7%BD%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton(name, handler) {
        const elem = document.createElement("div");
        document.querySelector(".tools").appendChild(elem);
        elem.style = `
            display: block;
            height: 2.25rem;
            margin: .3 .9375rem;
            font-size: .875rem;
            box-sizing: border-box;
            padding: 0. .9375rem;
            line-height: 2.25rem;
            border-radius: .1875rem;
            position: relative;
            background: var(--primary-bg-color1);
            color: var(--font-color5);
        `;
        elem.className = "btn-box";
        elem.innerHTML = name;
        elem.onclick = handler;
    }
    addButton("(插件)下载", () => {
        document.querySelectorAll(".header, .bread-nav, .other-info, .fiexd-nav, .footer, .exam-item__info").forEach(e => e.remove())
        document.querySelector(".exam-cnt").style.width = "100%";
        document.querySelector(".quesdiv").style.width = "0rem 1.25rem 0rem 1.625rem";
        document.documentElement.style.setProperty('--font-family1', '"Times New Roman", SimHei');
        document.documentElement.style.setProperty('--font-family2', '"Times New Roman", SimSun');
        document.documentElement.style.setProperty('--primary-color1', 'none');
        document.querySelector("title").innerText = document.querySelector(".title-txt").innerText
        window.print();
    });
    addButton("(插件)刷题模式", () => {
        document.querySelectorAll(".header, .bread-nav, .other-info, .fiexd-nav, .footer").forEach(e => e.remove())
        document.querySelector(".exam-cnt").style.width = "100%";
        document.querySelector(".page").style.minWidth = "0";
        document.querySelector(".quesdiv").style.width = "0rem 1.25rem 0rem 1.625rem";
        document.documentElement.style.setProperty('--font-family1', '"Times New Roman", SimHei');
        document.documentElement.style.setProperty('--font-family2', '"Times New Roman", SimSun');
        document.querySelector("title").innerText = document.querySelector(".title-txt").innerText
    });
})();
