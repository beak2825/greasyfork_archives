// ==UserScript==
// @name         AtCoder Graduation
// @namespace    matsu7874
// @version      1.0
// @description  Dispaly the year of graduation of the user.
// @author       matsu7874
// @match        https://atcoder.jp/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394079/AtCoder%20Graduation.user.js
// @updateURL https://update.greasyfork.org/scripts/394079/AtCoder%20Graduation.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let getBachelor = function (birthYear) {
        return birthYear + 23;
    }
    let getMaster = function (birthYear) {
        return birthYear + 25;
    }
    let createGraduatedRow = function (birthYear) {
        let descriptionOfGraduated = "B: " + getBachelor(birthYear) + "卒?\nM: " + getMaster(birthYear) + "卒?";
        let row = document.createElement("tr");
        let rowHeader = document.createElement("th");
        rowHeader.innerText = "卒業年度";
        let rowDef = document.createElement("td");
        rowDef.innerText = descriptionOfGraduated;
        row.appendChild(rowHeader);
        row.appendChild(rowDef);
        return row;
    }
    let userInfoTable = document.querySelector("#main-container > div.row > div.col-sm-3 > table > tbody");
    let rows = userInfoTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; ++i) {
        if (rows[i].getElementsByTagName("th")[0].innerText === "誕生年") {
            let birthYear = parseInt(rows[i].getElementsByTagName("td")[0].innerText, 10);
            userInfoTable.appendChild(createGraduatedRow(birthYear));
            break;
        }
    }
})();