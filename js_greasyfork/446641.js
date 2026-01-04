// ==UserScript==
// @name         Bilibili quick collect
// @namespace    https://github.com/zhouhaixian/bilibili-quick-collect
// @version      1.4.5
// @description  哔哩哔哩一键点赞并收藏
// @author       Zhou Haixian
// @license      GPL-3.0
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446641/Bilibili%20quick%20collect.user.js
// @updateURL https://update.greasyfork.org/scripts/446641/Bilibili%20quick%20collect.meta.js
// ==/UserScript==
(function () {
    "use strict";
    setTimeout(addQuickCollectButton, 5000);
})();
function addQuickCollectButton() {
    var toolbar = document.querySelector("#arc_toolbar_report > div.toolbar-left");
    toolbar.appendChild(createQuickCollectButton("单击左键收藏并点赞，单击右键仅收藏", "一键收藏并点赞"));
    function createQuickCollectButton(title, innerText) {
        function synchronizeState() {
            quickCollect.className = collectButton.className;
        }
        function handleClick() {
            like();
            collect();
        }
        function handleRightClick(e) {
            collect();
            e.preventDefault();
        }
        var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
        var collectIcon = document
            .querySelector("#arc_toolbar_report > div.toolbar-left > span.collect > svg")
            .cloneNode(true);
        var quickCollect = document.createElement("span");
        quickCollect.style.width = "13rem";
        quickCollect.className = "collect";
        quickCollect.title = title;
        quickCollect.appendChild(collectIcon);
        quickCollect.innerHTML += "\n      <span class=\"info-text\">".concat(innerText, "</span>\n    ");
        quickCollect.addEventListener("click", handleClick);
        quickCollect.addEventListener("contextmenu", handleRightClick);
        setInterval(synchronizeState, 200);
        return quickCollect;
    }
}
function like() {
    var likeButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.like");
    likeButton.click();
}
function collect() {
    var defaultFavoritesSelector = "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.content > div > ul > li > label > span.fav-title";
    var confirmButtonSelector = "#app > div.video-container-v1 > div.bili-dialog-m > div > div > div.bottom > button";
    var collectButton = document.querySelector("#arc_toolbar_report > div.toolbar-left > span.collect");
    var dialogHandler = createDialogHandler();
    dialogHandler.hiddenDialog();
    collectButton.click();
    waitForSelector(defaultFavoritesSelector).then(function (el) { return el.click(); });
    waitForAvailable(confirmButtonSelector).then(function (el) { return el.click(); });
    waitForSelector(".bili-dialog-m", false).then(dialogHandler.unHideDialog);
    function createDialogHandler() {
        var styleElement = document.createElement("style");
        styleElement.innerHTML = "\n      .bili-dialog-m {\n        display: none;\n      }\n    ";
        function hiddenDialog() {
            document.body.appendChild(styleElement);
        }
        function unHideDialog() {
            document.body.removeChild(styleElement);
        }
        return { hiddenDialog: hiddenDialog, unHideDialog: unHideDialog };
    }
}
function waitForSelector(selector, isExist, timeout) {
    if (isExist === void 0) { isExist = true; }
    if (timeout === void 0) { timeout = 30000; }
    return new Promise(function (resolve, reject) {
        setTimeout(reject, timeout, "Timeout");
        var interval = setInterval(function () {
            var element = document.querySelector(selector);
            function detectExist() {
                return element !== null;
            }
            if (detectExist() === isExist) {
                clearInterval(interval);
                resolve(element);
            }
        }, 200);
    });
}
function waitForAvailable(selector, timeout) {
    if (timeout === void 0) { timeout = 30000; }
    return new Promise(function (resolve, reject) {
        setTimeout(reject, timeout, "Timeout");
        var interval = setInterval(function () {
            var element = document.querySelector(selector);
            if (element.disabled === false) {
                clearInterval(interval);
                resolve(element);
            }
        }, 200);
    });
}
