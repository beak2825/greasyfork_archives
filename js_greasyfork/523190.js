// ==UserScript==
// @name         Scopus添加每年发文量查询按钮
// @namespace    http://tampermonkey.net/
// @version      2025.10.02.001
// @author       You
// @match        https://www.scopus.com/sources.uri*
// @match        https://www.scopus.com/sourceid/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scopus.com
// @license      MIT
// @description  方便点击查询每年发表的文献。Scopus添加每年发文量查询按钮
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523190/Scopus%E6%B7%BB%E5%8A%A0%E6%AF%8F%E5%B9%B4%E5%8F%91%E6%96%87%E9%87%8F%E6%9F%A5%E8%AF%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523190/Scopus%E6%B7%BB%E5%8A%A0%E6%AF%8F%E5%B9%B4%E5%8F%91%E6%96%87%E9%87%8F%E6%9F%A5%E8%AF%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    // const years = ["2021", "2022", "2023", "2024", "2025"]
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 4; i >= 0; i--) {
        years.push(String(currentYear - i));
    }
    // console.log("aaaa",years)
    function appendTo(parentEle, tagName = "a", attrs = {}, functions = {}, id = "") {
        attrs = typeof attrs !== "string" ? attrs : { textContent: attrs };
        functions = typeof functions !== "function" ? functions : { click: functions };
        if (id && document.getElementById(id)) return document.getElementById(id)
        const ele = document.createElement(tagName);
        if (id) ele.id = id;
        for (const key in attrs) { ele[key] = attrs[key]; ele.setAttribute(key, attrs[key]); }
        for (const key in functions) ele.addEventListener(key, functions[key]);
        if (parentEle) parentEle.appendChild(ele);
        return ele;
    }
    function add_years_query() {
        const trs = document.querySelectorAll("#sourceResults tr")
        for (const tr of trs) {
            const a = tr.querySelector("td:nth-child(2) > a")
            const td6 = tr.querySelector("td:nth-child(6)")
            if (a && !td6.querySelector("a")) {
                const href = a.href
                const sourceId = href.substring(href.lastIndexOf("/") + 1)
                a.style.wordWrap = "break-word"
                td6.style.wordWrap = "break-word"
                for (const year of years) {
                    appendTo(td6, "a", {
                        href: `https://www.scopus.com/source/search/docType.uri?sourceId=${sourceId}&years=${year}&docType=ar,re,cp,dp,ch&pubstageExclusions=aip`, 
                        textContent: year, style: "background: yellow; margin: 3px; padding:3px; word-wrap: normal;"
                    })
                }
            }
        }
         const fdownValue = document.querySelector(".csTrCalc  .fdownValue")
        if (fdownValue) {
            const fdownValueAs = fdownValue.querySelectorAll("a")
            if (fdownValueAs.length == 1) {
                const a1 = fdownValueAs[0]
                for (const year of years) {
                    appendTo(fdownValue, "a", {
                        ///source/search/docType.uri?sourceId=17496&years=2024,2023,2022,2021&docType=ar,re,cp,dp,ch&pubstageExclusions=aip
                        href: a1.href.replace(/years=[\d,]*&/g, `years=${year}&`), 
                        textContent: year, 
                        style: "background: yellow; margin: 3px; padding:3px; word-wrap: normal;"
                    })
                }
            }
        }
    }
    setInterval(add_years_query, 2000)

})();