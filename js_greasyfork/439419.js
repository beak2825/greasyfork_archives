// ==UserScript==
// @name         按回帖时间排序
// @version      0.0.1
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @license MIT
// @description  按回帖时间排序。
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/439419/%E6%8C%89%E5%9B%9E%E5%B8%96%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/439419/%E6%8C%89%E5%9B%9E%E5%B8%96%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==
(() => {
    let li = document.querySelector("#filter_dateline_menu > ul > li")
    if (!li) {
        return
    }
    const href = li.querySelector("a").href
    let u = new URL(href)
    u.searchParams.set("orderby", "lastpost")
    u.searchParams.set("filter", "reply")

    //<span class="pipe">|</span>
    let span = document.createElement("span")
    span.className = "pipe"
    span.innerHTML = "|"

    let a = document.createElement("a")
    a.href = u.href
    a.textContent = "回帖时间"

    if (new URL(location.href).searchParams.get("orderby") === "lastpost") {
        a.className = "xw1"
    }

    li.appendChild(span)
    li.appendChild(a)
})();
