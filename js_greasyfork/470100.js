// ==UserScript==
// @name        I want see usage not percent
// @description Design for exaroton
// @match       *://exaroton.com/server/
// @version 0.0.1.20230704024517
// @namespace https://greasyfork.org/users/1111276
// @downloadURL https://update.greasyfork.org/scripts/470100/I%20want%20see%20usage%20not%20percent.user.js
// @updateURL https://update.greasyfork.org/scripts/470100/I%20want%20see%20usage%20not%20percent.meta.js
// ==/UserScript==
// Exaroton JS API
let exaroton = {}
exaroton.getServerStatus = () => {
    if (location.href !== "https://exaroton.com/server/") {
       throw new Error("You are not in the server page")
    }
    if (document.getElementsByClassName("statuslabel")[0].innerText.search("Online")) {
        return true
    } else {
        return false
    }
}
exaroton.sendServerStatus = (status) => {
    if (location.href !== "https://exaroton.com/server/") {
        throw new Error("You are not in the server page")
     }
    switch (status) {
        case "start":
            document.getElementById("start").click();
             break;
        case "stop":
            document.getElementById("stop").click();
             break;
    }
}

// Exaroton JS APi End
let a = false;

function wait(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function handleMutation(mutationsList) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target === targetElement) {
            // 处理文本内容变化
            console.log("Updated");
            if (a) {
                console.log("CD");
                return;
            }
            a = true;

            let canUse = parseFloat(document.querySelector('.js-ram-value').textContent);
            let usedPercent = parseFloat(document.querySelector('.js-ram').textContent);
            console.log(canUse * (usedPercent / 100));
            document.querySelector('.js-ram').innerText = `${Math.floor(canUse * (usedPercent / 100))} MB`;

            wait(1000).then(() => {
                a = false;
            });
        }
    }
}

// 目标元素
var targetElement = document.querySelector('.js-ram');

// 创建MutationObserver实例
var observer = new MutationObserver(handleMutation);

// 配置观察器选项
var config = { childList: true, subtree: true };

// 开始观察目标元素
if (exaroton.getServerStatus()) {
    window.addEventListener('DOMContentLoaded', function () {
        observer.observe(targetElement, config);
    });
}
