// ==UserScript==
// @name         修改字体
// @namespace    https://normal-pcer.example.com/
// @license unlicense
// @version      1.0
// @description  懒得写
// @author       normal-pcer
// @match  https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492432/%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/492432/%E4%BF%AE%E6%94%B9%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let fun = () => {
        let targets = new Array("p", "span", "a");
        for (let index0 = 0; index0 < targets.length; index0++) {
            let t = document.getElementsByTagName(targets[index0]);
            for (let index = 0; index < t.length; index++) {
                let item = t[index];
                if (item.style !== undefined) {
                    item.style.fontFamily = "Times New Roman, 华文中宋";
                } else {
                    item.style = "font-family: Times New Roman, 华文中宋"
                }
            }
        }
        targets = new Array("h1", "h2", "h3", "h4", "h5", "h6", "header");
        for (let index0 = 0; index0 < targets.length; index0++) {
            let t = document.getElementsByTagName(targets[index0]);
            for (let index = 0; index < t.length; index++) {
                let item = t[index];
                if (item.style !== undefined) {
                    item.style.fontFamily = "Tahoma, 微软雅黑";
                } else {
                    item.style = "font-family: Tahoma, 微软雅黑"
                }
            }
        }
        targets = new Array("pre");
        for (let index0 = 0; index0 < targets.length; index0++) {
            let t = document.getElementsByTagName(targets[index0]);
            for (let index = 0; index < t.length; index++) {
                let item = t[index];
                if (item.style !== undefined) {
                    item.style.fontFamily = "Jetbrains Mono, 微软雅黑";
                } else {
                    item.style = "font-family: Jetbrains Mono, 微软雅黑"
                }
            }
        }
    }

    const observer = new MutationObserver(fun);
    const targetNode = document.body;
    const config = { attributes: true, childList: true, subtree: true, characterData: true, };
    observer.observe(targetNode, config);

})();