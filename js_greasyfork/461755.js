// ==UserScript==
// @name         FooterBox Hider
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to hide the footerBox of Limestart! Mar 13, 2023
// @author       Ning Lu
// @match        https://limestart.cn/*
// @icon         https://limestart.cn/favicon.ico
// @grant        none
// @run-at       document-start
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/461755/FooterBox%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/461755/FooterBox%20Hider.meta.js
// ==/UserScript==

(function () {

    // 需要隐藏的元素
    var clearElementArr = [
        '#footerBox','.shouldNotSwitch.noOpacity','#navPageSwitchContainer'
    ];

    // 实现隐藏功能的代码框架（无需改动）
    console.log("准备隐藏以下元素 >>> " + clearElementArr);
    window.pageC = function (clearElements) {
        let style = document.createElement("style");
        if (typeof (clearElements) === "object") {
            clearElements.forEach(cE => {
                style.innerText += `${cE} {display: none !important;} `
            });
        } else {
            console.error("param error,require array!");
        }
        document.head.appendChild(style);
    };
    pageC(clearElementArr);
    console.log("清理完成！");
})();