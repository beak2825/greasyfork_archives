
// ==UserScript==
// @name         必应拼图小游戏键盘控件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让你现在就能用上拼图游戏里的键盘控件，不必再等待慵懒的微软员工，使用键盘控件玩拼图小游戏实在是泰裤辣！
// @author       Haze
// @match        https://cn.bing.com/spotlight/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474344/%E5%BF%85%E5%BA%94%E6%8B%BC%E5%9B%BE%E5%B0%8F%E6%B8%B8%E6%88%8F%E9%94%AE%E7%9B%98%E6%8E%A7%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/474344/%E5%BF%85%E5%BA%94%E6%8B%BC%E5%9B%BE%E5%B0%8F%E6%B8%B8%E6%88%8F%E9%94%AE%E7%9B%98%E6%8E%A7%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let tiles;
    const entry = () => {
        loadElements();
        window.onkeyup = function (e) {
            if (e.key == 'ArrowUp') {
                inputArrowUp();
            }
            if (e.key == 'ArrowDown') {
                inputArrowDown();
            }
            if (e.key == 'ArrowLeft') {
                inputArrowLeft();
            }
            if (e.key == 'ArrowRight') {
                inputArrowRight();
            }
        }
    };
    const loadElements = () => {
        tiles = document.getElementById("tiles").children;
    };
    const inputArrowUp = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i - 3;
            if (checkTileByIndex(next)) {
                tiles[i].click();
                break;
            }
        }
    };
    const inputArrowDown = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i + 3;
            if (checkTileByIndex(next)) {
                tiles[i].click();
                break;
            }
        }
    };
    const inputArrowLeft = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i - 1;
            if (checkTileByIndex(next)) {
                tiles[i].click();
                break;
            }
        }
    };
    const inputArrowRight = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i + 1;
            if (checkTileByIndex(next)) {
                tiles[i].click();
                break;
            }
        }
    };
    const checkTileByIndex = (index) => {
        if (index < 0 || index >= tiles.length) {
            return false;
        }
        const targetChildren = tiles[index].children;
        if (targetChildren.length == 0) {
            return true;
        }
    };
    setTimeout(entry, 500);
})();