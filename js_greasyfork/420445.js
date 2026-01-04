// ==UserScript==
// @name         Like Button Colorizer for Zhihu
// @namespace    https://www.jeddd.com
// @version      0.1.2
// @description  为知乎的“喜欢”按钮添加颜色。
// @author       Jed-Z
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420445/Like%20Button%20Colorizer%20for%20Zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/420445/Like%20Button%20Colorizer%20for%20Zhihu.meta.js
// ==/UserScript==

function coloring() {
    var elements = document.getElementsByClassName("Zi--Heart");
    for (let element of elements) {
        // console.log("coloring like button");
        if (element.parentNode.parentNode.textContent.localeCompare("取消喜欢") == 0) {
            element.style.color = "#eb4868";
        } else {
            element.style.color = "#8590a6";
        }
    }
    // console.log("coloring loop done");
}

(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
            coloring();
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);