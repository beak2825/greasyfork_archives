// ==UserScript==
// @name         去他喵的推广消息
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽C站沟槽的私信推广提醒
// @author       You
// @match        https://bbs.colg.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=colg.cn
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530778/%E5%8E%BB%E4%BB%96%E5%96%B5%E7%9A%84%E6%8E%A8%E5%B9%BF%E6%B6%88%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/530778/%E5%8E%BB%E4%BB%96%E5%96%B5%E7%9A%84%E6%8E%A8%E5%B9%BF%E6%B6%88%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 配置观察选项（可以监听属性变化、子节点变化等）
    const config = {
        attributes: true, // 监听属性变化
        childList: false, // 不监听子节点的变化
        subtree: false, // 不监听子树的变化
    };
    let msgDom;
    let alertDom;

    document.addEventListener('DOMContentLoaded', function () {
        //检查私信是否有提醒
        msgDom = document.querySelector("#msg-popup li:last-child .nav-msg-dot");
        alertDom = document.querySelector("#nav_msg .nav-item-dot");
        // 创建一个回调函数，当观察到变化时执行
        const callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === "style") {//style改变意味着私信有新消息
                    checkMsg();
                }
            }
        };
        // 创建一个 MutationObserver 实例并传入回调函数
        const observer = new MutationObserver(callback);
        // 开始观察目标节点
        observer.observe(msgDom, config);
        // 如果你想要停止观察，可以调用 disconnect 方法
        // observer.disconnect();

        checkMsg();
    });

    function checkMsg() {
        let msgCount = msgDom.innerHTML;
        if (msgCount !== "") {
            //干掉私信提示
            msgDom.innerHTML = "0";
            msgDom.style.display = "none";
            //检查是否只有私信提醒
            let alertCount = alertDom.innerHTML;
            if (alertCount === msgCount) {
                //只有私信提醒就把外面的提醒一并消除
                alertDom.style.display = "none";
                //修改标题
                document.title = document.title.replace("【新提醒】", "");
                //修改顶部浮动条
                document.querySelector(".tools-msg").innerHTML = "消息";
            } else {
                let count = alertCount * 1 - msgCount * 1
                //修一下全局提醒数量
                alertDom.innerHTML = count;
                //修改顶部浮动条
                document.querySelector(".tools-msg").innerHTML = "消息(" + count + ")";
            }
        }
    }
})();