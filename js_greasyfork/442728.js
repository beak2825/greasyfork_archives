// ==UserScript==
// @name         在qq中点击链接自动跳转到目标网址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  省去复制,点击QQ中的网址,在提示页面会跳转目标网址
// @author       pananda
// @match        https://c.pc.qq.com/middlem.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442728/%E5%9C%A8qq%E4%B8%AD%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%9B%AE%E6%A0%87%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/442728/%E5%9C%A8qq%E4%B8%AD%E7%82%B9%E5%87%BB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%9B%AE%E6%A0%87%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==


(function() {
    'use strict';
let id = setInterval(() => {
    let url = document.querySelector('#url').innerText
    let middle = "https://c.pc.qq.com/middlem.html"
    if (url&&location.href.includes(middle)&&url!='') {
        location.href = url
        clearInterval(id)
    }
},300)
})();