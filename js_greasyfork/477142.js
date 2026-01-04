// ==UserScript==
// @name         知乎、百度知道小工具
// @namespace    jerry.k
// @version      0.1
// @description  知乎标题自由隐藏与显示；百度知道隐藏与显示，展开全部
// @author       codrwu
// @match        https://www.zhihu.com/question/*
// @match        https://zhidao.baidu.com/question/*
// @icon         todo
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477142/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/477142/%E7%9F%A5%E4%B9%8E%E3%80%81%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let zhihuEl = document.getElementsByClassName("QuestionHeader-title")[0]
    if (zhihuEl) {
        zhihuEl.setAttribute("hidden", "true");

        let button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "显示标题");
        button.setAttribute("class", "Button FollowButton Button--primary Button--blue");
        button.addEventListener('click', function () {
            if (zhihuEl.getAttribute("hidden")) {
                zhihuEl.removeAttribute("hidden");
                button.setAttribute("value", "隐藏标题");
            } else {
                zhihuEl.setAttribute("hidden", "true");
                button.setAttribute("value", "显示标题");
            }
        });
        document.getElementsByClassName("QuestionHeader-content")[0].appendChild(button);
        return
    }

    let baiduEl = document.getElementsByClassName("wgt-header-title-text")[0]
    if (baiduEl) {
        let innerText = baiduEl.innerText;
        baiduEl.innerText = "_"
        setTimeout(() => {
            document.getElementsByClassName("wgt-answers-showbtn")?.[0].click()
        }, 1000);

        let button = document.createElement("span");
        button.innerText = "显示标题"
        button.setAttribute("class", "iknow-icons wgt-header-title-btn");
        button.addEventListener('click', function () {
            if (baiduEl.innerText != "_") {
                baiduEl.innerText = "_"
                button.innerText = "隐藏标题"
            } else {
                baiduEl.innerText = innerText
                button.innerText = "显示标题"
            }
        });
        document.getElementsByClassName("wgt-header-title-content")[0].appendChild(button);
        return
    }
})();