// ==UserScript==
// @name         追新番资源网盘链接console导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  追新番资源网盘链接在console导出
// @author       You
// @match        https://www.fanxinzhui.com/rr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanxinzhui.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480366/%E8%BF%BD%E6%96%B0%E7%95%AA%E8%B5%84%E6%BA%90%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5console%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480366/%E8%BF%BD%E6%96%B0%E7%95%AA%E8%B5%84%E6%BA%90%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5console%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let itemLists = document.querySelectorAll('.item_list .way')
    let output = []
    for (let item of itemLists){
        let link = item.querySelector('span > a').href
        let pw = item.querySelector('.password').textContent
        output.push(`${link}?pwd=${pw}`)
    }
    console.log('网盘链接:');
    console.log(output.join('\n'));
})();