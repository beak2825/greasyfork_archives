// ==UserScript==
// @name         追新番毒盘链接直通
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  追新番毒盘链接直通 免去复制网盘密码
// @author       Yonjar
// @match        http://www.fanxinzhui.com/rr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanxinzhui.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457834/%E8%BF%BD%E6%96%B0%E7%95%AA%E6%AF%92%E7%9B%98%E9%93%BE%E6%8E%A5%E7%9B%B4%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/457834/%E8%BF%BD%E6%96%B0%E7%95%AA%E6%AF%92%E7%9B%98%E9%93%BE%E6%8E%A5%E7%9B%B4%E9%80%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let list = document.querySelectorAll('.item_list p.way')
    for(let item of list){
        let url_el = item.querySelector('span > a')
        let pwd = item.querySelector('.password').textContent
        url_el.href += `?pwd=${pwd}`
        // console.log(url_el.href);
    }
})();