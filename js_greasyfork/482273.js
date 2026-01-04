// ==UserScript==
// @license      Apache License 2.0
// @name         上大刷课
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  适用于上大刷课-移除blur监听事件
// @author       You
// @match        https://sdjj.ct-edu.com.cn/learning/student/studentIndex.action
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ct-edu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482273/%E4%B8%8A%E5%A4%A7%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/482273/%E4%B8%8A%E5%A4%A7%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
// @run-at       document-start

(function() {

    'use strict';
    let oldadd=EventTarget.prototype.addEventListener
    EventTarget.prototype.addEventListener=function (...args){
        if (args.length !== 0 && (args[0] === 'blur')) {
            console.log(`阻止blur监听事件：${args[0]}`);
            return;
        }
        return oldadd.call(this,...args)
    }
    //setInterval(()=>{
    //    //轮询点下一课
    //    $(".layui-layer-btn0").click()
    //}, 1000);

})();