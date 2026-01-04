// ==UserScript==
// @license MIT
// @name         YangtzeRain-AutoQuiz
// @version      0.1
// @description  长江雨课堂课堂习题监控
// @author       Viatin
// @match        *://changjiang.yuketang.cn/lesson/fullscreen/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      sctapi.ftqq.com
// @run-at       document-start
// @namespace    https://greasyfork.org/zh-CN/users/1278689-endorsie
// @downloadURL https://update.greasyfork.org/scripts/528189/YangtzeRain-AutoQuiz.user.js
// @updateURL https://update.greasyfork.org/scripts/528189/YangtzeRain-AutoQuiz.meta.js
// ==/UserScript==

const sendkey = '把Server酱的SendKey粘贴到这里'

function sendGotifyMessage(url, token, title, message, priority=9){
    GM_xmlhttpRequest({
        method: "post",
        url: `${url}/message?token=${token}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: `title=${title}&message=${message}&priority=${priority}`,

        onload: function(response){
            console.log("请求成功");
        },
        onerror: function(response){
            console.log("请求失败");
        }
    });
}

function sendWxMessage(sendkey, title){
    GM_xmlhttpRequest({
        method: "get",
        url: `https://sctapi.ftqq.com/${sendkey}.send?title=${title}`,

        onload: function(response){
            console.log("请求成功");
        },
        onerror: function(response){
            console.log("请求失败");
        }
    });
}

function onPageLoad() {
    // 选择将观察突变的节点
    let targetNode = document.querySelector('section.timeline__wrap');

    // 观察者的选项(要观察哪些突变)
    let config = { attributes: false, childList: true, subtree: false };

    // 当观察到突变时执行的回调函数
    let callback = function(mutationsList) {
        mutationsList.forEach(function(item,index){
            if (item.type == 'childList') {
                for (let node of item.addedNodes) {
                    if (node.querySelector('div.problem')) {
                        sendWxMessage(sendkey, `雨课堂-${document.title}有新习题`);
                    }
                }
            }
        });
    };

    // 创建一个链接到回调函数的观察者实例
    let observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点
    observer.observe(targetNode, config);

    sendWxMessage(sendkey, `雨课堂-${document.title}已上线`);
}

(function() {
    'use strict';

    // Your code here...
    window.onload = function() {
        setTimeout(onPageLoad, 5000);
    };
})();
