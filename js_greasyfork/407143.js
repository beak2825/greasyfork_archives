// ==UserScript==
// @name         timeLife
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  set time life
// @author       ikism
// @match        https://cn.bing.com/
// @grant        none
// @include      https://translate.google.cn/
// @downloadURL https://update.greasyfork.org/scripts/407143/timeLife.user.js
// @updateURL https://update.greasyfork.org/scripts/407143/timeLife.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let time = 25 * 60 * 1000;
    let time1 = 5 * 60 * 1000;
    let flag = true;
    setInterval(() => {
        var n = new Notification("",{
            body: flag ? '你需要休息了!!':'休息时间到!!',
            image:'https://c-ssl.duitang.com/uploads/item/201602/01/20160201101741_wJd4G.gif'
        });
        n.onshow = function () {
            setTimeout(n.close.bind(n), 2000);
        }
        flag = !flag;
     }, flag ? time : time1);
    var n = new Notification("",{
            body: flag ? '你需要休息了!!':'休息时间到!!',
            image:'https://c-ssl.duitang.com/uploads/item/201602/01/20160201101741_wJd4G.gif'
        });
    // Your code here...
})();