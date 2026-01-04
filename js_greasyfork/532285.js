// ==UserScript==
// @name         DMM検索
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @match        https://al.dmm.co.jp/* 
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532285/DMM%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/532285/DMM%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '15px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }

    button.addEventListener('click', () => {
javascript:(function() {     function createSearchWindow() {         let searchWindow = document.createElement("div");         searchWindow.style.position = "fixed";         searchWindow.style.top = "20px";         searchWindow.style.right = "20px";         searchWindow.style.padding = "10px";         searchWindow.style.background = "white";         searchWindow.style.border = "1px solid black";         searchWindow.style.zIndex = "10000";         searchWindow.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";                  let titleBar = document.createElement("div");         titleBar.textContent = "DMM検索";         titleBar.style.fontWeight = "bold";         titleBar.style.display = "flex";         titleBar.style.justifyContent = "space-between";                  let closeButton = document.createElement("span");         closeButton.textContent = "☒";         closeButton.style.cursor = "pointer";         closeButton.onclick = function() { document.body.removeChild(searchWindow); };                  titleBar.appendChild(closeButton);         searchWindow.appendChild(titleBar);                  let inputField = document.createElement("input");         inputField.type = "text";         inputField.style.width = "250px";         inputField.style.marginTop = "5px";         searchWindow.appendChild(inputField);                  let searchButton = document.createElement("button");         searchButton.textContent = "検索";         searchButton.style.display = "block";         searchButton.style.marginTop = "5px";         searchButton.onclick = function() {             let url = decodeURIComponent(inputField.value.trim());             let match = url.match(/product\/(\d+)/) || url.match(/cid=(d_\d+)/);             if (match) {                 window.open("https://www.google.com/search?q=dmm%20" + match[1], "_blank");             } else {                 alert("商品番号を特定できませんでした。");             }         };                  searchWindow.appendChild(searchButton);         document.body.appendChild(searchWindow);     }     createSearchWindow(); })();
    });

    document.body.appendChild(button);
})();