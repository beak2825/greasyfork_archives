// ==UserScript==
// @name         Loushang/Louxia blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  block 'loushang' and 'lowxia' messages
// @author       2_3_3
// @match        https://www.luogu.com.cn/discuss/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465090/LoushangLouxia%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/465090/LoushangLouxia%20blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const annoyingStrings = [
        "楼上",
        "楼下",
        "loushang",
        "louxia",
        "Loushang",
        "Louxia"
    ];
    let messages = document.getElementsByTagName("article"),
        n = messages.length,
        m = annoyingStrings.length,
        cnt = 0
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (messages[i].innerHTML.indexOf(annoyingStrings[j]) != -1) {
                messages[i].style.display = "none"
                cnt++
                break
            }
        }
    }
    let summary = document.getElementsByClassName("am-list am-list-static lg-summary-list"),
        disp = document.createElement("li")
    if (summary.length > 0) {
        disp.innerHTML = "<strong>插件：共屏蔽 " + cnt + " 条“楼上”“楼下”信息</strong>"
        summary[0].appendChild(disp)
    }
})();