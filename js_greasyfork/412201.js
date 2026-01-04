// ==UserScript==
// @name         Aone id 转换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改 gitlab 上的 aone id
// @author       You
// @match        https://git.in.chaitin.net/*/merge_requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412201/Aone%20id%20%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/412201/Aone%20id%20%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let list = $("#notes > div > section > div > div.detail-page-description > div > div > div > ol > li")
    let i = 0
    for (i = 0; i < list.length; i++){
        let element= list[i]
        element.innerHTML = element.innerHTML.replace(/AONE#(\d+)/i, '<a href="https://work.aone.alibaba-inc.com/issue/$1">AONE-$1</a>')
    }
})();