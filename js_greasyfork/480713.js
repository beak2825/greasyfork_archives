// ==UserScript==
// @name         以图搜图
// @version      2.8
// @description  通过菜单脚本或V键加B键执行以图搜图功能
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/480713/%E4%BB%A5%E5%9B%BE%E6%90%9C%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/480713/%E4%BB%A5%E5%9B%BE%E6%90%9C%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let menuBox = null;
    let exitButton = null;
    let isListening = false;

    function createMenu(imageUrl) {
        if (menuBox) {
            return menuBox;
        }

        menuBox = document.createElement("div");
        menuBox.style.position = "absolute";
        menuBox.style.backgroundColor = "#fff";
        menuBox.style.border = "1px solid #ccc";
        menuBox.style.boxShadow = "0 2px 6px #aaa";
        menuBox.style.zIndex = "9999";

        let searchEngines = [
            { name: "Google", url: "https://lens.google.com/uploadbyurl?url=" },
            { name: "SauceNAO", url: "https://saucenao.com/search.php?db=999&url=" },
            { name: "Yandex", url: "https://yandex.com/images/search?rpt=imageview&url=" },
            { name: "TinEye", url: "https://tineye.com/search/?url=" },
            { name: "iqdb", url: "https://iqdb.org/?url=" },
            { name: "3D iqdb", url: "https://3d.iqdb.org/?url=" },
            { name: "WhatAnime", url: "https://trace.moe/?url=" },
            { name: "ascii2d", url: "https://ascii2d.net/search/url/" },
            { name: "360", url: "https://st.so.com/r?img_url=" }
        ];

        for (let engine of searchEngines) {
            let menuItem = document.createElement("a");
            menuItem.textContent = engine.name;
            menuItem.href = engine.url + encodeURIComponent(imageUrl);
            menuItem.target = "_blank";
            menuItem.style.display = "block";
            menuItem.style.padding = "8px";
            menuItem.style.color = "#333";
            menuItem.style.textDecoration = "none";

            menuBox.appendChild(menuItem);
        }

        exitButton = document.createElement("button");
        exitButton.textContent = "退出";
        exitButton.style.marginTop = "10px";
        exitButton.style.padding = "5px";
        exitButton.style.backgroundColor = "#f00";
        exitButton.style.color = "#fff";
        exitButton.style.border = "none";
        exitButton.style.cursor = "pointer";

        exitButton.addEventListener("click", () => {
            menuBox.remove();
            menuBox = null;
            isListening = false;
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
        });

        menuBox.appendChild(exitButton);

        return menuBox;
    }

    function handleMouseDown(event) {
        if (event.target.tagName === "IMG" && !event.target.src.startsWith("data:image/")) {
            event.preventDefault();
            let imageUrl = event.target.src;
            menuBox = createMenu(imageUrl);
            menuBox.style.top = event.pageY + "px";
            menuBox.style.left = event.pageX + "px";
            document.body.appendChild(menuBox);
        } else {
            if (menuBox && !menuBox.contains(event.target)) {
                menuBox.remove();
                menuBox = null;
            }
        }
    }

    function handleMouseUp(event) {
        if (menuBox && menuBox.contains(event.target)) {
            event.stopPropagation();
        }
    }

    function startImageSearch() {
        if (!isListening) {
            document.addEventListener("mousedown", handleMouseDown);
            document.addEventListener("mouseup", handleMouseUp);
            isListening = true;
        }
    }

    function handleKeyboardEvent(event) {
        if (event.key === 'v') {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'b') {
                    startImageSearch();
                }
            });
        }
    }

    GM_registerMenuCommand("以图搜图", startImageSearch);
    document.addEventListener('keydown', handleKeyboardEvent);

})();
