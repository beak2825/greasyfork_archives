// ==UserScript==
// @name         plus sankuai
// @version      0.1
// @description 修改发布按钮位置
// @author       yueruipeng@meituan.com
// @match        http://www.ttlsa.com/docs/greasemonkey/#pattern.addcss
// @include http://plus.sankuai.com/*
// @grant        none
// @namespace https://greasyfork.org/users/125422
// @downloadURL https://update.greasyfork.org/scripts/29874/plus%20sankuai.user.js
// @updateURL https://update.greasyfork.org/scripts/29874/plus%20sankuai.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle("button.btn.btn-success {position: fixed; right: 2%;top:10%; }");