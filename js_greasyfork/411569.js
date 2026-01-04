// ==UserScript==
// @name         Script for making life easier in 成语宝典.
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Script for making life easier in 成语宝典. Support fixing button falling down in some device and press enter in input to submit.
// @author       You
// @match        https://chengyu.duwenz.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411569/Script%20for%20making%20life%20easier%20in%20%E6%88%90%E8%AF%AD%E5%AE%9D%E5%85%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/411569/Script%20for%20making%20life%20easier%20in%20%E6%88%90%E8%AF%AD%E5%AE%9D%E5%85%B8.meta.js
// ==/UserScript==
// 获取按位搜索的部分
var positionBasedSearchSection = document
    .getElementsByClassName("search")
    .item(0);
function setPositionBasedSearchSectionWidth() {
    if (!positionBasedSearchSection)
        return;
    // 设置宽度
    positionBasedSearchSection.getElementsByTagName("td").item(0).style.width =
        "500px";
}
function createClearButton(cell) {
    // Clone submit button as clear button
    var clearBtn = Array.from(cell.getElementsByTagName("input"))
        .find(function (x) { return x.type === "button"; })
        .cloneNode(true);
    clearBtn.value = "清除";
    clearBtn.onclick = function (_) {
        var inputs = Array.from(cell.getElementsByTagName("input"));
        inputs.filter(function (x) { return x.type !== "button"; }).forEach(function (x) { return (x.value = ""); });
        inputs[0].focus();
    };
    cell.appendChild(clearBtn);
}
function handleKeyPressedInInput(inputs) {
    var submitButton = inputs.splice(inputs.findIndex(function (x) { return x.type === "button"; }), 1)[0];
    inputs.forEach(function (x) {
        x.onkeypress = function (event) {
            if (event.key === "Enter")
                submitButton.click();
        };
    });
}
(function () {
    "use strict";
    setPositionBasedSearchSectionWidth();
    var searchSections = Array.from(positionBasedSearchSection.getElementsByTagName("td"));
    searchSections.forEach(function (x) {
        createClearButton(x);
        handleKeyPressedInInput(Array.from(x.getElementsByTagName("input")));
    });
})();
