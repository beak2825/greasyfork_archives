// ==UserScript==
// @name         优课在线::uooconline
// @namespace    https://greasyfork.org/
// @version      1.00
// @description  优课在线::uooconline刷课脚本
// @author       Cosil.C
// @match        http*://*.uooconline.com/home/learn/index*
// @icon         http://assets.uooconline.com/upload/uooc-www/org/logo/2018/11/05/181105103907_650ac3_uooclogo1.png
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444078/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%3A%3Auooconline.user.js
// @updateURL https://update.greasyfork.org/scripts/444078/%E4%BC%98%E8%AF%BE%E5%9C%A8%E7%BA%BF%3A%3Auooconline.meta.js
// ==/UserScript==

setInterval(() => {
    // console.log('isAlive');
    //视频
    if (document.querySelector('video')) {
        document.querySelector('video').muted = true;
        document.querySelector('video').play();
        document.querySelector('video').volume = 0;
        document.querySelector('video').playbackRate = 2;
    }
    //测验
    if (document.querySelector('button.btn.btn-danger.ng-scope')) {
        document.querySelectorAll('input[value=A]').forEach(v => v.click());
        document.querySelector('button.btn.btn-danger.ng-scope').click();
    }

    if (document.querySelector('.basic.active.complete') != null) {
        console.log('当前任务已完成');
        handleNext();
    } else if (!document.querySelector('.basic.active').parentElement.classList.contains('resourcelist')) {
        console.log('当前节点非叶子节点');
        handleNext();
    }
}, 1000)




function handleNext() {
    //有任务则下一个任务
    let nextTask = Array.from(document.querySelectorAll('.taskpoint')).filter(v => !v.parentElement.classList.contains('complete')).shift();
    if (nextTask) {
        console.log('找到新任务', nextTask);
        nextTask.click();
    } else {
        //无任务则下一个章节
        let list = Array.from(document.querySelectorAll('.basic'))
            //排除叶子节点
            .filter(v => !v.parentElement.classList.contains('resourcelist')),
            last = list.pop(),
            cur;
        if (last.classList.contains('complete')) {
            console.log('当前课程已完成');
            //返回课程主页
            document.querySelector('.goback')?.click();
        }
        while (true) {
            cur = list.pop();
            if (cur == null) {
                break;
            }
            if (cur.querySelector('.active') || cur.classList?.contains('active')) {
                break;
            }
            // console.log('last', last, 'cur', cur);
            last = cur;
        }
        console.log('找到下一章节', last);
        last.click();
    }
}