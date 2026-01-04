// ==UserScript==
// @name         Display priority dates
// @namespace    https://navirlabs.com/
// @version      1.1
// @license      MIT
// @description  Display priority dates on visa bulletin page for easy access and alerting when dates are current for filing I-485 application for adjustment of status to permanent resident in the US. This is for EB1, EB2 and EB3 categories.
// @author       Rajesh Kanna
// @match        https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=state.gov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472295/Display%20priority%20dates.user.js
// @updateURL https://update.greasyfork.org/scripts/472295/Display%20priority%20dates.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const parsys = "div.tsg-rwd-content-page-parsysxxx.parsys";
    const rows = [2,3,4];
    const tables = [4,5];
    let eb = [];

    for (let i = 0; i < tables.length; i++) {
        let status = [];
        for (let j = 0; j < rows.length; j++) {
            const eb = document.querySelector(parsys + " > div:nth-child(" + tables[i] + ") tr:nth-child(" + rows[j] + ") > td:nth-child(4)").innerText;
            status.push(eb);
        }
        eb.push(status);
    }

    let table = document.createElement("table");
    table.border = "1";
    table.cellPadding = 3;
    table.style.borderCollapse = "collapse";
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");

    ["Type","EB1", "EB2", "EB3"].forEach(function (item) {
        let th = document.createElement("th");
        th.innerHTML = item;
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);
    let rowTitles = ["FINAL ACTION DATES", "DATES FOR FILING"]

    for (let i = 0; i < eb.length; i++) {
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = rowTitles[i];
        tr.appendChild(td);
        for (let j = 0; j < eb[i].length; j++) {
            let td = document.createElement("td");
            td.innerHTML = eb[i][j];
            if (eb[i][j] === "C") {
                td.style.backgroundColor = "green";
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    document.querySelector("div.tsg-rwd-page-subheader > h1").after(table);
})();