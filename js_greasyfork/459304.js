// ==UserScript==
// @name         乐檬学堂自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  乐檬学堂视频课程自动播放，跳过无动作检测的弹窗
// @author       梅有人
// @match        https://e-learning.nhsoft.cn/o2o/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhsoft.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459304/%E4%B9%90%E6%AA%AC%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459304/%E4%B9%90%E6%AA%AC%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

setInterval(autoContinue,1000);

function autoContinue() {
    var continueBtn = Array.from(document.querySelectorAll('.yxtf-button--primary')).find(el => el.innerText.includes('继续学习'));
    var nextTaskBtn = Array.from(document.querySelectorAll('.yxtf-button--primary')).find(el => el.innerText.includes('下一个任务'));
    var finishBtn = Array.from(document.querySelectorAll('.yxtf-button--default')).find(el => el.innerText.includes('暂不评价'));

    function findParentByClassName(dom, className){
        if (dom) {
            var parent = dom.parentNode;
            if(parent && parent.nodeName !== '#document') {
                var _class = parent.getAttribute('class');
                if(_class && _class === className) return parent;
                return findParentByClassName(parent, className);//dom.parentNode作为子元素向上查找它的父元素
            }
        }
    }

    const continueDialogWrapper = findParentByClassName(continueBtn, 'yxtf-dialog__wrapper');
    if(continueDialogWrapper && !continueDialogWrapper.getAttribute('style').includes('display: none')) {
        console.log('防挂机弹窗显示，执行点击操作！');
        continueBtn.click();
    } else {
        console.log('我正在监听, 防挂机弹窗还没出现')
    }
    const finishDialogWrapper = findParentByClassName(finishBtn, 'yxtf-dialog__wrapper');
    if(finishDialogWrapper) {
        if(!finishDialogWrapper.getAttribute('style').includes('display: none')) {
            console.log('课程学习完成弹窗显示，执行不评价操作！');
            finishBtn.click();
            // 2秒后点击下一个任务
            setTimeout(() => {
                nextTaskBtn && nextTaskBtn.click();
            }, 2000)
        }
    }
}


