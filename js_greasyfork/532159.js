// ==UserScript==
// @name         mo.co 即将到来的事件 具体事件名显示
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  为 https://sqbwiki.com/mocowiki/ongoingevents 提供显示具体事件名的临时解决方案
// @author       aaa1115910
// @match        https://sqbwiki.com/mocowiki/ongoingevents
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sqbwiki.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532159/moco%20%E5%8D%B3%E5%B0%86%E5%88%B0%E6%9D%A5%E7%9A%84%E4%BA%8B%E4%BB%B6%20%E5%85%B7%E4%BD%93%E4%BA%8B%E4%BB%B6%E5%90%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532159/moco%20%E5%8D%B3%E5%B0%86%E5%88%B0%E6%9D%A5%E7%9A%84%E4%BA%8B%E4%BB%B6%20%E5%85%B7%E4%BD%93%E4%BA%8B%E4%BB%B6%E5%90%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    eventInfoDetailed = {
        "92": "精灵狂热(普通)！",
        "112": "精灵狂热(强壮)！",
        "177": "清道夫群集(普通)！",
        "188": "重启魔宝！",
        "194": "重启采集器！",
        "195": "拯救战术猫！",
        "197": "重大研究！",
        "198": "好多嗅探器！",
        "199": "工程师求助！",
        "201": "入侵警报！",
        "202": "入侵警报！",
        "203": "入侵警报！",
        "204": "入侵警报！",
        "205": "入侵警报！",
        "206": "入侵警报！",
        "207": "入侵警报！",
        "369": "混沌跳跳龙！",
        "370": "混沌冲击怪！",
        "371": "混沌花朵(混沌)！",
        "372": "混沌杂耍怪！",
        "373": "混沌骑士！",
        "374": "混沌喷射怪！",
        "375": "混沌跳斧怪！",
        "376": "混沌雕像！",
        "431": "混沌警钟！",
        "432": "清道夫群集(混沌)！",
        "433": "混沌喷火怪！",
        "434": "混沌碎骨怪！",
        "435": "混沌花朵(触手)！",
        "437": "混沌狂怒兽！",
        "438": "混沌吹吹怪！",
        "439": "混沌冲锋怪！",
        "440": "混沌长矛跳跳龙！",
    }
})();