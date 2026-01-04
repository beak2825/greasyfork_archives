// ==UserScript==
// @name         知乎界面精简
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除不必要信息，方便大屏查看
// @author       God is a girl
// @match        https://*.zhihu.com/question/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456537/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/456537/%E7%9F%A5%E4%B9%8E%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function getNode(name) {
        return document.querySelector(name)
    }
    function remove(node) {
        node.parentElement.removeChild(node)
    }

    setTimeout(() => {
        // 去除header
        const node1 = getNode(".QuestionHeader-content")

        // 去除侧边栏
        const node2 = getNode(".Question-sideColumn")

        const node3 = getNode(".Sticky")

        // 去除绑定事件
        const node4 = getNode(".QuestionPage")

        const main = getNode(".Question-mainColumn")

        node1 && remove(node1)
        node2 && remove(node2)
        node3 && remove(node3)

        node4.onclick = function(){}

        main.style.width = '1000px'
    }, 2000)
})();