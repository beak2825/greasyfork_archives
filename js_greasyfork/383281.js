// ==UserScript==
// @name         屏蔽部分掘金内容
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  掘金删除底部banner等操作
// @author       zhangchenna
// @match        https://juejin.im/*
// @grant        none
// @icon         https://b-gold-cdn.xitu.io/favicons/v2/apple-touch-icon.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/383281/%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86%E6%8E%98%E9%87%91%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/383281/%E5%B1%8F%E8%94%BD%E9%83%A8%E5%88%86%E6%8E%98%E9%87%91%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

//删除底部banner
let node= document.querySelector('.recommend-box');
node.parentNode.removeChild(node);

///删除小册推广
let clean = setInterval(() => {
    let node= document.querySelector('.index-book-collect');
    if (node != null) {
        node.parentNode.removeChild(node)
        clearInterval(clean)
        console.log('删除小册成功')
    }
}, 1000)
