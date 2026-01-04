// ==UserScript==
// @name         hephaes git log
// @namespace    http://tampermonkey.net/
// @version      0.0.4-beta
// @description  hephaes-显示Git提交记录
// @author       junliang.li
// @match        http://hephaes.idc1.fn/
// @grant        none
// @run-at       document-end
// @license      Apache 
// @downloadURL https://update.greasyfork.org/scripts/490360/hephaes%20git%20log.user.js
// @updateURL https://update.greasyfork.org/scripts/490360/hephaes%20git%20log.meta.js
// ==/UserScript==

(function () {
    "use strict";
    setTimeout(addBtn, 888);

    function addBtn() {
        let ele = document.querySelector("#bs-example-navbar-collapse-1 > ul");
        let btn = document.createElement("button");
        btn.innerHTML = "显示提交日志";
        btn.addEventListener("click", click);
        btn.setAttribute("style", "margin-top: 12px; margin-left: 10px");
        let parent = ele.parentNode;
        parent.insertBefore(btn, ele);
    }

    function click() {
        let existList = document.querySelectorAll(".tempEle");
        if (existList?.length) {
            existList.forEach(element => element.remove());
        }
        let element = document.querySelector("body > div.ng-scope > div:nth-child(2) > div > div > span:nth-child(1) > span");
        if (!element) {
            return;
        }
        let logList = angular
            ?.element(document.querySelector("[ng-controller=LogListCtrl]"))
            ?.scope()
            ?.detail
            ?.log
            ?.list;
        if (!logList?.length) {
            return;
        }
        let trList = document.querySelectorAll("body > div.ng-scope > div:nth-child(2) > div > table > tbody >tr");
        if (!trList?.length) {
            return;
        }
        for (let i = 0; i < trList.length; i++) {
            let logStr = logList[i]?.info?.console?.[0];
            let msg = "";
            if (logStr?.includes("Commit message")) {
                let reg = /(?<=timeout=10\nCommit\smessage:\s).*/;
                msg = reg.exec(logStr)?.[0]?.slice(1, -1)?.trim() ?? "";
            }
            let gitLogTd = document.createElement("td");
            gitLogTd.setAttribute("class", "tempEle");
            gitLogTd.setAttribute("style", "width: 30%");
            gitLogTd.innerHTML = msg;
            trList[i].appendChild(gitLogTd);
        }

    }
})();
