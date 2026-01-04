// ==UserScript==
// @name         Robux Fake😎
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  fake roblux
// @author       Kenite-Kelve
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474933/Robux%20Fake%F0%9F%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/474933/Robux%20Fake%F0%9F%98%8E.meta.js
// ==/UserScript==

var originalrobux;
var originalbalance;

window.addEventListener('DOMContentLoaded', (event) => {
    originalrobux = document.getElementById("nav-robux-amount").textContent;
    originalbalance = document.getElementById("nav-robux-balance").textContent;

    // Defina o valor de Robux como "1000k" diretamente ao carregar a página
    setInitialValue();
});

var RobuxAmount = "100k"; // Valor inicial como "1000k"

function setInitialValue() {
    document.getElementById("nav-robux-amount").textContent = RobuxAmount;
    document.getElementById("nav-robux-balance").textContent = RobuxAmount + " Robux";
    document.getElementById("nav-robux-balance").title = RobuxAmount;
}

function Robux() {
    var robux = document.getElementById("nav-robux-amount");
    var balance = document.getElementById("nav-robux-balance");
    robux.innerHTML = RobuxAmount;
    balance.innerHTML = RobuxAmount + " Robux";
    balance.title = RobuxAmount;
}

setInterval(Robux, 1);
