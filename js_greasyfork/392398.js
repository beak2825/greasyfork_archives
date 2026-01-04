// ==UserScript==
// @name         喵国建设者作弊器 Kittens Game Cheat
// @version      0.3
// @description  可以添加任意数量的资源，注意，这将极大地破坏您的游戏体验。You can add as many resources as you like in the game, and this will greatly ruin your gaming experience.
// @author       Kong Weihang
// @match        *likexia.gitee.io/*
// @grant        none
// @name         zh-CN,en
// @run-at       document-start
// @license      GNU General Public License v3.0 or later
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/392398/%E5%96%B5%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BD%9C%E5%BC%8A%E5%99%A8%20Kittens%20Game%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/392398/%E5%96%B5%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BD%9C%E5%BC%8A%E5%99%A8%20Kittens%20Game%20Cheat.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var isShowed = false;

    function InsertInputElement(inputArea, elementName) {
        var row = document.createElement("div");
        var input = document.createElement("input");
        var span = document.createElement("span");
        input.type = "text";
        input.className = "input";
        input.id = elementName;
        input.placeholder = elementName;
        input.style.marginRight = "1.0em";
        span.textContent = elementName;
        row.style.padding = "0px 10px";
        row.appendChild(span);
        row.appendChild(input);
        inputArea.appendChild(row);
    }

    function ElementCheat(elementName, value) {
        var numValue = parseInt(value);
        if (!isNaN(numValue) && numValue !== 0) {
            gamePage.resPool.get(elementName).value += numValue;
        }
    }

    function CheatEvent() {
        if (isShowed) { return; }
        var cheatList = [
            "catnip",
            "wood",
            "minerals",
            "iron",
            "gold",
            "manpower",
            "science",
            "culture",
            "kittens",
            "furs",
            "ivory",
            "spice",
            "unicorns",
            "blueprint"];
        var inputArea = document.createElement("div");

        var observeButton = document.getElementById("observeButton");

        if (typeof observeButton !== 'undefined' &&
            observeButton !== null) {

            for (let i = 0; i < cheatList.length; i++) {
                const chaetElement = cheatList[i];
                InsertInputElement(inputArea, chaetElement);
            }

            var cheatButton = document.createElement("button");
            cheatButton.textContent = "Start Cheat";
            cheatButton.addEventListener('click', function () {
                for (let i = 0; i < cheatList.length; i++) {
                    const elementName = cheatList[i];
                    var value = document.getElementById(elementName).value;

                    ElementCheat(elementName, value);

                }
            }, false);

            var cheatMaxButton = document.createElement("button");
            cheatMaxButton.textContent = "To Max";
            cheatMaxButton.addEventListener('click', function () {
                for (let i = 0; i < cheatList.length; i++) {
                    const elementName = cheatList[i];
                    var value = gamePage.resPool.get(elementName).maxValue;

                    ElementCheat(elementName, value);


                }
            }, false);

            var parent = observeButton.parentNode;
            parent.insertBefore(inputArea, observeButton);
            parent.insertBefore(cheatButton, observeButton);
            parent.insertBefore(cheatMaxButton, observeButton);

            isShowed = true;
        }
    }

    var IntervalID = setInterval(CheatEvent, 10000);

    setTimeout(function () {
        clearInterval(IntervalID)
    }, 300000);


})();