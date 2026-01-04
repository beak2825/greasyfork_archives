// ==UserScript==
// @name        恢复色彩
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      Helix
// @description 2022/12/1 16:48:00
// @namespace   http://qusu.info
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/455771/%E6%81%A2%E5%A4%8D%E8%89%B2%E5%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/455771/%E6%81%A2%E5%A4%8D%E8%89%B2%E5%BD%A9.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.body.style.filter='none';
    document.body.style['-webkit-filter']='none';
    document.getElementsByTagName('html')[0].style.filter = 'none';
    document.getElementsByTagName('html')[0].style['-webkit-filter'] = 'none';
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
                children[i].style.filter='none';
                children[i].style['-webkit-filter']='none';
            }
            resetColor(children[i])
            console.info(children[i])
        }
    }
    resetColor(document.body)
})();