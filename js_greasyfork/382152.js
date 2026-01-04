// ==UserScript==
// @name         改变pku树洞网页版显示
// @namespace    toplane@pku.edu.cn
// @version      1.1
// @description  隐藏评论，居中显示(V1.1:优化实现方式，修复失效问题)
// @author       nicolas
// @match        https://pkuhelper.pku.edu.cn/hole/
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/382152/%E6%94%B9%E5%8F%98pku%E6%A0%91%E6%B4%9E%E7%BD%91%E9%A1%B5%E7%89%88%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382152/%E6%94%B9%E5%8F%98pku%E6%A0%91%E6%B4%9E%E7%BD%91%E9%A1%B5%E7%89%88%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

GM_addStyle(".flow-item-row {display:flex;justify-content: center;}");
GM_addStyle(".flow-item {display:flex;justify-content: center;}");
GM_addStyle(".box {margin:10 auto}");
setInterval(function() {
    'use strict';
    var aEle = document.getElementsByTagName('*');
    for(var i=0;i<aEle.length;i++){
        if(aEle[i].className == "flow-reply-row"){
            aEle[i].parentNode.removeChild(aEle[i]);
        }
    }
}, 100);
