// ==UserScript==
// @name         百度推广title重命名
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        *://fengchao.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380723/%E7%99%BE%E5%BA%A6%E6%8E%A8%E5%B9%BFtitle%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/380723/%E7%99%BE%E5%BA%A6%E6%8E%A8%E5%B9%BFtitle%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==


// 需要自行修改的地方：BdID 和 BdAccount
// 按照已有的格式添加，顺序必须一致
// 例如添加一个账户ID 是 123456    
// 则 var BdId = ['111111', '222222', '123456'];
//    var BdAccount = ['第一个账户', '第二个账户', '这是新增的第三个账户'];

window.onload = function reName() {
    var BdId = ['111111', '222222'];
    var BdAccount = ['第一个账户', '第二个账户'];

    var titleText = window.location.href;

        for (var i = 0; i < BdId.length; i++) {
            if (titleText.includes(BdId[i])) {
                document.title = BdAccount[i]
            }
        }
}

// 下面是延时运行，网络卡的时候，可以再次更改 title
setTimeout(function reName() {
    var BdId = ['111111', '222222'];
    var BdAccount = ['第一个账户', '第二个账户'];

    var titleText = window.location.href;

        for (var i = 0; i < BdId.length; i++) {
            if (titleText.includes(BdId[i])) {
                document.title = BdAccount[i]
            }
        }
}, 10000);

