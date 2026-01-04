// ==UserScript==
// @name         gw2skills.net add fractal bonus attributes 碎层额外属性计算器
// @namespace    https://greasyfork.org/scripts/412693
// @version      1.1
// @description  为 gw2skills.net 添加碎层额外属性。
// @icon         http://img.gw2skills.net/favicon.ico
// @author       Saber Lily 莉莉哩哩 Gay哩Gay气
// @run-at       document-end
// @match        http://*.gw2skills.net/*
// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/412693/gw2skillsnet%20add%20fractal%20bonus%20attributes%20%E7%A2%8E%E5%B1%82%E9%A2%9D%E5%A4%96%E5%B1%9E%E6%80%A7%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/412693/gw2skillsnet%20add%20fractal%20bonus%20attributes%20%E7%A2%8E%E5%B1%82%E9%A2%9D%E5%A4%96%E5%B1%9E%E6%80%A7%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

// 作者简介
// Saber Lily.1960 Current in WSR EU Server
// 莉莉哩哩 Gay哩Gay气，一个天天划水的休闲 激战2 欧服玩家。
// 如果你觉得该脚本对你有所帮助，欢迎赞助我！

// 脚本原理
// 1. 略

// 版权申明
// 本脚本为 Saber Lily.1960 原创，未经作者授权禁止转载，禁止转载范围包括但不仅限于：贴吧、NGA论坛等。

var gridWindow = document.querySelector(".ui-grid_window");

function calcAttribute() {
    var agonyAttribute = document.getElementById("agonyAttribute");
        var agonyResistance = document.getElementById("agonyResistance");

        var toughness = (agonyResistance.value * 1.5).toFixed(2).toString();
        var precision = (agonyResistance.value * 1.5 / 21).toFixed(2).toString();
        var concentration = (agonyResistance.value * 1.5 / 15).toFixed(1).toString();
        agonyAttribute.textContent = `Precision ${precision}%, Concentration ${concentration}%, Toughness ${toughness}`;
}

if (gridWindow) {
    console.log('GW2 Skill Zh-CN more buff by Saber Lily 已启用!')

    var agonySummary = document.createElement("ul");
    agonySummary.innerHTML = '<div>Agony <input type="number" id="agonyResistance" value="150" min="0" max="500"></div><div id="agonyAttribute"></div>';
    agonySummary.className = "ui-grid ui-armor-summary";
    agonySummary.setAttribute("style", "font-size: 12px; left: 825px; width: 150px; height: 100px; line-height: 13px;");

    gridWindow.appendChild(agonySummary);
    calcAttribute();

    var agonyResistance = document.getElementById("agonyResistance");
    agonyResistance.addEventListener("input", (event) => {
        calcAttribute();
    });

}