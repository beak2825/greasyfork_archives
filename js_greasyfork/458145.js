// ==UserScript==
// @name         强制复制
// @namespace    https://viayoo.com/
// @version      0.4
// @description  理论上可以复制所有文字，请在手机上使用！
// @author       呆毛飘啊飘
// @run-at       document-idle
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458145/%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/458145/%E5%BC%BA%E5%88%B6%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
//注入css使所有内容可复制，两者均可单独使用
var n = document.createElement("style");
n.type = "text/css";
n.innerHTML = "*{user-select: auto!important;}";
document.body.appendChild(n);
//注入js使所有内容可复制，两者均可单独使用
let ys = document.getElementsByTagName('*');
for (var i=0;i<ys.length;i++) {
ys[i].style.userSelect='auto';
};

})();