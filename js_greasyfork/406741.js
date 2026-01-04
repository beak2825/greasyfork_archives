// ==UserScript==
// @name         Kibana Tweaker
// @namespace    andon
// @version      0.3.0
// @description  Kibana tweaker
// @author       yaxinliu
// @include      *://dnspod-log.oa.com/*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/406741/Kibana%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/406741/Kibana%20Tweaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addCSS(cssContent)
    {
        let styleElem = document.createElement("style");
        styleElem.setAttribute("class", "powered-by-tampermonkey")
        styleElem.innerHTML = cssContent;
        document.querySelector("head").appendChild(styleElem);
    }

    // 隐藏第一列
    addCSS(`
        table.kbn-table.table thead > tr > th:nth-child(2) {
            display: none;
        }
        table.kbn-table.table tbody tr[columns=columns] > td:nth-child(2) {
            display: none;
        }
    `)

    const columnWidthMap = {
        "time": "190px",
        "uin": "100px",
        "uri": "200px",
        "interface": "200px",
        "requestId": "150px"
    }
    let timmer = null

    document.addEventListener("DOMSubtreeModified", function(e) {
        const target = e.target
        if (target !== document.querySelector("table.kbn-table.table thead > tr")) {
            return;
        }
        if (timmer) {
            clearTimeout(timmer)
        }
        timmer = setTimeout(function() {
            const columns = document.querySelectorAll("table.kbn-table.table thead > tr > th");
            columns.forEach(function(elem, idx) {
                const title = elem.querySelector("span").innerText.trim()
                if (columnWidthMap[title]) {
                    elem.setAttribute("width", columnWidthMap[title])
                }
            })
        }, 100)
    })
})();