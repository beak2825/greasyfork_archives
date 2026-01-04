// ==UserScript==
// @name         日升通
// @namespace    日升通
// @version      0.1
// @description  一起学习
// @author       zusheng
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436102/%E6%97%A5%E5%8D%87%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/436102/%E6%97%A5%E5%8D%87%E9%80%9A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const undoneList = []
    // if (window.frames.length !== 0 || parent.frames.length !== 0) return
    // 查找是否有未完成的章节
    function findUndoneList() {
        // 开始查找
        console.log('@find 开始查找')
        document.querySelectorAll(".chapter #coursetree ul li .posCatalog_level ul li").forEach(item => {
            if (item.querySelector('.prevTips') && item.querySelector('.prevTips').classList?.length > 0) {
                let content = item.querySelector('.prevTips').classList.value
                let reg = new RegExp(/icon_Completed/)
                if (!reg.test(content)) undoneList.push(item)
            } else {
                undoneList.push(item)
            }
        })
        console.log('找到' + undoneList.length + '个未完成章节')
        if (undoneList.length > 0) delUndonList()
    }

    /**
         * 正式刷课
         */
    function delUndonList() {

        function nextSteps() {
            undoneList.shift()
            if (undoneList.length > 0) {
                setTimeout(() => {
                    delUndonList()
                }, 5 * 1000)
            }
        }
        // 选中目录
        console.log('@click,切换任务')
        undoneList[0]?.querySelector('div > .posCatalog_name').click()
        setTimeout(() => {
            //
            // 是否存在iframe ppt
            const iframeFlag = document.documentElement.querySelector('#iframe')?.contentDocument?.querySelector('.ans-attach-online')?.contentDocument?.querySelector('#navigation #ext-gen1045')
            console.log('pptFlage', document.documentElement)
            // 定时器
            let timer = null
            // 当存在ppt时
            if (iframeFlag) {
                timer = setInterval(() => {
                    if (document.documentElement.querySelector('#iframe')?.contentDocument?.querySelector('.ans-attach-online')?.contentDocument?.querySelector('#navigation #ext-gen1045')?.style?.visibility === 'hidden') {
                        clearInterval(timer)
                        nextSteps()
                    } else {
                        document.documentElement.querySelector('#iframe')?.contentDocument?.querySelector('.ans-attach-online')?.contentDocument?.querySelector('#navigation #ext-gen1045').click()
                    }
                }, 1000)
            } else {
                nextSteps()
            }
            //
        }, 3 * 1000)
    }

    setTimeout(() => {
        findUndoneList()
    }, 3 * 1000)
})();