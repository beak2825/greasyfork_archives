// ==UserScript==
// @name        沉重哀悼
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Helix
// @description 2022/12/1 16:48:00
// @namespace   http://qusu.info
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/455772/%E6%B2%89%E9%87%8D%E5%93%80%E6%82%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/455772/%E6%B2%89%E9%87%8D%E5%93%80%E6%82%BC.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.body.style.filter='grayscale(100%)';
    document.body.style['-webkit-filter']='grayscale(100%)';
    document.getElementsByTagName('html')[0].style.filter = 'grayscale(100%)';
    document.getElementsByTagName('html')[0].style['-webkit-filter'] = 'grayscale(100%)';
    document.body.classList.remove("big-event-gray");
    function resetColor(parent) {
        // 如果当前节点是元素节点，输出当前元素
        parent.nodeType === 1 && console.log(parent);
        // 获得父节点的所有直接子节点
        let children = parent.childNodes
        // 遍历 children 中每个节点
        for(let i = 0, len = children.length; i<len; i++) {
            // 对当前子节点递归
            if (children[i].style) {
                children[i].style.filter='grayscale(100%)';
                children[i].style['-webkit-filter']='grayscale(100%)';
            }
            resetColor(children[i])
            console.info(children[i])
        }
    }
    resetColor(document.body)
})();