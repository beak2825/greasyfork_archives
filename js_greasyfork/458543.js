// ==UserScript==
// @name         QQ链接直接访问
// @namespace    https://github.com/DayoWong0/script/blob/master/tampermonkey/QQ/QQ_Link_add_tag_a.js
// @version      0.2
// @description  电脑QQ访问链接时跳转页面加了个a标签，不用复制网址直接点击即可访问网址
// @author       DayoWong0
// @match        https://c.pc.qq.com/middlem.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458543/QQ%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458543/QQ%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let obj = document.querySelector("#url")
    //let url = document.querySelector("#url").textContent
    let url = obj.textContent
    obj.innerHTML = `<a href="${url}">${url}</a>`
})();
