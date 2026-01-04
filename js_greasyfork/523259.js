// ==UserScript==
// @name        自动刷课
// @namespace   Violentmonkey Scripts
// @match       https://cn202434030.stu.teacher.com.cn/*
// @grant       none
// @version     1.1
// @author      rockxsj
// @description 2025/1/8 14:35:05
// @downloadURL https://update.greasyfork.org/scripts/523259/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/523259/%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

const W = window;
(function () {
    W.addEventListener('load', function () {
        if (W.location.href.indexOf('intoStudentStudy') !== -1) {
            waitForElement('#checkjdcon2 > div > div.modulelistcontent.listcontent > ul > li:nth-child(1) > div.module_wrap > ul > li > div.firstmenu > a.list-title', (element) => {
                // 这里是元素出现后要执行的代码
                const list = document.querySelectorAll('a.layui-btn.layui-btn-primary > span')
                let windowHandle;
                for (const each of list) {
                    let link = each.parentElement.href
                    if (each.innerHTML !== '已完成') {
                        windowHandle = W.open(link)
                        break
                    }
                }

                let channel = new BroadcastChannel('message')
                channel.addEventListener('message', (event) => {
                    let time = parseInt(event.data)
                    if (time === 45) {
                        windowHandle.close()
                        W.location.reload()
                    }
                })
            }, 10000);


        } else {
            let waiter = setInterval(() => {
                let element = document.querySelector('video');
                if (element) {
                    clearInterval(waiter);
                }
            }, 1000);

            const v = document.querySelector("video")
            v.setAttribute('muted', '')

            let channel = new BroadcastChannel('message')

            setInterval(() => {
                let time = document.querySelector('#courseStudyMinutesNumber').innerHTML
                channel.postMessage(time)
                let pop = document.querySelector('div.layui-layer-btn.layui-layer-btn- > a')
                if (pop) {
                    pop.click()
                    document.querySelector('#replaybtn').click()
                    v.play()
                    return
                }
                if (v.paused) {
                    document.querySelector('#replaybtn').click()
                    v.play()
                }
            }, 3000);
        }
    });
})();


function waitForElement(selector, callback, timeout) {
    let timer;
    let interval = 100;  // 检查元素是否存在的时间间隔（毫秒）

    timer = setInterval(() => {
        let element = document.querySelector(selector);
        if (element) {
            clearInterval(timer);
            callback(element);
        } else if (timeout && Date.now() - start >= timeout) {
            clearInterval(timer);
            console.error(`等待元素 ${selector} 超时`);
        }
    }, interval);

    let start = Date.now();
}