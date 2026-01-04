// ==UserScript==
// @name         蓝光脚本
// @namespace    https://www.lgyy.cc/
// @version      0.2.1
// @description  ad
// @author       遁去无敌
// @match        https://www.lgyy.cc/vodplay/*
// @match        https://www.lgyy.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lgyy.cc
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459952/%E8%93%9D%E5%85%89%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459952/%E8%93%9D%E5%85%89%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {

    var clearElementArr = [
        '.textgreen','.textred','.textblue','#adv_wrap_hh'
    ];

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
