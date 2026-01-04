// ==UserScript==
// @name         去除知乎下拉推荐
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397648/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%8B%E6%8B%89%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/397648/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E4%B8%8B%E6%8B%89%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    // Your CSS as text
var styles = `
.AutoComplete-menu.SearchBar-menu.SearchBar-noValueMenu
> .AutoComplete-group:first-child {
  display: none;
}
`

var styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)


//     setTimeout(() => {
//         let l = document.body.children
//         let lastItem = l[l.length - 1]
//         //l[l.length - 1].remove()
//         console.log(lastItem)

//         setInterval(() => {
//             console.log(lastItem.innerHTML)
//         }, 3000)
//     }, 3000)

})();