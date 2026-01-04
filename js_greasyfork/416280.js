// ==UserScript==
// @name         b站关闭器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在允许时间以外，打开b站网页会自动关闭
// @author       さんしゅい
// @match        https://www.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416280/b%E7%AB%99%E5%85%B3%E9%97%AD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/416280/b%E7%AB%99%E5%85%B3%E9%97%AD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //全局对象
    var さんしゅい={};
    //禁止使用时间
    //禁用开始
    さんしゅい.start='22:30';
    //禁用结束
    さんしゅい.end='7:30';
    //现在的时间
    var date=new Date();
    さんしゅい.time=date.getHours()+':'+date.getMinutes();
    //比较同一天的两个时间大小, 若前者晚于后者，则返回true
    const 比较时间 = (t1, t2) => {
        let d = new Date()
        let time1 = d.setHours(t1.split(":")[0], t1.split(":")[1])
        let time2 = d.setHours(t2.split(":")[0], t2.split(":")[1])
        return time1 > time2
    }

    /*
*以下为程序，以上为参数
*/
    //判定,比结束时间早或开始时间晚都会触发关闭
    if (比较时间(さんしゅい.end,さんしゅい.time)||比较时间(さんしゅい.time,さんしゅい.start)){
        alert(`现在的时间是${さんしゅい.time},为允许时间外`);
        window.close();
    }else {
        //在允许时间内,啥都不做
    }

})();